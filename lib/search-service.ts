import { createClient } from "@/lib/supabase/client"
import { STATEWIDE_RACES, CONGRESSIONAL_RACES } from "@/lib/georgia-ballot-data"
import { listCounties, candidateDetailHref } from "@/lib/county-utils"

/* Real search over MyVote's own data: Georgia 2026 candidates, the 159
   county ballot pages, community posts, and clustered news stories.
   No external / mock content — every result links to something real. */

export interface SearchResult {
  id: string
  type: "candidate" | "county" | "post" | "news"
  title: string
  description: string
  /** Internal route to navigate to. */
  url?: string
  /** Small tag, e.g. party, congressional district, or lean label. */
  badge?: string
  /** Secondary line, e.g. office, author, or source count. */
  meta?: string
  timestamp?: string
  relevanceScore: number
}

const PARTY_ABBR: Record<string, string> = {
  Democrat: "DEM",
  Republican: "GOP",
  Independent: "IND",
  Libertarian: "LIB",
  Green: "GRN",
}

function relevance(query: string, text: string): number {
  if (!text) return 0
  const q = query.toLowerCase().trim()
  const t = text.toLowerCase()
  if (t === q) return 100
  if (t.startsWith(q)) return 90
  if (t.includes(q)) return 80
  const words = q.split(/\s+/).filter(Boolean)
  if (words.length === 0) return 0
  let hits = 0
  for (const w of words) if (t.includes(w)) hits++
  return (hits / words.length) * 70
}

/* ── Suggestion pool ─────────────────────────────────────────────────
   Built once at module init from live candidate / county data so
   suggestions never go stale. Weights: candidate name (3) > office (2)
   > county (1). Fixed civic terms fill the "no query" state.           */

type Suggestion = { text: string; weight: number }
const SUGGESTION_POOL: Suggestion[] = []

// Candidates from statewide + congressional races
for (const race of [...STATEWIDE_RACES, ...Object.values(CONGRESSIONAL_RACES)]) {
  for (const c of race.candidates) {
    if (c.name.includes("TBD")) continue
    SUGGESTION_POOL.push({ text: c.name, weight: 3 })
  }
  // Office name (deduplicate)
  if (!SUGGESTION_POOL.some((s) => s.text === race.office)) {
    SUGGESTION_POOL.push({ text: race.office, weight: 2 })
  }
}

// County names
for (const county of listCounties()) {
  SUGGESTION_POOL.push({ text: `${county.name} County`, weight: 1 })
}

const FIXED_SUGGESTIONS = [
  "Governor",
  "U.S. Senate",
  "Early voting",
  "Voter registration",
  "Find my ballot",
]

/* ── Lean label for news stories ─────────────────────────────────── */
function leanLabel(leanMin: number | null, leanMax: number | null): string {
  const lo = leanMin ?? 0
  const hi = leanMax ?? 0
  if (lo < -0.25 && hi < -0.25) return "Left-leaning"
  if (lo > 0.25 && hi > 0.25) return "Right-leaning"
  if (Math.abs(lo) < 0.2 && Math.abs(hi) < 0.2) return "Centrist"
  return "Multi-perspective"
}

export class SearchService {
  static async searchAll(
    query: string,
    filters?: { type?: string[] }
  ): Promise<SearchResult[]> {
    const q = query.trim()
    if (!q) return []

    const results: SearchResult[] = []
    const want = (t: string) => !filters?.type || filters.type.includes(t)

    // ── Candidates (statewide + congressional) ────────────────────────
    if (want("candidate")) {
      const races = [...STATEWIDE_RACES, ...Object.values(CONGRESSIONAL_RACES)]
      const seen = new Set<string>()
      for (const race of races) {
        for (const c of race.candidates) {
          if (c.name.includes("TBD")) continue
          const href = candidateDetailHref(c.name, race.office)
          if (!href || seen.has(href)) continue
          const score = Math.max(
            relevance(q, c.name),
            relevance(q, race.office),
            relevance(q, c.party),
            ...(c.keyIssues || []).map((i) => relevance(q, i) * 0.6)
          )
          if (score <= 0) continue
          seen.add(href)
          results.push({
            id: href,
            type: "candidate",
            title: c.name,
            description: race.office,
            url: href,
            badge: PARTY_ABBR[c.party] || c.party,
            meta: c.isIncumbent ? "Incumbent" : undefined,
            relevanceScore: score + (c.isIncumbent ? 2 : 0),
          })
        }
      }
    }

    // ── Counties (159 ballot pages) ───────────────────────────────────
    if (want("county")) {
      for (const county of listCounties()) {
        const score = Math.max(
          relevance(q, county.name),
          relevance(q, `${county.name} county`),
          relevance(q, county.congressionalDistrict)
        )
        if (score <= 0) continue
        results.push({
          id: county.slug,
          type: "county",
          title: `${county.name} County`,
          description: "View the 2026 ballot, races, and polling info",
          url: county.href,
          badge: county.congressionalDistrict,
          relevanceScore: score,
        })
      }
    }

    // ── Community posts ───────────────────────────────────────────────
    if (want("post")) {
      try {
        const supabase = createClient()
        const escaped = q.replace(/[%,]/g, " ")
        const { data } = await supabase
          .from("posts")
          .select(
            "id, content, topic, created_at, profile:profiles(display_name, username)"
          )
          .or(`content.ilike.%${escaped}%,topic.ilike.%${escaped}%`)
          .order("created_at", { ascending: false })
          .limit(20)

        for (const row of (data as any[]) || []) {
          const author = row.profile?.display_name || "Member"
          const username = row.profile?.username
          const content: string = row.content || ""
          results.push({
            id: row.id,
            type: "post",
            title: content.length > 90 ? content.slice(0, 90) + "…" : content,
            description: row.topic ? `Topic: ${row.topic}` : "Community post",
            url: username ? `/profile/${username}` : undefined,
            badge: row.topic || undefined,
            meta: `@${username || "member"}`,
            timestamp: row.created_at,
            relevanceScore: Math.max(
              relevance(q, content),
              relevance(q, row.topic || "")
            ),
          })
        }
      } catch (e) {
        console.error("post search error:", e)
      }
    }

    // ── News (clustered_stories) ──────────────────────────────────────
    if (want("news")) {
      try {
        const supabase = createClient()
        const escaped = q.replace(/[%]/g, " ")
        const { data } = await supabase
          .from("clustered_stories")
          .select("id, headline, synopsis, lean_min, lean_max, created_at, article_data")
          .or(`headline.ilike.%${escaped}%,synopsis.ilike.%${escaped}%`)
          .order("created_at", { ascending: false })
          .limit(15)

        for (const row of (data as any[]) || []) {
          const score = Math.max(
            relevance(q, row.headline || ""),
            relevance(q, row.synopsis || "") * 0.85
          )
          if (score <= 0) continue

          const synopsis: string = row.synopsis || ""
          const sources: number = Array.isArray(row.article_data)
            ? row.article_data.length
            : 0

          results.push({
            id: row.id,
            type: "news",
            title: row.headline || "Georgia news story",
            description:
              synopsis.length > 160 ? synopsis.slice(0, 160) + "…" : synopsis,
            url: "/news",
            badge: leanLabel(row.lean_min, row.lean_max),
            meta: sources > 0 ? `${sources} source${sources !== 1 ? "s" : ""}` : undefined,
            timestamp: row.created_at,
            relevanceScore: score,
          })
        }
      } catch (e) {
        console.error("news search error:", e)
      }
    }

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  static getSearchSuggestions(query: string): string[] {
    const q = query.toLowerCase().trim()
    if (!q) return FIXED_SUGGESTIONS

    // Match against the live suggestion pool
    const seen = new Set<string>()
    const matches: Suggestion[] = []
    for (const s of SUGGESTION_POOL) {
      if (s.text.toLowerCase().includes(q) && !seen.has(s.text)) {
        seen.add(s.text)
        matches.push(s)
      }
    }

    return matches
      .sort((a, b) => b.weight - a.weight)
      .map((s) => s.text)
      .slice(0, 6)
  }
}
