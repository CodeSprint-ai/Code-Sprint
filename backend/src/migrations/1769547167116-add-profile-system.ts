import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfileSystem1769547167116 implements MigrationInterface {
    name = 'AddProfileSystem1769547167116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_stats" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "total_solved" integer NOT NULL DEFAULT '0', "easy_solved" integer NOT NULL DEFAULT '0', "medium_solved" integer NOT NULL DEFAULT '0', "hard_solved" integer NOT NULL DEFAULT '0', "total_submissions" integer NOT NULL DEFAULT '0', "accepted_submissions" integer NOT NULL DEFAULT '0', "current_streak" integer NOT NULL DEFAULT '0', "max_streak" integer NOT NULL DEFAULT '0', "last_submission_date" date, "contests_participated" integer NOT NULL DEFAULT '0', "best_contest_rank" integer, "rating" integer NOT NULL DEFAULT '0', "last_calculated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_0e0da843088caf61925ded4434" UNIQUE ("user_id"), CONSTRAINT "PK_3348e6025cb3fb24420353357df" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TYPE "public"."badges_tier_enum" AS ENUM('BRONZE', 'SILVER', 'GOLD', 'PLATINUM')`);
        await queryRunner.query(`CREATE TABLE "badges" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" text NOT NULL, "icon" character varying(100) NOT NULL, "tier" "public"."badges_tier_enum" NOT NULL, "criteria" jsonb NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9c91fc9c4a4ae01712baad1e9f6" UNIQUE ("name"), CONSTRAINT "PK_ac73892238180923cee0b7e2320" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "user_badges" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "badge_id" uuid NOT NULL, "unlocked_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_201b6e34825dc5bd06181320bde" UNIQUE ("user_id", "badge_id"), CONSTRAINT "PK_994d60ec7a8f43d61052b200d61" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_preferences_theme_enum" AS ENUM('LIGHT', 'DARK', 'SYSTEM')`);
        await queryRunner.query(`CREATE TYPE "public"."user_preferences_default_language_enum" AS ENUM('java', 'python', 'cpp')`);
        await queryRunner.query(`CREATE TABLE "user_preferences" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "theme" "public"."user_preferences_theme_enum" NOT NULL DEFAULT 'SYSTEM', "default_language" "public"."user_preferences_default_language_enum" NOT NULL DEFAULT 'python', "email_notifications" boolean NOT NULL DEFAULT true, "marketing_emails" boolean NOT NULL DEFAULT false, "show_activity_status" boolean NOT NULL DEFAULT true, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_458057fa75b66e68a275647da2" UNIQUE ("user_id"), CONSTRAINT "PK_c293b03d8a52156df363502b70e" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "saved_problems" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "problem_id" uuid NOT NULL, "notes" text, "saved_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1a2eb948f72c9d6ee6fb4341103" UNIQUE ("user_id", "problem_id"), CONSTRAINT "PK_2fb572b853ecb4f21fc8d51820c" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "user_sessions" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "device" character varying(255), "browser" character varying(100), "os" character varying(100), "ip_address" character varying(45), "location" character varying(255), "is_current" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "last_active_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fe5c2a28cde7668fd49a3e51128" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar_url" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "bio" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "country" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "social_links" jsonb NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "problems" ALTER COLUMN "starter_code" SET DEFAULT '{"java":"","python":"","cpp":""}'`);
        await queryRunner.query(`ALTER TABLE "problems" ALTER COLUMN "runner_template" SET DEFAULT '{"java":"","python":"","cpp":""}'`);
        await queryRunner.query(`ALTER TABLE "user_stats" ADD CONSTRAINT "FK_0e0da843088caf61925ded4434e" FOREIGN KEY ("user_id") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_badges" ADD CONSTRAINT "FK_f1221d9b1aaa64b1f3c98ed46d3" FOREIGN KEY ("user_id") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_badges" ADD CONSTRAINT "FK_715b81e610ab276ff6603cfc8e8" FOREIGN KEY ("badge_id") REFERENCES "badges"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_458057fa75b66e68a275647da2e" FOREIGN KEY ("user_id") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_problems" ADD CONSTRAINT "FK_f17f6ee50752e0703d45274a572" FOREIGN KEY ("user_id") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_problems" ADD CONSTRAINT "FK_857840120b93191b09c04e4d9ad" FOREIGN KEY ("problem_id") REFERENCES "problems"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_sessions" ADD CONSTRAINT "FK_e9658e959c490b0a634dfc54783" FOREIGN KEY ("user_id") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_sessions" DROP CONSTRAINT "FK_e9658e959c490b0a634dfc54783"`);
        await queryRunner.query(`ALTER TABLE "saved_problems" DROP CONSTRAINT "FK_857840120b93191b09c04e4d9ad"`);
        await queryRunner.query(`ALTER TABLE "saved_problems" DROP CONSTRAINT "FK_f17f6ee50752e0703d45274a572"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_458057fa75b66e68a275647da2e"`);
        await queryRunner.query(`ALTER TABLE "user_badges" DROP CONSTRAINT "FK_715b81e610ab276ff6603cfc8e8"`);
        await queryRunner.query(`ALTER TABLE "user_badges" DROP CONSTRAINT "FK_f1221d9b1aaa64b1f3c98ed46d3"`);
        await queryRunner.query(`ALTER TABLE "user_stats" DROP CONSTRAINT "FK_0e0da843088caf61925ded4434e"`);
        await queryRunner.query(`ALTER TABLE "problems" ALTER COLUMN "runner_template" SET DEFAULT '{"cpp": "", "java": "", "python": ""}'`);
        await queryRunner.query(`ALTER TABLE "problems" ALTER COLUMN "starter_code" SET DEFAULT '{"cpp": "", "java": "", "python": ""}'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "social_links"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar_url"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
        await queryRunner.query(`DROP TABLE "user_sessions"`);
        await queryRunner.query(`DROP TABLE "saved_problems"`);
        await queryRunner.query(`DROP TABLE "user_preferences"`);
        await queryRunner.query(`DROP TYPE "public"."user_preferences_default_language_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_preferences_theme_enum"`);
        await queryRunner.query(`DROP TABLE "user_badges"`);
        await queryRunner.query(`DROP TABLE "badges"`);
        await queryRunner.query(`DROP TYPE "public"."badges_tier_enum"`);
        await queryRunner.query(`DROP TABLE "user_stats"`);
    }

}
