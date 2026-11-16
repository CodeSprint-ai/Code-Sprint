import type { MetadataRoute } from "next";
import { features } from "@/features/marketing/config";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about", "/contact", "/pricing", "/calendar", "/badges", "/sprints", "/legal", "/privacy", "/terms", "/cookies", "/legal/billing", ...Object.keys(features).map((slug) => `/platform/${slug}`)].map((path) => ({ url: `https://code-sprint.com${path}`, changeFrequency: path === "/calendar" ? "daily" : "monthly", priority: path ? 0.6 : 1 }));
}
