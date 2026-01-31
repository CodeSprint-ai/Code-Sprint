"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ProblemFormValues,
  problemSchema,
  defaultStarterCode,
  defaultRunnerTemplate,
  parseTestCaseInput,
  parseExpectedOutput,
} from "@/validations/problemForm";
import { toast } from "sonner";
import { useProblem } from "@/hooks/useProblems";
import { useAuthStore } from "@/store/authStore";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddProblemPage() {
  const router = useRouter();
  const { createProblem } = useProblem();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProblemFormValues>({
    resolver: zodResolver(problemSchema) as any,
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      inputFormat: "",
      outputFormat: "",
      constraints: "",
      sampleInput: "",
      sampleOutput: "",
      difficulty: "EASY" as const,
      tags: [] as string[],
      companies: [] as string[],
      createdByUuid: user?.userUuid || "",
      timeLimitSeconds: 2,
      memoryLimitMB: 256,
      starterCode: defaultStarterCode,
      runnerTemplate: defaultRunnerTemplate,
      testCases: [{ inputText: "", expectedOutputText: "", isSample: true, isHidden: false }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "testCases",
  });

  const onSubmit = async (values: ProblemFormValues) => {
    if (!user?.userUuid) {
      toast.error("User not authenticated");
      return;
    }

    setIsSubmitting(true);
    try {
      // Transform test cases - parse JSON inputs
      const transformedValues = {
        ...values,
        createdByUuid: user.userUuid,
        testCases: values.testCases.map((tc) => {
          const inputText = (tc as any).inputText || "";
          const expectedOutputText = (tc as any).expectedOutputText || "";

          return {
            input: parseTestCaseInput(inputText) || {},
            inputText: inputText,
            expectedOutput: parseExpectedOutput(expectedOutputText),
            expectedOutputText: expectedOutputText,
            isSample: tc.isSample ?? false,
            isHidden: tc.isHidden ?? false,
          };
        }),
      };

      await createProblem(transformedValues as any);
      toast.success("Problem Created Successfully 🎉");
      form.reset();
      router.push("/admin/problems");
    } catch (err: any) {
      toast.error("Failed to create problem", {
        description: err?.message || "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    const message = firstError?.message || "Please fix the highlighted fields";
    toast.error(message);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-6 sm:px-6 lg:px-8 w-full">
      <div className="flex w-full flex-1 min-h-0 flex-col max-w-5xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/problems"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Problems
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            Create New Problem
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Fill in the details below to create a new coding problem.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="starter">Starter Code</TabsTrigger>
                  <TabsTrigger value="runner">Runner Template</TabsTrigger>
                  <TabsTrigger value="testcases">Test Cases</TabsTrigger>
                </TabsList>

                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-4 mt-6">
                  <FormField
                    control={form.control as any}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-200">Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Two Sum"
                            {...field}
                            className="border-zinc-700 bg-zinc-800/50 text-zinc-100"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-200">Description (Markdown supported)</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="Problem description..."
                            {...field}
                            className="border-zinc-700 bg-zinc-800/50 text-zinc-100"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-200">Difficulty</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-zinc-700 bg-zinc-800/50 text-zinc-100">
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="EASY">Easy</SelectItem>
                              <SelectItem value="MEDIUM">Medium</SelectItem>
                              <SelectItem value="HARD">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control as any}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-200">Tags (comma separated)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="array, hash-table"
                              onChange={(e) => field.onChange(e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                              className="border-zinc-700 bg-zinc-800/50 text-zinc-100"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-200">Companies (comma separated)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Google, Amazon, Meta"
                              onChange={(e) => field.onChange(e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                              className="border-zinc-700 bg-zinc-800/50 text-zinc-100"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control as any}
                        name="timeLimitSeconds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-200">Time Limit (s)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                className="border-zinc-700 bg-zinc-800/50 text-zinc-100"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control as any}
                        name="memoryLimitMB"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-200">Memory (MB)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                className="border-zinc-700 bg-zinc-800/50 text-zinc-100"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="constraints"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-200">Constraints</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={2}
                            placeholder="2 <= nums.length <= 10^4"
                            {...field}
                            className="border-zinc-700 bg-zinc-800/50 text-zinc-100"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Starter Code Tab */}
                <TabsContent value="starter" className="space-y-4 mt-6">
                  <p className="text-sm text-zinc-400">
                    Starter code is what users see in the editor. Include the Solution class template.
                  </p>

                  <FormField
                    control={form.control as any}
                    name="starterCode.java"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-200">Java Starter Code</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={8}
                            className="font-mono text-sm border-zinc-700 bg-zinc-800/50 text-zinc-100"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="starterCode.python"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-200">Python Starter Code</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={6}
                            className="font-mono text-sm border-zinc-700 bg-zinc-800/50 text-zinc-100"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="starterCode.cpp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-200">C++ Starter Code</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={8}
                            className="font-mono text-sm border-zinc-700 bg-zinc-800/50 text-zinc-100"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Runner Template Tab */}
                <TabsContent value="runner" className="space-y-4 mt-6">
                  <p className="text-sm text-zinc-400">
                    Runner templates wrap the user&apos;s code for execution. Use {`{{USER_CODE}}`} as placeholder.
                    Users never see this.
                  </p>

                  <FormField
                    control={form.control as any}
                    name="runnerTemplate.java"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-200">Java Runner Template</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={10}
                            className="font-mono text-xs border-zinc-700 bg-zinc-800/50 text-zinc-100"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="runnerTemplate.python"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-200">Python Runner Template</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={8}
                            className="font-mono text-xs border-zinc-700 bg-zinc-800/50 text-zinc-100"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="runnerTemplate.cpp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-200">C++ Runner Template</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={10}
                            className="font-mono text-xs border-zinc-700 bg-zinc-800/50 text-zinc-100"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Test Cases Tab */}
                <TabsContent value="testcases" className="space-y-4 mt-6">
                  <p className="text-sm text-zinc-400">
                    Enter input as JSON object (e.g., {`{"nums": [2,7,11,15], "target": 9}`})
                    and expected output as JSON (e.g., {`[0, 1]`})
                  </p>

                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border border-zinc-800 rounded-lg space-y-3 bg-zinc-900/30">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-zinc-200">Test Case {index + 1}</h4>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormItem>
                          <FormLabel className="text-zinc-200">Input (JSON)</FormLabel>
                          <Textarea
                            rows={3}
                            className="font-mono text-sm border-zinc-700 bg-zinc-800/50 text-zinc-100"
                            placeholder='{"nums": [2,7,11,15], "target": 9}'
                            {...form.register(`testCases.${index}.inputText` as any)}
                          />
                        </FormItem>

                        <FormItem>
                          <FormLabel className="text-zinc-200">Expected Output (JSON)</FormLabel>
                          <Textarea
                            rows={3}
                            className="font-mono text-sm border-zinc-700 bg-zinc-800/50 text-zinc-100"
                            placeholder="[0, 1]"
                            {...form.register(`testCases.${index}.expectedOutputText` as any)}
                          />
                        </FormItem>
                      </div>

                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm text-zinc-300">
                          <input
                            type="checkbox"
                            {...form.register(`testCases.${index}.isSample`)}
                            className="rounded border-zinc-600"
                          />
                          Sample (shown to users)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-zinc-300">
                          <input
                            type="checkbox"
                            {...form.register(`testCases.${index}.isHidden`)}
                            className="rounded border-zinc-600"
                          />
                          Hidden (for scoring only)
                        </label>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      append({ inputText: "", expectedOutputText: "", isSample: false, isHidden: false } as any)
                    }
                    className="border-zinc-700 bg-zinc-800/50 text-zinc-200"
                  >
                    + Add Test Case
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/problems")}
                  className="border-zinc-700 bg-zinc-800/50 text-zinc-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-sky-600 hover:bg-sky-700 text-white"
                >
                  {isSubmitting ? "Creating..." : "Create Problem"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
