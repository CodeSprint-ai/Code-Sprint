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
   * 3072-dimensional vector for Gemini gemini-embedding-001.
   * Stored as pgvector `vector(3072)` type in the database.
   * TypeORM column type is a placeholder — actual type is managed via migrations.
   * select: false prevents TypeORM from auto-selecting this large column.
   */
  @Column({
    type: 'float8',
    array: true,
    nullable: true,
    select: false,
  })
  embedding: number[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
