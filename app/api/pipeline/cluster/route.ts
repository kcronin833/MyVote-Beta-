import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"

export const maxDuration = 60

function isAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return req.headers.get("authorization") === `Bearer ${secret}`
}

interface ArticleRow {
  id: string
  title: string
  description: string | null
  url: string
  image_url: string | null
  published_at: string | null
  source: {
    name: string
    domain: string
    lean: number
    lean_label: string
  }
}

interface ClusterResult {
  headline: string
  synopsis: string
  article_indices: number[] // indexes into the articles array sent to Claude
}

async function clusterWithClaude(articles: ArticleRow[]): Promise<ClusterResult[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set")

  const articleList = articles
    .map(
      (a, i) =>
        `[${i}] lean=${a.source.lean} source="${a.source.name}"\n    title: ${a.title}`
    )
    .join("\n")

  const prompt = `You are a neutral news editor. Group the following headlines into story clusters — articles covering the same real-world event or topic.

Rules:
- Each cluster should contain at least 2 articles about the SAME story
- Singleton articles (no matching story) should be omitted
- Write a SHORT neutral headline (10 words max) for each cluster
- Write a neutral factual synopsis (2-3 sentences, no political spin)
- Return ONLY valid JSON — no markdown, no explanation

Headlines (index, political lean -3 to +3, source):
${articleList}

Respond with this exact JSON format:
[
  {
    "headline": "Short neutral headline",
    "synopsis": "2-3 sentence neutral synopsis of the story.",
    "article_indices": [0, 3, 7]
  }
]`

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
    signal: AbortSignal.timeout(45000),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Anthropic API error ${res.status}: ${txt}`)
  }

  const data = await res.json()
  const rawText: string = data.content?.[0]?.text ?? ""

  // Strip any markdown code fences Claude might wrap the JSON in
  const jsonStr = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
  return JSON.parse(jsonStr) as ClusterResult[]
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createServiceClient()

  // Fetch articles from the last 6 hours that haven't been clustered yet
  const since = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  const { data: articles, error: artErr } = await supabase
    .from("raw_articles")
    .select("id, title, description, url, image_url, published_at, source:sources(name, domain, lean, lean_label)")
    .eq("clustered", false)
    .gte("fetched_at", since)
    .order("fetched_at", { ascending: false })
    .limit(120)

  if (artErr) {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
  if (!articles || articles.length < 2) {
    return NextResponse.json({ ok: true, message: "Not enough articles to cluster", clusters: 0 })
  }

  const typedArticles = articles as unknown as ArticleRow[]

  // Send to Claude for clustering
  let clusters: ClusterResult[]
  try {
    clusters = await clusterWithClaude(typedArticles)
  } catch (err) {
    console.error("[cluster] Claude error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }

  if (!clusters || clusters.length === 0) {
    return NextResponse.json({ ok: true, message: "Claude returned no clusters", clusters: 0 })
  }

  // Build clustered_stories rows
  const clusterRows = clusters
    .filter((c) => c.article_indices?.length >= 2)
    .map((c) => {
      const clusterArticles = c.article_indices
        .filter((i) => i >= 0 && i < typedArticles.length)
        .map((i) => typedArticles[i])

      const leans = clusterArticles.map((a) => a.source.lean)
      const leanMin = Math.min(...leans)
      const leanMax = Math.max(...leans)

      const articleData = clusterArticles.map((a) => ({
        id: a.id,
        title: a.title,
        url: a.url,
        image_url: a.image_url,
        published_at: a.published_at,
        source_name: a.source.name,
        source_domain: a.source.domain,
        lean: a.source.lean,
        lean_label: a.source.lean_label,
      }))

      return {
        headline: c.headline,
        synopsis: c.synopsis,
        article_data: articleData,
        lean_min: leanMin,
        lean_max: leanMax,
      }
    })

  // Insert clusters
  const { error: insertErr } = await supabase
    .from("clustered_stories")
    .insert(clusterRows)

  if (insertErr) {
    console.error("[cluster] Insert error:", insertErr)
    return NextResponse.json({ error: insertErr.message }, { status: 500 })
  }

  // Mark articles as clustered
  const clusteredIds = clusters
    .flatMap((c) => c.article_indices.map((i) => typedArticles[i]?.id))
    .filter(Boolean)

  if (clusteredIds.length > 0) {
    await supabase
      .from("raw_articles")
      .update({ clustered: true })
      .in("id", clusteredIds)
  }

  return NextResponse.json({
    ok: true,
    articles_processed: typedArticles.length,
    clusters_created: clusterRows.length,
    timestamp: new Date().toISOString(),
  })
}

export async function GET(req: NextRequest) {
  return POST(req)
}
