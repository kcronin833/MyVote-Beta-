"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Search,
  Loader2,
  ExternalLink,
  MessageCircle,
  Heart,
  Newspaper,
  Users,
  CheckCircle,
  Sparkles,
} from "lucide-react"
import { SearchService, type SearchResult } from "@/lib/search-service"
import { mockUsers } from "@/lib/mock-data"
import { formatDistanceToNow } from "date-fns"
import { Logo } from "@/components/logo"

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    if (query) {
      performSearch()
    }
  }, [query])

  const performSearch = async () => {
    setLoading(true)
    try {
      const searchResults = await SearchService.searchAll(query, {
        type: activeTab === "all" ? undefined : [activeTab],
        category: categoryFilter === "all" ? undefined : [categoryFilter],
      })
      setResults(searchResults)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (query) {
      performSearch()
    }
  }, [activeTab, categoryFilter])

  const filteredResults = results.filter((result) => {
    if (activeTab === "all") return true
    return result.type === activeTab
  })

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case "relevance":
        return b.relevanceScore - a.relevanceScore
      case "date":
        if (!a.timestamp || !b.timestamp) return 0
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      case "alphabetical":
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const getResultCounts = () => {
    const counts = {
      all: results.length,
      news: results.filter((r) => r.type === "news").length,
      representative: results.filter((r) => r.type === "representative").length,
      user: results.filter((r) => r.type === "user").length,
      comment: results.filter((r) => r.type === "comment").length,
      factual: results.filter((r) => r.type === "factual").length,
    }
    return counts
  }

  const renderResult = (result: SearchResult) => {
    switch (result.type) {
      case "news":
        return (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Newspaper className="w-4 h-4 text-teal-600" />
                    <Badge variant="outline" className="text-xs">
                      News Article
                    </Badge>
                    {result.source && (
                      <Badge variant="outline" className="text-xs">
                        {result.source}
                      </Badge>
                    )}
                    {result.category && (
                      <Badge variant="secondary" className="text-xs">
                        {result.category}
                      </Badge>
                    )}
                    {result.timestamp && (
                      <span className="text-xs text-ink-500">
                        {formatDistanceToNow(new Date(result.timestamp), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg mb-2">
                    {result.url ? (
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-teal-600 hover:underline"
                      >
                        {result.title}
                      </a>
                    ) : (
                      result.title
                    )}
                  </CardTitle>
                  <CardDescription>{result.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            {result.url && (
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <a href={result.url} target="_blank" rel="noopener noreferrer">
                    Read Article <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              </CardContent>
            )}
          </Card>
        )

      case "representative":
        return (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="bg-teal-100 p-2 rounded-full">
                  <Users className="w-5 h-5 text-teal-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      Representative
                    </Badge>
                    {result.metadata?.party && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          result.metadata.party === "Democrat"
                            ? "bg-blue-100 text-blue-800"
                            : result.metadata.party === "Republican"
                              ? "bg-red-100 text-red-800"
                              : "bg-paper-200 text-ink-700"
                        }`}
                      >
                        {result.metadata.party}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mb-1">{result.title}</CardTitle>
                  <CardDescription className="mb-2">{result.description}</CardDescription>
                  {result.metadata?.location && <p className="text-sm text-ink-700">{result.metadata.location}</p>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  View Political Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        )

      case "user":
        const user = mockUsers.find((u) => u.id === result.id)
        return (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {result.title
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      User
                    </Badge>
                    {user?.verified && <CheckCircle className="w-4 h-4 text-teal-500" />}
                    {result.category && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          result.category === "left"
                            ? "bg-blue-100 text-blue-800"
                            : result.category === "right"
                              ? "bg-red-100 text-red-800"
                              : "bg-paper-200 text-ink-700"
                        }`}
                      >
                        {result.category === "center" ? "Moderate" : result.category}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mb-1">{result.title}</CardTitle>
                  <p className="text-sm text-ink-700 mb-1">{result.metadata?.author}</p>
                  <CardDescription>{result.description}</CardDescription>
                  {result.metadata?.location && (
                    <p className="text-sm text-ink-500 mt-1">{result.metadata.location}</p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href={`/profile/${user?.username}`}>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        )

      case "comment":
        const commentUser = mockUsers.find((u) => u.displayName === result.metadata?.author)
        return (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-teal-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      Comment
                    </Badge>
                    {result.timestamp && (
                      <span className="text-xs text-ink-500">
                        {formatDistanceToNow(new Date(result.timestamp), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg mb-2">{result.title}</CardTitle>
                  <CardDescription className="mb-2">{result.description}</CardDescription>
                  <div className="flex items-center gap-4 text-sm text-ink-700">
                    <span>By {result.metadata?.author}</span>
                    {result.metadata?.likes && (
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {result.metadata.likes}
                      </div>
                    )}
                    {result.metadata?.replies && (
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {result.metadata.replies}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            {result.url && (
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <a href={result.url} target="_blank" rel="noopener noreferrer">
                    View Article <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              </CardContent>
            )}
          </Card>
        )

      case "factual":
        return (
          <Card key={result.id} className="hover:shadow-md transition-shadow border-l-4 border-l-teal-400">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <Badge variant="outline" className="text-xs bg-teal-100 text-teal-700">
                      AI Generated
                    </Badge>
                    {result.source && (
                      <Badge variant="outline" className="text-xs">
                        {result.source}
                      </Badge>
                    )}
                    {result.category && (
                      <Badge variant="secondary" className="text-xs">
                        {result.category}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mb-2">{result.title}</CardTitle>
                  <CardDescription>{result.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-xs bg-paper-100">
                Factual Summary
              </Badge>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  const counts = getResultCounts()

  if (!query) {
    return (
      <div className="text-center py-12">
        <Search className="w-12 h-12 text-ink-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Search MyVote</h2>
        <p className="text-ink-700">Enter a search term to find news, representatives, users, and more.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Search Results</h1>
          <p className="text-ink-700">{loading ? "Searching..." : `${results.length} results for "${query}"`}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="date">Most Recent</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters and Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="news">News ({counts.news})</TabsTrigger>
          <TabsTrigger value="factual">Facts ({counts.factual})</TabsTrigger>
          <TabsTrigger value="representative">Reps ({counts.representative})</TabsTrigger>
          <TabsTrigger value="user">Users ({counts.user})</TabsTrigger>
          <TabsTrigger value="comment">Comments ({counts.comment})</TabsTrigger>
        </TabsList>

        {/* Results */}
        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              <span className="ml-2 text-ink-700">Searching...</span>
            </div>
          ) : sortedResults.length > 0 ? (
            <div className="space-y-4">{sortedResults.map(renderResult)}</div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-ink-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
              <p className="text-ink-700">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <Logo size="sm" className="mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              </div>
            }
          >
            <SearchResults />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
