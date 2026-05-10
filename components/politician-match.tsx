"use client"

import { useEffect, useState } from "react"
import { ExternalLink, Vote, Sparkles, RefreshCw } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Politician {
  name: string
  party: "Democrat" | "Republican" | "Independent"
  seat: string
  area: string
  website: string
  matchReason: string
  matchScore: number // 0-100
}

const GEORGIA_POLITICIANS: Politician[] = [
  {
    name: "Jon Ossoff",
    party: "Democrat",
    seat: "U.S. Senate — Georgia",
    area: "Statewide",
    website: "https://www.ossoff.senate.gov/",
    matchReason: "Progressive economic policy, healthcare expansion, environmental legislation",
    matchScore: 0,
  },
  {
    name: "Nikema Williams",
    party: "Democrat",
    seat: "GA-5 (Atlanta)",
    area: "Fulton & DeKalb counties",
    website: "https://nikemawilliams.house.gov/",
    matchReason: "Civil rights, voting rights, urban infrastructure, social equity",
    matchScore: 0,
  },
  {
    name: "Lucy McBath",
    party: "Democrat",
    seat: "GA-7 (Gwinnett)",
    area: "Gwinnett, Forsyth, Hall counties",
    website: "https://mcbath.house.gov/",
    matchReason: "Moderate Democrat, gun safety, healthcare, bipartisan cooperation",
    matchScore: 0,
  },
  {
    name: "David Scott",
    party: "Democrat",
    seat: "GA-13 (South Fulton)",
    area: "South Fulton, Douglas, Fayette, Henry",
    website: "https://davidscott.house.gov/",
    matchReason: "Agriculture, financial services, veteran affairs, rural development",
    matchScore: 0,
  },
  {
    name: "Rich McCormick",
    party: "Republican",
    seat: "GA-6 (N. Atlanta suburbs)",
    area: "Cherokee, Forsyth, Gwinnett counties",
    website: "https://mccormick.house.gov/",
    matchReason: "Fiscal conservatism, national security, veterans, limited government",
    matchScore: 0,
  },
]

function leanToMatches(score: number | null): Politician[] {
  if (score === null) return []

  // Assign match scores based on distance from politician's natural lean
  // Democrats cluster around -1.5, Republicans around +1.5
  const politicianLeans: Record<string, number> = {
    "Jon Ossoff": -2,
    "Nikema Williams": -2.5,
    "Lucy McBath": -1,
    "David Scott": -1.5,
    "Rich McCormick": 2,
  }

  return GEORGIA_POLITICIANS.map((p) => {
    const pLean = politicianLeans[p.name] ?? 0
    const distance = Math.abs(score - pLean)
    const matchScore = Math.round(Math.max(0, 100 - distance * 20))
    return { ...p, matchScore }
  })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3) // top 3 matches
}

const PARTY_COLORS: Record<string, string> = {
  Democrat: "bg-blue-100 text-blue-800 border-blue-200",
  Republican: "bg-red-100 text-red-800 border-red-200",
  Independent: "bg-slate-100 text-slate-700 border-slate-200",
}

function MatchBar({ score }: { score: number }) {
  const color = score >= 75 ? "bg-teal-500" : score >= 50 ? "bg-amber-400" : "bg-slate-300"
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[11px] font-bold text-muted-foreground w-8 text-right">{score}%</span>
    </div>
  )
}

export function PoliticianMatch() {
  const [leanScore, setLeanScore] = useState<number | null>(null)
  const [totalRatings, setTotalRatings] = useState(0)
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)

  async function load() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    setAuthed(true)

    const { data } = await supabase
      .from("profiles")
      .select("content_lean_score, total_ratings")
      .eq("id", user.id)
      .single()

    setLeanScore(data?.content_lean_score ?? null)
    setTotalRatings(data?.total_ratings ?? 0)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const matches = leanToMatches(leanScore)

  function leanDescription(score: number): string {
    if (score <= -2) return "Strongly left-leaning"
    if (score <= -1) return "Center-left"
    if (score < 0) return "Slightly left-leaning"
    if (score === 0) return "Centrist"
    if (score < 1) return "Slightly right-leaning"
    if (score < 2) return "Center-right"
    return "Strongly right-leaning"
  }

  if (!authed && !loading) {
    return (
      <div className="bg-white rounded-2xl border border-border p-5 text-center space-y-2">
        <Vote className="w-8 h-8 text-[#1F3A93] mx-auto opacity-60" />
        <p className="text-sm font-semibold text-foreground">Politician Match</p>
        <p className="text-xs text-muted-foreground">
          Sign in and rate stories to discover which Georgia candidates align with your interests.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-border p-5 space-y-3 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-4/5" />
      </div>
    )
  }

  if (leanScore === null || totalRatings < 3) {
    return (
      <div className="bg-white rounded-2xl border border-[#1F3A93]/20 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#1F3A93]" />
          <p className="text-sm font-bold text-foreground">Politician Match</p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Rate <strong>{Math.max(0, 3 - totalRatings)} more</strong> {3 - totalRatings === 1 ? "story" : "stories"} on the National News page to unlock your politician alignment.
        </p>
        <div className="flex gap-0.5">
          {[1,2,3].map((i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full ${i <= totalRatings ? "bg-[#1F3A93]" : "bg-muted"}`}
            />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground">
          {totalRatings}/3 stories rated
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#1F3A93]/20 overflow-hidden shadow-sm">
      <div className="bg-[#1F3A93] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Vote className="w-4 h-4 text-white" />
            <p className="text-sm font-bold text-white">Your Politician Match</p>
          </div>
          <button onClick={load} className="p-1 rounded hover:bg-white/10 transition-colors">
            <RefreshCw className="w-3.5 h-3.5 text-white/70" />
          </button>
        </div>
        <p className="text-xs text-blue-200 mt-0.5">
          Based on {totalRatings} story ratings · {leanDescription(leanScore)}
        </p>
      </div>

      <div className="p-4 space-y-3">
        {matches.map((p, i) => (
          <div key={p.name} className="space-y-1.5">
            <div className="flex items-start gap-2">
              {i === 0 && (
                <span className="flex-shrink-0 text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full mt-0.5">
                  Best match
                </span>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <a
                    href={p.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-foreground hover:text-[#1F3A93] hover:underline transition-colors flex items-center gap-1"
                  >
                    {p.name}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${PARTY_COLORS[p.party]}`}>
                    {p.party}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">{p.seat}</p>
              </div>
            </div>
            <MatchBar score={p.matchScore} />
            <p className="text-[11px] text-muted-foreground leading-relaxed pl-0.5">
              {p.matchReason}
            </p>
            {i < matches.length - 1 && <div className="border-t border-border pt-1" />}
          </div>
        ))}

        <p className="text-[10px] text-muted-foreground text-center pt-1">
          Matches update automatically as you rate more stories.
        </p>
      </div>
    </div>
  )
}
