import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * Stores document chunks with pgvector embeddings for RAG retrieval.
 * Uses Gemini text-embedding-004 dimensions (768).
 */
@Entity('document_embeddings')
@Index(['namespace', 'documentId'])
export class DocumentEmbedding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  namespace: string;

  @Column({ name: 'document_id' })
  documentId: string;

  @Column('text')
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  /**
   * 768-dimensional vector for Gemini text-embedding-004.
   * Stored as pgvector `vector(768)` type.
   */
  @Column({
    type: 'float',
    array: true,
    nullable: true,
  })
  embedding: number[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
