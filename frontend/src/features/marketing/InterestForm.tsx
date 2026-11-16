"use client";

import { useState } from "react";
import Link from "next/link";
import { product } from "./config";
import { primaryClass } from "./PublicShell";

export function InterestForm({
  kind,
  initialPlan = "annual",
}: {
  kind: "contact" | "waitlist";
  initialPlan?: "monthly" | "annual";
}) {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (!form.reportValidity()) return;
    setState("sending");
    setMessage("");
    const common = {
      email: data.get("email"),
      consent: data.get("consent") === "on",
      website: data.get("website") || "",
    };
    const payload =
      kind === "waitlist"
        ? { ...common, plan: data.get("plan") }
        : {
            ...common,
            name: data.get("name"),
            category: data.get("category"),
            message: data.get("message"),
          };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/engagement/${kind}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(20000),
        },
      );
      const result: { message?: string | string[]; reference?: string } =
        await response.json();
      if (!response.ok)
        throw new Error(
          Array.isArray(result.message)
            ? result.message.join(" ")
            : result.message || "Please try again shortly.",
        );
      setMessage(
        `${result.message || "Received."}${result.reference ? ` Reference: ${result.reference}` : ""}`,
      );
      setState("success");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "We could not confirm receipt. Please retry or contact us by email.",
      );
    }
  }
  const inputClass =
    "mt-2 w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-base outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/20";
  return (
    <form onSubmit={submit} className="space-y-5">
      {kind === "contact" && (
        <label className="block text-sm font-medium">
          Your name
          <input
            className={inputClass}
            name="name"
            autoComplete="name"
            minLength={2}
            maxLength={100}
            required
          />
        </label>
      )}
      <label className="block text-sm font-medium">
        Email address
        <input
          className={inputClass}
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
        />
      </label>
      {kind === "waitlist" ? (
        <label className="block text-sm font-medium">
          Plan you are interested in
          <select
            className={inputClass}
            name="plan"
            key={initialPlan}
            defaultValue={initialPlan}
          >
            <option value="monthly">Monthly — planned $5/month</option>
            <option value="annual">Annual — planned $40/year</option>
          </select>
        </label>
      ) : (
        <>
          <label className="block text-sm font-medium">
            How can we help?
            <select
              className={inputClass}
              name="category"
              defaultValue="support"
            >
              <option value="support">Support</option>
              <option value="bug">Bug report</option>
              <option value="feedback">Feedback</option>
              <option value="university">University partnership</option>
              <option value="privacy">Privacy or data request</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Message
            <textarea
              className={inputClass}
              name="message"
              rows={5}
              minLength={10}
              maxLength={5000}
              required
            />
            <span className="mt-1 block text-xs text-zinc-500">
              Do not include passwords, API keys, or sensitive personal
              information.
            </span>
          </label>
        </>
      )}
      <div aria-hidden="true" className="hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="flex items-start gap-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        <input
          className="mt-1 size-4 accent-emerald-500"
          name="consent"
          type="checkbox"
          required
        />
        <span>
          {kind === "waitlist"
            ? "I agree to be contacted about CodeSprint Pro availability. This does not start a subscription."
            : "I acknowledge that my details will be used to respond to this request."}{" "}
          Read our{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      <button
        type="submit"
        disabled={state === "sending"}
        className={`${primaryClass} w-full disabled:opacity-50`}
      >
        {state === "sending"
          ? "Sending…"
          : kind === "waitlist"
            ? "Join Pro waitlist"
            : "Send message"}
      </button>
      <p
        role={state === "error" ? "alert" : "status"}
        aria-live="polite"
        className={`text-sm leading-relaxed ${state === "error" ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}
      >
        {message}
      </p>
      <p className="text-xs text-zinc-500">
        You can also email{" "}
        <a className="underline" href={`mailto:${product.email}`}>
          {product.email}
        </a>
        .{" "}
        {kind === "waitlist"
          ? "Ask us to remove your waitlist entry at any time."
          : "Our small team reviews requests; no fixed response time is promised."}
      </p>
    </form>
  );
}
