import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 120

function isAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return req.headers.get("authorization") === `Bearer ${secret}`
}

/** Manual trigger — runs ingest then cluster in sequence. Use during testing. */
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const headers = {
    "content-type": "application/json",
    authorization: `Bearer ${process.env.CRON_SECRET}`,
  }

  // Step 1: Ingest
  let ingestResult: Record<string, unknown> = {}
  try {
    const ingestRes = await fetch(`${base}/api/pipeline/ingest`, {
      method: "POST",
      headers,
    })
    ingestResult = await ingestRes.json()
  } catch (err) {
    return NextResponse.json({ error: `Ingest failed: ${err}` }, { status: 500 })
  }

  // Step 2: Cluster (small delay so DB writes settle)
  await new Promise((r) => setTimeout(r, 2000))

  let clusterResult: Record<string, unknown> = {}
  try {
    const clusterRes = await fetch(`${base}/api/pipeline/cluster`, {
      method: "POST",
      headers,
    })
    clusterResult = await clusterRes.json()
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
