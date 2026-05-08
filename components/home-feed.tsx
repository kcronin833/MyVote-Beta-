"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ExternalLink,
  Clock,
  MapPin,
  Globe,
  Newspaper,
  Users,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { formatNewsTime } from "@/lib/news-service"
import { getFriendsComments, type FriendComment } from "@/lib/friends-service"
import { CommentSystem } from "@/components/comment-system"
import { AIFactualNews } from "@/components/ai-factual-news"

interface Article {
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  urlToImage: string | null
}

interface GeoLocation {
  city: string
  region: string
  country: string
}

function ArticleCard({ article }: { article: Article }) {
  const [showComments, setShowComments] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <article className="bg-white dark:bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
      {article.urlToImage && !imgError && (
        <div className="relative w-full aspect-[16/7] overflow-hidden bg-muted">
          <img
            src={article.urlToImage}
            alt=""
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      )}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs font-semibold">
            {article.source}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatNewsTime(article.publishedAt)}
          </span>
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-base font-bold leading-snug text-foreground hover:text-primary hover:underline transition-colors"
        >
          {article.title}
        </a>
        {article.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {article.description}
          </p>
        )}
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground px-2">
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              Read Article <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </Button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Discuss
            {showComments ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
        {showComments && (
          <div className="pt-2 border-t border-border">
            <CommentSystem articleUrl={article.url} articleTitle={article.title} />
          </div>
        )}
      </div>
    </article>
  )
}

function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border overflow-hidden animate-pulse">
          <div className="w-full aspect-[16/7] bg-muted" />
          <div className="p-4 space-y-3">
            <div className="h-3 bg-muted rounded w-1/3" />
            <div className="h-5 bg-muted rounded w-5/6" />
            <div className="h-3 bg-muted rounded w-4/6" />
          </div>
        </div>
      ))}
    </div>
  )
}

// --- LOCAL GEORGIA NEWS SECTION ---
function LocalNewsSection({ location }: { location: GeoLocation | null }) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!location) return
    setLoading(true)
    fetch(`/api/news?perspective=local&location=${encodeURIComponent(`${location.city}, ${location.region}`)}`)
      .then((r) => r.json())
      .then((d) => setArticles((d.articles || []) as Article[]))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false))
  }, [location])

  if (!location) return null

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-green-600" />
        <h2 className="text-lg font-semibold text-foreground">Local Georgia News</h2>
        <Badge variant="secondary" className="text-xs">
          {location.city}, {location.region}
        </Badge>
      </div>

      {loading && <LoadingSkeleton count={3} />}

      {!loading && articles.length === 0 && (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            <Newspaper className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No local news found right now. Check back soon.</p>
          </CardContent>
        </Card>
      )}

      {!loading && articles.length > 0 && (
        <div className="grid gap-3">
          {articles.map((article, i) => (
            <ArticleCard key={`${article.url}-${i}`} article={article} />
          ))}
        </div>
      )}
    </section>
  )
}

// --- NATIONAL NEWS SECTION (topic-grouped with perspectives) ---
function NationalNewsSection() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">National Political News</h2>
        <Badge variant="secondary" className="text-xs">Left & Right Perspectives</Badge>
      </div>
      <AIFactualNews />
    </section>
  )
}

// --- FRIENDS ACTIVITY SECTION ---
function FriendsActivitySection() {
  const { user } = useAuth()
  const [comments, setComments] = useState<FriendComment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false)
        return
      }
      try {
        const data = await getFriendsComments(user.id)
        setComments(data)
      } catch {
        setComments([])
      }
      setLoading(false)
    }
    load()
  }, [user])

  if (!user) return null

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-amber-500" />
        <h2 className="text-lg font-semibold text-foreground">Friends' Activity</h2>
      </div>

      {loading && <LoadingSkeleton count={2} />}

      {!loading && comments.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium mb-1">No activity yet</p>
            <p className="text-xs">
              Follow other users to see their comments and discussions here.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && comments.length > 0 && (
        <div className="grid gap-3">
          {comments.map((comment) => {
            const profile = comment.profile
            const leanColor =
              profile?.political_lean === "left"
                ? "text-blue-600"
                : profile?.political_lean === "right"
                  ? "text-red-600"
                  : "text-muted-foreground"

            return (
              <Card key={comment.id} className="border-border">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-sm font-semibold text-muted-foreground">
                      {profile?.display_name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">
                          {profile?.display_name || "Unknown"}
                        </span>
                        <span className={`text-xs font-medium ${leanColor}`}>
                          @{profile?.username}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatNewsTime(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mt-1">{comment.content}</p>
                      {comment.article_title && (
                        <a
                          href={comment.article_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 text-xs text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          {comment.article_title.length > 80
                            ? comment.article_title.slice(0, 80) + "..."
                            : comment.article_title}
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </section>
  )
}

// --- MAIN HOME FEED ---
export function HomeFeed() {
  const [location, setLocation] = useState<GeoLocation | null>(null)

  useEffect(() => {
    async function detectLocation() {
      try {
        const res = await fetch("/api/geolocation")
        if (res.ok) {
          const data = await res.json()
          setLocation(data)
        }
      } catch {
        // Fallback handled by the API route
        setLocation({ city: "Atlanta", region: "Georgia", country: "US" })
      }
    }
    detectLocation()
  }, [])

  return (
    <div className="space-y-10">
      <NationalNewsSection />
      <LocalNewsSection location={location} />
      <FriendsActivitySection />
    </div>
  )
}
