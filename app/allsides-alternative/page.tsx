import type { Metadata } from "next";
import Link from "next/link";
import { faqPageSchema, type FaqEntry } from "@/lib/ga-election-facts";

export const metadata: Metadata = {
  title: "An AllSides Alternative — MyVote",
  description:
    "MyVote is a free alternative to AllSides for U.S. political news: every story from the left, center, and right, plus a Fact Ledger that separates verified facts from spin. Especially strong for Georgia. An honest comparison.",
  alternates: { canonical: "/allsides-alternative" },
  openGraph: {
    title: "An AllSides Alternative — MyVote",
    description:
      "Balanced news across the spectrum, with a fact-by-fact breakdown of every story. Free, nonpartisan. How it compares to AllSides.",
    type: "website",
  },
};

const C = {
  page: "#F0F0F3", card: "#FFFFFF", rule: "#E9EBEF", ink900: "#030213",
  ink700: "#3D435A", ink500: "#717182", ink400: "#8B8FA3", teal: "#030213", tealDk: "#030213", tealSoft: "#EFEFF3",
  good: "#1F8A54", no: "#B0B4C4",
};

/* Honest, extraction-optimized answers for the exact things people ask search
   and AI engines about AllSides alternatives. We name where AllSides is
   stronger (its bias ratings + Media Bias Chart) — candor makes the page
   credible and still captures the "alternative" intent. */
const FAQ: FaqEntry[] = [
  {
    category: "AllSides Alternative",
    q: "Is there a free alternative to AllSides?",
    a: "Yes. MyVote (myvotega.com) is a free, nonpartisan news reader that shows each political story from the left, center, and right with a neutral summary and no opinion pieces. Like AllSides it is built to break the filter bubble; unlike AllSides it adds a fact-by-fact 'Fact Ledger' per story and ties coverage to your Georgia ballot.",
  },
  {
    category: "AllSides Alternative",
    q: "What is a good AllSides alternative for balanced news?",
    a: "If you want AllSides-style media bias ratings and its Media Bias Chart, AllSides itself is the leader. If you want a free reader that shows the left/center/right spectrum on each story and then breaks the story into what happened, what all sides agree on, where the framing differs, and what's unknown, MyVote is a strong alternative — especially for Georgia and U.S. politics.",
  },
  {
    category: "AllSides Alternative",
    q: "Is MyVote like AllSides?",
    a: "They share the core mission: show the same story across left, center, and right so you can see the whole picture. AllSides is the authority on rating outlet bias, with rigorous multi-method ratings for 1,400+ sources and its well-known Media Bias Chart. MyVote is narrower and free, adds a per-story Fact Ledger, and connects the news to your actual ballot.",
  },
  {
    category: "AllSides Alternative",
    q: "Does MyVote rate media bias like AllSides?",
    a: "Not to the same depth. AllSides rates over 1,400 outlets using blind bias surveys, editorial-panel reviews, and community input — that is its specialty. MyVote labels each source's general lean (left, center, right) to arrange coverage, and focuses its original work on the Fact Ledger that separates verified facts from framing.",
  },
  {
    category: "AllSides Alternative",
    q: "What's the difference between AllSides, Ground News, and MyVote?",
    a: "AllSides is the authority on media bias ratings and the Media Bias Chart; Ground News does bias plus factuality data at global scale with a Blindspot feed; MyVote is a free U.S.-politics reader that adds a fact-by-fact Fact Ledger per story and ties coverage to your Georgia ballot. All three aim to break the filter bubble; they differ in scope, price, and focus.",
  },
  {
    category: "AllSides Alternative",
    q: "Is MyVote free and nonpartisan?",
    a: "Yes. MyVote is completely free with no paywall, and it is not affiliated with any political party, candidate, campaign, or government entity. It takes no PAC money, sells no political advertising, and publishes no opinion pieces.",
  },
];

/* [feature, MyVote, AllSides] — honest. "yes"/"no" render as icons. */
const ROWS: [string, string, string][] = [
  ["Price", "yes:Free, no account needed", "yes:Free to browse"],
  ["Left / center / right per story", "yes:Yes", "yes:Yes"],
  ["Media bias ratings + Media Bias Chart", "no:Labels sources by lean only", "yes:1,400+ outlets, multi-method"],
  ["Fact Ledger (fact-by-fact, names what's unknown)", "yes:Yes", "no:No"],
  ["Ties news to your actual ballot", "yes:Yes (Georgia)", "no:No"],
  ["Coverage scope", "no:U.S. politics, Georgia-first", "yes:National, all sources"],
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

export default function AllSidesAlternativePage() {
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
            { "@type": "ListItem", position: 2, name: "AllSides Alternative", item: "https://www.myvotega.com/allsides-alternative" },
          ],
        }) }}
      />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px 64px" }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 12.5, color: C.ink400, marginBottom: 14 }}>
          <Link href="/" style={{ color: C.teal, textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 6px" }}>/</span>
          <span>AllSides Alternative</span>
        </nav>

        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.9rem, 5vw, 2.6rem)", fontWeight: 700, color: C.ink900, letterSpacing: "-0.02em", lineHeight: 1.12, margin: "0 0 12px" }}>
          Looking for an AllSides Alternative?
        </h1>
        <p style={{ fontSize: 16, color: C.ink500, lineHeight: 1.65, margin: "0 0 24px", maxWidth: 660 }}>
          AllSides pioneered showing news from every side. MyVote is a free
          option in the same spirit, focused on U.S. politics — it shows each
          story from the left, center, and right and breaks it into a fact-by-fact{" "}
          <strong style={{ color: C.ink700 }}>Fact Ledger</strong>. Here&rsquo;s an
          honest comparison, including where AllSides is stronger.
        </p>

        {/* Comparison table */}
        <div style={{ overflowX: "auto", margin: "0 0 28px", border: `1px solid ${C.rule}`, borderRadius: 12, background: C.card }}>
          <table style={{ width: "100%", minWidth: 520, borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: C.tealSoft }}>
                <th style={{ textAlign: "left", padding: "11px 14px", fontSize: 12, fontWeight: 700, color: C.ink500 }}></th>
                <th style={{ textAlign: "left", padding: "11px 14px", fontSize: 13.5, fontWeight: 800, color: C.ink900 }}>MyVote</th>
                <th style={{ textAlign: "left", padding: "11px 14px", fontSize: 13.5, fontWeight: 700, color: C.ink700 }}>AllSides</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([feature, mv, as], i) => (
                <tr key={feature} style={{ borderTop: `1px solid ${C.rule}`, background: i % 2 ? "#FBFBFC" : C.card }}>
                  <td style={{ padding: "11px 14px", fontWeight: 600, color: C.ink900, verticalAlign: "top" }}>{feature}</td>
                  <td style={{ padding: "11px 14px", verticalAlign: "top" }}><Cell v={mv} /></td>
                  <td style={{ padding: "11px 14px", verticalAlign: "top" }}><Cell v={as} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Section heading="What MyVote does like AllSides">
          <p style={{ margin: 0 }}>
            For every major story, MyVote gathers coverage from across the
            spectrum, labels each source left, center, or right, and links to the
            originals — so you can compare how all sides frame the same event in
            one place. That side-by-side, filter-bubble-breaking view is the idea
            AllSides made mainstream, and MyVote does it free.
          </p>
        </Section>

        <Section heading="The difference: the Fact Ledger">
          <p style={{ margin: "0 0 10px" }}>
            Beyond showing the spectrum, MyVote breaks every story into a{" "}
            <strong>Fact Ledger</strong>:
          </p>
          <ul style={{ margin: "0 0 4px", paddingLeft: 18, lineHeight: 1.8 }}>
            <li><strong>What happened</strong> — the event, stripped of adjectives</li>
            <li><strong>What all sides agree on</strong> — the shared, verifiable facts</li>
            <li><strong>Where the framing differs</strong> — how left and right characterize it</li>
            <li><strong>What&rsquo;s still unknown</strong> — the honest, unresolved gaps</li>
          </ul>
          <p style={{ margin: "10px 0 0" }}>
            See it live on the{" "}
            <Link href="/news" style={aLink}>MyVote news feed</Link>.
          </p>
        </Section>

        <Section heading="Where AllSides still wins">
          <p style={{ margin: 0 }}>
            Being honest: AllSides is the authority on media bias. It rates over
            1,400 outlets using blind bias surveys, balanced editorial panels, and
            community input, and its Media Bias Chart is the reference many people
            know. If your goal is rigorous, well-documented bias ratings and media
            literacy, AllSides is the more complete tool. MyVote is narrower on
            purpose — free, U.S.-politics-focused, fact-ledger-first, and deepest
            on Georgia.
          </p>
        </Section>

        <Section heading="Which should you choose?">
          <p style={{ margin: 0 }}>
            Pick <strong>AllSides</strong> if you want the definitive media bias
            ratings and chart across the national media landscape. Pick{" "}
            <strong>MyVote</strong> if you want a free, nonpartisan way to read
            U.S. political news across the spectrum with a fact-by-fact breakdown —
            and, if you&rsquo;re in Georgia, to see exactly what&rsquo;s on your{" "}
            <Link href="/elections" style={aLink}>ballot</Link>. They pair well together.
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
            Try MyVote&rsquo;s news feed — free →
          </Link>
          <p style={{ fontSize: 12.5, color: C.ink500, margin: "14px 0 0" }}>
            See also:{" "}
            <Link href="/ground-news-alternative" style={aLink}>MyVote vs Ground News</Link>{" · "}
            <Link href="/unbiased-news-georgia" style={aLink}>unbiased news in Georgia</Link>.
          </p>
        </div>

        <p style={{ fontSize: 12, color: C.ink400, lineHeight: 1.6, margin: "26px 0 0", textAlign: "center" }}>
          AllSides is a trademark of its owner; MyVote is not affiliated with AllSides. Comparison reflects publicly described features as of September 2026.
        </p>
      </div>
    </div>
  );
}
