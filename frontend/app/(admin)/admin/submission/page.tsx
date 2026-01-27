"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
} from "lucide-react";

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

function SubmissionCardItem({
  submission,
  basePath,
}: {
  submission: Submission;
  basePath: string;
}) {
  const viewHref = `${basePath}/${submission.uuid}`;
  return (
    <Link
      href={viewHref}
      className="group block rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 transition hover:border-zinc-600 hover:bg-zinc-800/40"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-zinc-100 group-hover:text-white">
              {submission.problemTitle || "Untitled Problem"}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
              <User className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{submission.userName || "—"}</span>
            </div>
          </div>
          <StatusBadge status={submission.status} />
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <FileCode2 className="h-3.5 w-3.5" />
            {submission.language}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(submission.createdAt).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center text-sm text-sky-400 group-hover:text-sky-300">
          View details
          <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    router.replace(`/admin/submission${params.toString() ? `?${params}` : ""}`, { scroll: false });
  }, [filters, router]);

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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-zinc-950 px-4 py-6 sm:px-6 lg:px-8 w-full">
      <div className="flex w-full flex-1 min-h-0 flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            All Submissions
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            View and filter submissions from all users.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4">
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
                placeholder="Search by title or user..."
                value={filters.search ?? ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="border-zinc-700 bg-zinc-800/50 pl-9 text-zinc-100 placeholder:text-zinc-500"
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
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-sky-500" />
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
              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-2">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-4">
                  {submissions.map((s) => (
                    <SubmissionCardItem
                      key={s.uuid}
                      submission={s}
                      basePath="/admin/submission"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pagination: show for all statuses (empty or not) */}
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
