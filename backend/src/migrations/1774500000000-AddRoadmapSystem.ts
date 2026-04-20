import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoadmapSystem1774500000000 implements MigrationInterface {
    name = 'AddRoadmapSystem1774500000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Add new columns to submissions table
        await queryRunner.query(`
      ALTER TABLE submissions
      ADD COLUMN IF NOT EXISTS "time_spent_ms" INTEGER,
      ADD COLUMN IF NOT EXISTS "hints_used_count" INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "attempt_number" INTEGER DEFAULT 1
    `);

        // 2. Create user_topic_mastery table
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_topic_mastery" (
        "user_uuid"                  UUID          NOT NULL,
        "topic_name"                 VARCHAR(80)   NOT NULL,
        "problems_solved"            INTEGER       DEFAULT 0,
        "total_attempts"             INTEGER       DEFAULT 0,
        "first_attempt_success_rate" DECIMAL(5,2)  DEFAULT 0,
        "avg_accuracy"               DECIMAL(5,2)  DEFAULT 0,
        "avg_hint_penalty"           DECIMAL(5,2)  DEFAULT 0,
        "time_efficiency_score"      DECIMAL(5,2)  DEFAULT 0,
        "consistency_score"          DECIMAL(5,2)  DEFAULT 0,
        "mastery_score"              DECIMAL(5,2)  DEFAULT 0,
        "last_practiced"             TIMESTAMP     DEFAULT NOW(),
        PRIMARY KEY ("user_uuid", "topic_name")
      )
    `);

        // 3. Create problem_difficulty_stats table
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "problem_difficulty_stats" (
        "problem_id"     UUID          PRIMARY KEY,
        "difficulty"     VARCHAR(10)   NOT NULL,
        "topic_name"     VARCHAR(80),
        "median_time_ms" INTEGER       DEFAULT 0,
        "updated_at"     TIMESTAMP     DEFAULT NOW()
      )
    `);

        // 4. Create user_roadmaps cache table
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_roadmaps" (
        "user_uuid"    UUID      PRIMARY KEY,
        "roadmap_json" JSONB,
        "needs_regen"  BOOLEAN   DEFAULT TRUE,
        "updated_at"   TIMESTAMP DEFAULT NOW()
      )
    `);

        // 5. Create roadmap_badges table
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "roadmap_badges" (
        "id"          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_uuid"   UUID        NOT NULL,
        "badge_key"   VARCHAR(80) NOT NULL,
        "badge_label" VARCHAR(120),
        "awarded_at"  TIMESTAMP   DEFAULT NOW(),
        UNIQUE ("user_uuid", "badge_key")
      )
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "roadmap_badges"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "user_roadmaps"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "problem_difficulty_stats"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "user_topic_mastery"`);

        await queryRunner.query(`
      ALTER TABLE submissions
      DROP COLUMN IF EXISTS "time_spent_ms",
      DROP COLUMN IF EXISTS "hints_used_count",
      DROP COLUMN IF EXISTS "attempt_number"
    `);
    }
}
