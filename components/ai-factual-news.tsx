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
  Zap,
  ExternalLink,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { generateFactualNewsAction } from "@/app/actions/generate-news"
import { CommentSystem } from "@/components/comment-system"
import {
  perspectiveArticles,
  getLeftViewpoint,
  getRightViewpoint,
  type PerspectiveArticle,
} from "@/lib/perspective-data"

interface FactualNews {
  title: string
  description: string
  time: string
  trending: boolean
  source: string
  category: "economic" | "political" | "legal" | "scientific" | "international"
  leftViewpoint?: string
  rightViewpoint?: string
  leftArticles?: PerspectiveArticle[]
  rightArticles?: PerspectiveArticle[]
}

export function AIFactualNews() {
  const [news, setNews] = useState<FactualNews[]>([])
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
        const newsWithPerspectives = result.news.map((article: any) => {
          const categoryArticles = perspectiveArticles[article.category] || perspectiveArticles.political
          return {
            ...article,
            leftViewpoint: getLeftViewpoint(article.category),
            rightViewpoint: getRightViewpoint(article.category),
            leftArticles: categoryArticles.left,
            rightArticles: categoryArticles.right,
          }
        })
        setNews(newsWithPerspectives)
        setLastUpdated(new Date())
      } else {
        setError("Unable to generate fresh content")
        setNews(getFallbackNews())
      }
    } catch (error) {
      console.error("Failed to load news:", error)
      setError("Network error occurred")
      setNews(getFallbackNews())
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const getFallbackNews = (): FactualNews[] => {
    return [
      {
        title: "Federal Reserve Maintains Interest Rates at 5.25-5.50%",
        description:
          "The Federal Reserve announced no change to current interest rates following their two-day meeting, citing stable economic indicators.",
        time: "2 hours ago",
        trending: true,
        source: "Federal Reserve",
        category: "economic",
        leftViewpoint: getLeftViewpoint("economic"),
        rightViewpoint: getRightViewpoint("economic"),
        leftArticles: perspectiveArticles.economic.left,
        rightArticles: perspectiveArticles.economic.right,
      },
      {
        title: "Supreme Court Schedules Three Cases for March Oral Arguments",
        description:
          "The Court will hear cases involving digital privacy rights, environmental regulations, and interstate commerce law.",
        time: "4 hours ago",
        trending: false,
        source: "Supreme Court",
        category: "legal",
        leftViewpoint: getLeftViewpoint("legal"),
        rightViewpoint: getRightViewpoint("legal"),
        leftArticles: perspectiveArticles.legal.left,
        rightArticles: perspectiveArticles.legal.right,
      },
      {
        title: "Bureau of Labor Statistics Reports 3.7% Unemployment Rate",
        description:
          "January employment data shows unemployment holding steady with 187,000 new jobs added across various sectors.",
        time: "6 hours ago",
        trending: false,
        source: "Bureau of Labor Statistics",
        category: "economic",
        leftViewpoint: getLeftViewpoint("economic"),
        rightViewpoint: getRightViewpoint("economic"),
        leftArticles: perspectiveArticles.economic.left,
        rightArticles: perspectiveArticles.economic.right,
      },
      {
        title: "NASA Announces Successful Mars Sample Collection Mission",
        description:
          "The Perseverance rover has successfully collected 24 rock samples for future return to Earth, exceeding mission objectives.",
        time: "8 hours ago",
        trending: false,
        source: "NASA",
        category: "scientific",
        leftViewpoint: getLeftViewpoint("scientific"),
        rightViewpoint: getRightViewpoint("scientific"),
        leftArticles: perspectiveArticles.scientific.left,
        rightArticles: perspectiveArticles.scientific.right,
      },
    ]
  }

  useEffect(() => {
    loadNews()
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "economic":
        return "bg-green-100 text-green-800"
      case "political":
        return "bg-blue-100 text-blue-800"
      case "legal":
        return "bg-purple-100 text-purple-800"
      case "scientific":
        return "bg-orange-100 text-orange-800"
      case "international":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

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
            <span className="text-sm text-muted-foreground">Generating factual content...</span>
          </div>
        </div>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse border-l-4 border-l-primary">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
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
            <Zap className="w-3 h-3 mr-1" />
            AI Powered
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
            {refreshing ? "Generating..." : "Refresh"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 mb-4">
          <div className="text-sm text-accent-foreground">
            <strong>Notice:</strong> {error}. Showing available content.
          </div>
        </div>
      )}

      {/* Info banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-primary mt-0.5" />
          <div className="text-sm text-foreground">
            <strong>Objective reporting with perspective links:</strong> Each story presents the
            facts first, then links to articles from left-leaning and right-leaning sources so you
            can explore how each side covers the topic.
          </div>
        </div>
      </div>

      {/* News cards */}
      {news.map((article, i) => {
        const articleId = `facts-${article.title.replace(/\s+/g, "-").toLowerCase().slice(0, 50)}`
        const commentsOpen = expandedComments.has(i)

        return (
          <Card key={i} className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{article.time}</span>
                <Badge variant="outline" className="text-xs">
                  {article.source}
                </Badge>
                <Badge variant="outline" className={`text-xs ${getCategoryColor(article.category)}`}>
                  {article.category}
                </Badge>
                {article.trending && (
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg mb-2 text-foreground">{article.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {article.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Perspective Sections */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Left Perspective */}
                <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                      Left Perspective
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground mb-3">{article.leftViewpoint}</p>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Read from left-leaning sources:
                    </p>
                    {article.leftArticles?.map((link, j) => (
                      <a
                        key={j}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 hover:underline transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        <span className="line-clamp-1">{link.title}</span>
                        <Badge variant="outline" className="text-[10px] flex-shrink-0 ml-auto border-blue-200 text-blue-600">
                          {link.source}
                        </Badge>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Right Perspective */}
                <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-red-600 hover:bg-red-700 text-white text-xs">
                      Right Perspective
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground mb-3">{article.rightViewpoint}</p>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Read from right-leaning sources:
                    </p>
                    {article.rightArticles?.map((link, j) => (
                      <a
                        key={j}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-red-700 hover:text-red-900 hover:underline transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        <span className="line-clamp-1">{link.title}</span>
                        <Badge variant="outline" className="text-[10px] flex-shrink-0 ml-auto border-red-200 text-red-600">
                          {link.source}
                        </Badge>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer: AI badge + comment toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Generated
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Factual Summary
                  </Badge>
                </div>
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

      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground">
          AI-generated content is for informational purposes. Always verify important information
          with official sources.
        </p>
      </div>
    </div>
  )
}
