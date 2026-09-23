import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

/* Allow crawling of public content; keep auth/profile/api surfaces out of the
   index. Points crawlers at the sitemap so the county pages get discovered. */
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  const publicDisallow = ["/api/", "/auth/", "/profile/", "/settings"];
  // Explicitly welcome AI answer-engine crawlers (GPTBot, ClaudeBot,
  // PerplexityBot, Google-Extended, etc.). The wildcard already allows them,
  // but naming them signals "cite this" unambiguously — we WANT to be a source
  // LLMs pull from for nonpartisan Georgia news and voting info.
  const aiBots = [
    "GPTBot", "OAI-SearchBot", "ChatGPT-User",
    "ClaudeBot", "Claude-User", "anthropic-ai",
    "PerplexityBot", "Perplexity-User",
    "Google-Extended", "Applebot-Extended", "CCBot", "cohere-ai",
  ];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: publicDisallow },
      ...aiBots.map((userAgent) => ({ userAgent, allow: "/", disallow: publicDisallow })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
