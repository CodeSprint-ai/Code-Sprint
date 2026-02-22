import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentEmbedding } from '../entities/DocumentEmbedding';
import { EmbeddingService } from './embedding.service';

/**
 * RAG service for ingesting and retrieving documents via pgvector.
 */
@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);

  constructor(
    @InjectRepository(DocumentEmbedding)
    private readonly embeddingRepo: Repository<DocumentEmbedding>,
    private readonly embeddingService: EmbeddingService,
  ) {}

  /**
   * Ingest a document chunk: embed and upsert into vector store.
   * Deletes existing entries for the same namespace+documentId first (upsert).
   */
  async ingest(
    namespace: string,
    documentId: string,
    content: string,
    metadata?: Record<string, any>,
  ): Promise<DocumentEmbedding> {
    const start = Date.now();

    // Delete existing entries for this document (upsert behavior)
    await this.embeddingRepo.delete({ namespace, documentId });

    // Generate embedding
    const embedding = await this.embeddingService.embed(content);

    // Store with raw SQL to use pgvector's vector type properly
    const result = await this.embeddingRepo
      .createQueryBuilder()
      .insert()
      .into(DocumentEmbedding)
      .values({
        namespace,
        documentId,
        content,
        metadata: metadata || {},
        embedding: () => `'[${embedding.join(',')}]'::vector`,
      })
      .returning('*')
      .execute();

    const elapsed = Date.now() - start;
    this.logger.log(
      `Ingested doc "${documentId}" into namespace "${namespace}" in ${elapsed}ms`,
    );

    return result.generatedMaps[0] as DocumentEmbedding;
  }

  /**
   * Retrieve top-K most similar documents from a namespace via cosine similarity.
   */
  async retrieve(
    namespace: string,
    query: string,
    topK: number = 3,
  ): Promise<{ content: string; metadata: Record<string, any>; score: number }[]> {
    const start = Date.now();

    const queryEmbedding = await this.embeddingService.embed(query);
    const embeddingStr = `[${queryEmbedding.join(',')}]`;

    const results = await this.embeddingRepo
      .createQueryBuilder('doc')
      .select([
        'doc.content',
        'doc.metadata',
        `(doc.embedding <=> '${embeddingStr}'::vector) AS score`,
      ])
      .where('doc.namespace = :namespace', { namespace })
      .orderBy('score', 'ASC') // Lower distance = more similar
      .limit(topK)
      .getRawMany();

    const elapsed = Date.now() - start;
    this.logger.debug(
      `Retrieved ${results.length} docs from "${namespace}" in ${elapsed}ms`,
    );

    return results.map((r) => ({
      content: r.doc_content,
      metadata: r.doc_metadata,
      score: parseFloat(r.score),
    }));
  }

  /**
   * Delete all documents in a namespace (for cache invalidation / re-ingestion).
   */
  async invalidateNamespace(namespace: string): Promise<number> {
    const result = await this.embeddingRepo.delete({ namespace });
    this.logger.log(
      `Invalidated namespace "${namespace}": ${result.affected} docs removed`,
    );
    return result.affected || 0;
  }
}
