"use client"

import { useEffect, useRef, useState } from "react"
import { ExternalLink, RefreshCw, AlertCircle } from "lucide-react"
import { formatNewsTime } from "@/lib/news-service"

// Lean score: -3 (far-left) → +3 (far-right)
const LEAN_LABELS: Record<number, string> = {
  "-3": "Far Left",
  "-2": "Left",
  "-1": "Center Left",
  "0":  "Center",
  "1":  "Center Right",
  "2":  "Right",
  "3":  "Far Right",
}

function leanColor(lean: number): string {
  if (lean <= -3) return "#1565C0"
  if (lean === -2) return "#1E88E5"
  if (lean === -1) return "#64B5F6"
  if (lean === 0)  return "#78909C"
  if (lean === 1)  return "#EF9A9A"
  if (lean === 2)  return "#E53935"
  return "#B71C1C"
}

function leanBg(lean: number): string {
  if (lean <= -3) return "bg-blue-900 text-white"
  if (lean === -2) return "bg-blue-600 text-white"
  if (lean === -1) return "bg-blue-400 text-white"
  if (lean === 0)  return "bg-slate-500 text-white"
  if (lean === 1)  return "bg-red-300 text-white"
  if (lean === 2)  return "bg-red-600 text-white"
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

function SpectrumBar({
  range,
  onChange,
}: {
  range: [number, number]
  onChange: (r: [number, number]) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<"left" | "right" | null>(null)

  const toPercent = (v: number) => ((v + 3) / 6) * 100
  const fromPercent = (pct: number) => Math.round((pct / 100) * 6 - 3)

  function clamp(v: number) {
    return Math.max(-3, Math.min(3, v))
  }

  function handleMouseMove(e: MouseEvent) {
    if (!dragging || !trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const val = clamp(fromPercent(pct))
    if (dragging === "left") {
      onChange([Math.min(val, range[1]), range[1]])
    } else {
      onChange([range[0], Math.max(val, range[0])])
    }
  }

  function handleMouseUp() { setDragging(null) }

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [dragging, range])

  const leftPct = toPercent(range[0])
  const rightPct = toPercent(range[1])

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-blue-700">← Far Left</span>
        <span className="text-slate-500">Center</span>
        <span className="text-red-700">Far Right →</span>
      </div>

      {/* Gradient track */}
      <div
        ref={trackRef}
        className="relative h-5 rounded-full cursor-pointer select-none"
        style={{
          background:
            "linear-gradient(to right, #1565C0, #1E88E5, #64B5F6, #78909C, #EF9A9A, #E53935, #B71C1C)",
        }}
        onClick={(e) => {
          if (!trackRef.current) return
          const rect = trackRef.current.getBoundingClientRect()
          const pct = ((e.clientX - rect.left) / rect.width) * 100
          const val = clamp(fromPercent(pct))
          // Move whichever handle is closer
          const distLeft = Math.abs(val - range[0])
          const distRight = Math.abs(val - range[1])
          if (distLeft <= distRight) {
            onChange([Math.min(val, range[1]), range[1]])
          } else {
            onChange([range[0], Math.max(val, range[0])])
          }
        }}
      >
        {/* Selected range highlight */}
        <div
          className="absolute top-0 h-full rounded-full border-2 border-white/60 bg-white/20 pointer-events-none"
          style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }}
        />

        {/* Left handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 shadow-md cursor-grab active:cursor-grabbing z-10"
          style={{ left: `${leftPct}%`, borderColor: leanColor(range[0]) }}
          onMouseDown={(e) => { e.preventDefault(); setDragging("left") }}
        />

        {/* Right handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 shadow-md cursor-grab active:cursor-grabbing z-10"
          style={{ left: `${rightPct}%`, borderColor: leanColor(range[1]) }}
          onMouseDown={(e) => { e.preventDefault(); setDragging("right") }}
        />
      </div>

      {/* Tick labels */}
      <div className="flex justify-between text-[10px] text-muted-foreground px-2">
        {[-3, -2, -1, 0, 1, 2, 3].map((v) => (
          <span key={v} className={range[0] <= v && v <= range[1] ? "font-bold text-foreground" : ""}>
            {LEAN_LABELS[String(v)].split(" ").slice(-1)[0]}
          </span>
        ))}
      </div>

      {/* Active range label */}
      <div className="text-center text-xs text-muted-foreground">
        Showing:{" "}
        <span className="font-semibold text-foreground">
          {LEAN_LABELS[String(range[0])]} → {LEAN_LABELS[String(range[1])]}
        </span>
      </div>
    </div>
  )
}

function StoryCard({ story }: { story: ClusteredStory }) {
  const [expanded, setExpanded] = useState(false)
  const spread = story.lean_max - story.lean_min

  const heroImage = story.article_data.find((a) => a.image_url)?.image_url

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {heroImage && (
        <div className="w-full aspect-[16/7] overflow-hidden bg-muted">
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = "none" }}
          />
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Lean spread badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="h-1.5 rounded-full flex-1 max-w-[120px] overflow-hidden"
            style={{
              background:
                "linear-gradient(to right, #1565C0, #1E88E5, #64B5F6, #78909C, #EF9A9A, #E53935, #B71C1C)",
            }}
            title={`Covered from ${LEAN_LABELS[String(story.lean_min)]} to ${LEAN_LABELS[String(story.lean_max)]}`}
          />
          <span className="text-[10px] text-muted-foreground font-medium">
            {spread >= 4 ? "Cross-spectrum" : spread >= 2 ? "Bipartisan" : "Partisan coverage"}
          </span>
          <span className="ml-auto text-[10px] text-muted-foreground">
            {formatNewsTime(story.created_at)}
          </span>
        </div>

        <h3 className="font-bold text-foreground leading-snug">{story.headline}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{story.synopsis}</p>

        {/* Source pills */}
        <div className="flex flex-wrap gap-1.5">
          {story.article_data.map((a) => (
            <a
              key={a.id}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-opacity hover:opacity-80 ${leanBg(a.lean)}`}
              title={a.title}
            >
              {a.source_name}
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          ))}
        </div>

        {/* Expanded article list */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-teal-600 hover:text-teal-700 font-medium"
        >
          {expanded ? "Hide articles ↑" : `Read all ${story.article_data.length} articles ↓`}
        </button>

        {expanded && (
          <div className="space-y-2 pt-1 border-t border-border">
            {story.article_data.map((a) => (
              <a
                key={a.id}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 group"
              >
                <span
                  className="mt-0.5 flex-shrink-0 w-2 h-2 rounded-full"
                  style={{ backgroundColor: leanColor(a.lean) }}
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground">
                    {a.source_name}{" "}
                    <span className="font-normal">· {LEAN_LABELS[String(a.lean)]}</span>
                  </p>
                  <p className="text-sm text-foreground group-hover:underline leading-snug line-clamp-2">
                    {a.title}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function SpectrumWheel() {
  const [stories, setStories] = useState<ClusteredStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [range, setRange] = useState<[number, number]>([-3, 3])
  const [refreshing, setRefreshing] = useState(false)

  async function load(showRefreshing = false) {
    if (showRefreshing) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/pipeline/stories?hours=24&limit=30")
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

  const filtered = stories.filter(
    (s) => s.lean_min <= range[1] && s.lean_max >= range[0]
  )

  return (
    <div className="space-y-6">
      {/* Spectrum slider */}
      <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-foreground">Political Spectrum</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Drag the handles to filter stories by political lean
            </p>
          </div>
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            title="Refresh stories"
          >
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
        <SpectrumBar range={range} onChange={setRange} />
      </div>

      {/* Story count */}
      {!loading && !error && (
        <p className="text-xs text-muted-foreground px-1">
          {filtered.length === 0
            ? "No stories match this range."
            : `${filtered.length} stor${filtered.length === 1 ? "y" : "ies"} in selected range`}
        </p>
      )}

      {/* Stories grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-4 space-y-3 animate-pulse">
              <div className="h-2 bg-muted rounded w-32" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-5/6" />
              <div className="h-3 bg-muted rounded w-4/6" />
              <div className="flex gap-1.5">
                <div className="h-5 w-16 bg-muted rounded-full" />
                <div className="h-5 w-12 bg-muted rounded-full" />
                <div className="h-5 w-20 bg-muted rounded-full" />
              </div>
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
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            {stories.length === 0
              ? "No clustered stories yet — the pipeline needs to run first."
              : "No stories match the selected spectrum range."}
          </p>
          {stories.length === 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Trigger the pipeline manually at{" "}
              <code className="bg-muted px-1 rounded">/api/pipeline/trigger</code>
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  )
}
