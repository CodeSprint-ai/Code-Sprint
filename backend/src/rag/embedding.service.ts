import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

const EXPECTED_DIMENSIONS = 3072;

/**
 * Embedding service using Google Gemini text-embedding-004.
 * Generates 768-dimensional vectors for RAG retrieval.
 */
@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private embeddings: GoogleGenerativeAIEmbeddings;

  constructor() {
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: 'gemini-embedding-001',
    });
  }

  /**
   * Embed text into a 768-dimensional vector.
   * Sanitizes input by replacing newlines for better embedding quality.
   * Asserts output dimension matches expected value.
   */
  async embed(text: string): Promise<number[]> {
    const start = Date.now();

    const sanitized = text.replace(/\n/g, ' ');
    const result = await this.embeddings.embedQuery(sanitized);

    // Dimension assertion — guard against model changes (Gap #9)
    if (result.length !== EXPECTED_DIMENSIONS) {
      throw new Error(
        `Embedding dimension mismatch: expected ${EXPECTED_DIMENSIONS}, got ${result.length}. ` +
        `Model may have changed — update EXPECTED_DIMENSIONS and migration.`,
      );
    }

    const elapsed = Date.now() - start;
    this.logger.debug(`Embedding generated in ${elapsed}ms (${result.length} dims)`);

    return result;
  }
}
