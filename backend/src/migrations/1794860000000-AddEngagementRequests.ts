import { MigrationInterface, QueryRunner } from 'typeorm';
export class AddEngagementRequests1794860000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE engagement_requests (
      uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(), kind varchar(16) NOT NULL CHECK (kind IN ('contact', 'waitlist')),
      email varchar(254) NOT NULL, name varchar(100), category varchar(32), message text, plan varchar(16),
      "consentVersion" varchar(32) NOT NULL DEFAULT 'beta-v1', created_at timestamptz NOT NULL DEFAULT NOW()
    )`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX engagement_waitlist_email ON engagement_requests (email) WHERE kind = 'waitlist'`,
    );
    await queryRunner.query(
      `CREATE INDEX engagement_created_at ON engagement_requests (created_at)`,
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE engagement_requests');
  }
}
