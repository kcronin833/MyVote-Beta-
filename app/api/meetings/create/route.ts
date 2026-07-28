import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { summarizeMeeting } from "@/lib/meeting-ai"

/* Admin-curated meeting: paste an agenda/minutes document, get a grounded AI
   bullet-point breakdown + synopsis, and save it to the group. Insert is
   RLS-gated to admins (is_admin()), so this route is safe even if reached by a
   non-admin — the insert simply fails. */
export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 })

    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: "Bad request" }, { status: 400 })

    const groupId: string = body.group_id
    const bodyName: string = (body.body_name || "").trim()
    const meetingDate: string | null = body.meeting_date || null
    const sourceUrl: string | null = (body.source_url || "").trim() || null
    const rawText: string = (body.raw_text || "").trim()

    if (!groupId || !bodyName) return NextResponse.json({ error: "Missing group or body name" }, { status: 400 })
    if (rawText.length < 40) return NextResponse.json({ error: "Paste the agenda or minutes text (at least a few sentences)." }, { status: 400 })

    const summary = await summarizeMeeting(rawText, bodyName)
    if (!summary) return NextResponse.json({ error: "Couldn't summarize that text — check it and try again." }, { status: 502 })

    const { data, error } = await supabase
      .from("group_meetings")
      .insert({
        group_id: groupId,
        body_name: bodyName,
        meeting_date: meetingDate,
        source_url: sourceUrl,
        bullets: summary.bullets,
        synopsis: summary.synopsis,
        created_by: user.id,
      })
      .select("id, body_name, meeting_date, source_url, bullets, synopsis, created_at")
      .single()

    if (error) {
      const msg = /row-level|policy|permission/i.test(error.message)
        ? "Only admins can add meetings."
        : error.message
      return NextResponse.json({ error: msg }, { status: 403 })
    }
    return NextResponse.json({ meeting: data })
  } catch (err) {
    console.error("meeting create error:", err)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}
