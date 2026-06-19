import type { Metadata } from "next"
import Link from "next/link"
import { Globe, ShieldCheck, MapPin, BarChart3, Users, Newspaper, Bot, Filter, CheckCircle, AlertTriangle } from "lucide-react"

export const metadata: Metadata = {
  title: "About MyVote",
  description:
    "Learn how MyVote helps Georgia citizens stay informed with balanced political news, non-partisan voter guides, and civic engagement tools for the 2026 election cycle.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About MyVote — Georgia's Non-Partisan Voter Guide",
    description:
      "Built for Georgia voters who want the facts without the spin. Read about our mission, team, and how we present news from every perspective.",
    type: "website",
  },
}

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
  borderRadius: 12,
  boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
}

const FEATURES = [
  {
    Icon: Newspaper,
    iconColor: "#3D8073",
    iconBg: "#E6F0ED",
    title: "Balanced News",
    body: "Read the same story from left-leaning, right-leaning, and centrist sources side by side. No more living in a news bubble.",
  },
  {
    Icon: ShieldCheck,
    iconColor: "#059669",
    iconBg: "#ECFDF5",
    title: "Just the Facts",
    body: "Our AI summary cuts through opinion and shows you verified factual reporting, with links to original sources.",
  },
  {
    Icon: MapPin,
    iconColor: "#B33A2C",
    iconBg: "#FEF2F2",
    title: "Local Georgia Focus",
    body: "News specific to your area of Georgia, plus profiles of your local and state representatives.",
  },
  {
    Icon: Users,
    iconColor: "#1D4ED8",
    iconBg: "#EEF2FF",
    title: "Know Your Representatives",
    body: "Detailed profiles of Georgia's U.S. Senators, House members, and local officials — including key issues.",
  },
  {
    Icon: BarChart3,
    iconColor: "#B45309",
    iconBg: "#FFFBEB",
    title: "Your Political Spectrum",
    body: "Interact with stories to discover where your views actually land on the spectrum — based on your choices, not a quiz.",
  },
  {
    Icon: Globe,
    iconColor: "#3D8073",
    iconBg: "#E6F0ED",
    title: "Community Discussion",
    body: "Comment on articles and engage with other Georgia citizens in real, civil political discourse.",
  },
]

const AI_CARDS = [
  {
    Icon: Filter,
    color: "#3D8073",
    bg: "#E6F0ED",
    border: "#B2D8D0",
    title: "What we curate",
    body: "We pull from established national news sources (AP, Reuters, NPR, Fox News, Politico, and others). Our AI reads headlines and summaries to select stories relevant to Georgia voters and national politics.",
  },
  {
    Icon: CheckCircle,
    color: "#059669",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    title: "What the AI does",
    body: "The AI writes a brief, neutral summary of each story and tags it by topic. It does not add opinion or analysis. Every summary links directly to the original source so you can read the full article.",
  },
  {
    Icon: AlertTriangle,
    color: "#B45309",
    bg: "#FFFBEB",
    border: "#FDE68A",
    title: "What it can't do",
    body: "AI can make mistakes. It may occasionally miss context or select a story that doesn't belong. We review the feed regularly. If you see something off, use the Contact page to flag it.",
  },
]

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: C.page }}>

      <div style={{ background: "linear-gradient(145deg, #0F1929 0%, #1A2138 45%, #142E2A 100%)", position: "relative", overflow: "hidden" }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.08, pointerEvents: "none" }}>
          <defs>
            <pattern id="adots" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#fff" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#adots)" />
        </svg>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "56px 20px 64px", position: "relative" }}>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 5vw, 2.8rem)",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 14,
          }}>
            About MyVote
          </h1>
          <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.1rem)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 560 }}>
            Helping Georgia citizens stay informed, engaged, and empowered — from all political perspectives.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "48px 20px 80px", display: "flex", flexDirection: "column", gap: 48 }}>

        <section style={{ background: "#1A2138", borderRadius: 14, padding: "28px 28px 30px" }}>
          <p style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.25rem)", fontWeight: 700, color: "#ffffff", lineHeight: 1.4, marginBottom: 12 }}>
            No grants. No donors. No agenda.
          </p>
          <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, maxWidth: 580 }}>
            MyVote is entirely self-funded. We have not accepted grants, donations, or outside investment
            from any organization, political party, foundation, or individual donor. That independence isn&rsquo;t
            a limitation — it&rsquo;s the point. When nobody pays for it, nobody owns it.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, color: C.ink900, marginBottom: 16 }}>Our Mission</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ fontSize: 16, color: C.ink700, lineHeight: 1.75 }}>
              MyVote was built on a simple belief: <strong style={{ color: C.ink900 }}>an informed voter is a better voter.</strong> In a
              time when political media is deeply fragmented and trust is low, we created a platform where
              Georgians can read news from across the political spectrum — left, right, and down-the-middle — all
              in one place.
            </p>
            <p style={{ fontSize: 15, color: C.ink700, lineHeight: 1.75 }}>
              We are not here to tell you what to think. We are here to make sure you have access to what
              everyone is saying, so you can form your own opinions. Whether you lean left, lean right, or call
              yourself an independent, MyVote is for you.
            </p>
            <p style={{ fontSize: 15, color: C.ink700, lineHeight: 1.75 }}>
              We launched our pilot in Georgia ahead of the 2026 election cycle because Georgia has become one of
              the most politically consequential states in the country. From Atlanta's city council to the U.S.
              Senate, the decisions made in Georgia affect the whole nation.
            </p>
          </div>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, color: C.ink900, marginBottom: 18 }}>What MyVote Does</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {FEATURES.map(({ Icon, iconColor, iconBg, title, body }) => (
              <div key={title} style={{ ...cardStyle, padding: "18px 18px 20px" }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Icon size={21} color={iconColor} />
                </div>
                <p style={{ fontWeight: 700, fontSize: 14.5, color: C.ink900, marginBottom: 6 }}>{title}</p>
                <p style={{ fontSize: 13.5, color: C.ink700, lineHeight: 1.65 }}>{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: C.tealSoft, borderRadius: 14, border: `1px solid #B2D8D0`, padding: "28px 28px 30px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, color: C.tealDk, marginBottom: 12 }}>Georgia 2026 Pilot</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontSize: 14.5, color: C.ink700, lineHeight: 1.75 }}>
              MyVote is currently in a test pilot phase focused on Georgia voters ahead of the 2026 election
              cycle. We are starting here because Georgia has proven to be a true battleground state — home to
              some of the most competitive and consequential races in the country.
            </p>
            <p style={{ fontSize: 14.5, color: C.ink700, lineHeight: 1.75 }}>
              During this pilot, we are gathering feedback from real Georgia voters to improve the platform. Your
              experience matters to us. If something isn't working or you have ideas to make MyVote more useful,
              please reach out through our Contact page.
            </p>
            <p style={{ fontSize: 14.5, color: C.ink700, lineHeight: 1.75 }}>
              Our goal is to expand MyVote to other states following a successful Georgia pilot. But for now — we are all in on Georgia.
            </p>
          </div>
        </section>

        <section style={{ borderTop: `1px solid ${C.rule}`, paddingTop: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Bot size={20} color={C.teal} />
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, color: C.ink900 }}>How Our AI Works</h2>
          </div>
          <p style={{ fontSize: 13.5, color: C.ink500, marginBottom: 20, lineHeight: 1.7, maxWidth: 560 }}>
            MyVote uses AI to help surface relevant political news — but we believe you deserve to
            know exactly how it works and what its limits are.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            {AI_CARDS.map(({ Icon, color, bg, border, title, body }) => (
              <div key={title} style={{ borderRadius: 12, padding: "16px 18px", background: bg, border: `1px solid ${border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Icon size={15} color={color} />
                  <p style={{ fontWeight: 700, fontSize: 13.5, color }}>{title}</p>
                </div>
                <p style={{ fontSize: 13, color: C.ink700, lineHeight: 1.65 }}>{body}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: C.ink400, marginTop: 14, lineHeight: 1.65 }}>
            MyVote does not use AI to generate or fabricate news stories. All stories originate from
            human journalists at named publications. The AI role is curation and summarization only.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, color: C.ink900, marginBottom: 16 }}>What We Are Not</h2>
          <ul style={{ display: "flex", flexDirection: "column", gap: 10, listStyle: "none", padding: 0 }}>
            {[
              "We are not affiliated with any political party, candidate, or campaign.",
              "We are not funded by political organizations, advocacy groups, foundations, or outside donors of any kind.",
              "We are not a news organization — we aggregate and organize news from existing sources.",
              "We do not editorialize or take positions on political issues.",
              "We do not sell your personal data to political campaigns or advertisers.",
              "We are not a replacement for your county's official election resources — always verify voting info at sos.ga.gov.",
            ].map((item) => (
              <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14.5, color: C.ink700, lineHeight: 1.6 }}>
                <span style={{ color: C.teal, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section style={{ borderTop: `1px solid ${C.rule}`, paddingTop: 36 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, color: C.ink900, marginBottom: 18 }}>Who Built This</h2>
          <div style={{ ...cardStyle, padding: "20px 20px 22px", display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1F3A5F 0%, #3D8073 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 20,
              flexShrink: 0,
            }}>
              KC
            </div>
            <div>
              <p style={{ fontWeight: 700, color: C.ink900, fontSize: 16, marginBottom: 2 }}>Kevin Cronin</p>
              <p style={{ fontSize: 13, color: C.teal, fontWeight: 600, marginBottom: 10 }}>Founder · Georgia resident</p>
              <p style={{ fontSize: 14, color: C.ink700, lineHeight: 1.7 }}>
                MyVote grew out of frustration with how hard it is to get a straight answer about who&rsquo;s on your
                ballot and what they actually stand for. I built and funded this myself — no investors, no grants,
                no political backers — because the moment someone else pays for it, you have to wonder whose
                interests it serves. I wanted to build something Georgia voters from any background could actually
                trust. If something isn&rsquo;t working or you have ideas, my inbox is always open.
              </p>
            </div>
          </div>
        </section>

        <section style={{ borderTop: `1px solid ${C.rule}`, paddingTop: 36, textAlign: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.ink900, marginBottom: 6 }}>Questions or Feedback?</h2>
          <p style={{ fontSize: 14.5, color: C.ink500, marginBottom: 22, lineHeight: 1.6 }}>
            I read every message. Reach out anytime.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/contact"
              style={{ display: "inline-flex", alignItems: "center", padding: "11px 24px", borderRadius: 999, background: C.teal, color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: "0 2px 12px rgba(61,128,115,0.28)" }}
            >
              Contact Us
            </Link>
            <Link
              href="/elections"
              style={{ display: "inline-flex", alignItems: "center", padding: "11px 24px", borderRadius: 999, border: `1.5px solid ${C.teal}`, color: C.teal, fontWeight: 600, fontSize: 14, textDecoration: "none", background: "transparent" }}
            >
              Georgia 2026 Elections
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
