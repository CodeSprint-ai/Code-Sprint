import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration 2: Enable pgvector extension and create document_embeddings table.
 * Separated from Migration 1 so non-vector schema changes succeed independently.
 */
export class AddDocumentEmbeddings1771800001000 implements MigrationInterface {
  name = 'AddDocumentEmbeddings1771800001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable pgvector extension (Neon supports this natively)
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`);

    // Create document_embeddings table
    await queryRunner.query(`
      CREATE TABLE "document_embeddings" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "namespace" varchar NOT NULL,
        "document_id" varchar NOT NULL,
        "content" text NOT NULL,
        "metadata" jsonb DEFAULT NULL,
        "embedding" vector(768) DEFAULT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_document_embeddings" PRIMARY KEY ("id")
      )
    `);

    // Index for fast namespace + documentId lookups (used in upsert)
    await queryRunner.query(`
      CREATE INDEX "IDX_doc_embeddings_ns_docid"
      ON "document_embeddings" ("namespace", "document_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_doc_embeddings_ns_docid"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "document_embeddings"`);
    // Note: not dropping vector extension since other things might use it
  }
}
