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
  ThumbsUp,
  Heart,
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

// --- COMMON GROUND STORY CARD ---
const COMMON_GROUND_STORIES = [
  {
    id: "cg-1",
    headline: "Most Georgians agree: infrastructure investment is overdue",
    summary:
      "Across party lines, Georgia voters rank roads, bridges, and broadband as a top priority. A recent survey found 74% support for increased infrastructure spending regardless of political affiliation.",
    source: "Georgia Policy Institute",
    publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: "cg-2",
    headline: "Bipartisan support grows for expanded rural healthcare access",
    summary:
      "Rural Georgians from both parties express concern about hospital closures. Lawmakers in both chambers have co-sponsored bills aimed at keeping rural emergency services funded.",
    source: "Atlanta Journal-Constitution",
    publishedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
  {
    id: "cg-3",
    headline: "Georgia parents united on school safety — divided on solutions",
    summary:
      "While 89% of Georgia parents say school safety is a top concern, proposals range from mental health funding to stricter access controls. The shared urgency has opened rare cross-aisle dialogue.",
    source: "Georgia Public Broadcasting",
    publishedAt: new Date(Date.now() - 9 * 3600000).toISOString(),
  },
]

function CommonGroundCard() {
  const story = COMMON_GROUND_STORIES[new Date().getDate() % COMMON_GROUND_STORIES.length]
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(47)
  const [showComments, setShowComments] = useState(false)

  return (
    <div className="bg-white rounded-2xl border border-teal-200 shadow-sm overflow-hidden">
      <div className="bg-teal-50 px-4 pt-4 pb-3 border-b border-teal-100">
        <Badge className="bg-teal-600 text-white text-xs mb-2">Common ground</Badge>
        <h3 className="font-bold text-foreground text-base leading-snug">{story.headline}</h3>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">{story.summary}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">{story.source}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatNewsTime(story.publishedAt)}
          </span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-border">
          <button
            onClick={() => {
              setLiked(!liked)
              setLikeCount((c) => (liked ? c - 1 : c + 1))
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              liked
                ? "bg-teal-50 border-teal-400 text-teal-700"
                : "border-border text-muted-foreground hover:border-teal-300 hover:text-teal-600"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? "fill-teal-500 text-teal-500" : ""}`} />
            {likeCount}
          </button>
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
            <CommentSystem articleUrl={`/common-ground/${story.id}`} articleTitle={story.headline} />
          </div>
        )}
      </div>
    </div>
  )
}

// --- YOUR NETWORK SECTION ---
function YourNetworkSection() {
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
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-amber-500" />
        <h2 className="text-sm font-semibold text-foreground">Your network</h2>
      </div>

      {loading && <LoadingSkeleton count={2} />}

      {!loading && comments.length === 0 && (
        <Card className="border-border">
          <CardContent className="py-6 text-center text-muted-foreground">
            <Users className="w-7 h-7 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium mb-1">No activity yet</p>
            <p className="text-xs">Follow other users to see their comments and discussions here.</p>
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

// --- LOCAL NEWS SECTION ---
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

  const cityLabel = location.city === location.region ? location.region : `${location.city}`

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-green-600" />
        <h2 className="text-sm font-semibold text-foreground">Local</h2>
        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
          Local · {cityLabel}
        </Badge>
      </div>

      {loading && <LoadingSkeleton count={3} />}

      {!loading && articles.length === 0 && (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            <Newspaper className="w-7 h-7 mx-auto mb-2 opacity-40" />
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

// --- LEFT & RIGHT PERSPECTIVES SECTION ---
function PerspectivesSection() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Globe className="w-4 h-4 text-purple-600" />
        <h2 className="text-sm font-semibold text-foreground">Left & right perspectives</h2>
        <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
          National
        </Badge>
      </div>
      <AIFactualNews />
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
        setLocation({ city: "Atlanta", region: "Georgia", country: "US" })
      }
    }
    detectLocation()
  }, [])

  return (
    <div className="space-y-6">
      <CommonGroundCard />
      <YourNetworkSection />
      <LocalNewsSection location={location} />
      <PerspectivesSection />
    </div>
  )
}
