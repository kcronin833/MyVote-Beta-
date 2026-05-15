"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
  Heart,
  Compass,
  CalendarDays,
  Vote,
} from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { formatNewsTime } from "@/lib/news-service"
import { getFriendsComments, type FriendComment } from "@/lib/friends-service"
import { CommentSystem } from "@/components/comment-system"
import { PostComposer } from "@/components/post-composer"
import { PostCard, type PostData } from "@/components/post-card"
import { UserAvatar } from "@/components/user-avatar"
import { SuggestedNeighbors } from "@/components/suggested-neighbors"
import { createClient } from "@/lib/supabase/client"

interface Article {
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  urlToImage: string | null
}

function SectionHeader({
  icon,
  eyebrow,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  eyebrow: string
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl"
          style={{
            background: "rgba(255,253,248,0.78)",
            border: "1px solid var(--rule)",
            color: "var(--civic-blue)",
          }}
        >
          {icon}
        </div>
        <div>
          <div
            className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "var(--ink-500)" }}
          >
            {eyebrow}
          </div>
          <h2 className="text-xl font-semibold leading-tight" style={{ color: "var(--ink-900)" }}>
            {title}
          </h2>
          {description && (
            <p className="mt-1 max-w-xl text-sm leading-relaxed" style={{ color: "var(--ink-500)" }}>
              {description}
            </p>
          )}
        </div>
      </div>
      {action}
    </div>
  )
}

function FeedNavigation({ city }: { city: string | null }) {
  const quickLinks = [
    { href: "#conversation", label: "Conversation", icon: MessageCircle },
    { href: "#local", label: city ? city : "Local", icon: MapPin },
    { href: "#neighbors", label: "Neighbors", icon: Users },
    { href: "/elections", label: "Elections", icon: Vote },
    { href: "/news/spectrum", label: "News", icon: Newspaper },
  ]

  return (
    <div className="sticky top-0 z-30 -mx-4 mb-5 px-4 pt-1 pb-3 backdrop-blur-xl lg:top-3 lg:rounded-[1.5rem]">
      <div className="community-card rounded-[1.35rem] p-3">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--ink-500)" }}>
              Navigate MyVote
            </div>
            <div className="text-sm font-semibold" style={{ color: "var(--ink-900)" }}>
              Jump into the local civic loop
            </div>
          </div>
          <Link href="/elections" className="hidden rounded-full px-4 py-2 text-xs font-semibold sm:inline-flex primary-action">
            View ballot
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(255,253,248,0.72)",
                border: "1px solid var(--rule)",
                color: "var(--ink-700)",
              }}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function ArticleCard({ article }: { article: Article }) {
  const [showComments, setShowComments] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <article className="community-card overflow-hidden rounded-[1.35rem] transition-all hover:-translate-y-0.5 hover:shadow-lg">
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
        <div key={i} className="community-card rounded-[1.35rem] overflow-hidden animate-pulse">
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
    <section id="common-ground" className="scroll-mt-32">
      <SectionHeader
        icon={<Heart className="h-5 w-5" />}
        eyebrow="Common ground"
        title="Places people already agree"
        description="A calmer on-ramp into political conversation: start with shared concerns, then discuss solutions."
      />
      <div className="community-card rounded-[1.35rem] overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "var(--rule)", background: "rgba(36,133,111,0.08)" }}>
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
    </section>
  )
}

function CommunityPostsSection() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<PostData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from("posts")
        .select("*, profile:profiles(display_name, username, avatar_url)")
        .order("created_at", { ascending: false })
        .limit(20)
      setPosts((data as PostData[]) || [])
      setLoading(false)
    }
    load()
  }, [])

  function handleNewPost(post: PostData) {
    setPosts((prev) => [post, ...prev])
  }

  return (
    <section id="conversation" className="scroll-mt-32 space-y-3">
      <SectionHeader
        icon={<MessageCircle className="h-5 w-5" />}
        eyebrow="Conversation"
        title="What your community is saying"
        description="Post, respond, and follow the local issues people are already talking about."
      />
      {user && <PostComposer onPost={handleNewPost} />}
      {loading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="community-card rounded-[1.35rem] p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                  <div className="h-3 bg-muted rounded w-4/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && posts.length > 0 && (
        <div className="space-y-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
      {!loading && posts.length === 0 && (
        <div className="community-card rounded-[1.35rem] p-5 text-sm" style={{ color: "var(--ink-500)" }}>
          Be the first to start a local conversation. Ask about a city meeting, a candidate, a ballot issue, or something happening in your neighborhood.
        </div>
      )}
    </section>
  )
}

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
    <section id="neighbors" className="scroll-mt-32">
      <SectionHeader
        icon={<Users className="h-5 w-5" />}
        eyebrow="Neighbors"
        title="Your local network"
        description="Follow nearby voters and see the conversations your civic circle is joining."
      />

      {loading && <LoadingSkeleton count={2} />}

      {!loading && comments.length === 0 && (
        <Card className="community-card border-0">
          <CardContent className="py-5 space-y-3">
            <p className="text-sm font-semibold text-foreground text-center">
              Start by following your neighbors
            </p>
            <SuggestedNeighbors limit={3} showHeader={false} showSeeAll />
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
              <Card key={comment.id} className="community-card border-0">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <UserAvatar avatarUrl={profile?.avatar_url} displayName={profile?.display_name} size="sm" />
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

function LocalNewsSection({ city }: { city: string | null }) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!city) return
    setLoading(true)
    fetch(`/api/news?perspective=local&location=${encodeURIComponent(city)}`)
      .then((r) => r.json())
      .then((d) => setArticles((d.articles || []) as Article[]))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false))
  }, [city])

  return (
    <section id="local" className="scroll-mt-32">
      <SectionHeader
        icon={<MapPin className="h-5 w-5" />}
        eyebrow="Local pulse"
        title={city ? `${city} updates` : "Choose your local area"}
        description={city ? "Local stories become the doorway into discussion, candidates, meetings, and ballot decisions." : "Add your city or district to unlock local news and neighborhood conversations."}
        action={
          !city ? (
            <Link href="/profile" className="hidden rounded-full px-4 py-2 text-xs font-semibold sm:inline-flex primary-action">
              Add location
            </Link>
          ) : null
        }
      />

      {!city && (
        <div className="community-card rounded-[1.35rem] p-6 text-sm" style={{ color: "var(--ink-500)" }}>
          MyVote gets more useful when it knows where you vote. Add your location to see local news, district conversations, and election updates near you.
        </div>
      )}

      {city && loading && <LoadingSkeleton count={3} />}

      {city && !loading && articles.length === 0 && (
        <Card className="community-card border-0">
          <CardContent className="py-6 text-center text-muted-foreground">
            <Newspaper className="w-7 h-7 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No local news found right now. Check back soon.</p>
          </CardContent>
        </Card>
      )}

      {city && !loading && articles.length > 0 && (
        <div className="grid gap-3">
          {articles.map((article, i) => (
            <ArticleCard key={`${article.url}-${i}`} article={article} />
          ))}
        </div>
      )}
    </section>
  )
}

interface PipelineStory {
  id: string
  headline: string
  synopsis: string
  lean_min: number
  lean_max: number
  created_at: string
  article_data: {
    id: string
    title: string
    url: string
    image_url: string | null
    source_name: string
    lean: number
    lean_label: string
  }[]
}

function leanBg(lean: number) {
  if (lean < 0) return "bg-blue-100 text-blue-800"
  if (lean > 0) return "bg-red-100 text-red-800"
  return "bg-slate-100 text-slate-700"
}

function PipelineStoryCard({ story }: { story: PipelineStory }) {
  const [imgError, setImgError] = useState(false)
  const hero = story.article_data.find((a) => a.image_url)
  const spread = story.lean_max - story.lean_min

  return (
    <div className="community-card rounded-[1.35rem] overflow-hidden">
      {hero?.image_url && !imgError && (
        <div className="w-full aspect-[16/7] overflow-hidden bg-muted">
          <img src={hero.image_url} alt="" className="w-full h-full object-cover" onError={() => setImgError(true)} />
        </div>
      )}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {spread >= 4 && <Badge className="bg-teal-100 text-teal-800 border-teal-200 text-[10px]">Cross-spectrum</Badge>}
          <span className="text-[10px] text-muted-foreground ml-auto">{formatNewsTime(story.created_at)}</span>
        </div>
        <h3 className="font-bold text-foreground leading-snug">{story.headline}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{story.synopsis}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {story.article_data.map((a) => (
            <a
              key={a.id}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${leanBg(a.lean)}`}
            >
              {a.source_name}
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

function PerspectivesSection() {
  const [stories, setStories] = useState<PipelineStory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/pipeline/stories?hours=48&limit=5")
      .then((r) => r.json())
      .then((d) => setStories(d.stories || []))
      .catch(() => setStories([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="news" className="scroll-mt-32">
      <SectionHeader
        icon={<Globe className="h-5 w-5" />}
        eyebrow="News engine"
        title="Stories feeding the conversation"
        description="News keeps people engaged, but the goal is to move readers into local discussion, representatives, and elections."
        action={<Link href="/news/spectrum" className="hidden rounded-full px-4 py-2 text-xs font-semibold sm:inline-flex primary-action">See all</Link>}
      />

      {loading && <LoadingSkeleton count={3} />}

      {!loading && stories.length === 0 && (
        <div className="community-card rounded-[1.35rem] p-6 text-center text-sm text-muted-foreground">
          No national stories yet — check back after the daily pipeline runs.
        </div>
      )}

      {!loading && stories.length > 0 && (
        <div className="grid gap-3">
          {stories.map((s) => <PipelineStoryCard key={s.id} story={s} />)}
        </div>
      )}
    </section>
  )
}

export function HomeFeed() {
  const { profile } = useAuth()
  const city = profile?.location ?? null

  return (
    <div className="space-y-8">
      <FeedNavigation city={city} />
      <CommunityPostsSection />
      <CommonGroundCard />
      <div id="neighbors-mobile" className="scroll-mt-32 lg:hidden community-card rounded-[1.35rem] p-4">
        <SuggestedNeighbors limit={3} showHeader showSeeAll />
      </div>
      <YourNetworkSection />
      <LocalNewsSection city={city} />
      <PerspectivesSection />
    </div>
  )
}
