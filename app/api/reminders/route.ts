import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/* POST /api/reminders — subscribe an email to election reminders.
   The table is insert-only under RLS; duplicates are treated as success
   so the endpoint never leaks whether an email is already subscribed. */
export async function POST(request: Request) {
  let body: { email?: string; countySlug?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("election_reminders").insert({
    email,
    county_slug: body.countySlug?.slice(0, 60) || null,
    source: body.source?.slice(0, 40) || "site",
  });

  // 23505 = unique violation → already subscribed → still a success
  if (error && !error.message.includes("duplicate") && error.code !== "23505") {
    return NextResponse.json(
      { error: "Could not save right now. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
