import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { getAllCountySlugs } from "@/lib/county-utils";
import { getAllCandidateSlugs } from "@/lib/candidate-utils";
import { ARCHETYPE_SLUGS } from "@/lib/civic-share";
import { GUIDES } from "@/lib/guides-data";
import { TOP_COUNTY_SLUGS } from "@/lib/petitions";
import { getSiteUrl } from "@/lib/site-url";

/* Dynamic sitemap so Google can discover all ~159 statically generated county
   ballot pages plus the core marketing/utility routes. Regenerated on each
   build, so new counties or routes are picked up automatically. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/g`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/elections`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/news`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/news/recap`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/news/local`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${base}/quiz`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/how-to-vote-georgia`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/georgia-voter-faq`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/groups`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${base}/georgia-civic-groups`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/petitions`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: `${base}/petitions/create`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/start-a-petition-georgia`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/profiles`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/register`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
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

  const civicProfileRoutes: MetadataRoute.Sitemap = Object.values(ARCHETYPE_SLUGS).map(
    (slug) => ({
      url: `${base}/civic-profile/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${base}/guides/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  // Permanent spectrum story pages — the "free Ground News" content. Pulled
  // from Supabase so newly clustered stories get indexed automatically.
  let storyRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder"
    );
    const { data } = await supabase
      .from("clustered_stories")
      .select("id, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);
    storyRoutes = (data ?? []).map((s: { id: string; created_at: string }) => ({
      url: `${base}/news/story/${s.id}`,
      lastModified: new Date(s.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    /* sitemap should never fail the build over story fetch */
  }

  // County hub pages for petitions and groups (top 20 counties).
  const countyHubRoutes: MetadataRoute.Sitemap = TOP_COUNTY_SLUGS.flatMap((slug) => [
    { url: `${base}/petitions/county/${slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${base}/groups/county/${slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 },
  ]);

  // Live standalone petitions (group_id IS NULL) so each gets indexed.
  let petitionRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder"
    );
    const { data } = await supabase
      .from("group_petitions")
      .select("share_slug, created_at")
      .eq("status", "active")
      .not("share_slug", "is", null)
      .limit(1000);
    petitionRoutes = (data ?? [])
      .filter((p: { share_slug: string | null }) => p.share_slug)
      .map((p: { share_slug: string; created_at: string }) => ({
        url: `${base}/petitions/${p.share_slug}`,
        lastModified: new Date(p.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
  } catch {
    /* never fail the build over petition fetch */
  }

  return [
    ...staticRoutes,
    ...countyRoutes,
    ...candidateRoutes,
    ...civicProfileRoutes,
    ...guideRoutes,
    ...storyRoutes,
    ...countyHubRoutes,
    ...petitionRoutes,
  ];
}
