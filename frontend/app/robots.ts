import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/admin", "/api/", "/auth/reset-password"],
      },
    ],
    sitemap: "https://code-sprint.com/sitemap.xml",
  };
}
