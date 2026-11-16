import Navbar from "@/features/landing/components/Navbar";
import Footer from "@/features/landing/components/Footer";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-brand-dark dark:text-zinc-100">
      <Navbar />
      <main id="main-content" className="min-h-[65vh] pt-28 pb-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <header className="mx-auto max-w-4xl px-6 pt-10 pb-12 text-center">
      <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
        {eyebrow}
      </span>
      <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
        {title}
      </h1>
      <div className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
        {children}
      </div>
    </header>
  );
}

export const cardClass =
  "rounded-2xl border border-zinc-200 bg-white p-7 dark:border-white/10 dark:bg-white/[0.025]";
export const primaryClass =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-black transition hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500";
export const secondaryClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 px-6 py-3 font-medium transition hover:bg-zinc-100 dark:border-white/20 dark:hover:bg-white/5";
