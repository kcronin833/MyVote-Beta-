"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  MapPin,
  Newspaper,
  ShieldCheck,
  Vote,
  Scale,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import dynamic from "next/dynamic"
import { useAuth } from "@/components/auth-context"
import { Logo } from "@/components/logo"
import { EarlyVotingBanner } from "@/components/early-voting-banner"

/* The logged-in app shell and onboarding quiz are only needed after auth —
   loading them lazily keeps the public landing page bundle small. */
const DesktopHome = dynamic(
  () => import("@/components/desktop/home").then((m) => m.DesktopHome),
  { ssr: false }
)
const OnboardingQuiz = dynamic(
  () => import("@/components/onboarding-quiz").then((m) => m.OnboardingQuiz),
  { ssr: false }
)

/* ── Election countdown ──────────────────────────────────────────────── */
const GEORGIA_PRIMARY = new Date("2026-05-19T07:00:00-04:00")
const GEORGIA_RUNOFF  = new Date("2026-06-16T07:00:00-04:00")
const GEORGIA_GENERAL = new Date("2026-11-03T07:00:00-05:00")

/* Hero switches to runoff urgency during runoff week; evaluated at build/
   render time, so the day after the runoff a redeploy reverts it. The date
   guard also self-heals on the client since the page is a client component. */
const RUNOFF_MODE = Date.now() < new Date("2026-06-17T00:00:00-04:00").getTime()

function useElectionCountdown() {
  const [info, setInfo] = useState<{ label: string; days: number } | null>(null)
  useEffect(() => {
    const now = new Date()
    let target: Date
    let label: string
    if (now < GEORGIA_PRIMARY) {
      target = GEORGIA_PRIMARY; label = "Georgia Primary"
    } else if (now < GEORGIA_RUNOFF) {
      target = GEORGIA_RUNOFF; label = "June 16 Runoff"
    } else {
      target = GEORGIA_GENERAL; label = "General Election"
    }
    const days = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86_400_000))
    setInfo({ label, days })
  }, [])
  return info
}

/* ── Hero ZIP form ───────────────────────────────────────────────────── */
function HeroZipForm() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [zip, setZip] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const cleaned = zip.trim()
    if (!/^\d{5}$/.test(cleaned)) {
      setError("Please enter a 5-digit ZIP code.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/ballot-lookup?zip=${cleaned}`, { cache: "no-store" })
      const data = await res.json()
      if (data.found && data.href) {
        router.push(data.href)
        return
      }
      setError(data.error || "That ZIP wasn't found — try a Georgia ZIP like 30309 or 31401.")
    } catch {
      setError("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 480 }}>
      {/* Unified white pill */}
      <div
        style={{
          display: "flex",
          background: "#ffffff",
          borderRadius: 999,
          boxShadow: "0 4px 40px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.07)",
          overflow: "hidden",
        }}
      >
        {/* Input */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", position: "relative" }}>
          <MapPin
            size={17}
            style={{ position: "absolute", left: 15, color: "#8B8FA3", flexShrink: 0, pointerEvents: "none" }}
            aria-hidden
          />
          <input
            ref={inputRef}
            inputMode="numeric"
            maxLength={5}
            placeholder="Georgia ZIP code"
            value={zip}
            onChange={(e) => { setZip(e.target.value.replace(/\D/g, "")); setError(null) }}
            aria-label="Georgia ZIP code"
            style={{
              width: "100%",
              height: 56,
              paddingLeft: 42,
              paddingRight: 14,
              border: "none",
              outline: "none",
              background: "transparent",
              color: "#1A2138",
              fontSize: 16,
              fontWeight: 500,
            }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            height: 56,
            padding: "0 24px",
            background: "#B33A2C",
            color: "#ffffff",
            border: "none",
            fontWeight: 700,
            fontSize: 15,
            cursor: loading ? "wait" : "pointer",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
            transition: "background 0.15s ease",
          }}
        >
          {loading ? (
            <span
              style={{
                width: 18,
                height: 18,
                border: "2.5px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                display: "inline-block",
                animation: "mv-spin 0.75s linear infinite",
              }}
            />
          ) : (
            <ArrowRight size={16} />
          )}
          <span className="hidden sm:inline">{loading ? "Finding…" : "See my ballot"}</span>
          <span className="sm:hidden">{loading ? "…" : "Go"}</span>
        </button>
      </div>

      {error && (
        <p style={{ marginTop: 10, fontSize: 13, color: "#FFB8AD", lineHeight: 1.5 }}>
          {error}{" "}
          <Link href="/g" style={{ color: "#7DCFC5", textDecoration: "underline", fontWeight: 600 }}>
            Browse by county →
          </Link>
        </p>
      )}
    </form>
  )
}

/* ── Feature cards ───────────────────────────────────────────────────── */
const FEATURES = [
  {
    Icon: Scale,
    iconColor: "#B33A2C",
    iconBg: "#FEF0EE",
    title: "See Every Side",
    desc: "Left, center, and right perspectives on every story — decide for yourself.",
  },
  {
    Icon: Newspaper,
    iconColor: "#3D8073",
    iconBg: "#E6F0ED",
    title: "Georgia & National News",
    desc: "Curated national and local Georgia news, updated daily across the spectrum.",
  },
  {
    Icon: MapPin,
    iconColor: "#B8862F",
    iconBg: "#F4ECD8",
    title: "Know Your Ballot",
    desc: "Every race — governor to local school board — with real candidates and key dates.",
  },
  {
    Icon: ShieldCheck,
    iconColor: "#6B3A6B",
    iconBg: "#F5EAF5",
    title: "Facts First",
    desc: "Start with verified facts and candidate positions, then explore opinions.",
  },
]

/* ── Page ────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const { user, loading: authLoading } = useAuth()
  const [guestMode, setGuestMode] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("myvote_guest") === "true"
    }
    return false
  })
  const [showQuiz, setShowQuiz] = useState(false)
  const countdown = useElectionCountdown()

  // Synchronous hint that a Supabase session exists (token in localStorage).
  // Lets us show the spinner ONLY to returning logged-in users; new visitors
  // and crawlers get the full landing page immediately — previously the
  // prerendered HTML was just the spinner, which gutted SEO and LCP.
  const [sessionHint] = useState(() => {
    if (typeof window === "undefined") return false
    try {
      return Object.keys(localStorage).some(
        (k) => k.startsWith("sb-") && k.includes("auth-token")
      )
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (!user) return
    const alreadyShown = localStorage.getItem("mv_quiz_shown")
    if (alreadyShown) return
    const likes = JSON.parse(localStorage.getItem("viewpointLikes") || "[]")
    if (likes.length === 0) setShowQuiz(true)
  }, [user])

  if (authLoading && (sessionHint || guestMode)) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0F1929 0%, #1A2138 55%, #142E2A 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <span
          style={{
            width: 36,
            height: 36,
            border: "3px solid rgba(61,128,115,0.3)",
            borderTopColor: "#3D8073",
            borderRadius: "50%",
            display: "inline-block",
            animation: "mv-spin 0.8s linear infinite",
          }}
        />
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
          Loading MyVote…
        </p>
      </div>
    )
  }

  /* ── Logged-in / guest → full app ── */
  if (user || guestMode) {
    return (
      <>
        {showQuiz && <OnboardingQuiz onDismiss={() => setShowQuiz(false)} />}
        <DesktopHome />
      </>
    )
  }

  /* ── Landing page (logged-out) ── */
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F3F1EB" }}>

      {/* ── Minimal top nav ── */}
      <header
        className="sticky top-0 z-20 border-b border-rule"
        style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", boxShadow: "0 1px 6px rgba(20,24,40,0.06)" }}
      >
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Logo size="sm" />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link
              href="/auth/signin"
              style={{
                padding: "7px 14px",
                borderRadius: 999,
                color: "#3D435A",
                fontWeight: 600,
                fontSize: 13.5,
                textDecoration: "none",
                transition: "color 0.15s",
              }}
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              style={{
                padding: "7px 16px",
                borderRadius: 999,
                background: "#3D8073",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: 13.5,
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(61,128,115,0.3)",
                transition: "background 0.15s",
              }}
            >
              Sign up free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero — dark gradient ── */}
      <section
        style={{
          background: "linear-gradient(145deg, #0F1929 0%, #1A2138 45%, #142E2A 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          padding: "72px 16px 80px",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Countdown pill */}
          {countdown && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.09)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 999,
                padding: "5px 16px 5px 10px",
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#FF7B6B",
                  flexShrink: 0,
                  animation: "mv-pulse 2s ease-in-out infinite",
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,0.82)" }}>
                <strong style={{ color: "#FF9B8E" }}>{countdown.days} days</strong>
                {" "}until the {countdown.label}
              </span>
            </div>
          )}

          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.1rem, 5.5vw, 3.4rem)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 18,
            }}
          >
            {RUNOFF_MODE ? (
              <>
                Ready for the{" "}
                <span style={{ color: "#6FBFB0" }}>June 16 Runoff?</span>
              </>
            ) : (
              <>
                What&rsquo;s on your{" "}
                <span style={{ color: "#6FBFB0" }}>2026 Georgia ballot?</span>
              </>
            )}
          </h1>

          {/* Subhead */}
          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
              color: "rgba(255,255,255,0.75)",
              maxWidth: 480,
              lineHeight: 1.65,
              marginBottom: 36,
            }}
          >
            {RUNOFF_MODE
              ? "Election day is Tuesday, June 16 — polls open 7am to 7pm. Enter your ZIP for key dates, then confirm your exact runoff ballot at the GA Secretary of State's My Voter Page."
              : "Enter your ZIP and see every race — governor, U.S. Senate, your district, and local offices — with real candidates and key dates."}
          </p>

          {/* Early voting urgency strip */}
          <div style={{ width: "100%", maxWidth: 480, marginBottom: 12 }}>
            <EarlyVotingBanner compact />
          </div>

          {/* Zip form */}
          <HeroZipForm />

          {/* Trust row */}
          <div
            style={{
              display: "flex",
              gap: "clamp(16px, 4vw, 32px)",
              marginTop: 20,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {["Free to use", "Non-partisan", "Georgia focused"].map((t) => (
              <span
                key={t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.78)",
                  fontWeight: 500,
                }}
              >
                <CheckCircle2 size={14} style={{ color: "#6FBFB0", flexShrink: 0 }} />
                {t}
              </span>
            ))}
          </div>

          {/* Explore destinations — quiz, candidates, news */}
          <p
            style={{
              marginTop: 30,
              marginBottom: 10,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.6,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.66)",
            }}
          >
            Or explore first
          </p>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: 560,
            }}
          >
            {[
              { href: "/quiz",       icon: Scale,     label: "Take the quiz" },
              { href: "/elections",  icon: Vote,      label: "Browse candidates" },
              { href: "/news/local", icon: MapPin,    label: "Local news" },
              { href: "/news",       icon: Newspaper, label: "National news" },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "10px 18px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  color: "#fff",
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  backdropFilter: "blur(4px)",
                }}
              >
                <Icon size={15} style={{ color: "#6FBFB0", flexShrink: 0 }} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #E4E0D3",
          padding: "18px 16px",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            gap: "clamp(24px, 6vw, 64px)",
            flexWrap: "wrap",
          }}
        >
          {[
            { num: "159", label: "Georgia Counties" },
            { num: "14",  label: "U.S. House Districts" },
            { num: "100%", label: "Free to Use" },
          ].map(({ num, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1A2138", lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: 12, color: "#6B7088", marginTop: 3, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Why create an account ── */}
      <section style={{ background: "#F3F1EB", padding: "72px 16px 80px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)",
              fontWeight: 700,
              color: "#1A2138",
              textAlign: "center",
              letterSpacing: "-0.02em",
              marginBottom: 10,
            }}
          >
            More than a ballot guide
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "#6B7088",
              fontSize: 16,
              lineHeight: 1.65,
              maxWidth: 480,
              margin: "0 auto 48px",
            }}
          >
            Create a free account to save your picks, follow balanced news, and
            stay informed through Election Day.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {FEATURES.map(({ Icon, iconColor, iconBg, title, desc }) => (
              <div
                key={title}
                className="mv-lift"
                style={{
                  background: "#ffffff",
                  borderRadius: 16,
                  padding: "24px 22px",
                  border: "1px solid #E4E0D3",
                  boxShadow: "0 2px 8px rgba(20,24,40,0.04)",
                  cursor: "default",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    background: iconBg,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Icon size={26} style={{ color: iconColor }} />
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#1A2138",
                    marginBottom: 8,
                    lineHeight: 1.25,
                  }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: 14, color: "#6B7088", lineHeight: 1.6, margin: 0 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 44 }}>
            <Link href="/auth/signup" style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: "#3D8073",
                  color: "#fff",
                  borderRadius: 999,
                  padding: "14px 38px",
                  fontSize: 15,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 2px 16px rgba(61,128,115,0.35)",
                  transition: "background 0.15s ease, box-shadow 0.15s ease",
                }}
              >
                Create Free Account
              </button>
            </Link>
            <p style={{ marginTop: 12, fontSize: 13.5, color: "#8B8FA3" }}>
              Already have an account?{" "}
              <Link href="/auth/signin" style={{ color: "#3D8073", textDecoration: "underline", fontWeight: 600 }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Urgency dark section ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #1A2138 0%, #142E2A 100%)",
          padding: "72px 16px",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(255,255,255,0.09)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 999,
              padding: "5px 14px",
              fontSize: 11.5,
              fontWeight: 700,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 22,
            }}
          >
            <Vote size={13} style={{ color: "#6FBFB0" }} />
            Georgia 2026
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.75rem, 3.5vw, 2.2rem)",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              marginBottom: 14,
            }}
          >
            Don&rsquo;t walk into the booth unprepared
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 16,
              lineHeight: 1.65,
              marginBottom: 32,
              maxWidth: 520,
              margin: "0 auto 32px",
            }}
          >
            The U.S. Senate seat, all 14 House districts, the governorship, and dozens
            of local offices are on the 2026 Georgia ballot. Know your races now.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <Link href="/elections" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    background: "#B33A2C",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "13px 28px",
                    fontSize: 15,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 2px 16px rgba(179,58,44,0.4)",
                  }}
                >
                  <Vote size={16} />
                  2026 Races &amp; Key Dates
                </button>
              </Link>
              <Link href="/auth/signup" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    background: "transparent",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "13px 28px",
                    fontSize: 15,
                    fontWeight: 600,
                    border: "1.5px solid rgba(255,255,255,0.3)",
                    cursor: "pointer",
                  }}
                >
                  Create Free Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#F3F1EB", borderTop: "1px solid #E4E0D3", padding: "40px 16px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <Logo size="sm" />
          </div>
          <p style={{ fontSize: 13, color: "#8B8FA3", marginBottom: 16 }}>
            Inform. Clarify. Empower all political perspectives.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            {[
              { href: "/about",     label: "About" },
              { href: "/elections", label: "Elections 2026" },
              { href: "/privacy",   label: "Privacy Policy" },
              { href: "/terms",     label: "Terms of Service" },
              { href: "/contact",   label: "Contact" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{ fontSize: 13, color: "#8B8FA3", textDecoration: "none", fontWeight: 500 }}
              >
                {label}
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 24, fontSize: 11.5, color: "#B0B4C4", lineHeight: 1.65, maxWidth: 480, margin: "24px auto 0" }}>
            MyVote is not affiliated with any political party, campaign, or government entity.
            Always verify voting information at{" "}
            <a
              href="https://sos.ga.gov"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline", color: "#8B8FA3" }}
            >
              sos.ga.gov
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  )
}
