import { Injectable, Inject, Logger, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RagService } from '../../rag/rag.service';
import { Submission } from '../../submission/entities/Submission';
import { analysisSchema, AnalysisResult } from './schema/analysis.schema';

/**
 * Bump this whenever the prompt template changes.
 * Forces cache misses so users get analysis from the new prompt.
 */
const PROMPT_VERSION = 1;

/**
 * Max prompt token estimate before rejecting (cost control).
 * ~4 chars per token is a rough heuristic for English text.
 */
const MAX_PROMPT_CHARS = 32000; // ~8000 tokens

/** Cache TTL: 30 days in seconds */
const CACHE_TTL_SECONDS = 60 * 60 * 24 * 30;

@Injectable()
export class PostSubmissionService {
  private readonly logger = new Logger(PostSubmissionService.name);
  private model;

  constructor(
    private readonly ragService: RagService,
    @InjectRepository(Submission)
    private readonly submissionRepo: Repository<Submission>,
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {
    const rawModel = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: 'gemini-2.5-flash',
      temperature: 0.2, // Low temp for consistent, analytical JSON
      maxRetries: 3,
    });

    this.model = rawModel.withStructuredOutput(analysisSchema);
  }

  /**
   * Perform AI analysis of a submission.
   * Checks cache → fetches submission → retrieves RAG context →
   * calls Gemini → caches & saves result.
   *
   * @throws ForbiddenException if userId doesn't match submission owner
   */
  async performAnalysis(
    submissionId: string,
    userId: string,
  ): Promise<AnalysisResult> {
    const totalStart = Date.now();
    const cacheKey = `analysis:v${PROMPT_VERSION}:${submissionId}`;

    // ── 1. Check Cache ────────────────────────────────────────────
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      this.logger.debug(`Cache HIT for ${cacheKey}`);
      return JSON.parse(cached);
    }
    this.logger.debug(`Cache MISS for ${cacheKey}`);

    // ── 2. Fetch Submission ───────────────────────────────────────
    const submission = await this.submissionRepo.findOne({
      where: { uuid: submissionId },
      relations: ['problem', 'user'],
    });

    if (!submission) {
      throw new Error(`Submission ${submissionId} not found`);
    }

    // Ownership validation (Production concern #3)
    if (submission.user.uuid !== userId) {
      throw new ForbiddenException(
        'You can only request analysis for your own submissions',
      );
    }

    // ── 3. Retrieve RAG Context ───────────────────────────────────
    const [problemContext, testCaseContext] = await Promise.all([
      this.ragService.retrieve('problems', submission.problem.title, 3),
      this.ragService.retrieve(
        'test_cases',
        `${submission.problem.title} edge cases`,
        3,
      ),
    ]);

    // ── 4. Construct Prompt ───────────────────────────────────────
    const promptTemplate = PromptTemplate.fromTemplate(`
You are an expert competitive programming mentor.

PROBLEM CONTEXT:
{problemContext}

TEST CASE PATTERNS:
{testCaseContext}

USER SUBMISSION ({language}):
{code}

Submission Result: {result}

Analyze this submission and extract the required information.
    `);

    const formattedPrompt = await promptTemplate.format({
      problemContext:
        problemContext.map((c) => c.content).join('\n\n') || 'No context available',
      testCaseContext:
        testCaseContext.map((c) => c.content).join('\n\n') || 'No context available',
      language: submission.language,
      code: submission.code,
      result: submission.status === 'ACCEPTED' ? 'Accepted' : 'Failed',
    });

    // Cost control: reject if prompt is too long
    if (formattedPrompt.length > MAX_PROMPT_CHARS) {
      const estimatedTokens = Math.ceil(formattedPrompt.length / 4);
      this.logger.warn(
        `Prompt too long: ~${estimatedTokens} tokens (${formattedPrompt.length} chars). Rejecting.`,
      );
      throw new Error(
        `Prompt exceeds maximum length (~${estimatedTokens} tokens). Submission code may be too large.`,
      );
    }

    const estimatedTokens = Math.ceil(formattedPrompt.length / 4);
    this.logger.log(`Prompt size: ~${estimatedTokens} tokens`);

    // ── 5. Execute AI Request (with failure handling) ─────────────
    let analysis: AnalysisResult;
    try {
      const aiStart = Date.now();
      analysis = await this.model.invoke(formattedPrompt);
      const aiElapsed = Date.now() - aiStart;
      this.logger.log(`Gemini responded in ${aiElapsed}ms`);
    } catch (firstError: any) {
      this.logger.warn(
        `Gemini structured output failed (attempt 1): ${firstError.message}`,
      );

      // Retry once with a stricter instruction (Gap #8)
      try {
        const retryPrompt = `${formattedPrompt}\n\nIMPORTANT: You MUST respond with valid JSON matching the exact schema. No markdown, no code fences, just the JSON object.`;
        analysis = await this.model.invoke(retryPrompt);
      } catch (retryError: any) {
        this.logger.error(
          `Gemini structured output failed permanently: ${retryError.message}`,
          retryError.stack,
        );
        throw new Error(
          `AI analysis failed after retry: ${retryError.message}`,
        );
      }
    }

    // ── 6. Cache & Save ──────────────────────────────────────────
    await this.redis.set(
      cacheKey,
      JSON.stringify(analysis),
      'EX',
      CACHE_TTL_SECONDS,
    );

    await this.submissionRepo.update(submissionId, {
      aiAnalysis: analysis,
    });

    const totalElapsed = Date.now() - totalStart;
    this.logger.log(
      `Analysis complete for submission ${submissionId} in ${totalElapsed}ms`,
    );

    return analysis;
  }
}
