import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"
import { createClient } from "@/lib/supabase/client"
import { runIngest } from "@/lib/pipeline/ingest"
import { runCluster } from "@/lib/pipeline/cluster"

export const maxDuration = 120

async function isAdminRequest(req: NextRequest): Promise<boolean> {
  // Option 1: CRON_SECRET bearer token (for cron jobs / curl)
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.get("authorization") === `Bearer ${secret}`) return true

  // Option 2: valid Supabase admin session (for in-browser admin panel calls)
  const accessToken = req.headers.get("x-supabase-token")
  if (!accessToken) return false
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser(accessToken)
    if (!user) return false
    const svc = createServiceClient()
    const { data: profile } = await svc
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()
    return profile?.is_admin === true
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const authorized = await isAdminRequest(req)
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized — need admin session or CRON_SECRET" }, { status: 401 })
  }

  const svc = createServiceClient()

  // Step 1: Ingest
  let ingestResult: Record<string, unknown> = {}
  try {
    ingestResult = await runIngest(svc)
  } catch (err) {
    return NextResponse.json({ error: `Ingest failed: ${err}` }, { status: 500 })
  }

  // Step 2: Cluster (small delay so DB writes settle)
  await new Promise((r) => setTimeout(r, 2000))

  let clusterResult: Record<string, unknown> = {}
  try {
    clusterResult = await runCluster(svc)
  } catch (err) {
    return NextResponse.json({
      error: `Cluster failed: ${err}`,
      ingest: ingestResult,
    }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    ingest: ingestResult,
    cluster: clusterResult,
    timestamp: new Date().toISOString(),
  })
}
