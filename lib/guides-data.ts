/* Voter-education guides targeting Georgia's highest-volume election
   questions. Each guide renders at /guides/[slug] and is structured as
   sections so the page can emit FAQPage-style content. Facts are stated
   conservatively and always point to the GA SoS as the authority. */

export interface GuideSection {
  heading: string;
  body: string;
}

export interface Guide {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  updated: string;
  sections: GuideSection[];
  related: { href: string; label: string }[];
}

export const GUIDES: Guide[] = [
  {
    slug: "what-is-a-runoff",
    title: "What Is a Runoff Election? Georgia's June 16 Runoff, Explained",
    metaTitle: "What Is a Runoff Election? · MyVote Georgia",
    description:
      "Georgia requires candidates to win a majority — not just the most votes. When nobody clears 50%, the top two finishers meet again in a runoff. Here's how it works.",
    updated: "June 11, 2026",
    sections: [
      {
        heading: "The short version",
        body: "In Georgia, a candidate must win more than 50% of the vote to win an election. If nobody clears that bar — common when three or more candidates split the vote — the top two finishers face each other in a second election called a runoff. The June 16, 2026 runoff settles races from the May 19 primary where no candidate won a majority.",
      },
      {
        heading: "Why does Georgia do this?",
        body: "Most states let the candidate with the most votes win (a plurality). Georgia is one of the few states that requires an outright majority, a rule dating to the 1960s. Supporters say it ensures winners have broad support; critics note runoffs usually see far lower turnout than the first round.",
      },
      {
        heading: "Who can vote in a runoff?",
        body: "If you were registered in time for the original election, you can vote in the runoff — even if you skipped the first round. One caveat for primary runoffs: if you voted in one party's primary, you cannot cross over and vote in the other party's runoff. If you didn't vote in either primary, you may choose either party's runoff ballot.",
      },
      {
        heading: "Why runoff turnout matters",
        body: "Runoff turnout in Georgia routinely drops 30–60% from the first round. That means each vote cast in a runoff carries dramatically more weight. Close races are regularly decided by a few thousand votes statewide — and by a few dozen in local contests.",
      },
      {
        heading: "Key dates for the June 16, 2026 runoff",
        body: "Early voting runs June 9–13 at county early-voting sites, typically 7am–7pm. Election day is Tuesday, June 16, with polls open 7am–7pm. You'll need photo ID. Confirm your polling place at the Georgia Secretary of State's My Voter Page (mvp.sos.ga.gov) — runoff polling places occasionally differ from the first round.",
      },
    ],
    related: [
      { href: "/elections", label: "See what's on the June 16 runoff ballot" },
      { href: "/guides/georgia-voter-id", label: "Georgia voter ID rules" },
      { href: "/g", label: "Find your county ballot" },
    ],
  },
  {
    slug: "georgia-voter-id",
    title: "Georgia Voter ID: What You Need to Bring to Vote",
    metaTitle: "Georgia Voter ID Requirements · MyVote",
    description:
      "Georgia requires photo ID to vote in person. Here's every accepted form of ID, what to do if you don't have one, and how the free state voter ID card works.",
    updated: "June 11, 2026",
    sections: [
      {
        heading: "Accepted forms of photo ID",
        body: "Any of these works at a Georgia polling place: a Georgia driver's license (even if expired), a free Georgia voter identification card, a U.S. passport, a U.S. military photo ID, a government employee photo ID issued by Georgia or the federal government, or a tribal photo ID.",
      },
      {
        heading: "Don't have any of those? Get a free voter ID card",
        body: "Every county registrar's office and DDS (Department of Driver Services) office issues free voter ID cards. Bring a document with your full legal name and date of birth, evidence of registration, and proof of residence. You only need to do this once.",
      },
      {
        heading: "What if I forget my ID on election day?",
        body: "You can still cast a provisional ballot. You then have three days after the election to show ID at your county registrar's office for your vote to count. It's a safety net — but bringing ID the first time is far simpler.",
      },
      {
        heading: "Absentee voting uses ID numbers, not photos",
        body: "For mail ballots, Georgia verifies your identity with your driver's license number or state ID number (or a copy of an accepted ID if you have neither). The number goes on both the ballot application and the return envelope.",
      },
      {
        heading: "The authoritative source",
        body: "ID rules occasionally change. The Georgia Secretary of State's office (sos.ga.gov) and your county election office are the final word — check there if your situation is unusual.",
      },
    ],
    related: [
      { href: "/register", label: "Georgia voter registration guide" },
      { href: "/guides/what-is-a-runoff", label: "What is a runoff election?" },
      { href: "/g", label: "Find your county election office" },
    ],
  },
  {
    slug: "check-voter-registration-georgia",
    title: "How to Check Your Voter Registration in Georgia (2 Minutes)",
    metaTitle: "Check Your Georgia Voter Registration · MyVote",
    description:
      "Use Georgia's My Voter Page to confirm you're registered, find your polling place, and see a sample ballot. Here's exactly how, plus 2026 registration deadlines.",
    updated: "June 11, 2026",
    sections: [
      {
        heading: "The 2-minute check",
        body: "Go to the Georgia Secretary of State's My Voter Page at mvp.sos.ga.gov. Enter your first initial, last name, county, and date of birth. You'll see your registration status, polling place, districts, sample ballot, and the status of any absentee ballot — all in one place.",
      },
      {
        heading: "Why you should check even if you're 'sure'",
        body: "Georgia periodically removes inactive voters from the rolls. If you haven't voted in several election cycles, moved counties, or changed your name, your registration may be inactive or out of date. Checking takes two minutes; discovering a problem on election day costs you your vote.",
      },
      {
        heading: "2026 registration deadlines",
        body: "You must register at least 29 days before an election to vote in it. For the November 3, 2026 general election, the registration deadline is October 5, 2026. Registration is free and can be done online at registertovote.sos.ga.gov with a Georgia driver's license or state ID.",
      },
      {
        heading: "Moved recently?",
        body: "If you moved within the same county, you can update your address and vote normally. If you moved to a new Georgia county after the registration deadline, you may vote one last time in your old precinct. Update your registration online — it takes the same form as registering.",
      },
      {
        heading: "Eligibility basics",
        body: "You can register in Georgia if you're a U.S. citizen, a Georgia resident, and at least 17.5 years old (you must be 18 by election day). Georgia restores voting rights automatically once a felony sentence — including probation and parole — is complete.",
      },
    ],
    related: [
      { href: "/register", label: "Full Georgia registration guide" },
      { href: "/guides/early-voting-georgia", label: "Early voting in Georgia" },
      { href: "/elections", label: "What's on the 2026 ballot" },
    ],
  },
  {
    slug: "early-voting-georgia",
    title: "Early Voting in Georgia: Dates, Hours, and How It Works",
    metaTitle: "Early Voting in Georgia 2026 · MyVote",
    description:
      "Georgia offers roughly three weeks of in-person early voting before every election, including weekend days. Here's how it works and the 2026 dates.",
    updated: "June 11, 2026",
    sections: [
      {
        heading: "How early voting works",
        body: "Georgia calls it Advance Voting: you vote in person at designated county sites before election day, no excuse needed. Unlike election day — when you must use your assigned precinct — you can use any early-voting site in your county. Bring the same photo ID you'd use on election day.",
      },
      {
        heading: "When it happens",
        body: "Advance voting begins the fourth Monday before an election and runs about three weeks, including at least two Saturdays (counties may add Sundays). For the June 16, 2026 runoff, early voting runs June 9–13. For the November 3, 2026 general, expect advance voting from mid-October through October 30.",
      },
      {
        heading: "Why vote early",
        body: "Shorter lines, flexible locations, and a buffer for surprises — if there's a problem with your registration or ID, you have time to fix it and still vote. Poll workers also tend to have more time to help during early voting than on election day.",
      },
      {
        heading: "Finding your early-voting site",
        body: "Sites and hours vary by county and are listed on the Georgia My Voter Page (mvp.sos.ga.gov) under 'Advance Voting Locations.' Larger counties run multiple sites; smaller counties may have just the registrar's office. Hours are commonly 7am–7pm but check your county.",
      },
    ],
    related: [
      { href: "/g", label: "Your county's ballot and election office" },
      { href: "/guides/georgia-voter-id", label: "What ID to bring" },
      { href: "/guides/check-voter-registration-georgia", label: "Check your registration first" },
    ],
  },
  {
    slug: "georgia-absentee-ballot",
    title: "Voting by Mail in Georgia: Absentee Ballots Step by Step",
    metaTitle: "Georgia Absentee Ballot Guide 2026 · MyVote",
    description:
      "Any Georgia voter can vote by mail — no excuse required. How to request an absentee ballot, the ID rules, deadlines, and how to make sure it counts.",
    updated: "June 11, 2026",
    sections: [
      {
        heading: "Who can vote by mail",
        body: "Any registered Georgia voter may request an absentee ballot — Georgia is a no-excuse state. You don't need to be sick, traveling, or elderly. You do need to request it for each election (or check the box for the full cycle if you're 65+, disabled, or a military/overseas voter).",
      },
      {
        heading: "How to request one",
        body: "Apply online at the Georgia Secretary of State's absentee portal, or submit a paper application to your county registrar. Applications open 78 days before an election and must arrive at least 11 days before election day. You'll need your driver's license or state ID number.",
      },
      {
        heading: "Filling it out correctly",
        body: "Use blue or black ink, fill the oval completely, and — critically — complete the oath envelope including your ID number and signature. Most rejected mail ballots fail on envelope mistakes, not the ballot itself. Seal everything in the provided envelopes.",
      },
      {
        heading: "Getting it back on time",
        body: "Your ballot must be RECEIVED by 7pm on election day — a postmark is not enough. Mail it at least a week out, or use an official county drop box (available during early-voting hours), or hand-deliver it to your county election office. You can track its status on the My Voter Page.",
      },
      {
        heading: "Changed your mind?",
        body: "If you requested a mail ballot but decide to vote in person, bring the mail ballot to be canceled, or sign an affidavit if you never received it. You will not be turned away — but tell the poll worker about the outstanding ballot.",
      },
    ],
    related: [
      { href: "/guides/check-voter-registration-georgia", label: "Check your registration" },
      { href: "/guides/early-voting-georgia", label: "Or vote early in person" },
      { href: "/register", label: "Full registration guide" },
    ],
  },
];

export function getGuide(slug: string): Guide | null {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}
