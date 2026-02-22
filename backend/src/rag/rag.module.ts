import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEmbedding } from '../entities/DocumentEmbedding';
import { EmbeddingService } from './embedding.service';
import { RagService } from './rag.service';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentEmbedding])],
  providers: [EmbeddingService, RagService],
  exports: [EmbeddingService, RagService],
})
export class RagModule {}
