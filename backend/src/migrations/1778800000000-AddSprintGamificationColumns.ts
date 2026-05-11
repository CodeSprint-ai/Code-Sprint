import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: Add Sprint Gamification Columns
 * 
 * Adds new columns to sprint_sessions for gamification:
 * - correct_answers: tracks how many problems were solved
 * - total_questions: total problems in the sprint
 * - difficulty_breakdown: JSON breakdown of solved problems by difficulty
 * 
 * Also adds the ABANDONED enum value to sprint status.
 */
export class AddSprintGamificationColumns1778800000000 implements MigrationInterface {
    name = 'AddSprintGamificationColumns1778800000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new columns to sprint_sessions
        await queryRunner.query(`
            ALTER TABLE "sprint_sessions" 
            ADD COLUMN IF NOT EXISTS "correct_answers" integer NOT NULL DEFAULT 0
        `);

        await queryRunner.query(`
            ALTER TABLE "sprint_sessions" 
            ADD COLUMN IF NOT EXISTS "total_questions" integer NOT NULL DEFAULT 0
        `);

        await queryRunner.query(`
            ALTER TABLE "sprint_sessions" 
            ADD COLUMN IF NOT EXISTS "difficulty_breakdown" jsonb
        `);

        // Add ABANDONED to the sprint status enum
        // PostgreSQL enums need explicit ALTER TYPE
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_enum 
                    WHERE enumlabel = 'ABANDONED' 
                    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'sprint_sessions_status_enum')
                ) THEN
                    ALTER TYPE "sprint_sessions_status_enum" ADD VALUE 'ABANDONED';
                END IF;
            END$$;
        `);

        // Add index on user_id for sprint_sessions if not exists
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_sprint_sessions_user_id" 
            ON "sprint_sessions" ("user_id")
        `);

        // Add new badge criteria types to enum if it exists
        // These are stored as JSONB values, not as DB enum, so no ALTER TYPE needed
        // The BadgeCriteriaType enum is a TypeScript-only enum stored as string in JSON
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "sprint_sessions" DROP COLUMN IF EXISTS "correct_answers"
        `);
        await queryRunner.query(`
            ALTER TABLE "sprint_sessions" DROP COLUMN IF EXISTS "total_questions"
        `);
        await queryRunner.query(`
            ALTER TABLE "sprint_sessions" DROP COLUMN IF EXISTS "difficulty_breakdown"
        `);
        await queryRunner.query(`
            DROP INDEX IF EXISTS "IDX_sprint_sessions_user_id"
        `);
        // Note: Cannot remove enum values in PostgreSQL without recreating the type
    }
}
