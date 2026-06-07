"use client"

import { useState, useEffect } from "react"
import { RefreshCw, ExternalLink, MessageCircle, ChevronDown, ChevronUp, ThumbsUp, Flame, Zap, CheckCircle, Loader2 } from "lucide-react"
import { CommentSystem } from "@/components/comment-system"
import { formatNewsTime, type NewsArticle } from "@/lib/news-service"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-context"
import { NewsFeedAd } from "@/components/ads/ad-unit"

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

  // Combine all sources into one ordered list
  const allSources = [
    ...article.leftArticles.map(a  => ({ ...a, side: "left"  as const })),
    ...article.rightArticles.map(a => ({ ...a, side: "right" as const })),
  ]

  // Dot position on spectrum (0 = all left, 100 = all right)
  const total = article.leftArticles.length + article.rightArticles.length
  const dotPct = total > 0 ? Math.round((article.rightArticles.length / total) * 100) : 50

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
    <article className="bg-card rounded-2xl border border-rule p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow">

      {/* AI synopsis badge */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-paper-100 text-muted-foreground text-xs rounded-lg border border-rule font-medium">
          <span className="w-2.5 h-2.5 border border-rule rounded-sm flex-shrink-0" />
          AI synopsis
        </span>
        {article.controversyScore >= 70 && (
          <span className="text-xs font-bold text-red-600 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" /> High controversy
          </span>
        )}
      </div>

      {/* Headline */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-[1.15rem] font-bold font-serif leading-snug text-foreground hover:text-ink-900 transition-colors"
      >
        {article.title}
      </a>

      {/* Summary */}
      {(article.aiOverview || article.description) && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {article.aiOverview || article.description}
        </p>
      )}

      {/* Spectrum bar */}
      {total > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-blue-600 font-medium flex items-center gap-1 flex-shrink-0">
            <span className="w-2.5 h-2.5 border border-blue-400 rounded-sm" />
            Left
          </span>
          <div
            className="flex-1 relative h-1.5 rounded-full"
            style={{ background: "linear-gradient(to right, #3b82f6, #9ca3af, #ef4444)" }}
          >
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-gray-900 border-2 border-white shadow-md transition-all"
              style={{ left: `${dotPct}%` }}
            />
          </div>
          <span className="text-xs text-red-600 font-medium flex items-center gap-1 flex-shrink-0">
            Right
            <span className="w-2.5 h-2.5 border border-red-400 rounded-sm" />
          </span>
        </div>
      )}

      {/* Source cards — horizontal scroll */}
      {allSources.length > 0 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {allSources.map((src, i) => {
            const lean = getSourceLean(src.source, src.side)
            return (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-44 border border-rule rounded-xl p-3 hover:bg-paper-50 hover:border-rule transition-colors"
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-xs font-bold text-foreground truncate">{src.source}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${lean.badge}`}>
                    {lean.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{src.title}</p>
                <p className="text-[10px] text-ink-400 mt-2">{formatNewsTime(src.publishedAt)}</p>
              </a>
            )
          })}
        </div>
      )}

      {/* Reactions + actions */}
      <div className="flex items-center gap-1.5 pt-3 border-t border-rule flex-wrap">
        {REACTIONS.map(({ key, emoji, label }) => (
          <button
            key={key}
            onClick={() => handleReaction(key)}
            disabled={!user || reacting}
            title={!user ? "Sign in to react" : label}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              myReaction === key
                ? "bg-gray-900 text-white border-gray-900"
                : "border-rule text-muted-foreground hover:border-rule hover:text-foreground"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-rule text-muted-foreground hover:border-rule hover:text-foreground transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Read
          </a>
          <button
            onClick={() => setShowComments(v => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-rule text-muted-foreground hover:border-rule hover:text-foreground transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Discuss
            {showComments ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {showComments && (
        <div className="pt-2 border-t border-rule">
          <CommentSystem articleUrl={articleId} articleTitle={article.title} />
        </div>
      )}
    </article>
  )
}

export function AIFactualNews() {
  const [news, setNews]         = useState<FactualNewsItem[]>([])
  const [loading, setLoading]   = useState(true)
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

  useEffect(() => { loadNews() }, [])

  const filtered = category === "Top stories"
    ? news
    : news.filter(a => CATEGORY_KEYWORDS[category]?.test(`${a.title} ${a.description}`))

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2 mb-6">
          {CATEGORIES.map(c => (
            <div key={c} className="h-8 w-24 rounded-full bg-paper-200 animate-pulse" />
          ))}
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-2xl border border-rule p-5 space-y-3 animate-pulse">
            <div className="h-3 w-20 bg-paper-200 rounded" />
            <div className="h-6 w-5/6 bg-paper-200 rounded" />
            <div className="h-4 w-full bg-paper-100 rounded" />
            <div className="h-4 w-4/5 bg-paper-100 rounded" />
            <div className="h-2 w-full bg-paper-200 rounded-full" />
            <div className="flex gap-2">
              {[...Array(3)].map((_, j) => <div key={j} className="h-24 w-44 bg-paper-100 rounded-xl flex-shrink-0" />)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Category tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${
                category === c
                  ? "bg-gray-900 text-white border-gray-900"
                  : "border-rule text-muted-foreground hover:bg-paper-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-ink-400 hidden sm:block">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => loadNews(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-rule text-muted-foreground hover:border-rule transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div className="py-16 text-center text-ink-400 space-y-2">
          <p className="text-sm">{error}</p>
          <button onClick={() => loadNews(true)} className="text-xs text-ink-900 underline">
            Try again
          </button>
        </div>
      )}

      {filtered.length === 0 && !error && !loading && (
        <div className="py-16 text-center text-ink-400 text-sm">
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
        <p className="text-center text-xs text-ink-400 pt-2 pb-4">
          Coverage sourced from real outlets across the political spectrum. Always verify with official sources.
        </p>
      )}
    </div>
  )
}
