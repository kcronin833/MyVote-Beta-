import type { Metadata } from "next"
import Link from "next/link"
import { Globe, MapPin, Users, BarChart3, Newspaper, ShieldCheck } from "lucide-react"
import { Logo } from "@/components/logo"

export const metadata: Metadata = {
  title: "Welcome to MyVote — Georgia's 2026 Voter Guide",
  description:
    "Georgia's free, non-partisan 2026 voter guide. See your complete ballot for every one of the 159 Georgia counties, read news from left, right, and center, and find your polling place.",
  robots: { index: false, follow: true },
}

const C = {
  card:    "#FDFCF9",
  rule:    "#E4E0D3",
  ink900:  "#1A2138",
  ink700:  "#3D435A",
  ink500:  "#6B7088",
  teal:    "#3D8073",
  tealDk:  "#2F6358",
  tealSoft:"#E6F0ED",
  page:    "#F5F3EE",
}

const FEATURES = [
  {
    Icon: Newspaper,
    iconColor: "#3D8073",
    iconBg: "#E6F0ED",
    title: "Balanced News",
    desc: "Read left, right, and fact-based perspectives on every story so you see the full picture.",
  },
  {
    Icon: ShieldCheck,
    iconColor: "#059669",
    iconBg: "#ECFDF5",
    title: "Just the Facts",
    desc: "AI-generated factual summaries strip away bias and show you verified information from official sources.",
  },
  {
    Icon: MapPin,
    iconColor: "#B33A2C",
    iconBg: "#FEF2F2",
    title: "Local Focus",
    desc: "Get news and ballot info for your exact area. Enter your ZIP to see races for all 159 Georgia counties.",
  },
  {
    Icon: Users,
    iconColor: "#1D4ED8",
    iconBg: "#EEF2FF",
    title: "Know Your Representatives",
    desc: "Detailed profiles, voting records, and compatibility scores for your elected officials.",
  },
  {
    Icon: BarChart3,
    iconColor: "#B45309",
    iconBg: "#FFFBEB",
    title: "Political Spectrum",
    desc: "Like viewpoints to discover where you fall on the political spectrum based on your actual preferences.",
  },
  {
    Icon: Globe,
    iconColor: "#3D8073",
    iconBg: "#E6F0ED",
    title: "Community Discussion",
    desc: "Comment on articles, tag other users, and engage in meaningful political discourse.",
  },
]

export default function WelcomePage() {
  return (
    <div style={{ minHeight: "100vh", background: C.page }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(145deg, #0F1929 0%, #1A2138 45%, #142E2A 100%)", position: "relative", overflow: "hidden" }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.08, pointerEvents: "none" }}>
          <defs>
            <pattern id="wdots" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#fff" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wdots)" />
        </svg>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "72px 20px 80px", textAlign: "center", position: "relative" }}>
          <Logo size="xl" variant="white" />
          <p style={{ marginTop: 20, fontSize: 17, maxWidth: 540, margin: "20px auto 0", color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
            Georgia&rsquo;s non-partisan voter guide for 2026. See your complete ballot, read every candidate&rsquo;s
            positions, and follow the news from left, right, and center — all in one place.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
            <Link href="/auth/signup" style={{ textDecoration: "none" }}>
              <button style={{ background: "#B33A2C", color: "#fff", borderRadius: 999, padding: "12px 28px", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 2px 16px rgba(179,58,44,0.4)" }}>
                Sign Up Free
              </button>
            </Link>
            <Link href="/auth/signin" style={{ textDecoration: "none" }}>
              <button style={{ background: "transparent", color: "#fff", borderRadius: 999, padding: "12px 28px", fontSize: 15, fontWeight: 600, border: "1.5px solid rgba(255,255,255,0.3)", cursor: "pointer" }}>
                Sign In
              </button>
            </Link>
            <Link href="/quiz" style={{ textDecoration: "none" }}>
              <button style={{ background: "transparent", color: "rgba(255,255,255,0.7)", borderRadius: 999, padding: "12px 28px", fontSize: 15, fontWeight: 600, border: "1.5px solid rgba(255,255,255,0.18)", cursor: "pointer" }}>
                Take the civic quiz →
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "64px 20px" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 700, color: C.ink900, textAlign: "center", marginBottom: 8 }}>Why MyVote?</h2>
        <p style={{ textAlign: "center", color: C.ink500, fontSize: 15, lineHeight: 1.65, maxWidth: 440, margin: "0 auto 40px" }}>
          We believe informed citizens make better decisions. Here is how we help.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {FEATURES.map(({ Icon, iconColor, iconBg, title, desc }) => (
            <div
              key={title}
              className="mv-lift"
              style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 14, padding: "20px 20px 22px", boxShadow: "0 2px 8px rgba(20,24,40,0.04)" }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 11, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Icon size={22} color={iconColor} />
              </div>
              <p style={{ fontWeight: 700, fontSize: 15, color: C.ink900, marginBottom: 6 }}>{title}</p>
              <p style={{ fontSize: 13.5, color: C.ink700, lineHeight: 1.65, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Georgia Coverage */}
      <div style={{ background: C.tealSoft, borderTop: `1px solid #B2D8D0`, borderBottom: `1px solid #B2D8D0`, padding: "64px 20px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 700, color: C.ink900, marginBottom: 10 }}>
            All 159 Georgia Counties Covered
          </h2>
          <p style={{ fontSize: 15, color: C.ink700, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 28px" }}>
            Enter your ZIP code and see every race on your 2026 ballot — from Governor down to local school board — with candidates, key issues, and voting deadlines.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/elections" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", padding: "11px 22px", borderRadius: 999, background: C.tealDk, color: "#fff", fontWeight: 700, fontSize: 14, boxShadow: "0 2px 12px rgba(47,99,88,0.28)" }}>
              View 2026 Georgia Ballot
            </Link>
            <Link href="/news" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", padding: "11px 22px", borderRadius: 999, border: `1.5px solid ${C.tealDk}`, color: C.tealDk, fontWeight: 600, fontSize: 14 }}>
              News Across the Spectrum
            </Link>
            <Link href="/g" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", padding: "11px 22px", borderRadius: 999, border: `1.5px solid #B33A2C`, color: "#B33A2C", fontWeight: 600, fontSize: 14 }}>
              Browse by County
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${C.rule}`, padding: "36px 20px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <Logo size="sm" />
        </div>
        <p style={{ fontSize: 13, color: C.ink500 }}>Inform. Clarify. Empower all political perspectives.</p>
      </footer>
    </div>
  )
}
