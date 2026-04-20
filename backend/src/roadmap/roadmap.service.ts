import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

@Injectable()
export class RoadmapService {
    private readonly logger = new Logger(RoadmapService.name);
    private model: ChatGoogleGenerativeAI;

    constructor(private readonly dataSource: DataSource) {
        this.model = new ChatGoogleGenerativeAI({
            apiKey: process.env.GEMINI_API_KEY,
            model: 'gemini-2.5-flash',
            temperature: 0.4,
            maxRetries: 3,
        });
    }

    // ─── Main entry point ─────────────────────────────────────────
    async getRoadmapForUser(userUuid: string): Promise<any> {
        // Check cache
        const cached = await this.dataSource.query(`
      SELECT roadmap_json, needs_regen, updated_at
      FROM user_roadmaps WHERE user_uuid = $1
    `, [userUuid]);

        const now = new Date();
        const cacheEntry = cached[0];
        const cacheAge = cacheEntry
            ? (now.getTime() - new Date(cacheEntry.updated_at).getTime()) / 1000 / 60 / 60
            : Infinity;

        const shouldRegen = !cacheEntry || cacheEntry.needs_regen || cacheAge > 24;

        const roadmapJson = shouldRegen
            ? await this.generateAndCacheRoadmap(userUuid)
            : cacheEntry.roadmap_json;

        // Always attach live data (mastery, badges, streak, insights)
        const [topicMastery, badges, streak, comparativeInsights, masteryHistory] = await Promise.all([
            this.fetchTopicMastery(userUuid),
            this.fetchBadges(userUuid),
            this.calcStreak(userUuid),
            this.calcComparativeInsights(userUuid),
            this.fetchMasteryHistory(userUuid),
        ]);

        // Enrich each topic with a mastery level title
        for (const topic of topicMastery) {
            const score = parseFloat(topic.mastery_score);
            topic.level = this.getTopicMasteryLabel(score);
        }

        // Enrich daily suggestions with solved status + mark daily challenge
        const suggestions = roadmapJson.dailySuggestions || [];
        await this.enrichSuggestions(userUuid, suggestions);

        // Calculate overall mastery for theme tier
        const overallMastery = topicMastery.length > 0
            ? topicMastery.reduce((sum: number, t: any) => sum + parseFloat(t.mastery_score), 0) / topicMastery.length
            : 0;

        // Determine mastery tier for unlockable themes
        const masteryTier = this.getMasteryTier(overallMastery);

        return {
            ...roadmapJson,
            dailySuggestions: suggestions,
            topicMastery,
            badges,
            streak,
            comparativeInsights,
            masteryHistory,
            overallMastery: Math.round(overallMastery),
            masteryTier,
        };
    }

    // ─── Live data fetchers ───────────────────────────────────────

    private async fetchTopicMastery(userUuid: string): Promise<any[]> {
        return this.dataSource.query(`
      SELECT topic_name, mastery_score, problems_solved, total_attempts, last_practiced
      FROM user_topic_mastery WHERE user_uuid = $1
      ORDER BY mastery_score ASC
    `, [userUuid]);
    }

    private async fetchBadges(userUuid: string): Promise<any[]> {
        return this.dataSource.query(`
      SELECT badge_key, badge_label, awarded_at
      FROM roadmap_badges WHERE user_uuid = $1
      ORDER BY awarded_at DESC
    `, [userUuid]);
    }

    private async fetchMasteryHistory(userUuid: string): Promise<any[]> {
        return this.dataSource.query(`
      SELECT topic_name, mastery_score, recorded_at
      FROM mastery_history
      WHERE user_uuid = $1 AND recorded_at > NOW() - INTERVAL '30 days'
      ORDER BY recorded_at ASC, topic_name ASC
    `, [userUuid]);
    }

    private getTopicMasteryLabel(score: number): string {
        if (score >= 90) return 'Master';
        if (score >= 75) return 'Expert';
        if (score >= 55) return 'Proficient';
        if (score >= 35) return 'Apprentice';
        return 'Novice';
    }

    /**
     * Calculate consecutive-day streak (days in a row with at least one accepted submission).
     */
    async calcStreak(userUuid: string): Promise<{ current: number; longest: number; todayActive: boolean }> {
        const rows = await this.dataSource.query(`
      SELECT DISTINCT DATE(created_at) AS d
      FROM submissions
      WHERE user_id = $1 AND status = 'ACCEPTED'
      ORDER BY d DESC
    `, [userUuid]);

        if (!rows.length) return { current: 0, longest: 0, todayActive: false };

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dates = rows.map((r: any) => {
            const d = new Date(r.d);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        });

        const todayActive = dates[0] === today.getTime();

        // Count current streak (from today/yesterday backwards)
        let current = 0;
        const startCheck = todayActive ? today.getTime() : today.getTime() - 86400000;
        let check = startCheck;
        const dateSet = new Set(dates);

        while (dateSet.has(check)) {
            current++;
            check -= 86400000; // go back one day
        }

        // Calculate longest streak ever
        let longest = 0;
        let tempStreak = 1;
        for (let i = 1; i < dates.length; i++) {
            if (dates[i - 1] - dates[i] === 86400000) {
                tempStreak++;
            } else {
                longest = Math.max(longest, tempStreak);
                tempStreak = 1;
            }
        }
        longest = Math.max(longest, tempStreak, current);

        return { current, longest, todayActive };
    }

    /**
     * Speed percentile per topic — how fast the user is compared to everyone.
     */
    async calcComparativeInsights(userUuid: string): Promise<any[]> {
        return this.dataSource.query(`
      WITH user_speeds AS (
        SELECT unnest(p.patterns) AS topic_name, AVG(s.time_spent_ms) AS user_avg_ms
        FROM submissions s
        JOIN problems p ON p.uuid = s.problem_id
        WHERE s.user_id = $1 AND s.status = 'ACCEPTED' AND s.time_spent_ms IS NOT NULL
        GROUP BY unnest(p.patterns)
      ),
      all_speeds AS (
        SELECT unnest(p.patterns) AS topic_name, time_spent_ms
        FROM submissions s
        JOIN problems p ON p.uuid = s.problem_id
        WHERE s.status = 'ACCEPTED' AND s.time_spent_ms IS NOT NULL
      ),
      percentiles AS (
        SELECT
          a.topic_name,
          PERCENT_RANK() OVER (PARTITION BY a.topic_name ORDER BY a.time_spent_ms DESC) AS pct
        FROM all_speeds a
        JOIN user_speeds u ON u.topic_name = a.topic_name
        WHERE a.time_spent_ms <= u.user_avg_ms
      )
      SELECT us.topic_name,
             COALESCE(MAX(pe.pct) * 100, 50) AS speed_percentile,
             us.user_avg_ms
      FROM user_speeds us
      LEFT JOIN percentiles pe ON pe.topic_name = us.topic_name
      GROUP BY us.topic_name, us.user_avg_ms
      ORDER BY speed_percentile DESC
    `, [userUuid]);
    }

    /**
     * Enrich suggestions with solved status + mark first unsolved as daily challenge.
     */
    private async enrichSuggestions(userUuid: string, suggestions: any[]): Promise<void> {
        if (!suggestions.length) return;

        const problemIds = suggestions.map((s: any) => s.problemId).filter(Boolean);
        if (!problemIds.length) return;

        const solvedRows = await this.dataSource.query(`
      SELECT DISTINCT problem_id
      FROM submissions
      WHERE user_id = $1
        AND problem_id = ANY($2::uuid[])
        AND status = 'ACCEPTED'
    `, [userUuid, problemIds]);

        const solvedSet = new Set(solvedRows.map((r: any) => r.problem_id));
        let challengeSet = false;

        for (const s of suggestions) {
            s.solved = solvedSet.has(s.problemId);
            // Mark first unsolved hard/medium as daily challenge
            if (!challengeSet && !s.solved && (s.difficulty === 'Hard' || s.difficulty === 'Medium')) {
                s.isDailyChallenge = true;
                challengeSet = true;
            } else {
                s.isDailyChallenge = false;
            }
        }

        // If no hard/medium unsolved, mark first unsolved as challenge
        if (!challengeSet) {
            const firstUnsolved = suggestions.find((s: any) => !s.solved);
            if (firstUnsolved) firstUnsolved.isDailyChallenge = true;
        }
    }

    /**
     * Mastery tier for unlockable visual themes.
     */
    private getMasteryTier(overallMastery: number): { level: string; color: string; glowColor: string } {
        if (overallMastery >= 90) return { level: 'Grandmaster', color: '#f59e0b', glowColor: 'rgba(245,158,11,0.3)' };
        if (overallMastery >= 75) return { level: 'Expert', color: '#8b5cf6', glowColor: 'rgba(139,92,246,0.3)' };
        if (overallMastery >= 55) return { level: 'Proficient', color: '#3b82f6', glowColor: 'rgba(59,130,246,0.3)' };
        if (overallMastery >= 35) return { level: 'Apprentice', color: '#22c55e', glowColor: 'rgba(34,197,94,0.3)' };
        return { level: 'Novice', color: '#64748b', glowColor: 'rgba(100,116,139,0.3)' };
    }

    // ─── AI Roadmap Generation ────────────────────────────────────

    async generateAndCacheRoadmap(userUuid: string): Promise<any> {
        const start = Date.now();

        const stats = await this.dataSource.query(`
      SELECT topic_name, mastery_score, problems_solved, total_attempts,
             first_attempt_success_rate, avg_hint_penalty, last_practiced
      FROM user_topic_mastery
      WHERE user_uuid = $1
      ORDER BY mastery_score ASC
    `, [userUuid]);

        if (!stats.length) {
            return {
                themeOfWeek: 'Get Started!',
                coachInsight: 'Start solving problems to get a personalized roadmap.',
                dailySuggestions: [],
                nextWeekPreview: [],
                weeklyGoalSummary: 'Solve your first few problems so I can understand your strengths.',
            };
        }

        const weakAreas = stats.filter((s: any) => parseFloat(s.mastery_score) < 40);
        const growthAreas = stats.filter((s: any) => parseFloat(s.mastery_score) >= 40 && parseFloat(s.mastery_score) < 75);
        const strongAreas = stats.filter((s: any) => parseFloat(s.mastery_score) >= 75);

        const recommendedProblems = await this.fetchRecommendedProblems(weakAreas, growthAreas);
        const streak = await this.calcStreak(userUuid);

        // Dynamic context for AI coach
        const hour = new Date().getHours();
        const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
        const streakContext = streak.current > 0
            ? `The user has a ${streak.current}-day solving streak. Acknowledge and encourage this.`
            : 'The user has no active streak. Motivate them to start building consistency.';

        const prompt = `
You are a coding coach. A user has the following performance data across topics:

Weak Areas (mastery < 40): ${JSON.stringify(weakAreas.map((s: any) => ({ topic: s.topic_name, mastery: parseFloat(s.mastery_score).toFixed(1) })))}
Growth Areas (mastery 40-75): ${JSON.stringify(growthAreas.map((s: any) => ({ topic: s.topic_name, mastery: parseFloat(s.mastery_score).toFixed(1) })))}
Strong Areas (mastery >= 75): ${JSON.stringify(strongAreas.map((s: any) => ({ topic: s.topic_name, mastery: parseFloat(s.mastery_score).toFixed(1) })))}

Context: It's ${timeOfDay}. ${streakContext}

Available problems for recommendation: ${JSON.stringify(recommendedProblems.map((p: any) => ({ id: p.uuid, title: p.title, difficulty: p.difficulty, patterns: p.patterns })))}

Return ONLY valid JSON (no markdown, no explanation, no code fences) in this exact shape:
{
  "themeOfWeek": "string — e.g. 'Rebuild your Two Pointer foundations'",
  "coachInsight": "string — 2-3 sentences. Be warm, specific, and reference their data patterns. Include a motivational nudge relevant to the time of day and streak.",
  "dailySuggestions": [
    { "problemId": "uuid", "title": "string", "difficulty": "Easy|Medium|Hard", "reason": "string explaining why this problem is recommended" }
  ],
  "nextWeekPreview": ["topic1", "topic2"],
  "weeklyGoalSummary": "string — 1 sentence motivational goal for the week"
}

Rules:
- dailySuggestions should have 3-5 problems maximum
- Prioritize weak areas but include 1 growth area problem
- Only use problem IDs from the available problems list
- Be specific, warm, and encouraging in coaching insights
- Reference the user's streak if they have one
`;

        try {
            const response = await this.model.invoke(prompt);
            const content = typeof response.content === 'string'
                ? response.content
                : JSON.stringify(response.content);

            const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const roadmapJson = JSON.parse(cleaned);

            // Cache the result
            await this.dataSource.query(`
        INSERT INTO user_roadmaps (user_uuid, roadmap_json, needs_regen, updated_at)
        VALUES ($1, $2, FALSE, NOW())
        ON CONFLICT (user_uuid)
        DO UPDATE SET roadmap_json = $2, needs_regen = FALSE, updated_at = NOW()
      `, [userUuid, JSON.stringify(roadmapJson)]);

            const elapsed = Date.now() - start;
            this.logger.log(`Roadmap generated for user ${userUuid} in ${elapsed}ms`);

            return roadmapJson;
        } catch (err) {
            this.logger.error(`Failed to generate roadmap for user ${userUuid}`, err);
            return {
                themeOfWeek: 'Keep Practicing!',
                coachInsight: 'I had trouble generating your personalized plan. Keep solving problems and check back later.',
                dailySuggestions: recommendedProblems.slice(0, 3).map((p: any) => ({
                    problemId: p.uuid,
                    title: p.title,
                    difficulty: p.difficulty,
                    reason: `Practice ${(p.patterns || []).join(', ')}`,
                })),
                nextWeekPreview: [],
                weeklyGoalSummary: 'Focus on consistency — solve at least one problem every day.',
            };
        }
    }

    private async fetchRecommendedProblems(weakAreas: any[], growthAreas: any[]): Promise<any[]> {
        const topics = [
            ...weakAreas.map((a: any) => a.topic_name),
            ...growthAreas.map((a: any) => a.topic_name),
        ];
        if (!topics.length) return [];

        return this.dataSource.query(`
      SELECT uuid, title, difficulty, patterns
      FROM problems
      WHERE patterns::text[] && $1::text[]
      ORDER BY RANDOM()
      LIMIT 10
    `, [topics]);
    }
}
