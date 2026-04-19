import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHintSystem1773002641075 implements MigrationInterface {
    name = 'AddHintSystem1773002641075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_doc_embeddings_ns_docid"`);
        await queryRunner.query(`CREATE TABLE "problem_hints" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "problem_uuid" uuid NOT NULL, "level" integer NOT NULL, "content" text NOT NULL, "language" character varying NOT NULL DEFAULT 'python', "version" integer NOT NULL DEFAULT '1', "useful_count" integer NOT NULL DEFAULT '0', "not_useful_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c3a5d6c4a21ae40989316cab866" UNIQUE ("problem_uuid", "level", "language"), CONSTRAINT "PK_4e74adc62cf6c816dad21346ed4" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "hint_usage" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_uuid" uuid NOT NULL, "problem_uuid" uuid NOT NULL, "level_reached" integer NOT NULL DEFAULT '0', "hints_used_at" jsonb NOT NULL DEFAULT '[]', "score_penalty" numeric(5,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b5e866ecb49eb7bb652bdbae5bf" UNIQUE ("user_uuid", "problem_uuid"), CONSTRAINT "PK_d9a2814495602e83b5112ca04e0" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE INDEX "idx_hint_usage_lookup" ON "hint_usage" ("level_reached") `);
        await queryRunner.query(`ALTER TABLE "problems" ALTER COLUMN "starter_code" SET DEFAULT '{"java":"","python":"","cpp":""}'`);
        await queryRunner.query(`ALTER TABLE "problems" ALTER COLUMN "execution_config" SET DEFAULT '{"type":"FUNCTION","className":"Solution","methodName":"","compareMode":"EXACT","outputSerializer":"NONE"}'`);
        await queryRunner.query(`ALTER TABLE "document_embeddings" DROP COLUMN "embedding"`);
        await queryRunner.query(`ALTER TABLE "document_embeddings" ADD "embedding" double precision array`);
        await queryRunner.query(`CREATE INDEX "IDX_e5ef8a55dfe53b4b3cb6df0ad6" ON "document_embeddings" ("namespace", "document_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_e5ef8a55dfe53b4b3cb6df0ad6"`);
        await queryRunner.query(`ALTER TABLE "document_embeddings" DROP COLUMN "embedding"`);
        await queryRunner.query(`ALTER TABLE "document_embeddings" ADD "embedding" vector DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "problems" ALTER COLUMN "execution_config" SET DEFAULT '{"type": "FUNCTION", "className": "Solution", "methodName": "", "compareMode": "EXACT", "outputSerializer": "NONE"}'`);
        await queryRunner.query(`ALTER TABLE "problems" ALTER COLUMN "starter_code" SET DEFAULT '{"cpp": "", "java": "", "python": ""}'`);
        await queryRunner.query(`DROP INDEX "public"."idx_hint_usage_lookup"`);
        await queryRunner.query(`DROP TABLE "hint_usage"`);
        await queryRunner.query(`DROP TABLE "problem_hints"`);
        await queryRunner.query(`CREATE INDEX "IDX_doc_embeddings_ns_docid" ON "document_embeddings" ("document_id", "namespace") `);
    }

}
