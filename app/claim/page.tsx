import type { Metadata } from "next"
import Link from "next/link"
import { createServiceClient } from "@/lib/supabase/service"
import { ClaimForm } from "@/components/claim-form"
import { C } from "@/lib/design-tokens"

/* "Finish your profile" landing page for existing reminder subscribers.
   An emailed link carries an opaque claim_token; we resolve it to the
   subscriber's email SERVER-SIDE (never in the URL) and prefill signup so
   converting a reminder into an account is nearly one field. Personal landing
   page — noindex. */
export const metadata: Metadata = {
  title: "Finish setting up your MyVote profile",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function ClaimPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>
}) {
  const { t } = await searchParams

  let email: string | null = null
  let alreadyClaimed = false
  if (t && /^[0-9a-fA-F-]{36}$/.test(t)) {
    try {
      const supabase = createServiceClient()
      const { data } = await supabase
        .from("election_reminders")
        .select("email, claimed_at")
        .eq("claim_token", t)
        .maybeSingle()
      if (data) {
        email = (data as { email: string }).email
        alreadyClaimed = !!(data as { claimed_at: string | null }).claimed_at
      }
    } catch {
      /* fall through to the generic signup */
    }
  }

  return (
    <div style={{ background: C.page, minHeight: "100vh" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "36px 16px 56px" }}>
        {/* Hero */}
        <div
          style={{
            background: "linear-gradient(135deg, #1A2138 0%, #3D8073 100%)",
            borderRadius: 16,
            padding: "26px 22px",
            color: "#fff",
            marginBottom: 18,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
            MYVOTE
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 8px", lineHeight: 1.2 }}>
            {email ? "You're already on the list — make it official" : "Create your free MyVote profile"}
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.9)", margin: 0 }}>
            You get our Georgia election reminders. A free profile does the rest:
            save your ballot, join neighbors in local groups, sign petitions, and
            add friends.
          </p>
        </div>

        <ClaimForm email={email} token={t ?? null} alreadyClaimed={alreadyClaimed} />

        <p style={{ fontSize: 12, color: C.ink400, textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
          Free forever · nonpartisan · your email is never shared or sold.{" "}
          <Link href="/elections" style={{ color: C.teal, fontWeight: 600 }}>
            Or just browse your ballot →
          </Link>
        </p>
      </div>
    </div>
  )
}
