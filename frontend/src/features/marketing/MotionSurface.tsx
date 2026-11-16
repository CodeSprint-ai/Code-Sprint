"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Progressive enhancement: content stays visible without JavaScript or motion support. */
export function MotionSurface({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const surface = root.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (
      !surface ||
      preference.matches ||
      !window.IntersectionObserver ||
      !Element.prototype.animate
    )
      return;

    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          const animation = entry.target.animate(
            [
              { opacity: 0, transform: "translateY(14px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 320, easing: "cubic-bezier(.22,.68,.2,1)" },
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -24px 0px" },
    );
    surface
      .querySelectorAll(
        ".m-hero-copy, .m-preview, .m-section-heading, .m-workflow article, .m-guidance-copy, .m-guidance-example, .m-problem-list, .m-resources article, .m-start-strip, .m-page-intro, .m-plan, .m-roster article, .m-waitlist-copy",
      )
      .forEach((element) => observer.observe(element));

    const stop = () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
    const onPreferenceChange = () => {
      if (preference.matches) stop();
    };
    preference.addEventListener("change", onPreferenceChange);
    return () => {
      stop();
      preference.removeEventListener("change", onPreferenceChange);
    };
  }, [pathname]);

  return (
    <div className="marketing-site" ref={root}>
      {children}
    </div>
  );
}
