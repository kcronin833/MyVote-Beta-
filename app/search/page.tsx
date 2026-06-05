"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Search,
  Loader2,
  MessageCircle,
  Users,
  MapPin,
  ArrowRight,
} from "lucide-react"
import { SearchService, type SearchResult } from "@/lib/search-service"
import { formatDistanceToNow } from "date-fns"
import { Logo } from "@/components/logo"

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")

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
  }, [activeTab])

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
    return {
      all: results.length,
      candidate: results.filter((r) => r.type === "candidate").length,
      county: results.filter((r) => r.type === "county").length,
      post: results.filter((r) => r.type === "post").length,
    }
  }

  const renderResult = (result: SearchResult) => {
    switch (result.type) {
      case "candidate":
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
                      Candidate
                    </Badge>
                    {result.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {result.badge}
                      </Badge>
                    )}
                    {result.meta && (
                      <Badge variant="outline" className="text-xs">
                        {result.meta}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mb-1">{result.title}</CardTitle>
                  <CardDescription>{result.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            {result.url && (
              <CardContent>
                <Link href={result.url}>
                  <Button variant="outline" size="sm">
                    View candidate <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            )}
          </Card>
        )

      case "county":
        return (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="bg-teal-100 p-2 rounded-full">
                  <MapPin className="w-5 h-5 text-teal-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      County ballot
                    </Badge>
                    {result.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {result.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mb-1">{result.title}</CardTitle>
                  <CardDescription>{result.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            {result.url && (
              <CardContent>
                <Link href={result.url}>
                  <Button variant="outline" size="sm">
                    View ballot <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            )}
          </Card>
        )

      case "post":
        return (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-teal-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      Community post
                    </Badge>
                    {result.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {result.badge}
                      </Badge>
                    )}
                    {result.timestamp && (
                      <span className="text-xs text-ink-500">
                        {formatDistanceToNow(new Date(result.timestamp), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-base mb-1">{result.title}</CardTitle>
                  {result.meta && <p className="text-sm text-ink-700">{result.meta}</p>}
                </div>
              </div>
            </CardHeader>
            {result.url && (
              <CardContent>
                <Link href={result.url}>
                  <Button variant="outline" size="sm">
                    View author <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            )}
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
        <p className="text-ink-700">Find Georgia 2026 candidates, your county ballot, and community posts.</p>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="candidate">Candidates ({counts.candidate})</TabsTrigger>
          <TabsTrigger value="county">Counties ({counts.county})</TabsTrigger>
          <TabsTrigger value="post">Posts ({counts.post})</TabsTrigger>
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
