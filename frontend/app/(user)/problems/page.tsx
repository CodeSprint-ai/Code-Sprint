"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { usePaginatedProblems } from "@/hooks/useProblems";
import { Difficulty, GetProblemsParams, PatternEnum, Problem } from "@/types/problems";
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
  LayoutGrid,
  List,
} from "lucide-react";
import { ProblemCard } from "@/components/ProblemCard";
import { ProblemsTable } from "@/components/ProblemsTable";
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

  // Determine base path based on current route
  const basePath = pathname?.startsWith("/admin") ? "/admin/problems" : "/problems";

  type ViewMode = 'cards' | 'table';
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  const [filters, setFilters] = useState<GetProblemsParams>({
    page: parseInt(searchParams.get("page") || "1", 10) || 1,
    pageSize: parseInt(searchParams.get("pageSize") || "10", 10) || 10,
    difficulty: (searchParams.get("difficulty") as Difficulty) || undefined,
    pattern: (searchParams.get("pattern") as PatternEnum) || undefined,
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
    if (filters.pattern) params.set("pattern", filters.pattern);
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
    filters.difficulty || filters.pattern || filters.search || filters.tag || filters.fromDate || filters.toDate
  );
  const problems: Problem[] = paginatedProblems.data?.data ?? [];
  const meta = paginatedProblems.data?.meta;
  const showPagination = meta !== undefined;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden px-4 py-6 sm:px-6 lg:px-8 w-full">
      <div className="flex w-full flex-1 min-h-0 flex-col overflow-hidden">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black dark:text-white text-zinc-900 tracking-tight">
              All Problems
            </h1>
            <p className="mt-1 text-sm dark:text-zinc-400 text-zinc-500">
              Browse and solve algorithm challenges.
            </p>
          </div>

          {/* View toggle */}
          <div className="flex dark:bg-[#09090b] bg-white p-1 rounded-xl border dark:border-white/5 border-zinc-200 shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                viewMode === 'cards'
                  ? 'dark:bg-white/5 bg-zinc-100 dark:text-white text-zinc-800 shadow-sm border dark:border-white/5 border-zinc-200'
                  : 'dark:text-zinc-500 text-zinc-400 dark:hover:text-white hover:text-zinc-800'
              )}
              title="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                viewMode === 'table'
                  ? 'dark:bg-white/5 bg-zinc-100 dark:text-white text-zinc-800 shadow-sm border dark:border-white/5 border-zinc-200'
                  : 'dark:text-zinc-500 text-zinc-400 dark:hover:text-white hover:text-zinc-800'
              )}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 p-1 rounded-2xl border dark:border-white/5 border-zinc-200 dark:bg-[#09090b] bg-white shadow-sm dark:shadow-none">
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 dark:text-zinc-400 text-zinc-500" />
              <span className="text-sm font-medium dark:text-zinc-300 text-zinc-700">Filters</span>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>
          <div className="grid gap-2 p-2 sm:grid-cols-2 lg:grid-cols-5">
            <div className="relative group lg:col-span-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
              <Input
                placeholder="Search..."
                value={filters.search ?? ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="dark:border-white/5 border-zinc-200 dark:bg-black/40 bg-zinc-50 pl-10 dark:text-white text-zinc-800 dark:placeholder:text-zinc-600 placeholder:text-zinc-400 focus:border-emerald-500/50 rounded-xl py-3"
              />
            </div>
            <Select
              value={filters.difficulty ?? "all"}
              onValueChange={(v) => handleFilterChange("difficulty", v === "all" ? undefined : v)}
            >
              <SelectTrigger className="dark:border-zinc-700 border-zinc-200 dark:bg-zinc-800/50 bg-zinc-50 dark:text-zinc-100 text-zinc-800">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.pattern ?? "all"}
              onValueChange={(v) => handleFilterChange("pattern", v === "all" ? undefined : v)}
            >
              <SelectTrigger className="dark:border-zinc-700 border-zinc-200 dark:bg-zinc-800/50 bg-zinc-50 dark:text-zinc-100 text-zinc-800">
                <SelectValue placeholder="Pattern" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">All patterns</SelectItem>
                {Object.values(PatternEnum).map((p) => (
                  <SelectItem key={p} value={p}>
                    {p.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Filter by tag..."
              value={filters.tag ?? ""}
              onChange={(e) => handleFilterChange("tag", e.target.value)}
              className="dark:border-zinc-700 border-zinc-200 dark:bg-zinc-800/50 bg-zinc-50 dark:text-zinc-100 text-zinc-800 dark:placeholder:text-zinc-500 placeholder:text-zinc-400"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={filters.fromDate ?? ""}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                className="dark:border-zinc-700 border-zinc-200 dark:bg-zinc-800/50 bg-zinc-50 dark:text-zinc-100 text-zinc-800"
              />
              <Input
                type="date"
                value={filters.toDate ?? ""}
                onChange={(e) => handleFilterChange("toDate", e.target.value)}
                className="dark:border-zinc-700 border-zinc-200 dark:bg-zinc-800/50 bg-zinc-50 dark:text-zinc-100 text-zinc-800"
              />
            </div>
          </div>
        </div>

        {paginatedProblems.isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3 text-zinc-500">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-emerald-500" />
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

            {/* Pagination: sticky at bottom */}
            {showPagination && meta && (
              <div className="flex-shrink-0 mt-4 rounded-xl border dark:border-zinc-800/80 border-zinc-200 dark:bg-zinc-900/30 bg-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm dark:shadow-none">
                <p className="text-sm dark:text-zinc-400 text-zinc-500">
                  Showing{" "}
                  <span className="font-medium dark:text-zinc-300 text-zinc-700">
                    {meta.total === 0 ? 0 : (meta.page - 1) * meta.pageSize + 1}
                  </span>{" "}
                  –{" "}
                  <span className="font-medium dark:text-zinc-300 text-zinc-700">
                    {Math.min(meta.page * meta.pageSize, meta.total)}
                  </span>{" "}
                  of <span className="font-medium dark:text-zinc-300 text-zinc-700">{meta.total}</span>{" "}
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
                    disabled={meta.page <= 1}
                    className="dark:border-zinc-700 border-zinc-200 dark:bg-zinc-800/50 bg-zinc-50 dark:text-zinc-200 text-zinc-700 dark:hover:bg-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="min-w-[7rem] text-center text-sm dark:text-zinc-400 text-zinc-500">
                    Page {meta.page} of {Math.max(1, meta.totalPages)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: Math.min(meta.totalPages, (prev.page ?? 1) + 1),
                      }))
                    }
                    disabled={meta.page >= meta.totalPages}
                    className="dark:border-zinc-700 border-zinc-200 dark:bg-zinc-800/50 bg-zinc-50 dark:text-zinc-200 text-zinc-700 dark:hover:bg-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
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
