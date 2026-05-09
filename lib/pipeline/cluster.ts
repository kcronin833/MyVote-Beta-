import type { SupabaseClient } from "@supabase/supabase-js"

interface ArticleRow {
  id: string
  title: string
  description: string | null
  url: string
  image_url: string | null
  published_at: string | null
  source: { name: string; domain: string; lean: number; lean_label: string }
}

interface ClusterResult {
  headline: string
  synopsis: string
  article_indices: number[]
}

async function clusterWithClaude(articles: ArticleRow[]): Promise<ClusterResult[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set in environment variables")

  const articleList = articles
    .map((a, i) => `[${i}] lean=${a.source.lean} source="${a.source.name}"\n    title: ${a.title}`)
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

  if (!res.ok) throw new Error(`Anthropic API error ${res.status}: ${await res.text()}`)

  const data = await res.json()
  const rawText: string = data.content?.[0]?.text ?? ""
  const jsonStr = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
  return JSON.parse(jsonStr) as ClusterResult[]
}

export async function runCluster(supabase: SupabaseClient) {
  const since = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()

  const { data: articles, error: artErr } = await supabase
    .from("raw_articles")
    .select("id, title, description, url, image_url, published_at, source:sources(name, domain, lean, lean_label)")
    .eq("clustered", false)
    .gte("fetched_at", since)
    .order("fetched_at", { ascending: false })
    .limit(120)

  if (artErr) throw new Error(`Failed to fetch articles: ${artErr.message}`)
  if (!articles || articles.length < 2) {
    return { articles_processed: 0, clusters_created: 0, message: "Not enough articles to cluster" }
  }

  const typedArticles = articles as unknown as ArticleRow[]
  const clusters = await clusterWithClaude(typedArticles)

  if (!clusters || clusters.length === 0) {
    return { articles_processed: typedArticles.length, clusters_created: 0, message: "Claude returned no clusters" }
  }

  const clusterRows = clusters
    .filter((c) => c.article_indices?.length >= 2)
    .map((c) => {
      const arts = c.article_indices
        .filter((i) => i >= 0 && i < typedArticles.length)
        .map((i) => typedArticles[i])

      const leans = arts.map((a) => a.source.lean)
      return {
        headline: c.headline,
        synopsis: c.synopsis,
        lean_min: Math.min(...leans),
        lean_max: Math.max(...leans),
        article_data: arts.map((a) => ({
          id: a.id,
          title: a.title,
          url: a.url,
          image_url: a.image_url,
          published_at: a.published_at,
          source_name: a.source.name,
          source_domain: a.source.domain,
          lean: a.source.lean,
          lean_label: a.source.lean_label,
        })),
      }
    })

  const { error: insertErr } = await supabase.from("clustered_stories").insert(clusterRows)
  if (insertErr) throw new Error(`Insert error: ${insertErr.message}`)

  const clusteredIds = clusters
    .flatMap((c) => c.article_indices.map((i) => typedArticles[i]?.id))
    .filter(Boolean)

  if (clusteredIds.length > 0) {
    await supabase.from("raw_articles").update({ clustered: true }).in("id", clusteredIds)
  }

  return { articles_processed: typedArticles.length, clusters_created: clusterRows.length }
}
