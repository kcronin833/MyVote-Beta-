"use client"

import { useState, useEffect } from "react"
import { RefreshCw, ExternalLink, MessageCircle, ChevronDown, ChevronUp, Flame, Share2, Check } from "lucide-react"
import { CommentSystem } from "@/components/comment-system"
import { SpectrumScrubber } from "@/components/spectrum-scrubber"
import { formatNewsTime, type NewsArticle } from "@/lib/news-service"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-context"
import { NewsFeedAd } from "@/components/ads/ad-unit"
import { C } from "@/lib/design-tokens"

interface FactualNewsItem {
  title: string
  description: string
  source: string
  publishedAt: string
  url: string
  urlToImage: string | null
  category: string
  aiOverview: string
  aiGenerated?: boolean
  controversyScore: number
  leftArticles: NewsArticle[]
  rightArticles: NewsArticle[]
}

type Reaction = "important" | "outraged" | "surprising" | "factual"

const REACTIONS: { key: Reaction; emoji: string; label: string }[] = [
  { key: "important", emoji: "👍", label: "Important" },
  { key: "outraged",  emoji: "😡", label: "Outraged"  },
  { key: "surprising",emoji: "😮", label: "Surprising"},
  { key: "factual",   emoji: "✅", label: "Factual"   },
]

const CATEGORIES = ["Top stories", "Politics", "Economy", "World"] as const
type Category = typeof CATEGORIES[number]

const CATEGORY_KEYWORDS: Record<Category, RegExp | null> = {
  "Top stories": null,
  "Politics":   /\b(congress|senate|house|president|election|vote|bill|law|governor|legislation|democrat|republican|trump|biden|harris|white house|supreme court)\b/i,
  "Economy":    /\b(fed|federal reserve|rate|inflation|jobs|economy|economic|trade|market|stock|bank|tax|tariff|gdp|unemployment|budget|deficit)\b/i,
  "World":      /\b(world|international|global|ukraine|russia|china|israel|nato|europe|middle east|taiwan|iran|north korea|foreign)\b/i,
}

function getSourceLean(name: string, side: "left" | "right"): { label: string; dot: string; badge: string } {
  const n = name.toLowerCase()
  if (n.includes("msnbc") || n.includes("the nation") || n.includes("mother jones"))
    return { label: "Far left",     dot: "bg-blue-700",   badge: "bg-blue-100 text-blue-800" }
  if (n.includes("cnn") || n.includes("washington post") || n.includes("new york times") || n.includes("nytimes") || n.includes("npr") || n.includes("pbs") || n.includes("huffpost") || n.includes("vox"))
    return { label: "Center-left",  dot: "bg-blue-500",   badge: "bg-blue-50 text-blue-700" }
  if (n.includes("associated press") || n.includes("reuters") || n.includes("axios") || n.includes("politico") || n.includes("the hill") || n.includes("abc") || n.includes("nbc"))
    return { label: "Center",       dot: "bg-paper-500",   badge: "bg-paper-100 text-foreground" }
  if (n.includes("wall street") || n.includes("wsj") || n.includes("examiner") || n.includes("national review"))
    return { label: "Center-right", dot: "bg-orange-500", badge: "bg-orange-50 text-orange-700" }
  if (n.includes("fox") || n.includes("daily wire") || n.includes("new york post") || n.includes("breitbart") || n.includes("daily caller"))
    return { label: "Right",        dot: "bg-red-600",    badge: "bg-red-50 text-red-700" }
  // fallback by side
  return side === "left"
    ? { label: "Left-leaning",  dot: "bg-blue-400",  badge: "bg-blue-50 text-blue-600" }
    : { label: "Right-leaning", dot: "bg-red-400",   badge: "bg-red-50 text-red-600" }
}

const EMPTY_COUNTS: Record<Reaction, number> = { important: 0, outraged: 0, surprising: 0, factual: 0 }

function NewsCard({ article }: { article: FactualNewsItem }) {
  const { user } = useAuth()
  const supabase = createClient()
  const articleId = `facts-${article.title.replace(/\s+/g, "-").toLowerCase().slice(0, 50)}`

  const [counts, setCounts]         = useState<Record<Reaction, number>>(EMPTY_COUNTS)
  const [myReaction, setMyReaction] = useState<Reaction | null>(null)
  const [reacting, setReacting]     = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [shared, setShared] = useState(false)

  async function share() {
    const url = "https://www.myvotega.com/news"
    const summary = (article.aiOverview || article.description || "").slice(0, 400)
    const text = `${article.title}\n\n${summary}`
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: article.title, text, url })
        return
      }
    } catch { return /* user cancelled the share sheet */ }
    try {
      await navigator.clipboard.writeText(`${text}\n\nvia MyVote — ${url}`)
      setShared(true)
      setTimeout(() => setShared(false), 1800)
    } catch { /* clipboard unavailable */ }
  }

  // Sources laid out left → right for the interactive spectrum wheel.
  const scrubSources = [
    ...article.leftArticles.map(a  => ({ ...a, side: "left"  as const, leanLabel: getSourceLean(a.source, "left").label })),
    ...article.rightArticles.map(a => ({ ...a, side: "right" as const, leanLabel: getSourceLean(a.source, "right").label })),
  ]

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("article_reactions")
        .select("reaction, user_id")
        .eq("article_id", articleId)
      if (!data) return
      const t = { ...EMPTY_COUNTS }
      let mine: Reaction | null = null
      for (const row of data) {
        if (row.reaction in t) t[row.reaction as Reaction]++
        if (user && row.user_id === user.id) mine = row.reaction as Reaction
      }
      setCounts(t)
      setMyReaction(mine)
    }
    load()
  }, [articleId, user])

  async function handleReaction(key: Reaction) {
    if (!user || reacting) return
    setReacting(true)
    if (myReaction === key) {
      await supabase.from("article_reactions").delete().eq("article_id", articleId).eq("user_id", user.id)
      setCounts(p => ({ ...p, [key]: Math.max(0, p[key] - 1) }))
      setMyReaction(null)
    } else {
      await supabase.from("article_reactions").upsert({ user_id: user.id, article_id: articleId, reaction: key }, { onConflict: "user_id,article_id" })
      setCounts(p => {
        const n = { ...p, [key]: p[key] + 1 }
        if (myReaction) n[myReaction] = Math.max(0, n[myReaction] - 1)
        return n
      })
      setMyReaction(key)
    }
    setReacting(false)
  }

  return (
    <article
      className="mv-lift"
      style={{
        background: C.card,
        border: `1px solid ${C.rule}`,
        borderRadius: 12,
        boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
        overflow: "hidden",
      }}
    >

      {/* Hero image — full bleed at top */}
      {article.urlToImage && (
        <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", position: "relative", overflow: "hidden", aspectRatio: "16/9", maxHeight: 220 }}>
          <img
            src={article.urlToImage}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease", display: "block" }}
            className="hover:scale-105"
            onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = "none" }}
          />
        </a>
      )}

      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>

      {/* AI synopsis badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", background: C.tealSoft, color: C.tealDk, border: `1px solid ${C.tealBorder}`, borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: 0.2 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.teal, flexShrink: 0, display: "inline-block" }} />
          {article.aiGenerated === false ? "Summary" : "AI · Just the Facts"}
        </span>
        {article.controversyScore >= 70 && (
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.red, display: "flex", alignItems: "center", gap: 4 }}>
            <Flame style={{ width: 13, height: 13 }} /> High controversy
          </span>
        )}
      </div>

      {/* Headline */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "block", fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700, lineHeight: 1.3, color: C.ink900, textDecoration: "none", letterSpacing: -0.2 }}
        className="hover:text-teal-700"
      >
        {article.title}
      </a>

      {/* Summary */}
      {(article.aiOverview || article.description) && (
        <p style={{ fontSize: 13.5, color: C.ink700, lineHeight: 1.65, margin: 0 }}>
          {article.aiOverview || article.description}
        </p>
      )}

      {/* Interactive spectrum wheel — pull it to change the featured (middle) article */}
      {scrubSources.length > 0 && <SpectrumScrubber sources={scrubSources} />}

      {/* Reactions + actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 10, borderTop: `1px solid ${C.ruleSoft}`, flexWrap: "wrap" }}>
        {REACTIONS.map(({ key, emoji, label }) => {
          const isSelected = myReaction === key
          return (
            <button
              key={key}
              onClick={() => handleReaction(key)}
              disabled={!user || reacting}
              title={!user ? "Sign in to react" : label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 11px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                background: isSelected ? C.teal : "transparent",
                color: isSelected ? "#fff" : C.ink500,
                border: `1.5px solid ${isSelected ? C.teal : C.rule}`,
                cursor: !user || reacting ? "not-allowed" : "pointer",
                opacity: !user || reacting ? 0.5 : 1,
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: 13 }}>{emoji}</span>
              <span>{counts[key]}</span>
            </button>
          )
        })}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: `1.5px solid ${C.rule}`, color: C.ink500, textDecoration: "none", transition: "all 0.15s ease" }}
          >
            <ExternalLink style={{ width: 12, height: 12 }} />
            Read
          </a>
          <button
            onClick={share}
            title="Share this summary"
            style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: `1.5px solid ${shared ? C.teal : C.rule}`, color: shared ? C.teal : C.ink500, background: shared ? C.tealSoft : "transparent", cursor: "pointer", transition: "all 0.15s ease" }}
          >
            {shared ? <Check style={{ width: 12, height: 12 }} /> : <Share2 style={{ width: 12, height: 12 }} />}
            {shared ? "Copied" : "Share"}
          </button>
          <button
            onClick={() => setShowComments(v => !v)}
            style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: `1.5px solid ${showComments ? C.teal : C.rule}`, color: showComments ? C.teal : C.ink500, background: showComments ? C.tealSoft : "transparent", cursor: "pointer", transition: "all 0.15s ease" }}
          >
            <MessageCircle style={{ width: 12, height: 12 }} />
            Discuss
            {showComments ? <ChevronUp style={{ width: 11, height: 11 }} /> : <ChevronDown style={{ width: 11, height: 11 }} />}
          </button>
        </div>
      </div>

      {showComments && (
        <div style={{ paddingTop: 10, borderTop: `1px solid ${C.ruleSoft}` }}>
          <CommentSystem articleUrl={articleId} articleTitle={article.title} />
        </div>
      )}

      </div>{/* end content */}
    </article>
  )
}

export function AIFactualNews({ initialNews }: { initialNews?: FactualNewsItem[] } = {}) {
  const [news, setNews]         = useState<FactualNewsItem[]>(initialNews ?? [])
  const [loading, setLoading]   = useState(!initialNews || initialNews.length === 0)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [category, setCategory] = useState<Category>("Top stories")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  async function loadNews(isRefresh = false) {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/news/factual", { cache: "no-store" })
      const result = await res.json()
      if (result.success && result.news.length > 0) {
        setNews(result.news)
        setLastUpdated(new Date())
      } else {
        setError(result.error || "Unable to load news at this time.")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Skip the client fetch when the server already provided the feed — the
  // cards are in the SSR HTML. Refresh button still re-fetches on demand.
  useEffect(() => { if (!initialNews || initialNews.length === 0) loadNews() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = category === "Top stories"
    ? news
    : news.filter(a => CATEGORY_KEYWORDS[category]?.test(`${a.title} ${a.description}`))

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
          {CATEGORIES.map(c => (
            <div key={c} style={{ height: 32, width: 88, borderRadius: 999, background: "#E9EBEF", opacity: 0.6 }} className="animate-pulse" />
          ))}
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse" style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 12, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ height: 22, width: 80, background: "#E9EBEF", borderRadius: 6 }} />
            <div style={{ height: 26, width: "85%", background: "#E9EBEF", borderRadius: 6 }} />
            <div style={{ height: 15, width: "100%", background: "#EEEBE1", borderRadius: 4 }} />
            <div style={{ height: 15, width: "75%", background: "#EEEBE1", borderRadius: 4 }} />
            <div style={{ height: 6, width: "100%", background: "#E9EBEF", borderRadius: 999 }} />
            <div style={{ display: "flex", gap: 8 }}>
              {[...Array(3)].map((_, j) => <div key={j} style={{ height: 96, width: 168, background: "#EEEBE1", borderRadius: 10, flexShrink: 0 }} />)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Category tabs + refresh */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CATEGORIES.map(c => {
            const active = category === c
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: active ? "#fff" : C.ink500,
                  background: active ? C.tealDk : "transparent",
                  border: `1.5px solid ${active ? C.tealDk : C.rule}`,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {c}
              </button>
            )
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {lastUpdated && (
            <span style={{ fontSize: 11, color: C.ink400, display: "none" }} className="sm:block">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => loadNews(true)}
            disabled={refreshing}
            style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: `1.5px solid ${C.rule}`, color: C.ink500, background: "transparent", cursor: refreshing ? "not-allowed" : "pointer", opacity: refreshing ? 0.5 : 1, transition: "all 0.15s ease" }}
          >
            <RefreshCw style={{ width: 12, height: 12, animation: refreshing ? "mv-spin 1s linear infinite" : undefined }} />
            {refreshing ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: "48px 16px", textAlign: "center", color: C.ink400 }}>
          <p style={{ fontSize: 13.5, marginBottom: 8 }}>{error}</p>
          <button onClick={() => loadNews(true)} style={{ fontSize: 12, color: C.teal, fontWeight: 600, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Try again
          </button>
        </div>
      )}

      {filtered.length === 0 && !error && !loading && (
        <div style={{ padding: "48px 16px", textAlign: "center", color: C.ink400, fontSize: 13.5 }}>
          No {category.toLowerCase()} stories right now — try another category.
        </div>
      )}

      {filtered.map((article, i) => (
        <div key={i}>
          <NewsCard article={article} />
          {/* Ad after every 3rd article, but not after the last one */}
          {(i + 1) % 3 === 0 && i < filtered.length - 1 && (
            <NewsFeedAd />
          )}
        </div>
      ))}

      {filtered.length > 0 && (
        <p style={{ textAlign: "center", fontSize: 11.5, color: C.ink400, padding: "6px 0 12px" }}>
          Coverage sourced from real outlets across the political spectrum. Always verify with official sources.
        </p>
      )}
    </div>
  )
}
