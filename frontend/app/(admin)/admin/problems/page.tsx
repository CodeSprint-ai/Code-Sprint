"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { usePaginatedProblems } from "@/hooks/useProblems";
import { Difficulty, GetProblemsParams, Problem } from "@/types/problems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
  Calendar,
  ArrowRight,
  LayoutGrid,
  Tag,
  List,
} from "lucide-react";
import { ProblemCard } from "@/components/ProblemCard";
import { ProblemsTable } from "@/components/ProblemsTable";
import { useAuthStore } from "@/store/authStore";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";


function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const difficultyConfig: Record<Difficulty, string> = {
    EASY: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    MEDIUM: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    HARD: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  };
  const cls = difficultyConfig[difficulty] ?? "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}
    >
      {difficulty}
    </span>
  );
}

export default function ProblemsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  // Determine base path based on current route
  const basePath = pathname?.startsWith("/admin") ? "/admin/problems" : "/problems";

  type ViewMode = 'cards' | 'table';
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  const [filters, setFilters] = useState<GetProblemsParams>({
    page: parseInt(searchParams.get("page") || "1", 10) || 1,
    pageSize: parseInt(searchParams.get("pageSize") || "10", 10) || 10,
    difficulty: (searchParams.get("difficulty") as Difficulty) || undefined,
    search: searchParams.get("search") || undefined,
    tag: searchParams.get("tag") || undefined,
    fromDate: searchParams.get("fromDate") || undefined,
    toDate: searchParams.get("toDate") || undefined,
  });

  const { paginatedProblems } = usePaginatedProblems(filters);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.page && filters.page > 1) params.set("page", String(filters.page));
    if (filters.pageSize && filters.pageSize !== 10) params.set("pageSize", String(filters.pageSize));
    if (filters.difficulty) params.set("difficulty", filters.difficulty);
    if (filters.search) params.set("search", filters.search);
    if (filters.tag) params.set("tag", filters.tag);
    if (filters.fromDate) params.set("fromDate", filters.fromDate);
    if (filters.toDate) params.set("toDate", filters.toDate);
    router.replace(`${basePath}${params.toString() ? `?${params}` : ""}`, { scroll: false });
  }, [filters, router, basePath]);

  const handleFilterChange = (key: keyof GetProblemsParams, value: unknown) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value ?? undefined,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, pageSize: 10 });
  };

  const hasActiveFilters = Boolean(
    filters.difficulty || filters.search || filters.tag || filters.fromDate || filters.toDate
  );
  const problems: Problem[] = paginatedProblems.data?.data ?? [];
  const meta = paginatedProblems.data?.meta;
  const displayMeta = meta ?? (problems.length >= 0 && !paginatedProblems.isLoading && !paginatedProblems.isError
    ? { total: problems.length, page: filters.page ?? 1, pageSize: filters.pageSize ?? 10, totalPages: Math.max(1, Math.ceil(problems.length / (filters.pageSize ?? 10))) }
    : undefined);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-zinc-950 px-4 py-6 sm:px-6 lg:px-8 w-full">
      <div className="flex w-full flex-1 min-h-0 flex-col">
        <div className="mb-8 flex-shrink-0 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
              All Problems
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              View and filter problems from the collection.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center rounded-lg bg-zinc-800/50 border border-zinc-700 p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'cards'
                    ? 'bg-zinc-700 text-white'
                    : 'text-zinc-400 hover:text-white'
                )}
                title="Card view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'table'
                    ? 'bg-zinc-700 text-white'
                    : 'text-zinc-400 hover:text-white'
                )}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            {user?.role === "ADMIN" && (
              <Link href="/admin/problems/add">
                <Button className="bg-sky-600 hover:bg-sky-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Problem
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex-shrink-0 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-300">Filters</span>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search by title or description..."
                value={filters.search ?? ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="border-zinc-700 bg-zinc-800/50 pl-9 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
            <Select
              value={filters.difficulty ?? undefined}
              onValueChange={(v) => handleFilterChange("difficulty", v === "all" ? undefined : v)}
            >
              <SelectTrigger className="border-zinc-700 bg-zinc-800/50 text-zinc-100">
                <SelectValue placeholder="All difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All difficulties</SelectItem>
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Filter by tag..."
              value={filters.tag ?? ""}
              onChange={(e) => handleFilterChange("tag", e.target.value)}
              className="border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={filters.fromDate ?? ""}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                className="border-zinc-700 bg-zinc-800/50 text-zinc-100"
              />
              <Input
                type="date"
                value={filters.toDate ?? ""}
                onChange={(e) => handleFilterChange("toDate", e.target.value)}
                className="border-zinc-700 bg-zinc-800/50 text-zinc-100"
              />
            </div>
          </div>
        </div>

        {paginatedProblems.isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3 text-zinc-500">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-sky-500" />
              <span>Loading problems...</span>
            </div>
          </div>
        )}

        {paginatedProblems.isError && (
          <div className="rounded-xl border border-red-900/50 bg-red-950/20 px-6 py-8 text-center text-red-400">
            Failed to load problems. Please try again.
          </div>
        )}

        {!paginatedProblems.isLoading && !paginatedProblems.isError && (
          <div className="flex min-h-0 flex-1 flex-col">
            {problems.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center py-12">
                <LayoutGrid className="mb-3 h-12 w-12 text-zinc-600" />
                <p className="text-zinc-500">No problems found.</p>
              </div>
            ) : (
              viewMode === 'cards' ? (
                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-2">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-4">
                    {problems.map((problem, index) => (
                      <ProblemCard key={problem.uuid} {...problem} index={index} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-2 pb-4">
                  <ProblemsTable problems={problems} basePath={basePath} />
                </div>
              )
            )}

            {/* Pagination at bottom - always show when we have loaded */}
            {displayMeta && (
              <div className="mt-4 flex-shrink-0 rounded-xl border border-zinc-800/80 bg-zinc-900/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-zinc-400">
                  Showing{" "}
                  <span className="font-medium text-zinc-300">
                    {displayMeta.total === 0 ? 0 : (displayMeta.page - 1) * displayMeta.pageSize + 1}
                  </span>{" "}
                  –{" "}
                  <span className="font-medium text-zinc-300">
                    {Math.min(displayMeta.page * displayMeta.pageSize, displayMeta.total)}
                  </span>{" "}
                  of <span className="font-medium text-zinc-300">{displayMeta.total}</span>{" "}
                  problems
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: Math.max(1, (prev.page ?? 1) - 1),
                      }))
                    }
                    disabled={displayMeta.page <= 1}
                    className="border-zinc-700 bg-zinc-800/50 text-zinc-200 hover:bg-zinc-700 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="min-w-[7rem] text-center text-sm text-zinc-400">
                    Page {displayMeta.page} of {Math.max(1, displayMeta.totalPages)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: Math.min(displayMeta.totalPages, (prev.page ?? 1) + 1),
                      }))
                    }
                    disabled={displayMeta.page >= displayMeta.totalPages}
                    className="border-zinc-700 bg-zinc-800/50 text-zinc-200 hover:bg-zinc-700 disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
