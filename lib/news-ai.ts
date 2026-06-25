import type { FactualNewsWithPerspectives } from "@/lib/news-service";

/* Real "Just the Facts" generation — clustered.
 *
 * Takes the fetched center headlines (each already carrying its left/center/
 * right coverage) and, in ONE grounded Claude Haiku call:
 *   1. groups headlines covering the SAME event into a single story (so the
 *      feed shows one card per event, not one per outlet),
 *   2. drops anything that is opinion/editorial rather than news,
 *   3. writes a NEUTRAL headline + a 2-3 sentence "just the facts" summary for
 *      each event, using ONLY the supplied material (no outside knowledge).
 *
 * Grounded summarization is what keeps this accurate — the model summarizes the
 * provided headlines, it does not invent. The /api/news/factual route and the
 * /news page both cache 30 min, so this runs at most ~once per 30 min. Reuses
 * the raw-fetch pattern from lib/pipeline/cluster.ts. Returns null on any error
 * so the caller can fall back to the un-clustered list.
 */

const MODEL = "claude-haiku-4-5";

export interface ClusteredEvent {
  headline: string;
  summary: string;
  members: number[]; // indices into the input array
}

export async function generateClusteredFacts(
  stories: FactualNewsWithPerspectives[]
): Promise<ClusteredEvent[] | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || stories.length === 0) return null;

  const source = stories
    .map((s, i) => {
      const left = [...new Set(s.leftArticles.map((a) => a.title))].slice(0, 3);
      const right = [...new Set(s.rightArticles.map((a) => a.title))].slice(0, 3);
      const lines = [
        `[${i}] ${s.title}`,
        s.description ? `    DETAIL: ${s.description.replace(/\s*\[\+\d+ chars\]$/, "").slice(0, 300)}` : "",
        left.length ? `    ALSO COVERED: ${left.join(" | ")}` : "",
        right.length ? `    ALSO COVERED: ${right.join(" | ")}` : "",
      ].filter(Boolean);
      return lines.join("\n");
    })
    .join("\n\n");

  const prompt = `You are a neutral newswire editor building a "just the facts" national politics feed from the numbered items below.

Do the following:
1. GROUP items that are about the same underlying event into one story. Use each item's index.
2. EXCLUDE any item that is an opinion piece, editorial, op-ed, or pure commentary rather than a news event. If an event is only covered by opinion, drop it.
3. For each remaining story write:
   - a NEUTRAL headline (max 12 words) that states what happened — do NOT copy a single outlet's headline, write a plain factual one.
   - a "summary" of 2-3 sentences that states only the facts.

STRICT RULES:
- Use ONLY the information in the provided items. Do NOT add facts, names, numbers, dates, or context not present in the material.
- Neutral, factual language only. No spin, opinion, or loaded adjectives. Do not name outlets or mention political lean.
- If material is thin, write a shorter, careful summary.
- Order stories by importance (most significant first).

ITEMS:
${source}

Return ONLY valid JSON, no markdown, in exactly this shape:
[{"headline": "Plain factual headline", "summary": "2-3 factual sentences.", "members": [0, 4]}]`;

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
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: AbortSignal.timeout(40000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const raw: string = data.content?.[0]?.text ?? "";
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed = JSON.parse(jsonStr) as ClusteredEvent[];
    const clean = parsed.filter(
      (e) =>
        e &&
        typeof e.headline === "string" &&
        e.headline.trim() &&
        typeof e.summary === "string" &&
        e.summary.trim() &&
        Array.isArray(e.members) &&
        e.members.length > 0
    );
    return clean.length > 0 ? clean : null;
  } catch {
    return null;
  }
}
