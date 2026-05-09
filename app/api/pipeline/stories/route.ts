import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const revalidate = 900 // 15-minute ISR cache

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const hours = Math.min(parseInt(searchParams.get("hours") || "24"), 72)
  const limit = Math.min(parseInt(searchParams.get("limit") || "30"), 60)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from("clustered_stories")
    .select("id, headline, synopsis, article_data, lean_min, lean_max, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ stories: data || [] })
}
