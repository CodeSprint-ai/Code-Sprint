import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';

@Injectable()
export class StatsCronService {
  private readonly logger = new Logger(StatsCronService.name);

  constructor(private readonly dataSource: DataSource) { }

  /**
   * Refresh community median solve times nightly.
   * Uses patterns from the problems table (not tags).
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async refreshDifficultyMedians(): Promise<void> {
    this.logger.log('Refreshing problem_difficulty_stats medians...');

    try {
      await this.dataSource.query(`
        WITH expanded AS (
          SELECT
            s.problem_id,
            p.difficulty,
            unnest(p.patterns) AS topic_name,
            s.time_spent_ms
          FROM submissions s
          JOIN problems p ON p.uuid = s.problem_id
          WHERE s.time_spent_ms IS NOT NULL
            AND s.status = 'ACCEPTED'
        )
        INSERT INTO problem_difficulty_stats (problem_id, difficulty, topic_name, median_time_ms, updated_at)
        SELECT
          problem_id,
          difficulty,
          topic_name,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY time_spent_ms)::int AS median_time_ms,
          NOW()
        FROM expanded
        GROUP BY problem_id, difficulty, topic_name
        ON CONFLICT (problem_id, topic_name)
        DO UPDATE SET
          median_time_ms = EXCLUDED.median_time_ms,
          updated_at = NOW()
      `);

      this.logger.log('Done refreshing medians.');
    } catch (err) {
      this.logger.error('Failed to refresh difficulty medians', err);
    }
  }
}
