import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"

/* Mark a reminder subscriber as converted once they create a profile from the
   claim link. Best-effort + idempotent; keyed by the opaque claim_token so no
   email is ever passed from the client. */
export async function POST(req: Request) {
  try {
    const { token } = await req.json().catch(() => ({ token: null }))
    if (!token || !/^[0-9a-fA-F-]{36}$/.test(token)) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }
    const supabase = createServiceClient()
    await supabase
      .from("election_reminders")
      .update({ claimed_at: new Date().toISOString() })
      .eq("claim_token", token)
      .is("claimed_at", null)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
