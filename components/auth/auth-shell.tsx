"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { ArrowLeft, Vote, Users, Scale, Newspaper } from "lucide-react"

/* Shared chrome for the sign-in / sign-up screens.

   The auth screens are most people's *first* real impression of what MyVote
   is. They used to read like a one-time ballot lookup ("your 2026 ballot
   guide"). MyVote is now a year-round civic platform — your ballot, local
   organizing, official accountability, petitions, and balanced news — so the
   branded panel sells that, evergreen, with no election-dated copy to go stale.

   Desktop: a dark brand panel on the left (purpose + four pillars) beside the
   form. Mobile: the panel collapses to a compact logo + one-line purpose above
   the form so small screens still get the "why." */

const BG = "linear-gradient(145deg, #0F1929 0%, #1A2138 45%, #142E2A 100%)"

const HEADLINE = "Georgia politics you can actually act on."
const SUBHEAD = "Your ballot, your local issues, and the people who represent you — in one place."

const PILLARS = [
  { icon: Vote, title: "Know your ballot", body: "Every race from governor to school board, in plain language." },
  { icon: Users, title: "Organize locally", body: "Start or join groups around the issues in your county." },
  { icon: Scale, title: "Hold officials accountable", body: "See how they voted — with sources — and sign petitions." },
  { icon: Newspaper, title: "Stay informed", body: "Georgia news from left, right, and center, recapped daily." },
]

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", background: BG }}>
      {/* ── Brand panel (desktop only) ── */}
      <div
        className="hidden lg:flex"
        style={{ flex: "1 1 0%", maxWidth: 560, flexDirection: "column", justifyContent: "space-between", padding: "40px 48px" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="lg" variant="white" />
          <Link
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}
          >
            <ArrowLeft size={15} /> Back to site
          </Link>
        </div>

        <div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 34, lineHeight: 1.15, fontWeight: 600, color: "#fff", letterSpacing: -0.5, margin: "0 0 14px" }}>
            {HEADLINE}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.72)", margin: "0 0 30px", maxWidth: 430 }}>
            {SUBHEAD}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <div key={title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(61,128,115,0.22)", border: "1px solid rgba(122,196,180,0.30)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} color="#7AC4B4" />
                </div>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.62)" }}>{body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", margin: 0 }}>
          Free, nonpartisan, and built for Georgians.
        </p>
      </div>

      {/* ── Form panel ── */}
      <div style={{ flex: "1 1 0%", display: "flex", flexDirection: "column", padding: 16 }}>
        {/* Mobile back link (desktop has it in the panel) */}
        <div className="lg:hidden" style={{ paddingTop: 8, paddingBottom: 12 }}>
          <Link
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,0.78)", textDecoration: "none" }}
          >
            <ArrowLeft size={15} /> Back to Home
          </Link>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {/* Mobile compact brand (desktop has the full panel) */}
          <div className="lg:hidden" style={{ marginBottom: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Logo size="lg" variant="white" />
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.78)", textAlign: "center", maxWidth: 320, lineHeight: 1.45, margin: 0 }}>
              {HEADLINE}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
