"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Loader2,
  ExternalLink,
  MessageCircle,
  ChevronDown,
  ChevronUp,
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
  leftArticles: NewsArticle[]
  rightArticles: NewsArticle[]
  }

export function AIFactualNews() {
  const [news, setNews] = useState<FactualNewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set())

  const toggleComments = (index: number) => {
    setExpandedComments((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const loadNews = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
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
    } catch (err) {
      console.error("Failed to load news:", err)
      setError("Network error occurred")
      setNews([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadNews()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Just the Facts</h3>
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Fetching political news...</span>
          </div>
        </div>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse border-l-4 border-l-primary">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-full mb-2" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Just the Facts</h3>
          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
            Live
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadNews(true)}
            disabled={refreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="py-4 text-center text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Info banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-primary mt-0.5" />
          <div className="text-sm text-foreground">
            <strong>Nonpartisan political reporting:</strong> Each story includes a factual
            overview that objectively summarizes the political issue, followed by directly
            related articles from left-leaning and right-leaning outlets.
          </div>
        </div>
      </div>

      {/* News cards */}
      {news.map((article, i) => {
        const articleId = `facts-${article.title.replace(/\s+/g, "-").toLowerCase().slice(0, 50)}`
        const commentsOpen = expandedComments.has(i)
        const hasLeft = article.leftArticles.length > 0
        const hasRight = article.rightArticles.length > 0

        return (
          <Card key={i} className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {formatNewsTime(article.publishedAt)}
                </span>
                <Badge variant="outline" className="text-xs">
                  {article.source}
                </Badge>
                <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                  Political
                </Badge>
              </div>
              <CardTitle className="text-lg mb-2 text-foreground">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary hover:underline"
                >
                  {article.title}
                </a>
              </CardTitle>
              {/* AI Overview */}
              {article.aiOverview && (
                <div className="mt-3 rounded-lg bg-primary/5 border border-primary/15 p-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                        Overview
                      </span>
                      <p className="text-sm text-foreground mt-1 leading-relaxed">
                        {article.aiOverview}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Perspective Sections */}
              {(hasLeft || hasRight) && (
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Left Perspective */}
                  <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                        Left-Leaning Coverage
                      </Badge>
                    </div>
                    {hasLeft ? (
                      <div className="space-y-2.5">
                        {article.leftArticles.map((link, j) => (
                          <a
                            key={j}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-2 text-sm text-blue-700 hover:text-blue-900 hover:underline transition-colors group"
                          >
                            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            <span className="flex-1 line-clamp-2 leading-snug">
                              {link.title}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[10px] flex-shrink-0 border-blue-200 text-blue-600"
                            >
                              {link.source}
                            </Badge>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No matching coverage found
                      </p>
                    )}
                  </div>

                  {/* Right Perspective */}
                  <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-red-600 hover:bg-red-700 text-white text-xs">
                        Right-Leaning Coverage
                      </Badge>
                    </div>
                    {hasRight ? (
                      <div className="space-y-2.5">
                        {article.rightArticles.map((link, j) => (
                          <a
                            key={j}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-2 text-sm text-red-700 hover:text-red-900 hover:underline transition-colors group"
                          >
                            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            <span className="flex-1 line-clamp-2 leading-snug">
                              {link.title}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[10px] flex-shrink-0 border-red-200 text-red-600"
                            >
                              {link.source}
                            </Badge>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No matching coverage found
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Footer: source link + comment toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    Read Original
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleComments(i)}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">Discussion</span>
                  {commentsOpen ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </Button>
              </div>

              {/* Inline Comments */}
              {commentsOpen && (
                <div className="pt-2">
                  <CommentSystem articleUrl={articleId} articleTitle={article.title} />
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}

      {news.length > 0 && (
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">
            Perspective articles are sourced from real outlets. Always verify important information
            with official sources.
          </p>
        </div>
      )}
    </div>
  )
}
