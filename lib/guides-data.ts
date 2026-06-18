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
        body: "Early voting for the runoff began June 6–8 depending on the county (Fulton, Cobb, DeKalb and others opened Saturday, June 6; most counties opened Monday, June 8) and ends statewide on Friday, June 12. Hours vary by county. Election day is Tuesday, June 16, with polls open 7am–7pm. You'll need photo ID. Confirm your polling place at the Georgia Secretary of State's My Voter Page (mvp.sos.ga.gov) — runoff polling places occasionally differ from the first round.",
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
        body: "For general elections, advance voting begins the fourth Monday before election day and runs about three weeks, including at least two Saturdays — for the November 3, 2026 general, that's roughly October 12 through October 30. Runoffs are shorter: counties open advance voting as soon as possible (June 6–8 for the June 16, 2026 runoff, varying by county) and it always ends the Friday before election day — June 12 for this runoff.",
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
  {
    slug: "what-does-the-georgia-governor-do",
    title: "What Does the Governor of Georgia Actually Do?",
    metaTitle: "What Does the Governor of Georgia Do? · MyVote",
    description:
      "The governor is Georgia's chief executive — proposing the state budget, signing or vetoing laws, and commanding the state's response in a crisis. Here's the job, in plain English.",
    updated: "June 18, 2026",
    sections: [
      {
        heading: "The short version",
        body: "The governor is the head of Georgia's executive branch — the person who runs state government day to day. They propose the state budget, sign or veto bills the legislature passes, appoint people to state boards and agencies, and serve as commander-in-chief of Georgia's military forces (like the National Guard). It's one of the most powerful elected offices that directly shapes life in the state.",
      },
      {
        heading: "The budget is the biggest lever",
        body: "Every year the governor proposes a state budget for the General Assembly to consider. Because so much of what state government does — schools, roads, health programs, public safety — runs on that budget, the governor's spending priorities are arguably their single most powerful tool. The legislature can change the budget, but the governor sets the starting point.",
      },
      {
        heading: "Signing and vetoing laws",
        body: "When the Georgia legislature passes a bill, it goes to the governor, who can sign it into law or veto it. A veto can be overridden, but only by a two-thirds vote in both the House and Senate — a high bar — so the veto gives the governor real influence over what becomes law.",
      },
      {
        heading: "Appointments and emergencies",
        body: "The governor appoints members to many state boards and commissions, shaping policy well beyond their own term. As 'conservator of the peace,' the governor also leads the state's response to emergencies — natural disasters, public-safety crises — and can call the legislature into special session.",
      },
      {
        heading: "Term limits",
        body: "Georgia's governor is elected to a four-year term and can serve at most two consecutive terms, after which they must wait four years before running again. That's why an incumbent who has served two terms can't simply run again — the seat opens up.",
      },
    ],
    related: [
      { href: "/elections", label: "See who's running for Governor in 2026" },
      { href: "/guides/what-does-the-lieutenant-governor-do", label: "What does the Lieutenant Governor do?" },
      { href: "/quiz", label: "Find your civic profile" },
    ],
  },
  {
    slug: "what-does-the-lieutenant-governor-do",
    title: "What Does the Lieutenant Governor of Georgia Do?",
    metaTitle: "What Does Georgia's Lieutenant Governor Do? · MyVote",
    description:
      "Georgia's lieutenant governor runs the state Senate and is first in line if the governor can't serve — and they're elected separately from the governor. Here's the real job.",
    updated: "June 18, 2026",
    sections: [
      {
        heading: "The short version",
        body: "The lieutenant governor's main constitutional job is to serve as president of the Georgia State Senate — presiding over debate, keeping order, and casting the deciding vote when the Senate ties. They are also first in line to take over the governor's duties if the governor can't serve. It's a powerful but often misunderstood role.",
      },
      {
        heading: "Running the state Senate",
        body: "As president of the Senate, the lieutenant governor controls much of how that chamber operates — which influences which bills move forward and which stall. Notably, because the lieutenant governor isn't an actual member of the Senate, they can't sponsor legislation themselves; their power is procedural and tie-breaking, not authoring bills.",
      },
      {
        heading: "Elected on their own — not a running mate",
        body: "Unlike the U.S. vice president, Georgia's lieutenant governor is elected separately from the governor, on their own ballot line. That means Georgia can — and sometimes does — elect a governor and lieutenant governor from different parties. When you vote, these are two distinct choices.",
      },
      {
        heading: "Next in line",
        body: "If the governor dies, resigns, or is unable to serve, the lieutenant governor assumes the governor's powers and duties for the remainder of the term. It's the constitutional backstop that keeps the executive branch running.",
      },
      {
        heading: "Term",
        body: "The lieutenant governor serves a four-year term and — unlike the governor — faces no term limits, so the same person can hold the office across many elections.",
      },
    ],
    related: [
      { href: "/elections", label: "See the 2026 statewide races" },
      { href: "/guides/what-does-the-georgia-governor-do", label: "What does the Governor do?" },
      { href: "/guides/what-is-the-georgia-public-service-commission", label: "What is the Public Service Commission?" },
    ],
  },
  {
    slug: "what-does-the-georgia-secretary-of-state-do",
    title: "What Does the Georgia Secretary of State Do?",
    metaTitle: "What Does the Georgia Secretary of State Do? · MyVote",
    description:
      "Georgia's Secretary of State runs the state's elections — voter registration, ballots, and certifying results — plus business registration and professional licensing. Here's why this office matters to your vote.",
    updated: "June 18, 2026",
    sections: [
      {
        heading: "The short version",
        body: "The Secretary of State is Georgia's chief elections officer. Their office oversees voter registration, coordinates and monitors elections at every level, and certifies the official results. The same office also registers businesses and corporations, licenses many professions, and regulates the state's securities market. For voters, the elections role is the one that matters most.",
      },
      {
        heading: "Why this office matters to your vote",
        body: "When you check whether you're registered, find your polling place, request an absentee ballot, or look up your sample ballot, you're using systems run by the Secretary of State's office — the My Voter Page at mvp.sos.ga.gov. The office maintains the voter rolls and certifies who won. That's why it's one of the most consequential offices on your ballot, even though it gets less attention than governor or senator.",
      },
      {
        heading: "Elections, start to finish",
        body: "The office's elections division coordinates municipal, county, state, and federal elections; manages voter registration; handles campaign-finance disclosure for state candidates; and certifies final results. It works alongside Georgia's 159 county election offices, which run the actual polling places.",
      },
      {
        heading: "Beyond elections",
        body: "The Secretary of State also registers and regulates corporations and nonprofits, grants professional licenses (from cosmetologists to engineers), oversees securities, and maintains the State Capitol and the Georgia Archives. It's a wide-ranging office, but the elections function is what puts it on your ballot's radar.",
      },
      {
        heading: "Term",
        body: "The Secretary of State is a constitutional officer elected to a four-year term.",
      },
    ],
    related: [
      { href: "/guides/check-voter-registration-georgia", label: "Check your registration (uses the SoS My Voter Page)" },
      { href: "/elections", label: "See the 2026 races" },
      { href: "/register", label: "How to register to vote in Georgia" },
    ],
  },
  {
    slug: "what-is-the-georgia-public-service-commission",
    title: "What Is the Georgia Public Service Commission? (And Why It's On Your Power Bill)",
    metaTitle: "What Is the Georgia Public Service Commission? · MyVote",
    description:
      "Five elected commissioners set the rates most Georgians pay for electricity and natural gas. Here's what the Public Service Commission does — and why these low-profile races hit your wallet.",
    updated: "June 18, 2026",
    sections: [
      {
        heading: "The short version",
        body: "The Georgia Public Service Commission (PSC) is a five-member elected body that regulates the state's investor-owned utilities — setting the rates most Georgians pay for electricity and natural gas, and overseeing telecommunications and some transportation. If your power is from Georgia Power, the PSC has a direct hand in what you pay.",
      },
      {
        heading: "Why a sleepy race hits your wallet",
        body: "PSC races get little attention, but few offices touch your monthly budget as directly. The commission has exclusive authority to decide what counts as a 'fair and reasonable' rate for the utilities it regulates — balancing reliable service and affordable bills against utilities earning a return on investment. When your electric bill goes up, a PSC decision is often behind it.",
      },
      {
        heading: "How the five commissioners are elected",
        body: "The PSC has a chairman, vice-chairman, and three commissioners. Each must live in one of five districts, but — importantly — they're elected statewide, in partisan elections, by all Georgia voters. So even though a commissioner represents a district, every voter in Georgia helps choose them. They serve staggered six-year terms.",
      },
      {
        heading: "What it does — and doesn't — regulate",
        body: "The PSC regulates electric, natural gas, telecommunications, and certain transportation services. Unlike utility regulators in some other states, the Georgia PSC does not regulate water and sewer service — those are handled locally. So a water-bill complaint goes to your city or county, not the PSC.",
      },
    ],
    related: [
      { href: "/elections", label: "See the 2026 statewide races" },
      { href: "/guides/what-does-the-georgia-governor-do", label: "What does the Governor do?" },
      { href: "/g", label: "Find your full county ballot" },
    ],
  },
];

export function getGuide(slug: string): Guide | null {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}
