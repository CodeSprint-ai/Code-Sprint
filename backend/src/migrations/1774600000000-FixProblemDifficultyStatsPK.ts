import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixProblemDifficultyStatsPK1774600000000 implements MigrationInterface {
    name = 'FixProblemDifficultyStatsPK1774600000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Drop the old single-column PK on problem_id
        await queryRunner.query(`
      ALTER TABLE "problem_difficulty_stats"
      DROP CONSTRAINT IF EXISTS "problem_difficulty_stats_pkey"
    `);

        // 2. Ensure topic_name is NOT NULL (was nullable before)
        await queryRunner.query(`
      DELETE FROM "problem_difficulty_stats" WHERE "topic_name" IS NULL
    `);
        await queryRunner.query(`
      ALTER TABLE "problem_difficulty_stats"
      ALTER COLUMN "topic_name" SET NOT NULL
    `);

        // 3. Remove duplicate rows (keep latest) before adding composite PK
        await queryRunner.query(`
      DELETE FROM "problem_difficulty_stats" a
      USING "problem_difficulty_stats" b
      WHERE a.problem_id = b.problem_id
        AND a.topic_name = b.topic_name
        AND a.updated_at < b.updated_at
    `);

        // 4. Add composite PK (problem_id, topic_name)
        await queryRunner.query(`
      ALTER TABLE "problem_difficulty_stats"
      ADD CONSTRAINT "problem_difficulty_stats_pkey" PRIMARY KEY ("problem_id", "topic_name")
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert to single-column PK
        await queryRunner.query(`
      ALTER TABLE "problem_difficulty_stats"
      DROP CONSTRAINT IF EXISTS "problem_difficulty_stats_pkey"
    `);

        await queryRunner.query(`
      ALTER TABLE "problem_difficulty_stats"
      ALTER COLUMN "topic_name" DROP NOT NULL
    `);

        // Remove duplicates that would violate single PK
        await queryRunner.query(`
      DELETE FROM "problem_difficulty_stats" a
      USING "problem_difficulty_stats" b
      WHERE a.problem_id = b.problem_id
        AND a.updated_at < b.updated_at
    `);

        await queryRunner.query(`
      ALTER TABLE "problem_difficulty_stats"
      ADD CONSTRAINT "problem_difficulty_stats_pkey" PRIMARY KEY ("problem_id")
    `);
    }
}
