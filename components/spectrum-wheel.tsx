"use client"

import { useEffect, useRef, useState } from "react"
import { ExternalLink, RefreshCw, AlertCircle } from "lucide-react"
import { formatNewsTime } from "@/lib/news-service"

const LEAN_LABELS: Record<string, string> = {
  "-3": "Far Left",
  "-2": "Left",
  "-1": "Center Left",
  "0": "Center",
  "1": "Center Right",
  "2": "Right",
  "3": "Far Right",
}

function leanColor(lean: number): string {
  if (lean <= -3) return "#1565C0"
  if (lean === -2) return "#1E88E5"
  if (lean === -1) return "#64B5F6"
  if (lean === 0) return "#78909C"
  if (lean === 1) return "#EF9A9A"
  if (lean === 2) return "#E53935"
  return "#B71C1C"
}

function leanBg(lean: number): string {
  if (lean <= -3) return "bg-blue-900 text-white"
  if (lean === -2) return "bg-blue-600 text-white"
  if (lean === -1) return "bg-blue-400 text-white"
  if (lean === 0) return "bg-slate-500 text-white"
  if (lean === 1) return "bg-red-300 text-white"
  if (lean === 2) return "bg-red-600 text-white"
  return "bg-red-900 text-white"
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

function StoryWheel({
  articles,
  position,
  onChange,
}: {
  articles: ArticleEntry[]
  position: number
  onChange: (v: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  const toPercent = (v: number) => ((v + 3) / 6) * 100
  const fromPercent = (pct: number) => Math.max(-3, Math.min(3, (pct / 100) * 6 - 3))

  function updateFromX(clientX: number) {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    onChange(fromPercent(pct))
  }

  useEffect(() => {
    if (!dragging) return
    function onMove(e: MouseEvent) { updateFromX(e.clientX) }
    function onUp() { setDragging(false) }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [dragging])

  // Touch support
  useEffect(() => {
    if (!dragging) return
    function onMove(e: TouchEvent) { updateFromX(e.touches[0].clientX) }
    function onUp() { setDragging(false) }
    window.addEventListener("touchmove", onMove, { passive: true })
    window.addEventListener("touchend", onUp)
    return () => {
      window.removeEventListener("touchmove", onMove)
      window.removeEventListener("touchend", onUp)
    }
  }, [dragging])

  const thumbPct = toPercent(position)
  const closestLean = Math.round(position)

  return (
    <div className="space-y-2 select-none">
      {/* Labels */}
      <div className="flex justify-between text-[10px] font-semibold text-muted-foreground px-0.5">
        <span className="text-blue-700">← Left</span>
        <span>Center</span>
        <span className="text-red-700">Right →</span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-6 rounded-full cursor-pointer"
        style={{
          background:
            "linear-gradient(to right, #1565C0, #1E88E5, #64B5F6, #78909C, #EF9A9A, #E53935, #B71C1C)",
        }}
        onClick={(e) => updateFromX(e.clientX)}
      >
        {/* Article dot markers */}
        {articles.map((a) => (
          <button
            key={a.id}
            title={a.source_name}
            onClick={(e) => { e.stopPropagation(); onChange(a.lean) }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white shadow transition-transform hover:scale-125 z-10"
            style={{ left: `${toPercent(a.lean)}%`, backgroundColor: leanColor(a.lean) }}
          />
        ))}

        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white shadow-lg border-2 cursor-grab active:cursor-grabbing z-20 flex items-center justify-center"
          style={{ left: `${thumbPct}%`, borderColor: leanColor(closestLean) }}
          onMouseDown={(e) => { e.preventDefault(); setDragging(true) }}
          onTouchStart={() => setDragging(true)}
        >
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: leanColor(closestLean) }} />
        </div>
      </div>

      {/* Position label */}
      <div className="text-center text-[11px] font-medium" style={{ color: leanColor(closestLean) }}>
        {LEAN_LABELS[String(closestLean)]}
      </div>
    </div>
  )
}

function StoryCard({ story }: { story: ClusteredStory }) {
  const sorted = [...story.article_data].sort((a, b) => a.lean - b.lean)
  const midLean = sorted[Math.floor(sorted.length / 2)]?.lean ?? 0
  const [position, setPosition] = useState<number>(midLean)

  const closestLean = Math.round(position)
  const activeArticle = story.article_data.reduce((prev, curr) =>
    Math.abs(curr.lean - position) < Math.abs(prev.lean - position) ? curr : prev
  )

  const heroImage = story.article_data.find((a) => a.image_url)?.image_url
  const spread = story.lean_max - story.lean_min
  const coverageLabel =
    spread >= 4 ? "Cross-spectrum coverage" : spread >= 2 ? "Bipartisan coverage" : "Partisan coverage"

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {heroImage && (
        <div className="w-full aspect-[16/6] overflow-hidden bg-muted">
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = "none" }}
          />
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                {coverageLabel}
              </span>
              <span className="text-[10px] text-muted-foreground ml-auto">
                {formatNewsTime(story.created_at)}
              </span>
            </div>
            <h3 className="font-bold text-foreground text-lg leading-snug">{story.headline}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{story.synopsis}</p>
          </div>
        </div>

        {/* Source pills — click to jump to that lean */}
        <div className="flex flex-wrap gap-1.5">
          {story.article_data.map((a) => (
            <button
              key={a.id}
              onClick={() => setPosition(a.lean)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${leanBg(a.lean)} ${
                a.id === activeArticle.id
                  ? "ring-2 ring-offset-1 ring-white scale-105 shadow"
                  : "opacity-60 hover:opacity-90"
              }`}
            >
              {a.source_name}
            </button>
          ))}
        </div>

        {/* Spectrum wheel */}
        <div className="pt-1">
          <StoryWheel
            articles={story.article_data}
            position={position}
            onChange={setPosition}
          />
        </div>

        {/* Active article panel */}
        <a
          href={activeArticle.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors group"
          style={{ borderLeftColor: leanColor(activeArticle.lean), borderLeftWidth: 3 }}
        >
          <div className="flex-1 min-w-0 space-y-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${leanBg(activeArticle.lean)}`}
              >
                {activeArticle.source_name}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {LEAN_LABELS[String(activeArticle.lean)]}
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground group-hover:underline leading-snug">
              {activeArticle.title}
            </p>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 group-hover:text-foreground transition-colors" />
        </a>
      </div>
    </div>
  )
}

export function SpectrumWheel() {
  const [stories, setStories] = useState<ClusteredStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Drag the spectrum wheel under each story to see how different outlets cover it.
        </p>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 text-muted-foreground ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-5 space-y-3 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-5/6" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-muted rounded-full" />
                <div className="h-6 w-12 bg-muted rounded-full" />
                <div className="h-6 w-20 bg-muted rounded-full" />
              </div>
              <div className="h-6 bg-muted rounded-full" />
              <div className="h-14 bg-muted rounded-xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-border p-8 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto opacity-60" />
          <p className="text-sm font-medium text-foreground">Failed to load stories</p>
          <p className="text-xs text-muted-foreground">{error}</p>
          <button
            onClick={() => load()}
            className="mt-2 px-4 py-1.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors"
          >
            Try again
          </button>
        </div>
      ) : stories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No stories yet — run the pipeline in the admin panel to fetch today&apos;s news.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  )
}
