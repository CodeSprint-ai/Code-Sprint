"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/features/shared/api/api";
import { useRole } from "@/features/shared/hooks/useRole";
interface Request {
  uuid: string;
  kind: "contact" | "waitlist";
  email: string;
  name?: string;
  category?: string;
  message?: string;
  plan?: string;
  createdAt: string;
}
export default function InboxPage() {
  const { isAdmin } = useRole();
  const client = useQueryClient();
  const [filter, setFilter] = useState("all");
  const query = useQuery({
    queryKey: ["engagement-inbox"],
    queryFn: async () => (await api.get<Request[]>("/engagement/inbox")).data,
    enabled: isAdmin,
  });
  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/engagement/inbox/${id}`),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: ["engagement-inbox"] }),
  });
  if (!isAdmin)
    return (
      <p className="p-8">This inbox is available to administrators only.</p>
    );
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">Support & Pro waitlist</h1>
      <p className="text-sm text-zinc-500">
        Latest 100 requests. Contact requests expire after 90 days; waitlist
        entries after 365 days. Use removal to honor a verified deletion
        request.
      </p>
      <label className="block text-sm">
        Show
        <select
          className="ml-3 rounded-lg border border-zinc-300 bg-transparent p-2 dark:border-white/20"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All requests</option>
          <option value="contact">Contact</option>
          <option value="waitlist">Waitlist</option>
        </select>
      </label>
      {query.isPending && <p>Loading requests…</p>}
      {query.isError && (
        <p role="alert">
          Could not load requests.{" "}
          <button className="underline" onClick={() => query.refetch()}>
            Retry
          </button>
        </p>
      )}
      {remove.isError && <p role="alert">Removal failed. Please retry.</p>}
      {query.data
        ?.filter((request) => filter === "all" || request.kind === filter)
        .map((request) => (
          <article
            key={request.uuid}
            className="rounded-2xl border border-zinc-200 p-5 dark:border-white/10"
          >
            <div className="flex flex-wrap justify-between gap-3">
              <h2 className="font-semibold">{request.name || request.email}</h2>
              <span className="text-xs text-zinc-500">
                {request.kind} · {new Date(request.createdAt).toLocaleString()}
              </span>
            </div>
            <a
              className="mt-2 block text-sm text-emerald-600"
              href={`mailto:${request.email}`}
            >
              {request.email}
            </a>
            <p className="mt-2 text-xs text-zinc-500">
              {request.category || request.plan} · Reference: {request.uuid}
            </p>
            {request.message && (
              <p className="mt-4 whitespace-pre-wrap break-words text-sm">
                {request.message}
              </p>
            )}
            <button
              className="mt-4 text-xs text-red-600 underline"
              disabled={remove.isPending}
              onClick={() => {
                if (window.confirm("Permanently remove this request?"))
                  remove.mutate(request.uuid);
              }}
            >
              Remove request
            </button>
          </article>
        ))}
      {query.data?.length === 0 && <p>No requests yet.</p>}
    </div>
  );
}
