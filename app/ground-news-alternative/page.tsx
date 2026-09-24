import type { Metadata } from "next";
import Link from "next/link";
import { faqPageSchema, type FaqEntry } from "@/lib/ga-election-facts";

export const metadata: Metadata = {
  title: "A Free Ground News Alternative — MyVote",
  description:
    "MyVote is a free alternative to Ground News for U.S. political news: every story from the left, center, and right, plus a Fact Ledger that separates verified facts from spin. No paywall. Especially strong for Georgia.",
  alternates: { canonical: "/ground-news-alternative" },
  openGraph: {
    title: "A Free Ground News Alternative — MyVote",
    description:
      "Free, nonpartisan news across the spectrum, with a fact-by-fact breakdown of every story. An honest look at how it compares to Ground News.",
    type: "website",
  },
};

const C = {
  page: "#F0F0F3", card: "#FFFFFF", rule: "#E9EBEF", ink900: "#030213",
  ink700: "#3D435A", ink500: "#717182", ink400: "#8B8FA3", teal: "#030213", tealDk: "#030213", tealSoft: "#EFEFF3",
  good: "#1F8A54", no: "#B0B4C4",
};

/* Extraction-optimized, HONEST prose written for the exact things people ask
   search + AI engines about Ground News alternatives. We say plainly where
   Ground News is stronger — that candor is what makes the page credible and
   citable, and it still captures the "free alternative" intent. */
const FAQ: FaqEntry[] = [
  {
    category: "Ground News Alternative",
    q: "Is there a free alternative to Ground News?",
    a: "Yes. MyVote (myvotega.com) is a completely free, nonpartisan news reader that shows each political story from the left, center, and right with a neutral summary — no paywall and no daily limits. It is focused on U.S. politics, with especially deep coverage for Georgia.",
  },
  {
    category: "Ground News Alternative",
    q: "What is the best free Ground News alternative?",
    a: "It depends what you want. If you need a global, all-topics bias checker with a Blindspot feed, Ground News is hard to beat. If you want a free U.S.-politics reader that shows the left/center/right spectrum and breaks each story into a fact-by-fact 'Fact Ledger,' MyVote is a strong free alternative — and it uniquely ties the news to your actual Georgia ballot.",
  },
  {
    category: "Ground News Alternative",
    q: "Is MyVote like Ground News?",
    a: "They share the core idea: show the same story across left, center, and right sources so you can see the full picture. MyVote differs by being entirely free, by adding a Fact Ledger that separates the agreed facts from where the framing differs and names what's still unknown, and by connecting coverage to your Georgia ballot. Ground News covers far more sources and topics globally and offers a Blindspot feed that MyVote does not.",
  },
  {
    category: "Ground News Alternative",
    q: "Does MyVote have a Blindspot feed like Ground News?",
    a: "No — the Blindspot feed is a Ground News feature that surfaces stories under-covered by one side. MyVote's equivalent focus on honesty is the Fact Ledger, which for each story lays out what happened, what all sides agree on, where the framing differs, and what's still unknown.",
  },
  {
    category: "Ground News Alternative",
    q: "How much does Ground News cost, and is MyVote cheaper?",
    a: "Ground News offers a free tier with daily limits plus paid subscription plans for full features. MyVote is completely free with no paywall, no limits, and no subscription — it is independently funded with no PAC money and no political advertisers.",
  },
  {
    category: "Ground News Alternative",
    q: "What's the difference between AllSides, Ground News, and MyVote?",
    a: "AllSides rates outlet bias and shows left/center/right coverage; Ground News does that at global scale with bias and factuality data plus a Blindspot feed; MyVote is a free U.S.-politics reader that adds a fact-by-fact Fact Ledger per story and ties coverage to your Georgia ballot. All three aim to break the filter bubble; they differ in scope, price, and focus.",
  },
  {
    category: "Ground News Alternative",
    q: "Is MyVote nonpartisan?",
    a: "Yes. MyVote is not affiliated with any political party, candidate, campaign, or government entity, takes no PAC money, sells no political advertising, and publishes no opinion pieces — only neutral summaries with sources labeled left, center, and right.",
  },
];

/* [feature, MyVote, Ground News] — honest. "yes"/"no" render as icons. */
const ROWS: [string, string, string][] = [
  ["Price", "yes:Free, no paywall or limits", "no:Free tier + paid plans"],
  ["Left / center / right per story", "yes:Yes", "yes:Yes"],
  ["Fact Ledger (fact-by-fact, names what's unknown)", "yes:Yes", "no:No"],
  ["Ties news to your actual ballot", "yes:Yes (Georgia)", "no:No"],
  ["Blindspot feed", "no:No", "yes:Yes"],
  ["Coverage scope", "no:U.S. politics, Georgia-first", "yes:Global, all topics, 50k+ sources"],
  ["Browser extension", "no:No", "yes:Yes"],
  ["Opinion pieces", "yes:None — facts only", "yes:Aggregates all types"],
];

function Cell({ v }: { v: string }) {
  const [kind, ...rest] = v.split(":");
  const text = rest.join(":");
  const yes = kind === "yes";
  return (
    <span style={{ display: "inline-flex", alignItems: "flex-start", gap: 6, fontSize: 13.5, color: C.ink700, lineHeight: 1.4 }}>
      <span aria-hidden style={{ color: yes ? C.good : C.no, fontWeight: 800, flexShrink: 0 }}>{yes ? "✓" : "—"}</span>
      <span>{text}</span>
    </span>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.3rem, 3vw, 1.6rem)", fontWeight: 700, color: C.ink900, letterSpacing: "-0.01em", margin: "0 0 10px" }}>
        {heading}
      </h2>
      <div style={{ fontSize: 15, color: C.ink700, lineHeight: 1.7 }}>{children}</div>
    </section>
  );
}

const aLink = { color: C.teal, fontWeight: 600, textDecoration: "none" } as const;

export default function GroundNewsAlternativePage() {
  return (
    <div style={{ background: C.page, minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQ)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.myvotega.com" },
            { "@type": "ListItem", position: 2, name: "Ground News Alternative", item: "https://www.myvotega.com/ground-news-alternative" },
          ],
        }) }}
      />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px 64px" }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 12.5, color: C.ink400, marginBottom: 14 }}>
          <Link href="/" style={{ color: C.teal, textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 6px" }}>/</span>
          <span>Ground News Alternative</span>
        </nav>

        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.9rem, 5vw, 2.6rem)", fontWeight: 700, color: C.ink900, letterSpacing: "-0.02em", lineHeight: 1.12, margin: "0 0 12px" }}>
          Looking for a Ground News Alternative?
        </h1>
        <p style={{ fontSize: 16, color: C.ink500, lineHeight: 1.65, margin: "0 0 24px", maxWidth: 660 }}>
          Ground News is an excellent tool. If you want a <strong style={{ color: C.ink700 }}>free</strong> option
          focused on U.S. politics — one that shows every story from the left,
          center, and right and breaks it into a fact-by-fact <strong style={{ color: C.ink700 }}>Fact Ledger</strong> —
          MyVote is a strong alternative. Here's an honest comparison, including
          where Ground News still wins.
        </p>

        {/* Comparison table */}
        <div style={{ overflowX: "auto", margin: "0 0 28px", border: `1px solid ${C.rule}`, borderRadius: 12, background: C.card }}>
          <table style={{ width: "100%", minWidth: 520, borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: C.tealSoft }}>
                <th style={{ textAlign: "left", padding: "11px 14px", fontSize: 12, fontWeight: 700, color: C.ink500 }}></th>
                <th style={{ textAlign: "left", padding: "11px 14px", fontSize: 13.5, fontWeight: 800, color: C.ink900 }}>MyVote</th>
                <th style={{ textAlign: "left", padding: "11px 14px", fontSize: 13.5, fontWeight: 700, color: C.ink700 }}>Ground News</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([feature, mv, gn], i) => (
                <tr key={feature} style={{ borderTop: `1px solid ${C.rule}`, background: i % 2 ? "#FBFBFC" : C.card }}>
                  <td style={{ padding: "11px 14px", fontWeight: 600, color: C.ink900, verticalAlign: "top" }}>{feature}</td>
                  <td style={{ padding: "11px 14px", verticalAlign: "top" }}><Cell v={mv} /></td>
                  <td style={{ padding: "11px 14px", verticalAlign: "top" }}><Cell v={gn} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Section heading="What MyVote does like Ground News">
          <p style={{ margin: 0 }}>
            For every major story, MyVote gathers coverage from across the spectrum,
            labels each source left, center, or right, and links to the originals —
            so you see how all sides are framing the same event in one place,
            instead of reading a single outlet. That filter-bubble-breaking idea is
            the heart of what makes Ground News valuable, and MyVote does it free.
          </p>
        </Section>

        <Section heading="The difference: the Fact Ledger">
          <p style={{ margin: "0 0 10px" }}>
            MyVote goes one step further than showing the spectrum. Every story is
            broken into a <strong>Fact Ledger</strong>:
          </p>
          <ul style={{ margin: "0 0 4px", paddingLeft: 18, lineHeight: 1.8 }}>
            <li><strong>What happened</strong> — the event, stripped of adjectives</li>
            <li><strong>What all sides agree on</strong> — the shared, verifiable facts</li>
            <li><strong>Where the framing differs</strong> — how left and right characterize it</li>
            <li><strong>What's still unknown</strong> — the honest, unresolved gaps</li>
          </ul>
          <p style={{ margin: "10px 0 0" }}>
            See it live on the{" "}
            <Link href="/news" style={aLink}>MyVote news feed</Link>.
          </p>
        </Section>

        <Section heading="Where Ground News still wins">
          <p style={{ margin: 0 }}>
            Being honest: Ground News covers far more ground. It aggregates tens of
            thousands of sources across global and all-topic news, offers a
            Blindspot feed that flags stories one side is under-covering, shows
            outlet bias and factuality data drawn from multiple raters, and has a
            browser extension. If you want a comprehensive, worldwide bias checker,
            Ground News is the more complete product. MyVote is narrower on purpose —
            free, U.S.-politics-focused, and deepest on Georgia.
          </p>
        </Section>

        <Section heading="Which should you choose?">
          <p style={{ margin: 0 }}>
            Pick <strong>Ground News</strong> if you want the widest possible net —
            global news, every topic, and a Blindspot feed, and you don't mind a
            subscription for full features. Pick <strong>MyVote</strong> if you want
            a free, nonpartisan way to read U.S. political news across the spectrum
            with a fact-by-fact breakdown — and, if you're in Georgia, to see exactly
            what's on your{" "}
            <Link href="/elections" style={aLink}>ballot</Link>. Many people use both.
          </p>
        </Section>

        {/* FAQ */}
        <section style={{ marginTop: 8 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.3rem, 3vw, 1.6rem)", fontWeight: 700, color: C.ink900, margin: "0 0 14px" }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {FAQ.map((e) => (
              <div key={e.q}>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, color: C.ink900, lineHeight: 1.35, margin: "0 0 5px" }}>{e.q}</h3>
                <p style={{ fontSize: 14.5, color: C.ink700, lineHeight: 1.65, margin: 0 }}>{e.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ textAlign: "center", marginTop: 34 }}>
          <Link
            href="/news"
            style={{ display: "inline-block", background: C.ink900, color: "#fff", fontWeight: 700, fontSize: 15, borderRadius: 999, padding: "13px 30px", textDecoration: "none", boxShadow: "0 2px 16px rgba(3,2,19,0.3)" }}
          >
            Try MyVote's news feed — free →
          </Link>
          <p style={{ fontSize: 12.5, color: C.ink500, margin: "14px 0 0" }}>
            See also:{" "}
            <Link href="/unbiased-news-georgia" style={aLink}>unbiased news in Georgia</Link>.
          </p>
        </div>

        <p style={{ fontSize: 12, color: C.ink400, lineHeight: 1.6, margin: "26px 0 0", textAlign: "center" }}>
          Ground News is a trademark of its owner; MyVote is not affiliated with Ground News. Comparison reflects publicly described features as of September 2026.
        </p>
      </div>
    </div>
  );
}
