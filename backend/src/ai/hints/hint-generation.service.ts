import { Injectable, Logger } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RagService } from '../../rag/rag.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProblemHint } from './entities/problem-hint.entity';
import { Problem } from '../../problem/entities/Problem';

/**
 * Strict level instructions to prevent hint "leakage":
 * - Level 1 must NOT name any algorithm or data structure
 * - Level 3 must NOT be valid code in any language
 * - Level 4 is the only level that produces actual code
 */
const LEVEL_INSTRUCTIONS: Record<number, string> = {
    1: 'THINKING DIRECTION: Only provide conceptual nudges. Strictly NO mention of specific algorithms (e.g., do not say "BFS", "DFS", "dynamic programming") or data structures (e.g., do not say "hash map", "stack"). Just guide the student\'s thinking.',
    2: 'APPROACH: Name the algorithm or data structure and explain WHY it works for this problem. Still NO code, NO pseudocode.',
    3: 'PSEUDOCODE: Provide a step-by-step logical breakdown using plain english and indentation. Ensure it is NOT valid code in any programming language. Use natural language for all steps.',
    4: 'SOLUTION: Provide a complete, production-grade implementation in {language} with Big-O time and space complexity comments. Include edge case handling.',
};

@Injectable()
export class HintGenerationService {
    private readonly logger = new Logger(HintGenerationService.name);
    private model: ChatGoogleGenerativeAI;

    constructor(
        private readonly ragService: RagService,
        @InjectRepository(ProblemHint)
        private readonly hintRepo: Repository<ProblemHint>,
        @InjectRepository(Problem)
        private readonly problemRepo: Repository<Problem>,
    ) {
        this.model = new ChatGoogleGenerativeAI({
            apiKey: process.env.GEMINI_API_KEY,
            model: 'gemini-2.5-flash',
            temperature: 0.2,
            maxRetries: 3,
        });
    }

    /**
     * Generate all 4 hint levels for a problem and save them to the database.
     * Used by the BullMQ processor for bulk/admin-triggered generation.
     */
    async generateForProblem(
        problemUuid: string,
        language: string = 'python',
    ): Promise<ProblemHint[]> {
        const problem = await this.problemRepo.findOne({
            where: { uuid: problemUuid },
        });

        if (!problem) {
            throw new Error(`Problem ${problemUuid} not found`);
        }

        // Retrieve RAG context for richer prompts (optional — gracefully degrade)
        let contextStr = 'No additional context';
        try {
            const ragContext = await this.ragService.retrieve(
                'problems',
                problem.title,
                3,
            );
            if (ragContext.length > 0) {
                contextStr = ragContext.map((c) => c.content).join('\n\n');
            }
        } catch (ragError) {
            this.logger.warn(
                `RAG retrieval failed for problem ${problemUuid}, proceeding without context: ${ragError.message}`,
            );
        }

        const hints = await this.generateWithRetry(problem, contextStr, language);

        // Save all 4 levels to the database
        const savedHints: ProblemHint[] = [];
        for (let level = 1; level <= 4; level++) {
            const hintKey = `level${level}`;
            const content = hints[hintKey];

            if (!content) {
                this.logger.warn(
                    `Missing hint for level ${level} on problem ${problemUuid}`,
                );
                continue;
            }

            // Upsert: remove old hint for this (problem, level, language) combo
            await this.hintRepo.delete({
                problemUuid,
                level,
                language: level === 4 ? language : 'python',
            });

            const hint = this.hintRepo.create({
                problemUuid,
                level,
                content,
                language: level === 4 ? language : 'python',
            });

            savedHints.push(await this.hintRepo.save(hint));
        }

        this.logger.log(
            `Generated and saved ${savedHints.length} hints for problem ${problemUuid}`,
        );

        return savedHints;
    }

    /**
     * Generate a single hint level on-the-fly (live fallback when no pre-generated hint exists).
     */
    async generateSingleHint(
        problemUuid: string,
        level: number,
        language: string = 'python',
    ): Promise<string> {
        const problem = await this.problemRepo.findOne({
            where: { uuid: problemUuid },
        });

        if (!problem) {
            throw new Error(`Problem ${problemUuid} not found`);
        }

        // Retrieve RAG context for richer prompts (optional — gracefully degrade)
        let contextStr = 'No additional context';
        try {
            const ragContext = await this.ragService.retrieve(
                'problems',
                problem.title,
                3,
            );
            if (ragContext.length > 0) {
                contextStr = ragContext.map((c) => c.content).join('\n\n');
            }
        } catch (ragError) {
            this.logger.warn(
                `RAG retrieval failed for problem ${problemUuid}, proceeding without context: ${ragError.message}`,
            );
        }

        const levelInstruction = LEVEL_INSTRUCTIONS[level].replace(
            '{language}',
            language,
        );

        const prompt = `You are an expert competitive programming mentor.

PROBLEM:
Title: ${problem.title}
Description: ${problem.description}
${problem.constraints ? `Constraints: ${problem.constraints}` : ''}
${problem.inputFormat ? `Input Format: ${problem.inputFormat}` : ''}
${problem.outputFormat ? `Output Format: ${problem.outputFormat}` : ''}

ADDITIONAL CONTEXT:
${contextStr}

TASK: Generate a single hint for this problem.

LEVEL ${level} INSTRUCTION:
${levelInstruction}

Respond with ONLY the hint content as plain text. No JSON, no markdown fences, no labels.`;

        const response = await this.model.invoke(prompt);
        return typeof response.content === 'string'
            ? response.content
            : String(response.content);
    }

    /**
     * Generate all 4 levels in a single API call with retry + exponential backoff.
     */
    private async generateWithRetry(
        problem: Problem,
        contextStr: string,
        language: string,
        maxRetries: number = 3,
    ): Promise<Record<string, string>> {
        const promptTemplate = PromptTemplate.fromTemplate(`You are an expert competitive programming mentor. Generate exactly 4 levels of hints for this problem.

PROBLEM:
Title: {title}
Description: {description}
{constraints}
{inputFormat}
{outputFormat}

ADDITIONAL CONTEXT:
{context}

LEVEL INSTRUCTIONS:
- Level 1: {level1}
- Level 2: {level2}
- Level 3: {level3}
- Level 4: {level4}

You MUST respond with a valid JSON object with exactly these keys: "level1", "level2", "level3", "level4".
Each value should be a string containing the hint content for that level.
Do NOT include markdown code fences. Respond with raw JSON only.`);

        const formattedPrompt = await promptTemplate.format({
            title: problem.title,
            description: problem.description,
            constraints: problem.constraints
                ? `Constraints: ${problem.constraints}`
                : '',
            inputFormat: problem.inputFormat
                ? `Input Format: ${problem.inputFormat}`
                : '',
            outputFormat: problem.outputFormat
                ? `Output Format: ${problem.outputFormat}`
                : '',
            context: contextStr,
            level1: LEVEL_INSTRUCTIONS[1],
            level2: LEVEL_INSTRUCTIONS[2],
            level3: LEVEL_INSTRUCTIONS[3],
            level4: LEVEL_INSTRUCTIONS[4].replace('{language}', language),
        });

        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await this.model.invoke(formattedPrompt);
                const rawContent =
                    typeof response.content === 'string'
                        ? response.content
                        : String(response.content);

                // Strip potential markdown code fences
                const cleaned = rawContent
                    .replace(/```json\s*/g, '')
                    .replace(/```\s*/g, '')
                    .trim();

                const data = JSON.parse(cleaned);

                if (data.level1 && data.level2 && data.level3 && data.level4) {
                    return data;
                }

                this.logger.warn(
                    `Attempt ${i + 1}: AI response missing hint levels, retrying...`,
                );
            } catch (e) {
                this.logger.warn(
                    `Attempt ${i + 1}/${maxRetries} failed: ${e.message}`,
                );
                if (i === maxRetries - 1) throw e;
                await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
            }
        }

        throw new Error(
            `Failed to generate hints after ${maxRetries} attempts`,
        );
    }
}
