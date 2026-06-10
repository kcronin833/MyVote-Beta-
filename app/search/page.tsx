"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Search,
  Loader2,
  MessageCircle,
  Users,
  MapPin,
  Newspaper,
  ArrowRight,
  Vote,
} from "lucide-react"
import { SearchService, type SearchResult } from "@/lib/search-service"
import { formatDistanceToNow } from "date-fns"
import { C } from "@/lib/design-tokens"

const cardBase: React.CSSProperties = {
  background: C.card,
  border: `1px solid ${C.rule}`,
  borderRadius: 12,
  boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
}

/* ── Tab definitions ────────────────────────────────────────────────── */
type Tab = "all" | "candidate" | "county" | "post" | "news"

const TABS: { id: Tab; label: string }[] = [
  { id: "all",       label: "All"        },
  { id: "candidate", label: "Candidates" },
  { id: "county",    label: "Counties"   },
  { id: "news",      label: "News"       },
  { id: "post",      label: "Posts"      },
]

/* ── Lean badge color ───────────────────────────────────────────────── */
function leanStyle(badge?: string): React.CSSProperties {
  if (!badge) return { background: C.tealSoft, color: C.teal }
  if (badge === "Left-leaning")       return { background: "#DBEAFE", color: "#1D4ED8" }
  if (badge === "Right-leaning")      return { background: C.redSoft, color: C.red }
  if (badge === "Multi-perspective")  return { background: C.tealSoft, color: C.teal }
  return { background: C.shade, color: C.ink500 }
}

/* ── Individual result cards ────────────────────────────────────────── */
function CandidateCard({ r }: { r: SearchResult }) {
  return (
    <div style={{ ...cardBase, padding: 14 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: C.tealSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Users size={18} color={C.teal} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, background: C.shade, color: C.ink500, borderRadius: 4, padding: "2px 7px", letterSpacing: 0.3 }}>
              CANDIDATE
            </span>
            {r.badge && (
              <span style={{ fontSize: 10, fontWeight: 700, background: r.badge === "DEM" ? "#DBEAFE" : r.badge === "GOP" ? C.redSoft : C.shade, color: r.badge === "DEM" ? "#1D4ED8" : r.badge === "GOP" ? C.red : C.ink500, borderRadius: 4, padding: "2px 7px" }}>
                {r.badge}
              </span>
            )}
            {r.meta && (
              <span style={{ fontSize: 10, fontWeight: 600, background: "#FEF9C3", color: "#854D0E", borderRadius: 4, padding: "2px 7px" }}>
                {r.meta}
              </span>
            )}
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: "0 0 2px" }}>{r.title}</p>
          <p style={{ fontSize: 12.5, color: C.ink500, margin: 0 }}>{r.description}</p>
        </div>
      </div>
      {r.url && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.ruleSoft}` }}>
          <Link href={r.url} style={{ fontSize: 12.5, fontWeight: 700, color: C.teal, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
            View candidate profile <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </div>
  )
}

function CountyCard({ r }: { r: SearchResult }) {
  return (
    <div style={{ ...cardBase, padding: 14 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <MapPin size={18} color="#D97706" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, background: C.shade, color: C.ink500, borderRadius: 4, padding: "2px 7px", letterSpacing: 0.3 }}>
              COUNTY BALLOT
            </span>
            {r.badge && (
              <span style={{ fontSize: 10, fontWeight: 600, background: C.shade, color: C.ink500, borderRadius: 4, padding: "2px 7px" }}>
                {r.badge}
              </span>
            )}
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: "0 0 2px" }}>{r.title}</p>
          <p style={{ fontSize: 12.5, color: C.ink500, margin: 0 }}>{r.description}</p>
        </div>
      </div>
      {r.url && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.ruleSoft}` }}>
          <Link href={r.url} style={{ fontSize: 12.5, fontWeight: 700, color: C.teal, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
            View {r.title} ballot <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </div>
  )
}

function NewsCard({ r }: { r: SearchResult }) {
  const bs = leanStyle(r.badge)
  return (
    <div style={{ ...cardBase, padding: 14 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Newspaper size={18} color="#7C3AED" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4, alignItems: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 700, background: C.shade, color: C.ink500, borderRadius: 4, padding: "2px 7px", letterSpacing: 0.3 }}>
              NEWS
            </span>
            {r.badge && (
              <span style={{ fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "2px 7px", ...bs }}>
                {r.badge}
              </span>
            )}
            {r.meta && (
              <span style={{ fontSize: 10, color: C.ink400 }}>{r.meta}</span>
            )}
            {r.timestamp && (
              <span style={{ fontSize: 10, color: C.ink400 }}>
                {formatDistanceToNow(new Date(r.timestamp), { addSuffix: true })}
              </span>
            )}
          </div>
          <p style={{ fontSize: 14.5, fontWeight: 700, color: C.ink900, margin: "0 0 4px", lineHeight: 1.35 }}>{r.title}</p>
          {r.description && (
            <p style={{ fontSize: 12.5, color: C.ink700, margin: 0, lineHeight: 1.5 }}>{r.description}</p>
          )}
        </div>
      </div>
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.ruleSoft}` }}>
        <Link href="/news" style={{ fontSize: 12.5, fontWeight: 700, color: "#7C3AED", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
          Read in news feed <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}

function PostCard({ r }: { r: SearchResult }) {
  return (
    <div style={{ ...cardBase, padding: 14 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: C.shade, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <MessageCircle size={18} color={C.ink500} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4, alignItems: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 700, background: C.shade, color: C.ink500, borderRadius: 4, padding: "2px 7px", letterSpacing: 0.3 }}>
              COMMUNITY
            </span>
            {r.meta && <span style={{ fontSize: 10, color: C.ink400 }}>{r.meta}</span>}
            {r.timestamp && (
              <span style={{ fontSize: 10, color: C.ink400 }}>
                {formatDistanceToNow(new Date(r.timestamp), { addSuffix: true })}
              </span>
            )}
          </div>
          <p style={{ fontSize: 13.5, color: C.ink900, margin: "0 0 2px", lineHeight: 1.45 }}>{r.title}</p>
          {r.badge && <p style={{ fontSize: 12, color: C.ink500, margin: 0 }}>Topic: {r.badge}</p>}
        </div>
      </div>
      {r.url && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.ruleSoft}` }}>
          <Link href={r.url} style={{ fontSize: 12.5, fontWeight: 700, color: C.ink500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
            View author profile <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </div>
  )
}

function renderResult(r: SearchResult) {
  switch (r.type) {
    case "candidate": return <CandidateCard key={r.id} r={r} />
    case "county":    return <CountyCard    key={r.id} r={r} />
    case "news":      return <NewsCard      key={r.id} r={r} />
    case "post":      return <PostCard      key={r.id} r={r} />
    default:          return null
  }
}

/* ── Main search results component ─────────────────────────────────── */
function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [results, setResults]   = useState<SearchResult[]>([])
  const [loading, setLoading]   = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("all")

  useEffect(() => {
    if (!query) return
    setLoading(true)
    SearchService.searchAll(query).then((r) => {
      setResults(r)
      setLoading(false)
    })
  }, [query])

  const counts: Record<Tab, number> = {
    all:       results.length,
    candidate: results.filter((r) => r.type === "candidate").length,
    county:    results.filter((r) => r.type === "county").length,
    news:      results.filter((r) => r.type === "news").length,
    post:      results.filter((r) => r.type === "post").length,
  }

  const visible =
    activeTab === "all"
      ? results
      : results.filter((r) => r.type === activeTab)

  /* ── Empty / no-query state ── */
  if (!query) {
    return (
      <div style={{ textAlign: "center", padding: "48px 16px" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: C.shade, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Search size={24} color={C.ink400} />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: C.ink900, margin: "0 0 6px" }}>Search MyVote</h2>
        <p style={{ fontSize: 13.5, color: C.ink500, margin: "0 0 24px" }}>
          Find Georgia 2026 candidates, county ballots, news stories, and community posts.
        </p>
        {/* Quick-start chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {["Governor", "U.S. Senate", "Fulton County", "Early voting", "Voter registration"].map((s) => (
            <Link
              key={s}
              href={`/search?q=${encodeURIComponent(s)}`}
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: C.teal,
                background: C.tealSoft,
                borderRadius: 999,
                padding: "5px 14px",
                textDecoration: "none",
              }}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Result header */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: C.ink900, margin: "0 0 2px" }}>
          {loading ? "Searching…" : `${results.length} result${results.length !== 1 ? "s" : ""}`}
        </h1>
        <p style={{ fontSize: 13, color: C.ink500, margin: 0 }}>
          for &ldquo;<strong style={{ color: C.ink900 }}>{query}</strong>&rdquo;
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
        {TABS.map(({ id, label }) => {
          const active = activeTab === id
          const count  = counts[id]
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                height: 34,
                padding: "0 16px",
                borderRadius: 999,
                border: `1.5px solid ${active ? C.tealDk : C.rule}`,
                background: active ? C.tealDk : "transparent",
                color: active ? "#fff" : C.ink500,
                fontSize: 12.5,
                fontWeight: active ? 700 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              {label}
              {count > 0 && (
                <span style={{ marginLeft: 5, fontSize: 11, opacity: 0.7 }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Results */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0", gap: 10 }}>
          <Loader2 size={22} color={C.teal} style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: 13.5, color: C.ink500 }}>Searching…</span>
        </div>
      ) : visible.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {visible.map(renderResult)}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "48px 16px" }}>
          <Search size={32} color={C.ink400} style={{ margin: "0 auto 12px", display: "block" }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: C.ink900, margin: "0 0 4px" }}>
            No {activeTab === "all" ? "" : activeTab + " "}results
          </p>
          <p style={{ fontSize: 13, color: C.ink500, margin: 0 }}>
            Try a different term or{" "}
            <Link href="/elections" style={{ color: C.teal, fontWeight: 600 }}>
              browse all races
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  )
}

/* ── Page shell ─────────────────────────────────────────────────────── */
export default function SearchPage() {
  return (
    <div style={{ background: C.page, minHeight: "100vh" }}>
      <div className="max-w-[860px] mx-auto px-3 pt-4 pb-10 lg:px-6">
        {/* Page title row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: C.shade, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Search size={16} color={C.ink500} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: C.ink400, margin: 0, letterSpacing: 0.3 }}>
              MYVOTE SEARCH
            </p>
            <p style={{ fontSize: 13, color: C.ink700, margin: 0 }}>
              Candidates · Counties · News · Community
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
              <Loader2 size={22} color={C.teal} />
            </div>
          }
        >
          <SearchResults />
        </Suspense>
      </div>
    </div>
  )
}
