import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { story_id, rating, story_lean_avg } = await req.json()
  if (!story_id || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  // Upsert the rating
  const { error: rateErr } = await supabase
    .from("story_ratings")
    .upsert(
      { user_id: user.id, story_id, rating, story_lean_avg: story_lean_avg ?? 0 },
      { onConflict: "user_id,story_id" }
    )
  if (rateErr) return NextResponse.json({ error: rateErr.message }, { status: 500 })

  // Recalculate lean score from all this user's ratings
  const { data: allRatings } = await supabase
    .from("story_ratings")
    .select("rating, story_lean_avg")
    .eq("user_id", user.id)

  if (allRatings && allRatings.length > 0) {
    const totalWeight = allRatings.reduce((s, r) => s + r.rating, 0)
    const weightedLean = allRatings.reduce((s, r) => s + r.story_lean_avg * r.rating, 0)
    const contentLeanScore = totalWeight > 0 ? weightedLean / totalWeight : 0

    await supabase
      .from("profiles")
      .update({
        content_lean_score: Math.round(contentLeanScore * 100) / 100,
        total_ratings: allRatings.length,
      })
      .eq("id", user.id)
  }

  return NextResponse.json({ ok: true })
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ rating: null })

  const { searchParams } = new URL(req.url)
  const story_id = searchParams.get("story_id")
  if (!story_id) return NextResponse.json({ rating: null })

  const { data } = await supabase
    .from("story_ratings")
    .select("rating")
    .eq("user_id", user.id)
    .eq("story_id", story_id)
    .single()

  return NextResponse.json({ rating: data?.rating ?? null })
}
