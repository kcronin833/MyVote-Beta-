"use client"

import { useState, useEffect } from "react"
import { RefreshCw, MessageCircle, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { CommentSystem } from "@/components/comment-system"
import { formatNewsTime, type NewsArticle } from "@/lib/news-service"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-context"

interface FactualNewsItem {
  title: string
  description: string
  source: string
  publishedAt: string
  url: string
  urlToImage: string | null
  category: string
  aiOverview: string
  controversyScore: number
  leftArticles: NewsArticle[]
  rightArticles: NewsArticle[]
}

type Reaction = "important" | "outraged" | "surprising" | "factual"

const REACTIONS: { key: Reaction; emoji: string; label: string }[] = [
  { key: "important",  emoji: "👍", label: "Important"  },
  { key: "outraged",   emoji: "😡", label: "Outraged"   },
  { key: "surprising", emoji: "😮", label: "Surprising" },
  { key: "factual",    emoji: "✅", label: "Factual"    },
]

const CATEGORIES = ["Top stories", "Politics", "Economy", "World"] as const
type Category = typeof CATEGORIES[number]

const CATEGORY_KEYWORDS: Record<Category, RegExp | null> = {
  "Top stories": null,
  "Politics":   /\b(congress|senate|house|president|election|vote|bill|law|governor|legislation|democrat|republican|trump|biden|harris|white house|supreme court)\b/i,
  "Economy":    /\b(fed|federal reserve|rate|inflation|jobs|economy|economic|trade|market|stock|bank|tax|tariff|gdp|unemployment|budget|deficit)\b/i,
  "World":      /\b(world|international|global|ukraine|russia|china|israel|nato|europe|middle east|taiwan|iran|north korea|foreign)\b/i,
}

// Classify lean — muted tones, never partisan red/blue
function getLean(name: string, side: "left" | "right" | "center"): { lean: string; label: string } {
  const n = name.toLowerCase()
  if (/msnbc|huffpost|huffington|guardian|vox|slate|salon|the nation|mother jones/.test(n))
    return { lean: "left",   label: "Left lens" }
  if (/fox|daily wire|breitbart|washington examiner|national review|new york post|daily caller/.test(n))
    return { lean: "right",  label: "Right lens" }
  if (/associated press|reuters|axios|politico|the hill|abc|nbc|npr|pbs/.test(n))
    return { lean: "center", label: "Shared lens" }
  return { lean: side, label: side === "left" ? "Left lens" : side === "right" ? "Right lens" : "Shared lens" }
}

const EMPTY_COUNTS: Record<Reaction, number> = { important: 0, outraged: 0, surprising: 0, factual: 0 }

// ── Lean dot ─────────────────────────────────────────────────────────────────
function LeanDot({ lean }: { lean: string }) {
  const colors: Record<string, string> = {
    left:   "var(--lean-left)",
    right:  "var(--lean-right)",
    center: "var(--lean-center)",
  }
  const labels: Record<string, string> = { left: "L", right: "R", center: "C" }
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 16, height: 16, borderRadius: 999,
        background: colors[lean] || colors.center,
        color: "#fff", fontSize: 8, fontWeight: 700, flexShrink: 0,
      }}
    >{labels[lean] || "·"}</span>
  )
}

// ── Perspective row ────────────────────────────────────────────────────────────
function PerspectiveRow({ article, side }: { article: NewsArticle; side: "left" | "right" | "center" }) {
  const { lean, label } = getLean(article.source, side)
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 p-3 rounded-xl transition-colors hover:opacity-80"
      style={{ background: "var(--paper-100)" }}
    >
      <LeanDot lean={lean} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[10px] font-bold tracking-wide uppercase" style={{ color: "var(--ink-500)" }}>{label}</span>
          <span style={{ color: "var(--rule)" }}>·</span>
          <span className="text-[10px]" style={{ color: "var(--ink-500)" }}>{article.source}</span>
        </div>
        <p className="text-sm font-medium leading-snug line-clamp-2" style={{ color: "var(--ink-900)" }}>{article.title}</p>
      </div>
    </a>
  )
}

// ── News card ─────────────────────────────────────────────────────────────────
function NewsCard({ article }: { article: FactualNewsItem }) {
  const { user } = useAuth()
  const supabase = createClient()
  const articleId = `facts-${article.title.replace(/\s+/g, "-").toLowerCase().slice(0, 50)}`

  const [counts, setCounts]         = useState<Record<Reaction, number>>(EMPTY_COUNTS)
  const [myReaction, setMyReaction] = useState<Reaction | null>(null)
  const [reacting, setReacting]     = useState(false)
  const [showComments, setShowComments] = useState(false)

  // All perspective articles
  const leftArticles   = article.leftArticles.slice(0, 2)
  const rightArticles  = article.rightArticles.slice(0, 2)
  const hasPerspectives = leftArticles.length > 0 || rightArticles.length > 0

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
    <article className="rounded-2xl overflow-hidden" style={{ background: "var(--paper-50)", border: "1px solid var(--rule)" }}>
      <div className="p-5 space-y-4">

        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--paper-200)", color: "var(--ink-700)" }}>
            {article.source}
          </span>
          <span className="text-xs" style={{ color: "var(--ink-500)" }}>{formatNewsTime(article.publishedAt)}</span>
          {article.controversyScore >= 70 && (
            <span className="ml-auto text-xs font-bold" style={{ color: "var(--civic-red)" }}>🔥 Trending</span>
          )}
        </div>

        {/* Headline */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-70 transition-opacity"
          style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 500, lineHeight: 1.2, letterSpacing: "-0.02em", color: "var(--ink-900)" }}
        >
          {article.title}
        </a>

        {/* Summary */}
        {(article.aiOverview || article.description) && (
          <p className="text-sm leading-relaxed" style={{ color: "var(--ink-700)" }}>
            {article.aiOverview || article.description}
          </p>
        )}

        {/* Perspective rows */}
        {hasPerspectives && (
          <div className="space-y-2">
            <div className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "var(--ink-500)" }}>
              How it's being covered
            </div>
            {leftArticles.map((a, i)  => <PerspectiveRow key={`l${i}`} article={a} side="left"   />)}
            {rightArticles.map((a, i) => <PerspectiveRow key={`r${i}`} article={a} side="right"  />)}
          </div>
        )}

        {/* Reactions + actions */}
        <div className="flex items-center gap-1.5 pt-3 flex-wrap" style={{ borderTop: "1px solid var(--rule)" }}>
          {REACTIONS.map(({ key, emoji, label }) => (
            <button
              key={key}
              onClick={() => handleReaction(key)}
              disabled={!user || reacting}
              title={!user ? "Sign in to react" : label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                border: `1px solid ${myReaction === key ? "var(--ink-900)" : "var(--rule)"}`,
                background: myReaction === key ? "var(--ink-900)" : "transparent",
                color: myReaction === key ? "var(--paper-50)" : "var(--ink-700)",
                opacity: !user || reacting ? 0.4 : 1,
                cursor: !user ? "not-allowed" : "pointer",
              }}
            >
              <span>{emoji}</span>
              <span>{counts[key]}</span>
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-70"
              style={{ border: "1px solid var(--rule)", color: "var(--ink-700)" }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Read
            </a>
            <button
              onClick={() => setShowComments(v => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-70"
              style={{ border: "1px solid var(--rule)", color: "var(--ink-700)" }}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Discuss
              {showComments ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {showComments && (
          <div className="pt-2" style={{ borderTop: "1px solid var(--rule)" }}>
            <CommentSystem articleUrl={articleId} articleTitle={article.title} />
          </div>
        )}
      </div>
    </article>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export function AIFactualNews() {
  const [news, setNews]       = useState<FactualNewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError]     = useState<string | null>(null)
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

  useEffect(() => { loadNews() }, [])

  const filtered = category === "Top stories"
    ? news
    : news.filter(a => CATEGORY_KEYWORDS[category]?.test(`${a.title} ${a.description}`))

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2 mb-6">
          {CATEGORIES.map(c => <div key={c} className="h-8 w-24 rounded-full animate-pulse" style={{ background: "var(--paper-200)" }} />)}
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl p-5 space-y-3 animate-pulse" style={{ background: "var(--paper-50)", border: "1px solid var(--rule)" }}>
            <div className="h-3 w-20 rounded" style={{ background: "var(--paper-200)" }} />
            <div className="h-6 w-5/6 rounded" style={{ background: "var(--paper-200)" }} />
            <div className="h-4 w-full rounded" style={{ background: "var(--paper-200)" }} />
            <div className="h-4 w-4/5 rounded" style={{ background: "var(--paper-200)" }} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Category tabs + refresh */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={{
                border: `1px solid ${category === c ? "var(--ink-900)" : "var(--rule)"}`,
                background: category === c ? "var(--ink-900)" : "transparent",
                color: category === c ? "var(--paper-50)" : "var(--ink-700)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <button
          onClick={() => loadNews(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-70"
          style={{ border: "1px solid var(--rule)", color: "var(--ink-500)" }}
        >
          <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
          {lastUpdated ? `Updated ${formatNewsTime(lastUpdated.toISOString())}` : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="rounded-2xl p-6 text-center text-sm" style={{ background: "var(--paper-50)", border: "1px solid var(--rule)", color: "var(--ink-500)" }}>
          {error}
        </div>
      )}

      {!error && filtered.length === 0 && !loading && (
        <div className="rounded-2xl p-8 text-center text-sm" style={{ background: "var(--paper-50)", border: "1px solid var(--rule)", color: "var(--ink-500)" }}>
          No articles in this category right now.
        </div>
      )}

      {filtered.map((article, i) => (
        <NewsCard key={`${article.url}-${i}`} article={article} />
      ))}
    </div>
  )
}
