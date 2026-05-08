"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  RefreshCw,
  Sparkles,
  Loader2,
  ExternalLink,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Flame,
  AlertCircle,
  HelpCircle,
} from "lucide-react"
import { generateFactualNewsAction } from "@/app/actions/generate-news"
import { CommentSystem } from "@/components/comment-system"
import { formatNewsTime, type NewsArticle } from "@/lib/news-service"

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

const REACTIONS: { key: Reaction; icon: React.ReactNode; label: string; activeClass: string }[] = [
  { key: "important", icon: <ThumbsUp className="w-3.5 h-3.5" />, label: "Important", activeClass: "bg-blue-100 text-blue-700 border-blue-300" },
  { key: "outraged", icon: <Flame className="w-3.5 h-3.5" />, label: "Outraged", activeClass: "bg-red-100 text-red-700 border-red-300" },
  { key: "surprising", icon: <HelpCircle className="w-3.5 h-3.5" />, label: "Surprising", activeClass: "bg-purple-100 text-purple-700 border-purple-300" },
  { key: "factual", icon: <AlertCircle className="w-3.5 h-3.5" />, label: "Factual", activeClass: "bg-green-100 text-green-700 border-green-300" },
]

function CoverageBar({ leftCount, rightCount }: { leftCount: number; rightCount: number }) {
  const total = leftCount + rightCount
  if (total === 0) return null
  const leftPct = Math.round((leftCount / total) * 100)
  const rightPct = 100 - leftPct
  const bothSides = leftCount > 0 && rightCount > 0

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-blue-600">{leftCount} left-leaning</span>
        {bothSides && (
          <span className="text-green-600 text-[10px] font-semibold tracking-wide uppercase">
            Cross-spectrum coverage
          </span>
        )}
        <span className="text-red-600">{rightCount} right-leaning</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden flex bg-muted/60 gap-px">
        {leftCount > 0 && (
          <div
            className="bg-blue-500 h-full rounded-l-full transition-all"
            style={{ width: `${leftPct}%` }}
          />
        )}
        {rightCount > 0 && (
          <div
            className="bg-red-500 h-full rounded-r-full transition-all"
            style={{ width: `${rightPct}%` }}
          />
        )}
      </div>
    </div>
  )
}

function ArticleLink({ article, side }: { article: NewsArticle; side: "left" | "right" }) {
  const colorClass = side === "left"
    ? "text-blue-700 hover:text-blue-900"
    : "text-red-700 hover:text-red-900"
  const badgeClass = side === "left"
    ? "border-blue-200 text-blue-600"
    : "border-red-200 text-red-600"

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-start gap-2 text-sm ${colorClass} hover:underline transition-colors`}
    >
      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 opacity-70" />
      <span className="flex-1 line-clamp-2 leading-snug">{article.title}</span>
      <Badge variant="outline" className={`text-[10px] flex-shrink-0 ${badgeClass}`}>
        {article.source}
      </Badge>
    </a>
  )
}

function NewsCard({ article, index }: { article: FactualNewsItem; index: number }) {
  const [reactions, setReactions] = useState<Record<Reaction, number>>({
    important: Math.floor(Math.random() * 40) + 5,
    outraged: Math.floor(Math.random() * 25),
    surprising: Math.floor(Math.random() * 15),
    factual: Math.floor(Math.random() * 30) + 3,
  })
  const [myReaction, setMyReaction] = useState<Reaction | null>(null)
  const [showComments, setShowComments] = useState(false)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)
  const [imgError, setImgError] = useState(false)

  const articleId = `facts-${article.title.replace(/\s+/g, "-").toLowerCase().slice(0, 50)}`
  const hasLeft = article.leftArticles.length > 0
  const hasRight = article.rightArticles.length > 0

  function handleReaction(key: Reaction) {
    setReactions((prev) => {
      const next = { ...prev }
      if (myReaction === key) {
        next[key] = Math.max(0, next[key] - 1)
        setMyReaction(null)
      } else {
        if (myReaction) next[myReaction] = Math.max(0, next[myReaction] - 1)
        next[key] = next[key] + 1
        setMyReaction(key)
      }
      return next
    })
  }

  return (
    <article className="bg-white dark:bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
      {/* Hero Image */}
      {article.urlToImage && !imgError && (
        <div className="relative w-full aspect-[16/7] overflow-hidden bg-muted">
          <img
            src={article.urlToImage}
            alt=""
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {/* Controversy badge overlaid on image */}
          <div className="absolute bottom-3 left-3">
            {article.controversyScore >= 70 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                🔥 High Controversy
              </span>
            )}
            {article.controversyScore >= 40 && article.controversyScore < 70 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                ⚡ Contested
              </span>
            )}
          </div>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Source + Time row */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs font-semibold">
            {article.source}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatNewsTime(article.publishedAt)}
          </span>
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 ml-auto">
            Political
          </Badge>
        </div>

        {/* Headline */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-lg font-bold leading-snug text-foreground hover:text-primary hover:underline transition-colors"
        >
          {article.title}
        </a>

        {/* Coverage bar */}
        <CoverageBar
          leftCount={article.leftArticles.length}
          rightCount={article.rightArticles.length}
        />

        {/* AI Overview */}
        {article.aiOverview && (
          <div className="rounded-xl bg-primary/5 border border-primary/15 p-3">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  Factual Overview
                </span>
                <p className="text-sm text-foreground mt-1 leading-relaxed">
                  {article.aiOverview}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Perspective toggles */}
        {(hasLeft || hasRight) && (
          <div className="space-y-2">
            {hasLeft && (
              <div>
                <button
                  onClick={() => setShowLeft((v) => !v)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Left-leaning coverage ({article.leftArticles.length})
                  </span>
                  {showLeft ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showLeft && (
                  <div className="mt-2 pl-3 space-y-2.5 border-l-2 border-blue-200">
                    {article.leftArticles.map((a, j) => (
                      <ArticleLink key={j} article={a} side="left" />
                    ))}
                  </div>
                )}
              </div>
            )}
            {hasRight && (
              <div>
                <button
                  onClick={() => setShowRight((v) => !v)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Right-leaning coverage ({article.rightArticles.length})
                  </span>
                  {showRight ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showRight && (
                  <div className="mt-2 pl-3 space-y-2.5 border-l-2 border-red-200">
                    {article.rightArticles.map((a, j) => (
                      <ArticleLink key={j} article={a} side="right" />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Reactions + Actions bar */}
        <div className="flex items-center gap-1 pt-1 flex-wrap border-t border-border">
          {REACTIONS.map(({ key, icon, label, activeClass }) => (
            <button
              key={key}
              onClick={() => handleReaction(key)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                myReaction === key
                  ? activeClass
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {icon}
              <span>{reactions[key]}</span>
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-xs text-muted-foreground h-8 px-2"
            >
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
            <button
              onClick={() => setShowComments((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Discuss
              {showComments ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="pt-2 border-t border-border">
            <CommentSystem articleUrl={articleId} articleTitle={article.title} />
          </div>
        )}
      </div>
    </article>
  )
}

export function AIFactualNews() {
  const [news, setNews] = useState<FactualNewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadNews = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)

    try {
      const result = await generateFactualNewsAction()
      if (result.success && result.news.length > 0) {
        setNews(result.news)
        setLastUpdated(new Date())
      } else {
        setError(result.error || "Unable to load news")
        setNews([])
      }
    } catch {
      setError("Network error occurred")
      setNews([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { loadNews() }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Just the Facts</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Fetching news...
          </div>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border overflow-hidden animate-pulse">
            <div className="w-full aspect-[16/7] bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-muted rounded w-1/3" />
              <div className="h-5 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/6" />
              <div className="h-2 bg-muted rounded-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Just the Facts</h3>
          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
            Live
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground hidden sm:block">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadNews(true)}
            disabled={refreshing}
            className="gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive text-center">
          {error}
        </div>
      )}

      {/* Cards */}
      {news.map((article, i) => (
        <NewsCard key={i} article={article} index={i} />
      ))}

      {news.length > 0 && (
        <p className="text-center text-xs text-muted-foreground pt-2">
          Coverage sourced from real outlets. Always verify with official sources.
        </p>
      )}
    </div>
  )
}
