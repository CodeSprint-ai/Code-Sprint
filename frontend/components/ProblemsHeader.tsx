"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Filter } from "lucide-react";
import { useProblemStore } from "@/store/problemStore";
import AddProblemPopupForm from "./forms/AddProblemPopupForm";

export default function ProblemsHeader() {
 const { isAddProblemPopupForm, setIsAddProblemPopupForm } = useProblemStore();

const handleAddProblemPopup = () =>{
setIsAddProblemPopupForm(true)
}

  return (
    <div className="flex flex-col gap-2 p-6 border-b bg-background">
      {/* Title and subtitle */}
      <div className="flex justify-between">
        <div>
          <h2 className="text-lg font-semibold text-primary">
            Problems Collection
          </h2>
          <p className="text-sm text-muted-foreground">
            Challenge yourself with our curated set of coding problems
          </p>
        </div>
        <Button variant="outline" onClick={handleAddProblemPopup} >
          Add Problem
        </Button>
      </div>

      {/* Search + filters row */}
      <div className="flex items-center gap-2 mt-2">
        {/* Search Input */}
        <Input
          type="search"
          placeholder="Search problems by title or tags..."
          className="flex-1"
        />

        {/* Difficulty Dropdown */}
        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Difficulties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Dropdown */}
        <Select>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="unsolved">Unsolved</SelectItem>
            <SelectItem value="solved">Solved</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter button */}
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      <AddProblemPopupForm />
    </div>
  );
}
