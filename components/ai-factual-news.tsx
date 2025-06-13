"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, RefreshCw, Sparkles, Loader2, Zap } from "lucide-react"
import { generateFactualNewsAction } from "@/app/actions/generate-news"

interface FactualNews {
  title: string
  description: string
  time: string
  trending: boolean
  source: string
  category: "economic" | "political" | "legal" | "scientific" | "international"
}

export function AIFactualNews() {
  const [news, setNews] = useState<FactualNews[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

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
        setError("Unable to generate fresh content")
        // Fallback to static content
        setNews([
          {
            title: "Federal Reserve Maintains Interest Rates at 5.25-5.50%",
            description:
              "The Federal Reserve announced no change to current interest rates following their two-day meeting, citing stable economic indicators.",
            time: "2 hours ago",
            trending: true,
            source: "Federal Reserve",
            category: "economic",
          },
          {
            title: "Supreme Court Schedules Three Cases for March Oral Arguments",
            description:
              "The Court will hear cases involving digital privacy rights, environmental regulations, and interstate commerce law.",
            time: "4 hours ago",
            trending: false,
            source: "Supreme Court",
            category: "legal",
          },
          {
            title: "Bureau of Labor Statistics Reports 3.7% Unemployment Rate",
            description:
              "January employment data shows unemployment holding steady with 187,000 new jobs added across various sectors.",
            time: "6 hours ago",
            trending: false,
            source: "Bureau of Labor Statistics",
            category: "economic",
          },
          {
            title: "NASA Announces Successful Mars Sample Collection Mission",
            description:
              "The Perseverance rover has successfully collected 24 rock samples for future return to Earth, exceeding mission objectives.",
            time: "8 hours ago",
            trending: false,
            source: "NASA",
            category: "scientific",
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
                <CardDescription className="text-sm text-gray-700">{article.description}</CardDescription>
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
