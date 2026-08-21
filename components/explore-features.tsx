import Link from "next/link"
import { C } from "@/lib/design-tokens"

/* "Explore everything MyVote offers" — a feature-discovery grid for the
   dead-end pages (quiz results, civic-profile share page, the user's profile).
   People were landing on their civic profile and stopping there; this turns
   that moment into a launchpad into the rest of the product. Pure presentational
   (no hooks) so it renders in both server and client components. */

type FeatureKey =
  | "elections" | "news" | "groups" | "petitions" | "people" | "profiles"

interface Feature {
  key: FeatureKey
  href: string
  emoji: string
  title: string
  blurb: string
}

const FEATURES: Feature[] = [
  { key: "elections", href: "/elections", emoji: "🗳️", title: "Your ballot",
    blurb: "Every 2026 race for your address — governor to school board." },
  { key: "news", href: "/news", emoji: "📰", title: "News, all sides",
    blurb: "One neutral summary per story, with the left–center–right spectrum." },
  { key: "groups", href: "/groups", emoji: "🤝", title: "Groups",
    blurb: "Organize with neighbors on local issues and track council meetings." },
  { key: "petitions", href: "/petitions", emoji: "✍️", title: "Petitions",
    blurb: "Start or sign a petition that puts pressure where it counts." },
  { key: "people", href: "/search", emoji: "👥", title: "Find your people",
    blurb: "Search members, add friends, and see who's organizing near you." },
  { key: "profiles", href: "/profiles", emoji: "🧭", title: "Civic profiles",
    blurb: "Compare all 8 profiles and the historical figures who shared them." },
]

export function ExploreFeatures({
  heading = "Explore everything MyVote offers",
  note,
  exclude = [],
}: {
  heading?: string
  /** Optional line under the heading. */
  note?: string
  /** Feature keys to hide (e.g. the page you're already on). */
  exclude?: FeatureKey[]
}) {
  const items = FEATURES.filter((f) => !exclude.includes(f.key))

  return (
    <section
      style={{
        background: C.card,
        border: `1px solid ${C.rule}`,
        borderRadius: 14,
        boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
        padding: "16px 16px 14px",
      }}
    >
      <p style={{ fontSize: 14.5, fontWeight: 800, color: C.ink900, margin: "0 0 2px" }}>{heading}</p>
      <p style={{ fontSize: 12.5, color: C.ink500, margin: `0 0 ${note ? 4 : 12}px`, lineHeight: 1.5 }}>
        {note ?? "You're set up — here's the rest of what you can do."}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 8,
          marginTop: 10,
        }}
      >
        {items.map((f) => (
          <Link
            key={f.key}
            href={f.href}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "12px 13px",
              borderRadius: 10,
              border: `1px solid ${C.rule}`,
              background: "#fff",
              textDecoration: "none",
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{f.emoji}</span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: C.ink900 }}>
                {f.title} <span style={{ color: C.teal }}>→</span>
              </span>
              <span style={{ display: "block", fontSize: 12, color: C.ink500, lineHeight: 1.45, marginTop: 2 }}>
                {f.blurb}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
