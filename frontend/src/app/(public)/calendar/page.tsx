import type { Metadata } from "next";
import { ContestsPage } from "@/features/contests";
export const metadata: Metadata = {
  title: "Contest Calendar",
  description:
    "Find upcoming competitive programming contests, filter by platform, and add events to your calendar.",
  alternates: { canonical: "/calendar" },
};
export default function CalendarPage() {
  return (
    <div className="mx-auto max-w-7xl px-4">
      <ContestsPage />
    </div>
  );
}
