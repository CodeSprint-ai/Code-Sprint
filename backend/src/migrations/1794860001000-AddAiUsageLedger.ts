import { MigrationInterface, QueryRunner } from 'typeorm';
export class AddAiUsageLedger1794860001000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE ai_usage_ledger (
      id uuid PRIMARY KEY, user_uuid uuid NOT NULL, kind varchar(16) NOT NULL CHECK (kind IN ('hint','analysis')),
      period varchar(7) NOT NULL, resource varchar(100) NOT NULL,
      status varchar(16) NOT NULL CHECK (status IN ('reserved','completed')),
      created_at timestamptz NOT NULL DEFAULT NOW(), UNIQUE (user_uuid, kind, period, resource)
    )`);
    // Invalidate generated level-4 cache entries from the old full-solution policy.
    await queryRunner.query(
      'DELETE FROM problem_hints WHERE level = 4 AND version < 2',
    );
    await queryRunner.query(
      'CREATE INDEX ai_usage_user_period ON ai_usage_ledger(user_uuid, period)',
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE ai_usage_ledger');
  }
}
