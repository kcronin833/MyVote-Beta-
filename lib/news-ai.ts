import type { FactualNewsWithPerspectives } from "@/lib/news-service";

/* Real "Just the Facts" generation.
 *
 * Replaces the old templated buildOverview (which just echoed one outlet's RSS
 * blurb) with a genuine AI synthesis. Critically, this is GROUNDED: the model
 * is given ONLY the fetched headline + the left/center/right coverage and is
 * instructed to summarize strictly from that material — it must not add facts
 * from its own knowledge. Grounded summarization is what keeps this accurate
 * (no free-form hallucination), in line with the project's accuracy rule.
 *
 * One batched Claude Haiku call covers all ~12 headlines. The /api/news/factual
 * route caches for 30 min (revalidate 1800), so this runs at most ~once per
 * 30 min regardless of traffic — negligible cost. Reuses the raw-fetch pattern
 * already established in lib/pipeline/cluster.ts. Falls back gracefully to null
 * on any error so the news feed never breaks.
 */

const MODEL = "claude-haiku-4-5";

interface SummaryOut {
  index: number;
  summary: string;
}

export async function generateFactualSummaries(
  stories: FactualNewsWithPerspectives[]
): Promise<Map<number, string> | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || stories.length === 0) return null;

  // Compact, grounded source material — titles + descriptions only.
  const source = stories
    .map((s, i) => {
      const left = [...new Set(s.leftArticles.map((a) => a.title))].slice(0, 3);
      const right = [...new Set(s.rightArticles.map((a) => a.title))].slice(0, 3);
      const lines = [
        `[${i}] HEADLINE: ${s.title}`,
        s.description ? `    CENTER: ${s.description.replace(/\s*\[\+\d+ chars\]$/, "").slice(0, 400)}` : "",
        left.length ? `    LEFT COVERAGE: ${left.join(" | ")}` : "",
        right.length ? `    RIGHT COVERAGE: ${right.join(" | ")}` : "",
      ].filter(Boolean);
      return lines.join("\n");
    })
    .join("\n\n");

  const prompt = `You are a neutral newswire editor. For each numbered story below, write a "just the facts" summary of 2-3 sentences.

STRICT RULES:
- Use ONLY the information in that story's headline and the coverage lines provided. Do NOT add facts, names, numbers, dates, or context that are not present in the provided material.
- Write in neutral, factual language. No spin, no opinion, no loaded adjectives, no editorializing.
- Do not mention the outlets by name or that coverage spans the political spectrum — just state what happened.
- If the provided material is too thin to summarize, write one sentence restating the headline as a factual statement.
- Return ONLY valid JSON, no markdown, no commentary.

STORIES:
${source}

Respond with this exact JSON shape:
[{"index": 0, "summary": "..."}]`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const raw: string = data.content?.[0]?.text ?? "";
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed = JSON.parse(jsonStr) as SummaryOut[];
    const map = new Map<number, string>();
    for (const o of parsed) {
      if (typeof o.index === "number" && typeof o.summary === "string" && o.summary.trim()) {
        map.set(o.index, o.summary.trim());
      }
    }
    return map.size > 0 ? map : null;
  } catch {
    return null;
  }
}
