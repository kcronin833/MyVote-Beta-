import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

/* POST /api/candidate/claim
   A candidate (or their campaign) requests to claim their AI-generated
   profile. The request is written to contact_messages with category
   "claim" so it surfaces in the admin Messages tab / mailbox.
   Anyone (incl. signed-out) may submit — RLS allows the insert. */

const ROLES = ["candidate", "campaign", "other"] as const;
type Role = (typeof ROLES)[number];

const ROLE_LABEL: Record<Role, string> = {
  candidate: "The candidate",
  campaign: "Campaign / staff",
  other: "Other",
};

export async function POST(req: NextRequest) {
  let body: {
    candidateName?: string;
    raceOffice?: string;
    slug?: string;
    claimantName?: string;
    email?: string;
    role?: string;
    message?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const candidateName = body.candidateName?.trim();
  const raceOffice = body.raceOffice?.trim();
  const slug = body.slug?.trim();
  const claimantName = body.claimantName?.trim();
  const email = body.email?.trim().toLowerCase();
  const role = (body.role || "").trim();
  const note = body.message?.trim() || "";

  if (!candidateName || !claimantName || !email) {
    return NextResponse.json(
      { error: "Your name, email, and the candidate are required." },
      { status: 400 }
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!ROLES.includes(role as Role)) {
    return NextResponse.json({ error: "Select your relationship to the candidate." }, { status: 400 });
  }

  const message = [
    `PROFILE CLAIM REQUEST`,
    `Candidate: ${candidateName}`,
    raceOffice ? `Race: ${raceOffice}` : null,
    slug ? `Profile: /elections/candidate/${slug}` : null,
    `Requested by: ${claimantName} (${ROLE_LABEL[role as Role]})`,
    note ? `\nMessage:\n${note}` : null,
    `\nVerify identity before granting edit access.`,
  ]
    .filter(Boolean)
    .join("\n");

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: `${claimantName} — claim: ${candidateName}`,
    email,
    category: "claim",
    message,
  });

  if (error) {
    console.error("[candidate/claim] contact_messages insert error:", error);
    return NextResponse.json({ error: "Failed to submit your request." }, { status: 500 });
  }

  // Also upsert into candidate_profiles so admins can approve from the dashboard
  if (slug && candidateName && raceOffice) {
    try {
      const svc = createServiceClient();
      await svc.from("candidate_profiles").upsert(
        {
          slug,
          candidate_name: candidateName,
          race_office: raceOffice,
          claimed: true,
          verified: false,
          claimant_name: claimantName,
          claimant_email: email,
          claimant_role: role,
          claimant_message: note || null,
        },
        { onConflict: "slug", ignoreDuplicates: false }
      );
    } catch (e) {
      // Non-fatal — claim message was already written above
      console.error("[candidate/claim] candidate_profiles upsert error:", e);
    }
  }

  return NextResponse.json({ success: true });
}
