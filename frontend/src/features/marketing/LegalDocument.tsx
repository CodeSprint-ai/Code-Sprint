import Link from "next/link";
import { PageIntro, cardClass } from "./PublicShell";
export function LegalDocument({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: { title: string; text: string }[];
}) {
  return (
    <>
      <PageIntro eyebrow="Free Beta · policy version beta-v1" title={title}>
        {intro}
      </PageIntro>
      <article className={`${cardClass} mx-6 max-w-3xl space-y-8 md:mx-auto`}>
        <p className="text-xs text-zinc-500">Last updated: 17 November 2026</p>
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-zinc-600 dark:text-zinc-400">
              {section.text}
            </p>
          </section>
        ))}
        <div className="border-t border-zinc-200 pt-6 text-sm dark:border-white/10">
          <p>
            Questions or requests:{" "}
            <a href="mailto:codesprint.ai@gmail.com" className="underline">
              codesprint.ai@gmail.com
            </a>
            .
          </p>
          <p className="mt-2">
            <Link href="/contact" className="underline">
              Contact the team
            </Link>{" "}
            ·{" "}
            <Link href="/legal" className="underline">
              All policies
            </Link>
          </p>
        </div>
      </article>
    </>
  );
}
