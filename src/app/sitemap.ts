/**
 * Dynamic sitemap.
 * Includes the homepage and every indexable log entry so crawlers can
 * discover the canonical set of pages without guessing.
 */

import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/baseUrl";
import { logEntries } from "@/config/log";

export default function sitemap(): MetadataRoute.Sitemap {
  const host = getBaseUrl();

  return [
    {
      url: `${host}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...logEntries.map((entry) => ({
      url: `${host}${entry.url}`,
      lastModified: new Date(entry.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
