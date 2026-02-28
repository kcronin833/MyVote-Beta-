"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, RefreshCw, Sparkles, Loader2, Zap, ThumbsUp } from "lucide-react"
import { generateFactualNewsAction } from "@/app/actions/generate-news"

interface FactualNews {
  title: string
  description: string
  time: string
  trending: boolean
  source: string
  category: "economic" | "political" | "legal" | "scientific" | "international"
  leftViewpoint?: string
  rightViewpoint?: string
}

interface ViewpointLike {
  newsId: string
  viewpoint: "left" | "right"
  title: string
  content: string
  timestamp: Date
}

export function AIFactualNews() {
  const [news, setNews] = useState<FactualNews[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [likedViewpoints, setLikedViewpoints] = useState<Set<string>>(new Set())

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
        // Add viewpoints to generated news
        const newsWithViewpoints = result.news.map((article: any, index: number) => ({
          ...article,
          leftViewpoint: getLeftViewpoint(article.title, index),
          rightViewpoint: getRightViewpoint(article.title, index),
        }))
        setNews(newsWithViewpoints)
        setLastUpdated(new Date())
      } else {
        setError("Unable to generate fresh content")
        // Fallback to static content with viewpoints
        setNews([
          {
            title: "Federal Reserve Maintains Interest Rates at 5.25-5.50%",
            description:
              "The Federal Reserve announced no change to current interest rates following their two-day meeting, citing stable economic indicators.",
            time: "2 hours ago",
            trending: true,
            source: "Federal Reserve",
            category: "economic",
            leftViewpoint:
              "Interest rates should be lowered to stimulate economic growth and help working families struggling with high costs of living and housing affordability.",
            rightViewpoint:
              "Maintaining current interest rates is prudent to prevent inflation and ensure economic stability while protecting the value of savings and investments.",
          },
          {
            title: "Supreme Court Schedules Three Cases for March Oral Arguments",
            description:
              "The Court will hear cases involving digital privacy rights, environmental regulations, and interstate commerce law.",
            time: "4 hours ago",
            trending: false,
            source: "Supreme Court",
            category: "legal",
            leftViewpoint:
              "The Court should prioritize protecting individual privacy rights and strengthening environmental protections over corporate interests.",
            rightViewpoint:
              "The Court should focus on constitutional originalism and limiting federal overreach while protecting business rights and state sovereignty.",
          },
          {
            title: "Bureau of Labor Statistics Reports 3.7% Unemployment Rate",
            description:
              "January employment data shows unemployment holding steady with 187,000 new jobs added across various sectors.",
            time: "6 hours ago",
            trending: false,
            source: "Bureau of Labor Statistics",
            category: "economic",
            leftViewpoint:
              "While job numbers look good, we need to focus on wage growth, worker protections, and ensuring these are quality jobs with benefits.",
            rightViewpoint:
              "Strong employment numbers demonstrate the success of pro-business policies and free market principles in creating opportunities.",
          },
          {
            title: "NASA Announces Successful Mars Sample Collection Mission",
            description:
              "The Perseverance rover has successfully collected 24 rock samples for future return to Earth, exceeding mission objectives.",
            time: "8 hours ago",
            trending: false,
            source: "NASA",
            category: "scientific",
            leftViewpoint:
              "Space exploration funding should be increased as it drives innovation, creates jobs, and advances scientific knowledge for humanity's benefit.",
            rightViewpoint:
              "While space achievements are impressive, we should prioritize fiscal responsibility and ensure space spending doesn't exceed practical benefits.",
          },
        ])
      }
    } catch (error) {
      console.error("Failed to load news:", error)
      setError("Network error occurred")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const getLeftViewpoint = (title: string, index: number): string => {
    const leftViewpoints = [
      "Progressive policies and increased government investment are needed to address systemic inequalities and support working families.",
      "We need stronger regulations and oversight to protect consumers and the environment from corporate overreach.",
      "Social programs and public services should be expanded to ensure everyone has access to basic necessities and opportunities.",
      "Climate action and environmental justice must be prioritized to protect future generations and vulnerable communities.",
    ]
    return leftViewpoints[index % leftViewpoints.length]
  }

  const getRightViewpoint = (title: string, index: number): string => {
    const rightViewpoints = [
      "Free market solutions and reduced government intervention will create more opportunities and economic growth for all Americans.",
      "Individual responsibility and limited government are key to preserving freedom and ensuring efficient resource allocation.",
      "Traditional values and constitutional principles should guide policy decisions to maintain social stability and order.",
      "Business-friendly policies and deregulation will drive innovation and create jobs while maintaining American competitiveness.",
    ]
    return rightViewpoints[index % rightViewpoints.length]
  }

  const handleViewpointLike = (newsId: string, viewpoint: "left" | "right", title: string, content: string) => {
    const likeKey = `${newsId}-${viewpoint}`
    const newLikedViewpoints = new Set(likedViewpoints)

    if (likedViewpoints.has(likeKey)) {
      newLikedViewpoints.delete(likeKey)
    } else {
      newLikedViewpoints.add(likeKey)

      // Save to localStorage for profile tracking
      const existingLikes = JSON.parse(localStorage.getItem("viewpointLikes") || "[]")
      const newLike: ViewpointLike = {
        newsId,
        viewpoint,
        title,
        content,
        timestamp: new Date(),
      }
      existingLikes.push(newLike)
      localStorage.setItem("viewpointLikes", JSON.stringify(existingLikes))
    }

    setLikedViewpoints(newLikedViewpoints)
  }

  useEffect(() => {
    loadNews()
    // Load existing likes from localStorage
    const existingLikes = JSON.parse(localStorage.getItem("viewpointLikes") || "[]")
    const likeKeys = existingLikes.map((like: ViewpointLike) => `${like.newsId}-${like.viewpoint}`)
    setLikedViewpoints(new Set(likeKeys))
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
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "economic":
        return "📊"
      case "political":
        return "🏛️"
      case "legal":
        return "⚖️"
      case "scientific":
        return "🔬"
      case "international":
        return "🌍"
      default:
        return "📰"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">AI-Generated Facts</h3>
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-sm text-gray-500">Generating factual content...</span>
          </div>
        </div>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse border-l-4 border-l-blue-400">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">AI-Generated Facts</h3>
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
            <Zap className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && <span className="text-xs text-gray-500">Updated {lastUpdated.toLocaleTimeString()}</span>}
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
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <span className="text-yellow-600">⚠️</span>
            <div className="text-sm text-yellow-800">
              <strong>Notice:</strong> {error}. Showing available content.
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <strong>AI-Generated Content:</strong> These news items are generated using advanced AI to provide
            objective, factual information based on current events and official sources. Content is designed to be
            unbiased and informational.
          </div>
        </div>
      </div>

      {news.map((article, i) => (
        <Card key={i} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-400">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">{article.time}</span>
                  <Badge variant="outline" className="text-xs">
                    {article.source}
                  </Badge>
                  <Badge variant="outline" className={`text-xs ${getCategoryColor(article.category)}`}>
                    {getCategoryIcon(article.category)} {article.category}
                  </Badge>
                  {article.trending && (
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg mb-2 text-gray-900">{article.title}</CardTitle>
                <CardDescription className="text-sm text-gray-700 mb-4">{article.description}</CardDescription>

                {/* Political Viewpoints Section */}
                <div className="space-y-3 mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Political Perspectives:</h4>

                  {/* Left Viewpoint */}
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-300">
                          Left Perspective
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{article.leftViewpoint}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewpointLike(`${i}`, "left", article.title, article.leftViewpoint || "")}
                      className={`flex items-center gap-1 ${
                        likedViewpoints.has(`${i}-left`)
                          ? "text-red-600 bg-red-100"
                          : "text-gray-500 hover:text-red-600"
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-xs">{likedViewpoints.has(`${i}-left`) ? "Liked" : "Like"}</span>
                    </Button>
                  </div>

                  {/* Right Viewpoint */}
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-blue-300">
                          Right Perspective
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{article.rightViewpoint}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewpointLike(`${i}`, "right", article.title, article.rightViewpoint || "")}
                      className={`flex items-center gap-1 ${
                        likedViewpoints.has(`${i}-right`)
                          ? "text-blue-600 bg-blue-100"
                          : "text-gray-500 hover:text-blue-600"
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-xs">{likedViewpoints.has(`${i}-right`) ? "Liked" : "Like"}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Generated
              </Badge>
              <Badge variant="outline" className="text-xs bg-gray-50">
                Factual Summary
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="text-center pt-4">
        <p className="text-xs text-gray-500">
          AI-generated content is for informational purposes. Always verify important information with official sources.
        </p>
      </div>
    </div>
  )
}
