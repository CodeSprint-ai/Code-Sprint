import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExecutionConfig1771688316815 implements MigrationInterface {
    name = 'AddExecutionConfig1771688316815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "problems"
                RENAME COLUMN "runner_template" TO "execution_config"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."account_status_enum"
            RENAME TO "account_status_enum_old"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'unverified', 'suspended', 'deleted')
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "status" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "status" TYPE "public"."users_status_enum" USING "status"::"text"::"public"."users_status_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "status"
            SET DEFAULT 'unverified'
        `);
        await queryRunner.query(`
            DROP TYPE "public"."account_status_enum_old"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "status"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "problems"
            ALTER COLUMN "starter_code"
            SET DEFAULT '{"java":"","python":"","cpp":""}'
        `);
        await queryRunner.query(`
            ALTER TABLE "problems"
            ALTER COLUMN "execution_config"
            SET DEFAULT '{"type":"FUNCTION","className":"Solution","methodName":"","compareMode":"EXACT","outputSerializer":"NONE"}'
        `);
        await queryRunner.query(`
            ALTER TABLE "user_sessions"
            ALTER COLUMN "refresh_token_hash"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_sessions"
            ALTER COLUMN "expires_at"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_sessions"
            ALTER COLUMN "is_revoked"
            SET NOT NULL
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_3676155292d72c67cd4e090514" ON "users" ("status")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ead56a334d703fe8605f173b44" ON "user_sessions" ("user_id", "is_revoked")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ead56a334d703fe8605f173b44"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_3676155292d72c67cd4e090514"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_sessions"
            ALTER COLUMN "is_revoked" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_sessions"
            ALTER COLUMN "expires_at" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_sessions"
            ALTER COLUMN "refresh_token_hash" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "problems"
            ALTER COLUMN "execution_config"
            SET DEFAULT '{"cpp": "", "java": "", "python": ""}'
        `);
        await queryRunner.query(`
            ALTER TABLE "problems"
            ALTER COLUMN "starter_code"
            SET DEFAULT '{"cpp": "", "java": "", "python": ""}'
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "status" DROP NOT NULL
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."account_status_enum_old" AS ENUM('active', 'unverified', 'suspended', 'deleted')
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "status" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "status" TYPE "public"."account_status_enum_old" USING "status"::"text"::"public"."account_status_enum_old"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "status"
            SET DEFAULT 'unverified'
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_status_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."account_status_enum_old"
            RENAME TO "account_status_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "problems"
                RENAME COLUMN "execution_config" TO "runner_template"
        `);
    }

}
