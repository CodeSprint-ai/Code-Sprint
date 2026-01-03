import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameColumnsToSnakeCase1735930000000 implements MigrationInterface {
  name = 'RenameColumnsToSnakeCase1735930000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ============== USERS TABLE ==============
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "isVerified" TO "is_verified"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "emailVerificationToken" TO "email_verification_token"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "passwordResetToken" TO "password_reset_token"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "passwordResetExpires" TO "password_reset_expires"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "refreshToken" TO "refresh_token"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated_at"`);

    // ============== PROBLEMS TABLE ==============
    await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "inputFormat" TO "input_format"`);
    await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "outputFormat" TO "output_format"`);
    await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "sampleInput" TO "sample_input"`);
    await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "sampleOutput" TO "sample_output"`);
    await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "timeLimitSeconds" TO "time_limit_seconds"`);
    await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "memoryLimitMB" TO "memory_limit_mb"`);
    await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "createdAt" TO "created_at"`);
    await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "updatedAt" TO "updated_at"`);
    await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "createdByUuid" TO "created_by"`);
    
    // Add new columns if they don't exist
    await queryRunner.query(`
      ALTER TABLE "problems" 
      ADD COLUMN IF NOT EXISTS "starter_code" jsonb DEFAULT '{"java":"","python":"","cpp":""}'
    `);
    await queryRunner.query(`
      ALTER TABLE "problems" 
      ADD COLUMN IF NOT EXISTS "runner_template" jsonb DEFAULT '{"java":"","python":"","cpp":""}'
    `);
    await queryRunner.query(`
      ALTER TABLE "problems" 
      ADD COLUMN IF NOT EXISTS "companies" text[] DEFAULT '{}'
    `);

    // ============== TEST_CASES TABLE ==============
    await queryRunner.query(`ALTER TABLE "test_cases" RENAME COLUMN "expectedOutput" TO "expected_output_text"`);
    await queryRunner.query(`ALTER TABLE "test_cases" RENAME COLUMN "isSample" TO "is_sample"`);
    await queryRunner.query(`ALTER TABLE "test_cases" RENAME COLUMN "createdAt" TO "created_at"`);
    await queryRunner.query(`ALTER TABLE "test_cases" RENAME COLUMN "problemUuid" TO "problem_id"`);
    
    // Rename input to input_text and add new jsonb input column
    await queryRunner.query(`ALTER TABLE "test_cases" RENAME COLUMN "input" TO "input_text"`);
    await queryRunner.query(`
      ALTER TABLE "test_cases" 
      ADD COLUMN IF NOT EXISTS "input" jsonb DEFAULT '{}'
    `);
    await queryRunner.query(`
      ALTER TABLE "test_cases" 
      ADD COLUMN IF NOT EXISTS "expected_output" jsonb
    `);
    await queryRunner.query(`
      ALTER TABLE "test_cases" 
      ADD COLUMN IF NOT EXISTS "is_hidden" boolean DEFAULT false
    `);

    // ============== SUBMISSIONS TABLE ==============
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "executionTime" TO "execution_time"`);
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "memoryUsage" TO "memory_usage"`);
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "testResults" TO "test_results"`);
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "judgeTokens" TO "judge_tokens"`);
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "compileOutput" TO "compile_output"`);
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "finishedAt" TO "finished_at"`);
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "createdAt" TO "created_at"`);
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "userUuid" TO "user_id"`);
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "problemUuid" TO "problem_id"`);
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "sprintSessionUuid" TO "sprint_session_id"`);

    // ============== SPRINT_SESSIONS TABLE ==============
    await queryRunner.query(`ALTER TABLE "sprint_sessions" RENAME COLUMN "startTime" TO "start_time"`);
    await queryRunner.query(`ALTER TABLE "sprint_sessions" RENAME COLUMN "endTime" TO "end_time"`);
    await queryRunner.query(`ALTER TABLE "sprint_sessions" RENAME COLUMN "completedAt" TO "completed_at"`);
    await queryRunner.query(`ALTER TABLE "sprint_sessions" RENAME COLUMN "createdAt" TO "created_at"`);
    await queryRunner.query(`ALTER TABLE "sprint_sessions" RENAME COLUMN "updatedAt" TO "updated_at"`);
    await queryRunner.query(`ALTER TABLE "sprint_sessions" RENAME COLUMN "userUuid" TO "user_id"`);

    // ============== SPRINT_PROBLEMS TABLE ==============
    await queryRunner.query(`ALTER TABLE "sprint_problems" RENAME COLUMN "maxScore" TO "max_score"`);
    await queryRunner.query(`ALTER TABLE "sprint_problems" RENAME COLUMN "sprintSessionUuid" TO "sprint_session_id"`);
    await queryRunner.query(`ALTER TABLE "sprint_problems" RENAME COLUMN "problemUuid" TO "problem_id"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ============== SPRINT_PROBLEMS TABLE ==============
    await queryRunner.query(`ALTER TABLE "sprint_problems" RENAME COLUMN "problem_id" TO "problemUuid"`);
    await queryRunner.query(`ALTER TABLE "sprint_problems" RENAME COLUMN "sprint_session_id" TO "sprintSessionUuid"`);
    await queryRunner.query(`ALTER TABLE "sprint_problems" RENAME COLUMN "max_score" TO "maxScore"`);

    // ============== SPRINT_SESSIONS TABLE ==============
    await queryRunner.query(`ALTER TABLE "sprint_sessions" RENAME COLUMN "user_id" TO "userUuid"`);
    await queryRunner.query(`ALTER TABLE "sprint_sessions" RENAME COLUMN "updated_at" TO "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "sprint_sessions" RENAME COLUMN "created_at" TO "createdAt"`);
    await queryRunner.query(`ALTER TABLE "sprint_sessions" RENAME COLUMN "completed_at" TO "completedAt"`);
    await queryRunner.query(`ALTER TABLE "sprint_sessions" RENAME COLUMN "end_time" TO "endTime"`);
    await queryRunner.query(`ALTER TABLE "sprint_sessions" RENAME COLUMN "start_time" TO "startTime"`);

    // ============== SUBMISSIONS TABLE ==============
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "sprint_session_id" TO "sprintSessionUuid"`);
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "problem_id" TO "problemUuid"`);
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "user_id" TO "userUuid"`);
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "created_at" TO "createdAt"`);
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "finished_at" TO "finishedAt"`);
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "compile_output" TO "compileOutput"`);
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "judge_tokens" TO "judgeTokens"`);
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "test_results" TO "testResults"`);
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "memory_usage" TO "memoryUsage"`);
    await queryRunner.query(`ALTER TABLE "submissions" RENAME COLUMN "execution_time" TO "executionTime"`);

    // ============== TEST_CASES TABLE ==============
    await queryRunner.query(`ALTER TABLE "test_cases" DROP COLUMN IF EXISTS "is_hidden"`);
    await queryRunner.query(`ALTER TABLE "test_cases" DROP COLUMN IF EXISTS "expected_output"`);
    await queryRunner.query(`ALTER TABLE "test_cases" DROP COLUMN IF EXISTS "input"`);
    await queryRunner.query(`ALTER TABLE "test_cases" RENAME COLUMN "input_text" TO "input"`);
    await queryRunner.query(`ALTER TABLE "test_cases" RENAME COLUMN "problem_id" TO "problemUuid"`);
    await queryRunner.query(`ALTER TABLE "test_cases" RENAME COLUMN "created_at" TO "createdAt"`);
    await queryRunner.query(`ALTER TABLE "test_cases" RENAME COLUMN "is_sample" TO "isSample"`);
    await queryRunner.query(`ALTER TABLE "test_cases" RENAME COLUMN "expected_output_text" TO "expectedOutput"`);

    // ============== PROBLEMS TABLE ==============
    await queryRunner.query(`ALTER TABLE "problems" DROP COLUMN IF EXISTS "companies"`);
    await queryRunner.query(`ALTER TABLE "problems" DROP COLUMN IF EXISTS "runner_template"`);
    await queryRunner.query(`ALTER TABLE "problems" DROP COLUMN IF EXISTS "starter_code"`);
    await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "created_by" TO "createdByUuid"`);
    await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "updated_at" TO "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "created_at" TO "createdAt"`);
    await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "memory_limit_mb" TO "memoryLimitMB"`);
    await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "time_limit_seconds" TO "timeLimitSeconds"`);
    await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "sample_output" TO "sampleOutput"`);
    await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "sample_input" TO "sampleInput"`);
    await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "output_format" TO "outputFormat"`);
    await queryRunner.query(`ALTER TABLE "problems" RENAME COLUMN "input_format" TO "inputFormat"`);

    // ============== USERS TABLE ==============
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "updated_at" TO "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "created_at" TO "createdAt"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "refresh_token" TO "refreshToken"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "password_reset_expires" TO "passwordResetExpires"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "password_reset_token" TO "passwordResetToken"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "email_verification_token" TO "emailVerificationToken"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "is_verified" TO "isVerified"`);
  }
}

