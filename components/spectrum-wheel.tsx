"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ExternalLink, RefreshCw, AlertCircle, Star } from "lucide-react"
import { formatNewsTime } from "@/lib/news-service"
import { createClient } from "@/lib/supabase/client"

type LeanFilter = "all" | "left" | "center" | "right"

function getLeanCategory(lean: number): "left" | "center" | "right" {
  if (lean < 0) return "left"
  if (lean > 0) return "right"
  return "center"
}

function leanLabel(lean: number): string {
  if (lean <= -3) return "Far Left"
  if (lean === -2) return "Left"
  if (lean === -1) return "Ctr Left"
  if (lean === 0) return "Center"
  if (lean === 1) return "Ctr Right"
  if (lean === 2) return "Right"
  return "Far Right"
}

function leanDotColor(lean: number): string {
  if (lean < 0) return "#1E88E5"
  if (lean > 0) return "#B33A2C"
  return "#78909C"
}

function leanBadgeClass(lean: number): string {
  if (lean < 0) return "bg-blue-100 text-blue-800 border border-blue-200"
  if (lean > 0) return "bg-red-100 text-red-800 border border-red-200"
  return "bg-slate-100 text-slate-600 border border-slate-200"
}

interface ArticleEntry {
  id: string
  title: string
  url: string
  image_url: string | null
  published_at: string | null
  source_name: string
  source_domain: string
  lean: number
  lean_label: string
}

interface ClusteredStory {
  id: string
  headline: string
  synopsis: string
  article_data: ArticleEntry[]
  lean_min: number
  lean_max: number
  created_at: string
}

// ---- Article thumbnail card ----
function ArticleCard({ article }: { article: ArticleEntry }) {
  const [imgError, setImgError] = useState(false)
  const accent = leanDotColor(article.lean)

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-40 sm:w-44 group"
    >
      <div className="w-full aspect-video rounded-xl overflow-hidden mb-2 relative bg-muted">
        {article.image_url && !imgError ? (
          <img
            src={article.image_url}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center px-2"
            style={{ background: `linear-gradient(135deg, ${accent}cc 0%, ${accent}33 100%)` }}
          >
            <span className="text-white text-[10px] font-bold text-center leading-tight line-clamp-3">
              {article.source_name}
            </span>
          </div>
        )}
        <div className="absolute top-1.5 left-1.5">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-sm ${leanBadgeClass(article.lean)}`}>
            {leanLabel(article.lean)}
          </span>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl flex items-end justify-end p-1.5 opacity-0 group-hover:opacity-100">
          <ExternalLink className="w-3.5 h-3.5 text-white drop-shadow" />
        </div>
      </div>
      <p className="text-[10px] font-semibold truncate" style={{ color: accent }}>
        {article.source_name}
      </p>
      <p className="text-xs font-medium text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors mt-0.5">
        {article.title}
      </p>
    </a>
  )
}

// ---- Star rating widget ----
function StarRating({ storyId, storyLeanAvg }: { storyId: string; storyLeanAvg: number }) {
  const [userRating, setUserRating] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setAuthed(true)
      fetch(`/api/stories/rate?story_id=${storyId}`)
        .then((r) => r.json())
        .then((d) => { if (d.rating) setUserRating(d.rating) })
    })
  }, [storyId])

  async function handleRate(stars: number) {
    if (!authed || loading) return
    setLoading(true)
    const prev = userRating
    setUserRating(stars)
    try {
      const res = await fetch("/api/stories/rate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ story_id: storyId, rating: stars, story_lean_avg: storyLeanAvg }),
      })
      if (!res.ok) setUserRating(prev)
    } catch {
      setUserRating(prev)
    } finally {
      setLoading(false)
    }
  }

  const display = hovered ?? userRating ?? 0

  if (!authed) {
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map((s) => (
            <Star key={s} className="w-3.5 h-3.5 text-muted-foreground/30" />
          ))}
        </div>
        <span>Sign in to rate</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex gap-0.5"
        onMouseLeave={() => setHovered(null)}
      >
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onMouseEnter={() => setHovered(s)}
            onClick={() => handleRate(s)}
            disabled={loading}
            className="transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              className={`w-4 h-4 transition-colors ${
                s <= display
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
      </div>
      {userRating && (
        <span className="text-[11px] text-muted-foreground">
          {userRating === 5 ? "Love it" : userRating >= 4 ? "Great" : userRating >= 3 ? "Good" : userRating >= 2 ? "Fair" : "Not for me"}
        </span>
      )}
    </div>
  )
}

// ---- Story card ----
function StoryCard({ story, filter }: { story: ClusteredStory; filter: LeanFilter }) {
  const visibleArticles = story.article_data.filter((a) =>
    filter === "all" ? true : getLeanCategory(a.lean) === filter
  )
  if (visibleArticles.length === 0) return null

  const leftCount = story.article_data.filter((a) => a.lean < 0).length
  const centerCount = story.article_data.filter((a) => a.lean === 0).length
  const rightCount = story.article_data.filter((a) => a.lean > 0).length
  const spread = story.lean_max - story.lean_min

  // Story's average lean (used for algorithm weighting)
  const storyLeanAvg = (story.lean_min + story.lean_max) / 2

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="p-4 pb-2 space-y-2">
        {/* Meta row */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground flex-wrap">
          {spread >= 4 && (
            <span className="bg-teal-100 text-teal-700 font-semibold px-2 py-0.5 rounded-full">Cross-spectrum</span>
          )}
          {spread >= 2 && spread < 4 && (
            <span className="bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">Bipartisan</span>
          )}
          <span className="ml-auto">{formatNewsTime(story.created_at)}</span>
        </div>

        {/* Headline + synopsis — headline links to the permanent story page */}
        <Link href={`/news/story/${story.id}`} className="block group">
          <h3 className="font-bold text-foreground text-base leading-snug group-hover:text-teal-700 transition-colors">{story.headline}</h3>
        </Link>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{story.synopsis}</p>

        {/* Coverage counts */}
        <div className="flex items-center gap-3 pt-0.5">
          {leftCount > 0 && <span className="text-[11px] font-semibold text-blue-600">{leftCount} Left</span>}
          {centerCount > 0 && <span className="text-[11px] font-semibold text-slate-500">{centerCount} Center</span>}
          {rightCount > 0 && <span className="text-[11px] font-semibold text-red-600">{rightCount} Right</span>}
          <span className="ml-auto text-[11px] text-muted-foreground">
            {visibleArticles.length} article{visibleArticles.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Netflix horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-3 pt-1" style={{ scrollbarWidth: "none" }}>
        {visibleArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Star rating bar + full breakdown link */}
      <div className="px-4 pb-4 pt-1 border-t border-border flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground font-medium">Rate this story:</span>
          <StarRating storyId={story.id} storyLeanAvg={storyLeanAvg} />
        </div>
        <Link
          href={`/news/story/${story.id}`}
          className="text-[12px] font-semibold text-teal-700 hover:underline whitespace-nowrap"
        >
          Full breakdown →
        </Link>
      </div>
    </div>
  )
}

// ---- Main component ----
export function SpectrumWheel() {
  const [stories, setStories] = useState<ClusteredStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<LeanFilter>("all")
  const [refreshing, setRefreshing] = useState(false)

  async function load(showRefreshing = false) {
    if (showRefreshing) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/pipeline/stories?hours=48&limit=30")
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setStories(data.stories || [])
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [])

  const FILTERS: { key: LeanFilter; label: string; active: string; inactive: string }[] = [
    { key: "all",    label: "All",    active: "bg-slate-800 text-white",  inactive: "bg-muted text-muted-foreground hover:bg-slate-200" },
    { key: "left",   label: "Left",   active: "bg-blue-600 text-white",   inactive: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
    { key: "center", label: "Center", active: "bg-slate-500 text-white",  inactive: "bg-slate-100 text-slate-600 hover:bg-slate-200" },
    { key: "right",  label: "Right",  active: "bg-red-600 text-white",    inactive: "bg-red-50 text-red-700 hover:bg-red-100" },
  ]

  const visibleStories = stories.filter((s) =>
    filter === "all" ? true : s.article_data.some((a) => getLeanCategory(a.lean) === filter)
  )

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          {FILTERS.map(({ key, label, active, inactive }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${filter === key ? active : inactive}`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="ml-auto p-1.5 rounded-lg hover:bg-muted transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-muted-foreground ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-4 space-y-3 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="flex gap-3 pt-2">
                {[1,2,3].map((j) => (
                  <div key={j} className="flex-shrink-0 w-40">
                    <div className="aspect-video bg-muted rounded-xl mb-2" />
                    <div className="h-2.5 bg-muted rounded w-2/3 mb-1" />
                    <div className="h-2.5 bg-muted rounded w-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-card rounded-2xl border border-border p-8 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto opacity-60" />
          <p className="text-sm font-medium">Failed to load stories</p>
          <p className="text-xs text-muted-foreground">{error}</p>
          <button onClick={() => load()} className="mt-2 px-4 py-1.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700">
            Try again
          </button>
        </div>
      ) : stories.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">No stories yet — run the pipeline from the admin panel.</p>
        </div>
      ) : visibleStories.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">No {filter}-leaning articles in current stories.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleStories.map((story) => (
            <StoryCard key={story.id} story={story} filter={filter} />
          ))}
        </div>
      )}
    </div>
  )
}
