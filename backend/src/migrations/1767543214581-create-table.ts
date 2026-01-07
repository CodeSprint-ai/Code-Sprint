import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1767543214581 implements MigrationInterface {
    name = 'CreateTable1767543214581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "name" character varying(255), "password" character varying(255), "is_verified" boolean NOT NULL DEFAULT false, "email_verification_token" character varying, "password_reset_token" character varying, "password_reset_expires" TIMESTAMP WITH TIME ZONE, "provider" "public"."users_provider_enum" NOT NULL DEFAULT 'local', "refresh_token" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "level" "public"."users_level_enum" NOT NULL DEFAULT 'BEGINNER', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_951b8f1dfc94ac1d0301a14b7e1" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "test_cases" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "input" jsonb DEFAULT '{}', "input_text" text, "expected_output" jsonb, "expected_output_text" text, "is_sample" boolean NOT NULL DEFAULT false, "is_hidden" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "problem_id" uuid, CONSTRAINT "PK_727c6e67a5098e99e448109b017" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TYPE "public"."problems_patterns_enum" AS ENUM('ARRAY', 'HASH_TABLE', 'SLIDING_WINDOW', 'TWO_POINTERS', 'FAST_AND_SLOW_POINTERS', 'MERGE_INTERVALS', 'CYCLIC_SORT', 'INPLACE_REVERSAL_OF_LINKED_LIST', 'TREE_BFS', 'TREE_DFS', 'TWO_HEAPS', 'SUBSETS', 'MODIFIED_BINARY_SEARCH', 'TOP_K_ELEMENTS', 'K_WAY_MERGE', 'TOPOLOGICAL_SORT', 'BITWISE_XOR', 'DYNAMIC_PROGRAMMING', 'BACKTRACKING', 'GRAPH')`);
        await queryRunner.query(`CREATE TABLE "problems" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "description" text NOT NULL, "input_format" text, "output_format" text, "constraints" text, "sample_input" text, "sample_output" text, "difficulty" "public"."problems_difficulty_enum" NOT NULL, "patterns" "public"."problems_patterns_enum" array NOT NULL DEFAULT '{}', "tags" text array NOT NULL DEFAULT '{}', "companies" text array NOT NULL DEFAULT '{}', "starter_code" jsonb DEFAULT '{"java":"","python":"","cpp":""}', "runner_template" jsonb DEFAULT '{"java":"","python":"","cpp":""}', "time_limit_seconds" integer NOT NULL DEFAULT '2', "memory_limit_mb" integer NOT NULL DEFAULT '256', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, CONSTRAINT "UQ_ed0948d10a4b9dff13c9461090b" UNIQUE ("slug"), CONSTRAINT "PK_a96944bb3d97fb294b00f035cf3" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "sprint_problems" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL DEFAULT '0', "max_score" integer NOT NULL DEFAULT '0', "sprint_session_id" uuid, "problem_id" uuid, CONSTRAINT "PK_f2de698597482b050de1cd91d4e" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "sprint_sessions" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "status" "public"."sprint_sessions_status_enum" NOT NULL DEFAULT 'PENDING', "score" integer NOT NULL DEFAULT '0', "completed_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_cbde38b9016cc8cc62c67481d26" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "submissions" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" text NOT NULL, "status" "public"."submissions_status_enum" NOT NULL DEFAULT 'PENDING', "language" character varying, "execution_time" double precision, "memory_usage" double precision, "test_results" jsonb, "judge_tokens" text, "compile_output" text, "finished_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "problem_id" uuid NOT NULL, "sprint_session_id" uuid, CONSTRAINT "PK_2e07bcdbbfb5280e6ff6a6c0986" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`ALTER TABLE "test_cases" ADD CONSTRAINT "FK_b64ac4d24cd9a87eda34b2a9457" FOREIGN KEY ("problem_id") REFERENCES "problems"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "problems" ADD CONSTRAINT "FK_2aee58a468d036cc139963ae789" FOREIGN KEY ("created_by") REFERENCES "users"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sprint_problems" ADD CONSTRAINT "FK_f1f73c7d16e633eccbac6f57abc" FOREIGN KEY ("sprint_session_id") REFERENCES "sprint_sessions"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sprint_problems" ADD CONSTRAINT "FK_0ce27fa46f5cbe38a161d1bcbf0" FOREIGN KEY ("problem_id") REFERENCES "problems"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sprint_sessions" ADD CONSTRAINT "FK_dca24aa2f0e6d8909ed9111ed6c" FOREIGN KEY ("user_id") REFERENCES "users"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "FK_fca12c4ddd646dea4572c6815a9" FOREIGN KEY ("user_id") REFERENCES "users"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "FK_d7613a2172f2115adb054c4c16e" FOREIGN KEY ("problem_id") REFERENCES "problems"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "FK_d5a00af45aced67739d40424398" FOREIGN KEY ("sprint_session_id") REFERENCES "sprint_sessions"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_d5a00af45aced67739d40424398"`);
        await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_d7613a2172f2115adb054c4c16e"`);
        await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_fca12c4ddd646dea4572c6815a9"`);
        await queryRunner.query(`ALTER TABLE "sprint_sessions" DROP CONSTRAINT "FK_dca24aa2f0e6d8909ed9111ed6c"`);
        await queryRunner.query(`ALTER TABLE "sprint_problems" DROP CONSTRAINT "FK_0ce27fa46f5cbe38a161d1bcbf0"`);
        await queryRunner.query(`ALTER TABLE "sprint_problems" DROP CONSTRAINT "FK_f1f73c7d16e633eccbac6f57abc"`);
        await queryRunner.query(`ALTER TABLE "problems" DROP CONSTRAINT "FK_2aee58a468d036cc139963ae789"`);
        await queryRunner.query(`ALTER TABLE "test_cases" DROP CONSTRAINT "FK_b64ac4d24cd9a87eda34b2a9457"`);
        await queryRunner.query(`DROP TABLE "submissions"`);
        await queryRunner.query(`DROP TABLE "sprint_sessions"`);
        await queryRunner.query(`DROP TABLE "sprint_problems"`);
        await queryRunner.query(`DROP TABLE "problems"`);
        await queryRunner.query(`DROP TYPE "public"."problems_patterns_enum"`);
        await queryRunner.query(`DROP TABLE "test_cases"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
