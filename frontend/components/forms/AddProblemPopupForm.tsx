"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
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
import { useProblemStore } from "@/store/problemStore";
import { ProblemFormValues, problemSchema } from "@/validations/problemForm";
import { toast } from "sonner";
import { useProblem } from "@/hooks/useProblems";

export default function AddProblemPopupForm() {
  const { isAddProblemPopupForm, setIsAddProblemPopupForm } = useProblemStore();

  const { createProblem } = useProblem();

  //   const [open, setOpen] = useState(false);

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
      createdByUuid: "a6f81af8-df34-43c4-9cb5-aa66240f6c33", // autofill from user
      timeLimitSeconds: 1,
      memoryLimitMB: 128,
      testCases: [{ input: "", expectedOutput: "", isSample: true }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "testCases",
  });

  const onSubmit = async (values: ProblemFormValues) => {
    try {
      await createProblem(values);

      console.log("✅ Problem Created:", values);

      toast.success("Problem Created Successfully 🎉");
      setIsAddProblemPopupForm(false);
    } catch (err: any) {
      toast.error("Login failed", {
        description: err?.message || "Invalid credentials",
      });
    }
    // setOpen(false);
  };

  const onError = (errors: any) => {
    // validation errors (from zod)
    const firstError = Object.values(errors)[0] as any;
    const message = firstError?.message || "Please fix the highlighted fields";

    toast.error(message);
  };

  return (
    <Dialog
      open={isAddProblemPopupForm}
      onOpenChange={setIsAddProblemPopupForm}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Problem</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-4"
          >
            {/* Title */}
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

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Input/Output/Constraints */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="inputFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Input Format</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="outputFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Output Format</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="constraints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Constraints</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Samples */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sampleInput"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sample Input</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sampleOutput"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sample Output</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Difficulty + Tags + Limits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                        placeholder="Array, Hash Table"
                        onChange={(e) =>
                          field.onChange(e.target.value.split(","))
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

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
                    <FormLabel>Memory Limit (MB)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Test Cases */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Test Cases</h3>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end"
                >
                  <Input
                    placeholder="Input"
                    {...form.register(`testCases.${index}.input`)}
                  />
                  <Input
                    placeholder="Expected Output"
                    {...form.register(`testCases.${index}.expectedOutput`)}
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-sm">
                      <input
                        type="checkbox"
                        {...form.register(`testCases.${index}.isSample`)}
                      />{" "}
                      Sample
                    </label>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({ input: "", expectedOutput: "", isSample: false })
                }
              >
                + Add Test Case
              </Button>
            </div>

            {/* Footer */}
            <DialogFooter>
              <Button type="submit">Create Problem</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
