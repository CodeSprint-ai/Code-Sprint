import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration 1: Add ai_analysis JSONB column to submissions.
 * No pgvector dependency — succeeds independently.
 */
export class AddAiAnalysisColumn1771800000000 implements MigrationInterface {
  name = 'AddAiAnalysisColumn1771800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD COLUMN "ai_analysis" jsonb DEFAULT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP COLUMN "ai_analysis"`,
    );
  }
}
