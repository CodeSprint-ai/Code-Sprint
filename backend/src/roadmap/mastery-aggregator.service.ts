import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class MasteryAggregatorService {
    private readonly logger = new Logger(MasteryAggregatorService.name);

    constructor(private readonly dataSource: DataSource) { }

    /**
     * Recalculate mastery for all topics for a given user.
     * Called as fire-and-forget after each submission.
     *
     * Uses `patterns` (enum array) from the problems table as topic source.
     * Derives correctness from submission status = 'ACCEPTED'.
     */
    async recalculateForUser(userUuid: string): Promise<void> {
        const start = Date.now();

        // 1. Aggregate raw stats per topic from submissions (using patterns)
        //    First-attempt-success: for each distinct problem in a topic,
        //    check if the chronologically first submission was ACCEPTED.
        const rawStats = await this.dataSource.query(`
      WITH topic_subs AS (
        SELECT
          s.user_id,
          s.problem_id,
          s.status,
          s.hints_used_count,
          s.created_at,
          unnest(p.patterns) AS topic_name,
          ROW_NUMBER() OVER (PARTITION BY s.user_id, s.problem_id ORDER BY s.created_at ASC) AS rn
        FROM submissions s
        JOIN problems p ON p.uuid = s.problem_id
        WHERE s.user_id = $1
          AND s.created_at > NOW() - INTERVAL '90 days'
      )
      SELECT
        user_id AS user_uuid,
        topic_name,
        COUNT(*) AS total_attempts,
        COUNT(*) FILTER (WHERE status = 'ACCEPTED') AS problems_solved,
        AVG(CASE WHEN rn = 1 AND status = 'ACCEPTED' THEN 1.0 ELSE 0.0 END) AS first_attempt_success_rate,
        AVG(COALESCE(hints_used_count, 0)) AS avg_hints_used,
        MAX(created_at) AS last_practiced
      FROM topic_subs
      GROUP BY user_id, topic_name
    `, [userUuid]);

        if (!rawStats.length) {
            this.logger.debug(`No submissions found for user ${userUuid}`);
            return;
        }

        for (const stat of rawStats) {
            // 2. Calculate TimeEfficiency per topic
            const timeEfficiency = await this.calcTimeEfficiency(userUuid, stat.topic_name);

            // 3. Calculate Consistency (active days in last 7 days)
            const consistency = await this.calcConsistency(userUuid, stat.topic_name);

            // 4. HintDependency penalty (normalized 0-1, capped at 5 hints)
            const hintDependency = Math.min(parseFloat(stat.avg_hints_used || '0') / 5, 1);

            // 5. Mastery formula:
            // Mastery = (0.45 × FirstAttemptSuccess) + (0.25 × TimeEfficiency)
            //         - (0.20 × HintDependency) + (0.10 × Consistency)
            const masteryScore = Math.max(0, Math.min(100,
                (parseFloat(stat.first_attempt_success_rate) * 0.45 * 100) +
                (timeEfficiency * 0.25) -
                (hintDependency * 0.20 * 100) +
                (consistency * 0.10)
            ));

            // 6. Read OLD mastery score BEFORE the upsert (for regen-delta check)
            const prevRow = await this.dataSource.query(`
        SELECT mastery_score FROM user_topic_mastery
        WHERE user_uuid = $1 AND topic_name = $2
      `, [userUuid, stat.topic_name]);
            const oldScore = parseFloat(prevRow[0]?.mastery_score ?? '0');

            // 7. Upsert into user_topic_mastery
            await this.dataSource.query(`
        INSERT INTO user_topic_mastery (
          user_uuid, topic_name, problems_solved, total_attempts,
          first_attempt_success_rate, avg_hint_penalty,
          time_efficiency_score, consistency_score,
          mastery_score, last_practiced
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (user_uuid, topic_name)
        DO UPDATE SET
          problems_solved = EXCLUDED.problems_solved,
          total_attempts = EXCLUDED.total_attempts,
          first_attempt_success_rate = EXCLUDED.first_attempt_success_rate,
          avg_hint_penalty = EXCLUDED.avg_hint_penalty,
          time_efficiency_score = EXCLUDED.time_efficiency_score,
          consistency_score = EXCLUDED.consistency_score,
          mastery_score = EXCLUDED.mastery_score,
          last_practiced = EXCLUDED.last_practiced
      `, [
                userUuid,
                stat.topic_name,
                parseInt(stat.problems_solved),
                parseInt(stat.total_attempts),
                parseFloat(stat.first_attempt_success_rate),
                hintDependency,
                timeEfficiency,
                consistency,
                masteryScore,
                stat.last_practiced,
            ]);

            // 8. Record daily mastery history snapshot (one per topic per day)
            await this.dataSource.query(`
        INSERT INTO mastery_history (user_uuid, topic_name, mastery_score, recorded_at)
        VALUES ($1, $2, $3, CURRENT_DATE)
        ON CONFLICT (user_uuid, topic_name, recorded_at)
        DO UPDATE SET mastery_score = EXCLUDED.mastery_score
      `, [userUuid, stat.topic_name, masteryScore]);

            // 9. Flag roadmap for regeneration if mastery changed significantly
            await this.flagRoadmapRegenIfNeeded(userUuid, oldScore, masteryScore);

            // 9. Check and award badges
            await this.evaluateBadges(userUuid, stat, masteryScore);
        }

        const elapsed = Date.now() - start;
        this.logger.log(`Mastery recalculated for user ${userUuid} in ${elapsed}ms`);
    }

    private async calcTimeEfficiency(userUuid: string, topicName: string): Promise<number> {
        const result = await this.dataSource.query(`
      SELECT
        AVG(s.time_spent_ms) AS user_avg,
        AVG(pds.median_time_ms) AS community_median
      FROM submissions s
      JOIN problems p ON p.uuid = s.problem_id
      LEFT JOIN problem_difficulty_stats pds ON pds.problem_id = p.uuid
      WHERE s.user_id = $1
        AND $2 = ANY(p.patterns)
        AND s.status = 'ACCEPTED'
        AND s.time_spent_ms IS NOT NULL
    `, [userUuid, topicName]);

        if (!result[0]?.user_avg || !result[0]?.community_median) return 50;

        const ratio = parseFloat(result[0].community_median) / parseFloat(result[0].user_avg);
        // ratio > 1 means user is faster than median (good), cap at 0-100
        return Math.max(0, Math.min(100, ratio * 50));
    }

    private async calcConsistency(userUuid: string, topicName: string): Promise<number> {
        const result = await this.dataSource.query(`
      SELECT COUNT(DISTINCT DATE(s.created_at)) AS active_days
      FROM submissions s
      JOIN problems p ON p.uuid = s.problem_id
      WHERE s.user_id = $1
        AND $2 = ANY(p.patterns)
        AND s.created_at > NOW() - INTERVAL '7 days'
    `, [userUuid, topicName]);

        const activeDays = parseInt(result[0]?.active_days ?? '0');
        return (activeDays / 7) * 100;
    }

    private async flagRoadmapRegenIfNeeded(
        userUuid: string,
        prevScore: number,
        newScore: number,
    ): Promise<void> {
        const delta = Math.abs(newScore - prevScore);

        if (delta >= 8) {
            await this.dataSource.query(`
        INSERT INTO user_roadmaps (user_uuid, needs_regen)
        VALUES ($1, TRUE)
        ON CONFLICT (user_uuid) DO UPDATE SET needs_regen = TRUE
      `, [userUuid]);

            this.logger.debug(`Roadmap flagged for regen (delta=${delta.toFixed(1)}) for user ${userUuid}`);
        }
    }

    private async evaluateBadges(userUuid: string, stat: any, masteryScore: number): Promise<void> {
        const topicKey = stat.topic_name.replace(/\s+/g, '_').toLowerCase();
        const badges: { key: string; label: string; condition: boolean }[] = [
            {
                key: `mastered_${topicKey}`,
                label: `Mastered ${stat.topic_name}`,
                condition: masteryScore >= 80,
            },
            {
                key: 'hint_abstainer',
                label: 'Hint Abstainer — Solved 5+ problems without hints',
                condition: parseFloat(stat.avg_hints_used || '0') === 0 && parseInt(stat.problems_solved) >= 5,
            },
        ];

        for (const badge of badges) {
            if (badge.condition) {
                await this.dataSource.query(`
          INSERT INTO roadmap_badges (user_uuid, badge_key, badge_label)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_uuid, badge_key) DO NOTHING
        `, [userUuid, badge.key, badge.label]);
            }
        }
    }
}
