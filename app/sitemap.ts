import type { MetadataRoute } from "next";
import { getAllCountySlugs } from "@/lib/county-utils";
import { getAllCandidateSlugs } from "@/lib/candidate-utils";
import { getSiteUrl } from "@/lib/site-url";

/* Dynamic sitemap so Google can discover all ~156 statically generated county
   ballot pages plus the core marketing/utility routes. Regenerated on each
   build, so new counties or routes are picked up automatically. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/g`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/elections`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/news`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/news/local`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${base}/news/spectrum`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/welcome`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const countyRoutes: MetadataRoute.Sitemap = getAllCountySlugs().map((slug) => ({
    url: `${base}/g/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const candidateRoutes: MetadataRoute.Sitemap = getAllCandidateSlugs().map((slug) => ({
    url: `${base}/elections/candidate/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...countyRoutes, ...candidateRoutes];
}
