import z from "zod";

export const problemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  inputFormat: z.string().min(1),
  outputFormat: z.string().min(1),
  constraints: z.string().min(1),
  sampleInput: z.string().min(1),
  sampleOutput: z.string().min(1),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1),
  createdByUuid: z.string().uuid(),
  timeLimitSeconds: z.number().min(1),
  memoryLimitMB: z.number().min(1),
  testCases: z.array(
    z.object({
      input: z.string(),
      expectedOutput: z.string(),
      isSample: z.boolean(),
    })
  ),
});


export type ProblemFormValues = z.infer<typeof problemSchema>;