/**
 * Dynamic robots.txt.
 * Uses getBaseUrl() so the sitemap reference always points to the live host.
 * Individual doc pages emit their own robots meta based on the `indexable`
 * flag, so /d/ stays crawlable — the per-page tag drives indexing.
 */

import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/baseUrl";

export default function robots(): MetadataRoute.Robots {
  const host = getBaseUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/published/"],
    },
    sitemap: `${host}/sitemap.xml`,
  };
}
