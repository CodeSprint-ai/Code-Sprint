import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMasteryHistory1774700000000 implements MigrationInterface {
    name = 'AddMasteryHistory1774700000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "mastery_history" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_uuid" uuid NOT NULL,
                "topic_name" varchar(80) NOT NULL,
                "mastery_score" decimal(5,2) NOT NULL DEFAULT 0,
                "recorded_at" date NOT NULL,
                CONSTRAINT "PK_mastery_history" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_mastery_history_user_topic_date" UNIQUE ("user_uuid", "topic_name", "recorded_at")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_mastery_history_user_topic_date"
            ON "mastery_history" ("user_uuid", "topic_name", "recorded_at")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_mastery_history_user_topic_date"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "mastery_history"`);
    }
}
