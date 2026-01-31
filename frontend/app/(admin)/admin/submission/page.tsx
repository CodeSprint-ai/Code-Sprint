"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { usePaginatedSubmissions } from "@/hooks/useSubmission";
import { useAuthStore } from "@/store/authStore";
import { SubmissionStatus, GetSubmissionsParams, Submission } from "@/types/submission";
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
  FileCode2,
  User,
  Calendar,
  ArrowRight,
  LayoutGrid,
  List,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { SubmissionsTable } from "@/components/SubmissionsTable";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, string> = {
    ACCEPTED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    WRONG_ANSWER: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    TIME_LIMIT_EXCEEDED: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    COMPILATION_ERROR: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    RUNTIME_ERROR: "bg-red-500/15 text-red-400 border-red-500/30",
    PROCESSING: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    QUEUED: "bg-sky-500/10 text-sky-300 border-sky-500/20",
    PENDING: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  };
  const cls = statusConfig[status] ?? "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

// Card colors aligned with ProblemCard: bg-{color}-600/10 border border-{color}-800 (like lines 49–56)
const cardStatusStyles: Record<string, string> = {
  ACCEPTED: "bg-green-600/10 border border-green-800 hover:border-green-600 hover:shadow-lg",
  WRONG_ANSWER: "bg-red-600/10 border border-red-800 hover:border-red-600 hover:shadow-lg",
  TIME_LIMIT_EXCEEDED:
    "bg-yellow-600/10 border border-yellow-800 hover:border-yellow-600 hover:shadow-lg",
  COMPILATION_ERROR:
    "bg-violet-600/10 border border-violet-800 hover:border-violet-600 hover:shadow-lg",
  RUNTIME_ERROR: "bg-red-600/10 border border-red-800 hover:border-red-600 hover:shadow-lg",
  PROCESSING: "bg-sky-600/10 border border-sky-800 hover:border-sky-600 hover:shadow-lg",
  QUEUED: "bg-cyan-600/10 border border-cyan-800 hover:border-cyan-600 hover:shadow-lg",
  PENDING: "bg-zinc-600/10 border border-zinc-800 hover:border-zinc-600 hover:shadow-lg",
};

function SubmissionCardItem({
  submission,
  basePath,
}: {
  submission: Submission;
  basePath: string;
}) {
  const viewHref = `${basePath}/${submission.uuid}`;
  const isAccepted = submission.status === "ACCEPTED";

  // Language color mapping
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
      className="bg-[#09090b] border border-white/5 rounded-xl p-6 relative group hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg block"
    >
      {/* Header with title and status badge */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight">
            {submission.problemTitle || "Untitled Problem"}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
              <User className="w-3 h-3 text-zinc-400" />
            </div>
            <span className="text-xs text-zinc-400 font-medium">
              {submission.userName || "—"}
            </span>
          </div>
        </div>

        {/* Status Badge - Passed/Failed style */}
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

      {/* Info section with borders */}
      <div className="space-y-3 py-4 border-t border-white/5 border-b mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">Language</span>
          <span className="text-zinc-300 font-mono flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${langColor}`} />
            {submission.language}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">Date</span>
          <span className="text-zinc-300 font-mono">
            {new Date(submission.createdAt).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* View Analysis button */}
      <button className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2 group/btn">
        View Analysis
        <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover/btn:text-white transition-colors" />
      </button>
    </Link>
  );
}

export default function SubmissionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Determine base path based on current route
  const basePath = pathname?.startsWith("/admin") ? "/admin/submission" : "/submission";

  type ViewMode = 'cards' | 'table';
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

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
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden px-4 py-6 sm:px-6 lg:px-8 w-full">
      <div className="flex w-full flex-1 min-h-0 flex-col overflow-hidden">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              All Submissions
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              View and filter submissions from all users.
            </p>
          </div>

          {/* View toggle */}
          <div className="flex bg-[#09090b] p-1 rounded-xl border border-white/5 shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                viewMode === 'cards'
                  ? 'bg-white/5 text-white shadow-sm border border-white/5'
                  : 'text-zinc-500 hover:text-white'
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
                  ? 'bg-white/5 text-white shadow-sm border border-white/5'
                  : 'text-zinc-500 hover:text-white'
              )}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 p-1 rounded-2xl border border-white/5 bg-[#09090b]">
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-300">Filters</span>
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
          <div className="grid gap-2 p-2 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
              <Input
                placeholder="Search by title or user..."
                value={filters.search ?? ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="border-white/5 bg-black/40 pl-10 text-white placeholder:text-zinc-600 focus:border-emerald-500/50 rounded-xl py-3"
              />
            </div>
            <Select
              value={filters.status ?? undefined}
              onValueChange={(v) => handleFilterChange("status", v === "all" ? undefined : v)}
            >
              <SelectTrigger className="border-zinc-700 bg-zinc-800/50 text-zinc-100">
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

        {paginatedSubmissions.isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3 text-zinc-500">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-emerald-500" />
              <span>Loading submissions...</span>
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
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-4">
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

            {/* Pagination: sticky at bottom */}
            {showPagination && meta && (
              <div className="flex-shrink-0 mt-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-zinc-400">
                  Showing{" "}
                  <span className="font-medium text-zinc-300">
                    {meta.total === 0 ? 0 : (meta.page - 1) * meta.pageSize + 1}
                  </span>{" "}
                  –{" "}
                  <span className="font-medium text-zinc-300">
                    {Math.min(meta.page * meta.pageSize, meta.total)}
                  </span>{" "}
                  of <span className="font-medium text-zinc-300">{meta.total}</span>{" "}
                  submissions
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
                    className="border-zinc-700 bg-zinc-800/50 text-zinc-200 hover:bg-zinc-700 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="min-w-[7rem] text-center text-sm text-zinc-400">
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
