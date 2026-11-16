import Link from "next/link";
import { PageIntro } from "./PublicShell";
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
      <div className="m-container m-document-layout">
        <aside className="m-document-nav" aria-label="On this page">
          <h2>On this page</h2>
          {sections.map((section, index) => (
            <a href={`#policy-${index}`} key={section.title}>
              {section.title}
            </a>
          ))}
        </aside>
        <article className="m-document">
          <p className="mb-7 text-xs m-muted">Last updated: 17 November 2026</p>
          {sections.map((section, index) => (
            <section id={`policy-${index}`} key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </section>
          ))}
          <div className="border-t pt-5 text-sm m-muted">
            <p>
              Questions or requests:{" "}
              <a href="mailto:codesprint.ai@gmail.com" className="underline">
                codesprint.ai@gmail.com
              </a>
              .
            </p>
            <p>
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
      </div>
    </>
  );
}
