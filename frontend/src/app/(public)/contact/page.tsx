import type { Metadata } from "next";
import { InterestForm } from "@/features/marketing/InterestForm";
import { PageIntro, cardClass } from "@/features/marketing/PublicShell";
import { product } from "@/features/marketing/config";
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the CodeSprint team for support, feedback, bug reports, privacy requests, or university pilots.",
  alternates: { canonical: "/contact" },
};
export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="We are listening"
        title="Talk to the CodeSprint team."
      >
        A stuck submission, a product idea, or a campus pilot. Tell us how we
        can help.
      </PageIntro>
      <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-2">
        <section>
          <h2 className="text-2xl font-semibold">A direct line to us</h2>
          <a
            className="mt-4 block text-lg text-emerald-700 dark:text-emerald-400"
            href={`mailto:${product.email}`}
          >
            {product.email}
          </a>
          <p className="mt-5 leading-relaxed text-zinc-500">
            For a bug report, include the page URL, the steps you took, and what
            you expected. For an account or privacy request, use the email
            associated with your account.
          </p>
          <p className="mt-5 text-sm text-zinc-500">
            Support messages are retained for up to 90 days. We do not add
            contact-form submissions to a marketing list.
          </p>
          <div className="mt-8 flex flex-wrap gap-5">
            {product.socials.map((social) => (
              <a
                key={social.label}
                className="font-medium underline"
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.label} ↗
              </a>
            ))}
          </div>
        </section>
        <section className={cardClass}>
          <h2 className="mb-6 text-xl font-semibold">Send a message</h2>
          <InterestForm kind="contact" />
        </section>
      </div>
    </>
  );
}
