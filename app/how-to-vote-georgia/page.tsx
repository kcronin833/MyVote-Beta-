import type { Metadata } from "next";
import Link from "next/link";
import { GA_2026, GA_VOTER_FAQ, faqPageSchema } from "@/lib/ga-election-facts";

export const metadata: Metadata = {
  title: "How to Vote in Georgia 2026 — Complete Voter Guide · MyVote",
  description:
    "Everything Georgia voters need for 2026: registration deadline (Oct 5), photo ID requirements, early voting (Oct 12–30), absentee ballot rules, and how to find your polling place.",
  alternates: { canonical: "/how-to-vote-georgia" },
  openGraph: {
    title: "How to Vote in Georgia 2026 · MyVote",
    description:
      "Registration, photo ID, early voting, absentee ballots, and Election Day — the complete 2026 Georgia voter guide.",
    type: "website",
  },
};

const C = {
  page: "#F5F3EE", card: "#FDFCF9", rule: "#E4E0D3", ink900: "#1A2138",
  ink700: "#3D435A", ink500: "#6B7088", ink400: "#8B8FA3", teal: "#3D8073", tealDk: "#2F6358", tealSoft: "#E6F0ED",
};

/* Reuse the relevant how-to questions for this page's FAQ schema. */
const HOWTO_FAQ = GA_VOTER_FAQ.filter((e) =>
  ["Registration", "ID & Eligibility", "Early & Absentee Voting", "Election Day"].includes(e.category)
);

function Section({ id, heading, children }: { id: string; heading: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 30 }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.3rem, 3vw, 1.6rem)", fontWeight: 700, color: C.ink900, letterSpacing: "-0.01em", margin: "0 0 10px" }}>
        {heading}
      </h2>
      <div style={{ fontSize: 15, color: C.ink700, lineHeight: 1.7 }}>{children}</div>
    </section>
  );
}

const aLink = { color: C.teal, fontWeight: 600, textDecoration: "none" } as const;

export default function HowToVoteGeorgiaPage() {
  return (
    <div style={{ background: C.page, minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(HOWTO_FAQ)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.myvotega.com" },
            { "@type": "ListItem", position: 2, name: "How to Vote in Georgia", item: "https://www.myvotega.com/how-to-vote-georgia" },
          ],
        }) }}
      />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px 64px" }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 12.5, color: C.ink400, marginBottom: 14 }}>
          <Link href="/" style={{ color: C.teal, textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 6px" }}>/</span>
          <span>How to Vote in Georgia</span>
        </nav>

        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.9rem, 5vw, 2.6rem)", fontWeight: 700, color: C.ink900, letterSpacing: "-0.02em", lineHeight: 1.12, margin: "0 0 12px" }}>
          How to Vote in Georgia in 2026
        </h1>
        <p style={{ fontSize: 16, color: C.ink500, lineHeight: 1.65, margin: "0 0 10px", maxWidth: 640 }}>
          A plain-English guide to voting in Georgia's November 3, 2026 general election —
          how to register, what ID you need, when you can vote early or by mail, and what
          to expect on Election Day.
        </p>
        <p style={{ fontSize: 12.5, color: C.ink400, lineHeight: 1.6, margin: "0 0 28px" }}>
          Dates verified June 23, 2026 against the Georgia Secretary of State. Confirm your
          registration, polling place, and sample ballot at{" "}
          <a href={GA_2026.links.myVoterPage} target="_blank" rel="noopener noreferrer" style={{ color: C.teal }}>the My Voter Page</a>.
        </p>

        {/* Key-dates callout */}
        <div style={{ background: C.tealSoft, border: "1px solid #B2D8D0", borderRadius: 14, padding: "16px 18px", marginBottom: 30 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: C.tealDk, marginBottom: 8 }}>
            2026 General Election — Key Dates
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: C.ink700, lineHeight: 1.8 }}>
            <li><strong>Registration deadline:</strong> {GA_2026.registrationDeadline.label}</li>
            <li><strong>Early voting:</strong> {GA_2026.earlyVoting.startLabel} – {GA_2026.earlyVoting.endLabel}</li>
            <li><strong>Absentee request deadline:</strong> {GA_2026.absenteeRequestDeadline.label}</li>
            <li><strong>Election Day:</strong> {GA_2026.generalElection.label} (polls {GA_2026.pollHours})</li>
          </ul>
        </div>

        <Section id="register" heading="1. Register to Vote">
          <p style={{ margin: "0 0 10px" }}>
            To vote in the general election, you must register by <strong>{GA_2026.registrationDeadline.label}</strong>.
            Register online at{" "}
            <a href={GA_2026.links.register} target="_blank" rel="noopener noreferrer" style={aLink}>registertovote.sos.ga.gov</a>{" "}
            if you have a Georgia driver's license or state ID, or register by mail or in person at
            offices like the Department of Driver Services.
          </p>
          <p style={{ margin: 0 }}>
            Already registered? Check your status, polling place, and sample ballot any time at{" "}
            <a href={GA_2026.links.myVoterPage} target="_blank" rel="noopener noreferrer" style={aLink}>mvp.sos.ga.gov</a>.
          </p>
        </Section>

        <Section id="id" heading="2. Photo ID Requirements">
          <p style={{ margin: "0 0 10px" }}>
            Georgia requires a photo ID to vote in person. Accepted forms include a Georgia driver's
            license or state ID, a U.S. passport, a U.S. military or government photo ID, a tribal ID,
            or a free Georgia Voter ID card.
          </p>
          <p style={{ margin: 0 }}>
            If you don't have a photo ID, you can get a <strong>free Georgia Voter ID card</strong> at your
            county registrar's office or a Department of Driver Services center — bring proof of identity,
            Georgia residence, and date of birth.
          </p>
        </Section>

        <Section id="early-voting" heading="3. Early Voting">
          <p style={{ margin: 0 }}>
            In-person early voting runs <strong>{GA_2026.earlyVoting.startLabel} through {GA_2026.earlyVoting.endLabel}</strong>,
            on weekdays plus at least two Saturdays. Exact dates and hours can vary by county, and during
            early voting you may use any early-voting site in your county — find locations on the My Voter Page.
          </p>
        </Section>

        <Section id="absentee" heading="4. Absentee / Mail-In Voting">
          <p style={{ margin: "0 0 10px" }}>
            Any registered Georgia voter may request an absentee ballot — no excuse required. Request yours
            online or by mail from your county; for the general election, your application must be received by{" "}
            <strong>{GA_2026.absenteeRequestDeadline.label}</strong>. You'll need your Georgia ID number or a
            copy of acceptable photo ID.
          </p>
          <p style={{ margin: 0 }}>
            Your completed ballot must be <strong>received</strong> by your county by 7:00 p.m. on Election Day —
            a postmark is not enough — so mail it early or use an official drop box.
          </p>
        </Section>

        <Section id="election-day" heading={`5. Election Day — ${GA_2026.generalElection.label}`}>
          <p style={{ margin: 0 }}>
            Polls are open <strong>{GA_2026.pollHours}</strong>. On Election Day you must vote at your assigned
            polling place. If you are in line by 7:00 p.m., you are legally allowed to stay and cast your vote.
          </p>
        </Section>

        <Section id="polling-place" heading="6. Find Your Polling Place">
          <p style={{ margin: 0 }}>
            Look up your assigned precinct, sample ballot, and absentee status on the Georgia{" "}
            <a href={GA_2026.links.myVoterPage} target="_blank" rel="noopener noreferrer" style={aLink}>My Voter Page</a>.
            To see who is on your ballot — from governor to school board — enter your ZIP on{" "}
            <Link href="/elections" style={aLink}>MyVote's ballot guide</Link>.
          </p>
        </Section>

        {/* FAQ */}
        <section style={{ marginTop: 8 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.3rem, 3vw, 1.6rem)", fontWeight: 700, color: C.ink900, margin: "0 0 14px" }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {HOWTO_FAQ.map((e) => (
              <div key={e.q}>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, color: C.ink900, lineHeight: 1.35, margin: "0 0 5px" }}>{e.q}</h3>
                <p style={{ fontSize: 14.5, color: C.ink700, lineHeight: 1.65, margin: 0 }}>{e.a}</p>
              </div>
            ))}
          </div>
        </section>

        <p style={{ fontSize: 12, color: C.ink400, lineHeight: 1.6, margin: "30px 0 0", textAlign: "center" }}>
          MyVote is nonpartisan and not affiliated with any party or government entity. Official
          information is always at{" "}
          <a href={GA_2026.links.sos} target="_blank" rel="noopener noreferrer" style={{ color: C.ink500, textDecoration: "underline" }}>sos.ga.gov</a>.
        </p>
      </div>
    </div>
  );
}
