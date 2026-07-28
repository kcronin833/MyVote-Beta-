/* Grounded meeting summarizer.
 *
 * Takes the pasted text of a town-council agenda or minutes and returns a
 * bullet-point breakdown + a plain-English "what was said / decided" synopsis.
 * Strictly grounded — it summarizes ONLY the provided document, never invents —
 * which is what keeps it accurate (see the project's accuracy rule). Reuses the
 * raw-fetch Anthropic pattern from lib/pipeline/cluster.ts. Returns null on any
 * failure so the caller can surface an error instead of publishing garbage.
 */

const MODEL = "claude-haiku-4-5";

export interface MeetingSummary {
  bullets: string[];
  synopsis: string;
}

export async function summarizeMeeting(
  rawText: string,
  bodyName: string
): Promise<MeetingSummary | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const text = (rawText || "").trim();
  if (!apiKey || text.length < 40) return null;

  const prompt = `You are a neutral civic clerk summarizing a local government meeting document (an agenda or minutes) for "${bodyName}".

Produce:
1. "bullets": 4 to 9 concise, factual bullet points covering the key agenda items, votes, and decisions. Each bullet one short sentence.
2. "synopsis": a plain-English 2 to 4 sentence summary of what the meeting covered and what was decided.

STRICT RULES:
- Use ONLY the information in the document below. Do NOT add facts, names, numbers, dates, or outcomes that are not present.
- Neutral and factual. No opinion, no spin, no loaded language.
- If the document is an agenda (items to be discussed) rather than minutes (what happened), phrase items as what is scheduled, and note in the synopsis that these are agenda items, not outcomes.
- If a vote or decision is recorded, state it plainly (who voted how, if given).
- Return ONLY valid JSON, no markdown.

DOCUMENT:
"""
${text.slice(0, 24000)}
"""

Respond with exactly: {"bullets": ["...", "..."], "synopsis": "..."}`;

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
        max_tokens: 1600,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: AbortSignal.timeout(40000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const raw: string = data.content?.[0]?.text ?? "";
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed = JSON.parse(jsonStr) as MeetingSummary;
    const bullets = Array.isArray(parsed.bullets)
      ? parsed.bullets.filter((b) => typeof b === "string" && b.trim()).map((b) => b.trim())
      : [];
    const synopsis = typeof parsed.synopsis === "string" ? parsed.synopsis.trim() : "";
    if (bullets.length === 0 && !synopsis) return null;
    return { bullets, synopsis };
  } catch {
    return null;
  }
}
