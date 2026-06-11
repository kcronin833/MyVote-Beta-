import type { ArchetypeKey } from "@/lib/quiz-engine"

/* URL slugs for the public civic-profile share pages (/civic-profile/[slug]).
   Hyphenated for clean URLs; maps 1:1 to ArchetypeKey underscores. */
export const ARCHETYPE_SLUGS: Record<ArchetypeKey, string> = {
  institutional_skeptic: "institutional-skeptic",
  freedom_first: "freedom-first",
  public_safety: "public-safety",
  local_impact: "local-impact",
  independent_localist: "independent-localist",
  community_builder: "community-builder",
  national_policy_watcher: "national-policy-watcher",
  civic_pragmatist: "civic-pragmatist",
}

export function archetypeFromSlug(slug: string): ArchetypeKey | null {
  const hit = (Object.entries(ARCHETYPE_SLUGS) as [ArchetypeKey, string][]).find(
    ([, s]) => s === slug
  )
  return hit ? hit[0] : null
}

/** Absolute share URL for an archetype result. */
export function shareUrl(key: ArchetypeKey): string {
  return `https://www.myvotega.com/civic-profile/${ARCHETYPE_SLUGS[key]}`
}

/** Pre-written share text used by the results-screen share buttons. */
export function shareText(label: string): string {
  return `My civic profile is "${label}" — which one are you? Take the free 2-minute quiz:`
}
