import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CandidatePhoto } from "@/components/elections/candidate-photo"
import { ARCHETYPES, type ArchetypeKey } from "@/lib/quiz-engine"
import { ARCHETYPE_PROFILE_DATA } from "@/lib/civic-profile-data"

export const metadata: Metadata = {
  title: "Civic Profile Types · MyVote",
  description:
    "Explore all 8 MyVote civic profile types — from Institutional Skeptic to Civic Pragmatist — and discover which historical figures shared your values.",
  alternates: { canonical: "/profiles" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Civic Profile Types · MyVote",
    description: "8 civic profiles grounded in peer-reviewed political psychology. Which one are you?",
    type: "website",
  },
}

// Hex gradient per archetype (converted from Tailwind palette)
const GRADIENTS: Record<ArchetypeKey, [string, string]> = {
  institutional_skeptic:    ["#1E293B", "#475569"],
  freedom_first:            ["#92400E", "#D97706"],
  public_safety:            ["#1E3A5F", "#2563EB"],
  local_impact:             ["#064E3B", "#059669"],
  independent_localist:     ["#4C1D95", "#7C3AED"],
  community_builder:        ["#134E4A", "#0D9488"],
  national_policy_watcher:  ["#1E1B4B", "#4F46E5"],
  civic_pragmatist:         ["#44403C", "#78716C"],
}

const ARCHETYPE_ORDER: ArchetypeKey[] = [
  "civic_pragmatist",
  "freedom_first",
  "community_builder",
  "institutional_skeptic",
  "local_impact",
  "national_policy_watcher",
  "public_safety",
  "independent_localist",
]

const C = {
  card:    "#FDFCF9",
  rule:    "#E4E0D3",
  ink900:  "#1A2138",
  ink700:  "#3D435A",
  ink500:  "#6B7088",
  ink400:  "#8B8FA3",
  teal:    "#3D8073",
  tealDk:  "#2F6358",
  tealSoft:"#E6F0ED",
  page:    "#F5F3EE",
  shade:   "#F0EDE6",
}

const cardStyle = {
  background: C.card,
  border: `1px solid ${C.rule}`,
  borderRadius: 16,
  boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
  overflow: "hidden",
}

const researchFrameworks = [
  {
    title: "Moral Foundations Theory",
    authors: "Jonathan Haidt & Jesse Graham",
    desc: "Six universal moral foundations — Care, Fairness, Loyalty, Authority, Sanctity, and Liberty — that people weight differently, producing distinct moral \"taste profiles\" that map onto civic orientations.",
  },
  {
    title: "Big Five Personality Research",
    authors: "Costa & McCrae / Goldberg",
    desc: "Decades of replicated research showing that Openness, Conscientiousness, Agreeableness, Extraversion, and Neuroticism predict political values and civic behavior with surprising consistency.",
  },
  {
    title: "Pew Research Political Typology",
    authors: "Pew Research Center",
    desc: "Large-sample cluster analysis of American political attitudes that consistently identifies 9–12 coherent value groups that don't map neatly onto the two-party spectrum.",
  },
  {
    title: "Post-Materialist Values",
    authors: "Ronald Inglehart",
    desc: "Research showing that as economic security rises, a segment of citizens prioritizes self-expression, autonomy, and quality of life over security and conformity — reshaping political coalitions in democracies worldwide.",
  },
]

export default function CivicProfilesPage() {
  return (
    <div style={{ minHeight: "100vh", background: C.page }}>

      {/* ── Breadcrumb ── */}
      <div style={{ borderBottom: `1px solid ${C.rule}`, background: C.card }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
          <Link
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: C.ink500, textDecoration: "none", padding: "10px 0" }}
          >
            <ArrowLeft size={14} />
            Home
          </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{ background: "linear-gradient(145deg, #0F1929 0%, #1A2138 45%, #142E2A 100%)" }}>
        {/* Dot pattern */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.1, pointerEvents: "none" }}>
            <defs>
              <pattern id="pdots" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.2" fill="#fff" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pdots)" />
          </svg>
          <div style={{ maxWidth: 780, margin: "0 auto", padding: "64px 16px 72px", textAlign: "center", position: "relative" }}>
            <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6FBFB0", marginBottom: 14 }}>
              MyVote Civic Profiles
            </p>
            <h1 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 18,
            }}>
              What kind of civic voice are you?
            </h1>
            <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.1rem)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 580, margin: "0 auto 32px" }}>
              MyVote uses 12 questions to map you to one of 8 civic profiles — each
              reflecting a distinct set of values about government, freedom, and community.
              Below you&rsquo;ll find every profile, the research behind it, and the
              historical figures who embodied it.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/quiz"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "12px 28px", borderRadius: 999,
                  background: C.teal, color: "#fff",
                  fontWeight: 700, fontSize: 14.5, textDecoration: "none",
                  boxShadow: "0 2px 14px rgba(61,128,115,0.4)",
                }}
              >
                Take the quiz — find your profile
              </Link>
              <Link
                href="/profile"
                style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "12px 28px", borderRadius: 999,
                  border: "1.5px solid rgba(255,255,255,0.28)", color: "#fff",
                  fontWeight: 600, fontSize: 14.5, textDecoration: "none",
                  background: "rgba(255,255,255,0.07)",
                }}
              >
                View my profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Research basis strip ── */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.rule}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 16px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.ink400, textAlign: "center", marginBottom: 10 }}>
            The Research Behind the Profiles
          </p>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.ink900, textAlign: "center", marginBottom: 24 }}>
            Grounded in peer-reviewed political psychology
          </h2>
          <p style={{ fontSize: 13.5, color: C.ink700, lineHeight: 1.7, marginBottom: 20, maxWidth: 600, margin: "0 auto 24px" }}>
            MyVote&rsquo;s 8 civic profiles are derived from four evidence-based frameworks used by political scientists and psychologists to explain how people actually form their civic values — not the partisan labels news media assigns.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            {researchFrameworks.map((f) => (
              <div key={f.title} style={{ background: C.page, borderRadius: 12, border: `1px solid ${C.rule}`, padding: "14px 16px" }}>
                <p style={{ fontWeight: 700, color: C.ink900, fontSize: 13.5, marginBottom: 2 }}>{f.title}</p>
                <p style={{ fontSize: 11.5, color: C.ink400, marginBottom: 8 }}>{f.authors}</p>
                <p style={{ fontSize: 12.5, color: C.ink700, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Profile cards ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: 20 }}>
          {ARCHETYPE_ORDER.map((key) => {
            const arch = ARCHETYPES[key]
            const [gradFrom, gradTo] = GRADIENTS[key]
            const data = ARCHETYPE_PROFILE_DATA[key]
            const { primaryFigure, moreFigures, science } = data
            const allFigures = [primaryFigure, ...moreFigures]

            return (
              <div key={key} id={key} style={{ ...cardStyle, scrollMarginTop: 80 }}>
                {/* Gradient banner */}
                <div style={{
                  background: `linear-gradient(135deg, ${gradFrom} 0%, ${gradTo} 100%)`,
                  padding: "24px 22px",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  {/* Subtle dot pattern */}
                  <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.12, pointerEvents: "none" }}>
                    <defs>
                      <pattern id={`dp-${key}`} x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                        <circle cx="1.5" cy="1.5" r="1" fill="#fff" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#dp-${key})`} />
                  </svg>
                  <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <span style={{ fontSize: 40, lineHeight: 1, display: "block", marginBottom: 8 }}>{arch.emoji}</span>
                      <h2 style={{ fontSize: 19, fontWeight: 700, color: "#fff", marginBottom: 4, lineHeight: 1.2 }}>{arch.label}</h2>
                      <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.55 }}>{arch.headline}</p>
                    </div>
                    <span style={{
                      flexShrink: 0,
                      fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                      background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.28)",
                      borderRadius: 999, padding: "4px 10px", color: "#fff", whiteSpace: "nowrap", marginTop: 4,
                    }}>
                      {arch.tag}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div style={{ padding: "18px 20px 0" }}>
                  <p style={{ fontSize: 13.5, color: C.ink700, lineHeight: 1.65 }}>{arch.description}</p>
                </div>

                {/* Research basis */}
                <div style={{ margin: "14px 20px", background: "#EEF2FF", borderRadius: 10, border: "1px solid #C7D2FE", padding: "12px 14px" }}>
                  <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6366F1", marginBottom: 6 }}>
                    Research Basis
                  </p>
                  <p style={{ fontSize: 12.5, color: "#3730A3", lineHeight: 1.6 }}>
                    {science.replace(/\*\*[^*]+\*\*\s*/g, "")}
                  </p>
                </div>

                {/* Historical figures */}
                <div style={{ padding: "0 20px 20px" }}>
                  <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.ink400, marginBottom: 12 }}>
                    Historical Parallels
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {allFigures.map((fig, idx) => (
                      <div
                        key={fig.name}
                        style={{
                          display: "flex", gap: 12, alignItems: "flex-start",
                          borderRadius: 10, border: `1px solid ${idx === 0 ? C.rule : C.rule + "80"}`,
                          background: idx === 0 ? C.page : C.card,
                          padding: "12px 14px",
                        }}
                      >
                        <div style={{ flexShrink: 0 }}>
                          <CandidatePhoto
                            name={fig.name}
                            wikipediaTitle={fig.wikiTitle}
                            size={idx === 0 ? 60 : 44}
                            shape="circle"
                            partyColor="#6B7088"
                          />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 2 }}>
                            <p style={{ fontWeight: 700, color: C.ink900, fontSize: 13.5 }}>{fig.name}</p>
                            {idx === 0 && (
                              <span style={{ fontSize: 10.5, fontWeight: 700, background: C.shade, color: C.ink500, borderRadius: 999, padding: "2px 8px" }}>
                                Primary
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: 12, color: C.ink400, marginBottom: 6 }}>{fig.years} · {fig.role}</p>
                          <blockquote style={{ fontSize: 12.5, fontStyle: "italic", color: C.ink700, borderLeft: `2px solid ${C.rule}`, paddingLeft: 10, lineHeight: 1.6, margin: 0 }}>
                            &ldquo;{fig.quote}&rdquo;
                          </blockquote>
                          {idx === 0 && (
                            <p style={{ fontSize: 12.5, color: C.ink700, lineHeight: 1.6, marginTop: 8 }}>
                              {fig.why}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: 56, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          <p style={{ fontSize: 14, color: C.ink500, marginBottom: 18, lineHeight: 1.65 }}>
            Not sure which profile fits you? The quiz takes 2–3 minutes and
            never assigns a partisan label.
          </p>
          <Link
            href="/quiz"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "13px 32px", borderRadius: 999,
              background: C.teal, color: "#fff",
              fontWeight: 700, fontSize: 15, textDecoration: "none",
              boxShadow: "0 2px 16px rgba(61,128,115,0.32)",
            }}
          >
            Discover your civic profile →
          </Link>
        </div>
      </div>
    </div>
  )
}
