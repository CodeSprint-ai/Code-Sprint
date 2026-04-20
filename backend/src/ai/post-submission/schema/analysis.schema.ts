import { z } from 'zod';

/**
 * Zod schema defining the exact JSON structure Gemini must return
 * for post-submission analysis. Used by LangChain's structured output
 * AND as the TypeScript type for the Submission.aiAnalysis column.
 */
export const analysisSchema = z.object({
  approach: z
    .string()
    .describe('Description of what approach/algorithm the user used'),
  timeComplexity: z
    .string()
    .describe('O(...) with explanation'),
  spaceComplexity: z
    .string()
    .describe('O(...) with explanation'),
  edgeCases: z
    .array(z.string())
    .describe('List of edge cases that might be missed'),
  optimizations: z
    .array(z.string())
    .describe('Specific optimization suggestions'),
  feedback: z
    .string()
    .describe('Personalized, encouraging 2-3 sentence feedback'),
  isOptimal: z.boolean(),
});

export type AnalysisResult = z.infer<typeof analysisSchema>;
