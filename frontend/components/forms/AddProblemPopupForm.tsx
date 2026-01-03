"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { useProblemStore } from "@/store/problemStore";
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

export default function AddProblemPopupForm() {
  const { isAddProblemPopupForm, setIsAddProblemPopupForm } = useProblemStore();
  const { createProblem } = useProblem();
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<ProblemFormValues>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      description: "",
      inputFormat: "",
      outputFormat: "",
      constraints: "",
      sampleInput: "",
      sampleOutput: "",
      difficulty: "EASY",
      tags: [],
      companies: [],
      createdByUuid: "a6f81af8-df34-43c4-9cb5-aa66240f6c33", // TODO: Get from auth
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
    try {
      // Transform test cases - parse JSON inputs
      const transformedValues = {
        ...values,
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
      setIsAddProblemPopupForm(false);
      form.reset();
    } catch (err: any) {
      toast.error("Failed to create problem", {
        description: err?.message || "Something went wrong",
      });
    }
  };

  const onError = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    const message = firstError?.message || "Please fix the highlighted fields";
    toast.error(message);
  };

  return (
    <Dialog open={isAddProblemPopupForm} onOpenChange={setIsAddProblemPopupForm}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Problem</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="starter">Starter Code</TabsTrigger>
                <TabsTrigger value="runner">Runner Template</TabsTrigger>
                <TabsTrigger value="testcases">Test Cases</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Two Sum" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Markdown supported)</FormLabel>
                      <FormControl>
                        <Textarea rows={5} placeholder="Problem description..." {...field} />
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
                        <FormLabel>Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
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
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (comma separated)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="array, hash-table"
                            onChange={(e) => field.onChange(e.target.value.split(",").map((t) => t.trim()))}
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
                        <FormLabel>Companies (comma separated)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Google, Amazon, Meta"
                            onChange={(e) => field.onChange(e.target.value.split(",").map((t) => t.trim()))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="timeLimitSeconds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Limit (s)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="memoryLimitMB"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Memory (MB)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                      <FormLabel>Constraints</FormLabel>
                      <FormControl>
                        <Textarea rows={2} placeholder="2 <= nums.length <= 10^4" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Starter Code Tab */}
              <TabsContent value="starter" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Starter code is what users see in the editor. Include the Solution class template.
                </p>

                <FormField
                  control={form.control}
                  name="starterCode.java"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Java Starter Code</FormLabel>
                      <FormControl>
                        <Textarea rows={8} className="font-mono text-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="starterCode.python"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Python Starter Code</FormLabel>
                      <FormControl>
                        <Textarea rows={6} className="font-mono text-sm" {...field} />
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
                      <FormLabel>C++ Starter Code</FormLabel>
                      <FormControl>
                        <Textarea rows={8} className="font-mono text-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Runner Template Tab */}
              <TabsContent value="runner" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Runner templates wrap the user&apos;s code for execution. Use {`{{USER_CODE}}`} as placeholder.
                  Users never see this.
                </p>

                <FormField
                  control={form.control}
                  name="runnerTemplate.java"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Java Runner Template</FormLabel>
                      <FormControl>
                        <Textarea rows={10} className="font-mono text-xs" {...field} />
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
                      <FormLabel>Python Runner Template</FormLabel>
                      <FormControl>
                        <Textarea rows={8} className="font-mono text-xs" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="runnerTemplate.cpp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>C++ Runner Template</FormLabel>
                      <FormControl>
                        <Textarea rows={10} className="font-mono text-xs" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Test Cases Tab */}
              <TabsContent value="testcases" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter input as JSON object (e.g., {`{"nums": [2,7,11,15], "target": 9}`})
                  and expected output as JSON (e.g., {`[0, 1]`})
                </p>

                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Test Case {index + 1}</h4>
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
                        <FormLabel>Input (JSON)</FormLabel>
                        <Textarea
                          rows={3}
                          className="font-mono text-sm"
                          placeholder='{"nums": [2,7,11,15], "target": 9}'
                          {...form.register(`testCases.${index}.inputText` as any)}
                        />
                      </FormItem>

                      <FormItem>
                        <FormLabel>Expected Output (JSON)</FormLabel>
                        <Textarea
                          rows={3}
                          className="font-mono text-sm"
                          placeholder="[0, 1]"
                          {...form.register(`testCases.${index}.expectedOutputText` as any)}
                        />
                      </FormItem>
                    </div>

                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          {...form.register(`testCases.${index}.isSample`)}
                        />
                        Sample (shown to users)
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          {...form.register(`testCases.${index}.isHidden`)}
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
                >
                  + Add Test Case
                </Button>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddProblemPopupForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Problem</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
