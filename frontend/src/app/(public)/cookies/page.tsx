import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, cardClass } from "@/features/marketing/PublicShell";
import { CookieControls } from "@/features/marketing/CookieControls";
export const metadata: Metadata = {
  title: "Cookie Settings",
  alternates: { canonical: "/cookies" },
};
export default function CookiesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Your browser preferences"
        title="Understand what stays on your device."
      >
        The beta uses essential account storage and local preferences. Review
        essential storage and reset your appearance preference here. Optional
        analytics and advertising are not enabled by this beta setup.
      </PageIntro>
      <div className="mx-auto max-w-3xl space-y-6 px-6">
        <section className={cardClass}>
          <h2 className="mb-6 text-xl font-semibold">Storage settings</h2>
          <CookieControls />
        </section>
        <section className={cardClass}>
          <h2 className="text-xl font-semibold">What the application stores</h2>
          <ul className="mt-5 space-y-4 text-sm leading-relaxed text-zinc-500">
            <li>
              <strong>Authentication:</strong> refresh/session cookies and the
              sign-in state indicator and the auth-storage browser record
              (profile and access state) keep account features available.
              Clearing them can sign you out.
            </li>
            <li>
              <strong>Appearance:</strong> the codesprint-theme preference
              remembers light, dark, or device appearance.
            </li>
            <li>
              <strong>Demo snippets:</strong> code saved from the landing-page
              demo can be stored in this browser under codesprint_snippets.
              Browser site-data controls can remove it; removing it deletes
              those local copies.
            </li>
            <li>
              <strong>Third-party destinations:</strong> visiting linked video
              or social platforms is subject to their storage policies. Opening
              a link is separate from enabling tracking on CodeSprint.
            </li>
          </ul>
          <p className="mt-6 text-sm text-zinc-500">
            Use your browser settings to review or clear site data. Read the{" "}
            <Link className="underline" href="/privacy">
              Privacy Policy
            </Link>{" "}
            for server-side information and data requests.
          </p>
        </section>
      </div>
    </>
  );
}
