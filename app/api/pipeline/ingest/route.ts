import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"
import { runIngest } from "@/lib/pipeline/ingest"

export const maxDuration = 60

function isAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return req.headers.get("authorization") === `Bearer ${secret}`
}

async function handle(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const supabase = createServiceClient()
    const result = await runIngest(supabase)
    return NextResponse.json({ ok: true, ...result, timestamp: new Date().toISOString() })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export const GET = handle
export const POST = handle
