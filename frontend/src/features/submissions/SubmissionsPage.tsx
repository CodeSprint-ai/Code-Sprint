"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePaginatedSubmissions } from "@/features/submissions/hooks/useSubmission";
import { SubmissionStatus, GetSubmissionsParams, Submission } from "@/features/submissions/types/submission.types";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  X,
  User,
  ArrowRight,
  LayoutGrid,
  List,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { SubmissionsTable } from "@/features/submissions/components/SubmissionsTable";
import { Skeleton } from "@/features/shared/components/ui/skeleton";
import { cn } from "@/features/shared/utils/utils";

function SubmissionCardItem({
  submission,
  basePath,
}: {
  submission: Submission;
  basePath: string;
}) {
  const viewHref = `${basePath}/${submission.uuid}`;
  const isAccepted = submission.status === "ACCEPTED";

  const languageColors: Record<string, string> = {
    python: "bg-blue-500",
    javascript: "bg-yellow-500",
    typescript: "bg-blue-400",
    java: "bg-orange-500",
    cpp: "bg-purple-500",
    c: "bg-gray-500",
  };
  const langColor = languageColors[submission.language?.toLowerCase()] ?? "bg-zinc-500";

  return (
    <Link
      href={viewHref}
      className="dark:bg-[#09090b] bg-white border dark:border-white/5 border-zinc-200 rounded-xl p-4 sm:p-6 relative group dark:hover:border-emerald-500/20 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg block shadow-sm dark:shadow-none"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-base font-bold dark:text-white text-zinc-800 group-hover:text-emerald-400 transition-colors tracking-tight">
            {submission.problemTitle || "Untitled Problem"}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-5 h-5 rounded-full dark:bg-white/5 bg-zinc-100 flex items-center justify-center">
              <User className="w-3 h-3 text-zinc-400" />
            </div>
            <span className="text-xs text-zinc-400 font-medium">
              {submission.userName || "—"}
            </span>
          </div>
        </div>

        {isAccepted ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wide">Passed</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wide">Failed</span>
          </div>
        )}
      </div>

      <div className="space-y-3 py-4 border-t dark:border-white/5 border-zinc-200 border-b dark:border-b-white/5 border-b-zinc-200 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="dark:text-zinc-500 text-zinc-500">Language</span>
          <span className="dark:text-zinc-300 text-zinc-700 font-mono flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${langColor}`} />
            {submission.language}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="dark:text-zinc-500 text-zinc-500">Date</span>
          <span className="dark:text-zinc-300 text-zinc-700 font-mono">
            {new Date(submission.createdAt).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <button className="w-full py-2.5 rounded-lg dark:bg-white/5 bg-zinc-50 dark:hover:bg-white/10 hover:bg-zinc-100 text-xs font-bold dark:text-zinc-300 text-zinc-600 dark:hover:text-white hover:text-zinc-800 transition-all flex items-center justify-center gap-2 group/btn border dark:border-transparent border-zinc-200">
        View Analysis
        <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover/btn:text-white transition-colors" />
      </button>
    </Link>
  );
}

export default function SubmissionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const basePath = "/submission";

  type ViewMode = 'cards' | 'table';
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<GetSubmissionsParams>({
    page: parseInt(searchParams.get("page") || "1", 10) || 1,
    pageSize: parseInt(searchParams.get("pageSize") || "10", 10) || 10,
    status: (searchParams.get("status") as SubmissionStatus) || undefined,
    search: searchParams.get("search") || undefined,
    fromDate: searchParams.get("fromDate") || undefined,
    toDate: searchParams.get("toDate") || undefined,
  });

  const { paginatedSubmissions } = usePaginatedSubmissions(filters);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.page && filters.page > 1) params.set("page", String(filters.page));
    if (filters.pageSize && filters.pageSize !== 10) params.set("pageSize", String(filters.pageSize));
    if (filters.status) params.set("status", filters.status);
    if (filters.search) params.set("search", filters.search);
    if (filters.fromDate) params.set("fromDate", filters.fromDate);
    if (filters.toDate) params.set("toDate", filters.toDate);
    router.replace(`${basePath}${params.toString() ? `?${params}` : ""}`, { scroll: false });
  }, [filters, router, basePath]);

  const handleFilterChange = (key: keyof GetSubmissionsParams, value: unknown) => {
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
    filters.status || filters.search || filters.fromDate || filters.toDate
  );
  const submissions: Submission[] = paginatedSubmissions.data?.data ?? [];
  const meta = paginatedSubmissions.data?.meta;
  const showPagination = meta !== undefined;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden px-3 py-4 sm:px-6 sm:py-6 lg:px-8 w-full">
      <div className="flex w-full flex-1 min-h-0 flex-col overflow-hidden">
        <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black dark:text-white text-zinc-900 tracking-tight">
              All Submissions
            </h1>
            <p className="mt-1 text-xs sm:text-sm dark:text-zinc-400 text-zinc-500">
              View and filter submissions from all users.
            </p>
          </div>

          <div className="flex dark:bg-[#09090b] bg-white p-1 rounded-xl border dark:border-white/5 border-zinc-200 shrink-0 self-start">
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
        <div className="mb-3 sm:mb-8 p-1 rounded-2xl border dark:border-white/5 border-zinc-200 dark:bg-[#09090b] bg-white shadow-sm dark:shadow-none">
          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="w-full p-3 flex items-center justify-between sm:cursor-default"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 dark:text-zinc-400 text-zinc-500" />
              <span className="text-sm font-medium dark:text-zinc-300 text-zinc-700">Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]"></span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); clearFilters(); }}
                  className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10 h-7 px-2"
                >
                  <X className="mr-1 h-3.5 w-3.5" />
                  Clear
                </Button>
              )}
              <ChevronDown className={cn(
                "h-4 w-4 dark:text-zinc-500 text-zinc-400 transition-transform sm:hidden",
                filtersOpen && "rotate-180"
              )} />
            </div>
          </button>
          <div className={cn(
            "grid gap-2 p-2 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 transition-all",
            !filtersOpen && "hidden sm:grid"
          )}>
            <div className="relative group col-span-2 sm:col-span-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
              <Input
                placeholder="Search by title or user..."
                value={filters.search ?? ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="dark:border-white/5 border-zinc-200 dark:bg-black/40 bg-zinc-50 pl-10 dark:text-white text-zinc-800 dark:placeholder:text-zinc-600 placeholder:text-zinc-400 focus:border-emerald-500/50 rounded-xl py-3"
              />
            </div>
            <Select
              value={filters.status ?? undefined}
              onValueChange={(v) => handleFilterChange("status", v === "all" ? undefined : v)}
            >
              <SelectTrigger className="dark:border-zinc-700 border-zinc-200 dark:bg-zinc-800/50 bg-zinc-50 dark:text-zinc-100 text-zinc-800">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="QUEUED">Queued</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="WRONG_ANSWER">Wrong Answer</SelectItem>
                <SelectItem value="TIME_LIMIT_EXCEEDED">Time Limit Exceeded</SelectItem>
                <SelectItem value="COMPILATION_ERROR">Compilation Error</SelectItem>
                <SelectItem value="RUNTIME_ERROR">Runtime Error</SelectItem>
              </SelectContent>
            </Select>
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

        {paginatedSubmissions.isLoading && (
          <div className="min-h-0 flex-1 overflow-y-auto pr-2">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-2xl" />
              ))}
            </div>
          </div>
        )}

        {paginatedSubmissions.isError && (
          <div className="rounded-xl border border-red-900/50 bg-red-950/20 px-6 py-8 text-center text-red-400">
            Failed to load submissions. Please try again.
          </div>
        )}

        {!paginatedSubmissions.isLoading && !paginatedSubmissions.isError && (
          <div className="flex min-h-0 flex-1 flex-col">
            {submissions.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center py-12">
                <LayoutGrid className="mb-3 h-12 w-12 text-zinc-600" />
                <p className="text-zinc-500">No submissions found.</p>
              </div>
            ) : (
              viewMode === 'cards' ? (
                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-2">
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-4">
                    {submissions.map((s) => (
                      <SubmissionCardItem
                        key={s.uuid}
                        submission={s}
                        basePath={basePath}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-2 pb-4">
                  <SubmissionsTable submissions={submissions} basePath={basePath} />
                </div>
              )
            )}

            {showPagination && meta && (
              <div className="flex-shrink-0 mt-3 sm:mt-4 rounded-xl border dark:border-zinc-800/80 border-zinc-200 dark:bg-zinc-900/30 bg-white px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shadow-sm dark:shadow-none">
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
                  submissions
                </p>
                <div className="flex items-center gap-2 sm:gap-3">
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
