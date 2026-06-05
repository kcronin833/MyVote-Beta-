import { createClient } from "@/lib/supabase/client"
import { STATEWIDE_RACES, CONGRESSIONAL_RACES } from "@/lib/georgia-ballot-data"
import { listCounties, candidateDetailHref } from "@/lib/county-utils"

/* Real search over MyVote's own data: Georgia 2026 candidates, the 159
   county ballot pages, and community posts. No external/mock content. */

export interface SearchResult {
  id: string
  type: "candidate" | "county" | "post"
  title: string
  description: string
  /** Internal route to navigate to. */
  url?: string
  /** Small tag, e.g. party or congressional district. */
  badge?: string
  /** Secondary line, e.g. office or author. */
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

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  static getSearchSuggestions(query: string): string[] {
    const base = [
      "Governor",
      "U.S. Senate",
      "Fulton County",
      "DeKalb County",
      "Cobb County",
      "Gwinnett County",
      "Brian Jack",
      "Find my ballot",
      "Early voting",
      "Voter registration",
    ]
    const q = query.toLowerCase().trim()
    if (!q) return base.slice(0, 5)
    return base.filter((s) => s.toLowerCase().includes(q)).slice(0, 5)
  }
}
