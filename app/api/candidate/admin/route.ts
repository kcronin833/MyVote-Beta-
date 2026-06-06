import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"

/* PATCH /api/candidate/admin
   Admin-only endpoint for managing candidate profile claims.

   Body:
     slug              — candidate slug (required)
     action            — "approve" | "set_donorbox" | "reject"
     claimant_user_id? — profiles.id of the verified claimant (for "approve")
     donorbox_url?     — Donorbox campaign URL (for "set_donorbox")

   All mutations go through the service client (bypasses RLS).
   Caller must be a verified admin (is_admin = true in profiles table). */

function isValidDonorboxUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return (
      (u.protocol === "https:" || u.protocol === "http:") &&
      u.hostname === "donorbox.org" &&
      u.pathname.length > 1
    )
  } catch {
    return false
  }
}

export async function PATCH(req: NextRequest) {
  // Verify caller is an authenticated admin
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: prof } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()
  if (!prof?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  let body: {
    slug?: string
    action?: string
    claimant_user_id?: string
    donorbox_url?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { slug, action, claimant_user_id, donorbox_url } = body
  if (!slug || !action) {
    return NextResponse.json({ error: "slug and action are required" }, { status: 400 })
  }

  const svc = createServiceClient()

  if (action === "approve") {
    const updates: Record<string, unknown> = { verified: true }
    if (claimant_user_id) updates.claimant_user_id = claimant_user_id
    const { error } = await svc
      .from("candidate_profiles")
      .update(updates)
      .eq("slug", slug)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, action: "approved", slug })
  }

  if (action === "set_donorbox") {
    if (!donorbox_url || !isValidDonorboxUrl(donorbox_url)) {
      return NextResponse.json(
        { error: "Provide a valid Donorbox URL (https://donorbox.org/…)" },
        { status: 400 }
      )
    }
    const { error } = await svc
      .from("candidate_profiles")
      .update({ donorbox_campaign_url: donorbox_url })
      .eq("slug", slug)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, action: "set_donorbox", slug })
  }

  if (action === "reject") {
    const { error } = await svc
      .from("candidate_profiles")
      .update({ claimed: false, verified: false, claimant_user_id: null })
      .eq("slug", slug)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, action: "rejected", slug })
  }

  return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
}

/* GET /api/candidate/admin — admin list of all claims */
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: prof } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()
  if (!prof?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const svc = createServiceClient()
  const { data, error } = await svc
    .from("candidate_profiles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ claims: data ?? [] })
}
