/* Single source of truth for verified 2026 Georgia election facts.
 *
 * VERIFIED 2026-06-23 against AP/NPR/Washington Post (June 16 runoff results),
 * Georgia SoS, georgia.gov, and Ballotpedia. Do NOT edit these from memory —
 * re-verify against the GA Secretary of State before changing (see the June
 * 2026 wrong-dates incident). The June 16, 2026 primary runoff is COMPLETE:
 *   - Governor (GOP runoff): Rick Jackson defeated Burt Jones
 *   - U.S. Senate (GOP runoff): Mike Collins defeated Derek Dooley
 * so the November matchups below are final, not pending.
 */

export const GA_2026 = {
  verifiedOn: "June 23, 2026",
  generalElection: { label: "November 3, 2026", iso: "2026-11-03" },
  pollHours: "7:00 a.m. to 7:00 p.m.",
  registrationDeadline: { label: "October 5, 2026", iso: "2026-10-05" },
  earlyVoting: { startLabel: "October 12, 2026", startIso: "2026-10-12", endLabel: "October 30, 2026", endIso: "2026-10-30" },
  absenteeRequestDeadline: { label: "October 23, 2026", iso: "2026-10-23" },
  governor: { democrat: "Keisha Lance Bottoms", republican: "Rick Jackson" },
  senate: { democrat: "Jon Ossoff", republican: "Mike Collins" },
  links: {
    register: "https://registertovote.sos.ga.gov",
    myVoterPage: "https://mvp.sos.ga.gov",
    sos: "https://sos.ga.gov",
  },
} as const;

export interface FaqEntry {
  category: string;
  q: string;
  a: string;
}

/* Prose answers (2–3 sentences, no bullets) so AI engines — Google AI
   Overviews, ChatGPT Search, Perplexity — can extract them cleanly. */
export const GA_VOTER_FAQ: FaqEntry[] = [
  // ── Registration ──
  { category: "Registration", q: "How do I register to vote in Georgia for 2026?", a: "You can register online at registertovote.sos.ga.gov, by mail, or in person at offices like the Department of Driver Services. You must be a U.S. citizen, a legal resident of your Georgia county, and at least 18 years old by Election Day. The deadline to register for the November 3, 2026 general election is October 5, 2026." },
  { category: "Registration", q: "What is the Georgia voter registration deadline for the 2026 election?", a: "The registration deadline for the November 3, 2026 general election is October 5, 2026. If you move or change your name, update your registration by that same date so your information is correct at your polling place." },
  { category: "Registration", q: "How do I check my Georgia voter registration status?", a: "Use the Georgia My Voter Page at mvp.sos.ga.gov. It confirms whether you are registered, shows your assigned polling place, and lets you preview your sample ballot." },
  { category: "Registration", q: "Can I register to vote online in Georgia?", a: "Yes. If you have a Georgia driver's license or state ID, you can register or update your registration online at registertovote.sos.ga.gov in a few minutes." },
  { category: "Registration", q: "Who is eligible to vote in Georgia?", a: "You must be a U.S. citizen, a legal resident of the Georgia county where you register, and at least 18 years old by Election Day. People currently serving a sentence for a felony involving moral turpitude, or who have been declared mentally incompetent by a judge, are not eligible until their rights are restored." },

  // ── ID & eligibility ──
  { category: "ID & Eligibility", q: "What ID do I need to vote in Georgia?", a: "Georgia requires a photo ID to vote in person. Accepted forms include a Georgia driver's license or state ID, a U.S. passport, a U.S. military or government photo ID, a tribal ID, or a free Georgia Voter ID card." },
  { category: "ID & Eligibility", q: "How do I get a free Georgia Voter ID card?", a: "Free Voter ID cards are available at your county registrar's office or a Department of Driver Services center. Bring proof of identity, proof of Georgia residence, and your date of birth." },
  { category: "ID & Eligibility", q: "Do I need ID to vote absentee by mail in Georgia?", a: "Yes. You must provide your Georgia driver's license or state ID number, or a copy of an acceptable photo ID, on both your absentee ballot application and the ballot return envelope." },
  { category: "ID & Eligibility", q: "Can I vote in Georgia without a photo ID?", a: "In almost all cases a photo ID is required. If you cannot show one in person, you may cast a provisional ballot and then provide acceptable ID to your county within three days for it to be counted." },

  // ── Early & absentee voting ──
  { category: "Early & Absentee Voting", q: "When is early voting in Georgia for the 2026 general election?", a: "In-person early voting for the November 3, 2026 general election runs October 12–30, 2026, on weekdays plus at least two Saturdays. Exact dates and hours can vary slightly by county, so confirm your location's schedule on the My Voter Page." },
  { category: "Early & Absentee Voting", q: "How do I vote absentee or by mail in Georgia?", a: "Any registered Georgia voter may request an absentee ballot — no excuse is needed — online or by mail from your county election office. For the general election, your application must be received by October 23, 2026." },
  { category: "Early & Absentee Voting", q: "When must my absentee ballot be returned in Georgia?", a: "Your completed absentee ballot must be received by your county election office by 7:00 p.m. on Election Day, November 3, 2026. A postmark is not enough — late ballots are not counted, so return it early or use an official drop box." },
  { category: "Early & Absentee Voting", q: "Can anyone vote by mail in Georgia?", a: "Yes. Georgia allows no-excuse absentee voting, so any registered voter can request a mail-in ballot for any reason." },

  // ── 2026 races ──
  { category: "2026 Races", q: "Who is running for Georgia governor in 2026?", a: "Democrat Keisha Lance Bottoms, the former mayor of Atlanta, faces Republican Rick Jackson, who won the June 16, 2026 GOP primary runoff. The winner will succeed term-limited Governor Brian Kemp." },
  { category: "2026 Races", q: "Who won the 2026 Georgia Republican primary runoff for governor?", a: "Rick Jackson won the June 16, 2026 Republican primary runoff for governor, defeating Burt Jones. Jackson is the Republican nominee on the November 3 general election ballot." },
  { category: "2026 Races", q: "Who is running for U.S. Senate in Georgia in 2026?", a: "Incumbent Democratic Senator Jon Ossoff is seeking re-election against Republican Mike Collins, who won the June 16, 2026 GOP primary runoff. The race is one of the most closely watched Senate contests in the country." },
  { category: "2026 Races", q: "Who won the 2026 Georgia Republican Senate primary runoff?", a: "U.S. Representative Mike Collins won the June 16, 2026 Republican Senate primary runoff, defeating Derek Dooley. Collins will challenge Democratic Senator Jon Ossoff in November." },
  { category: "2026 Races", q: "Is Brian Kemp running for governor in 2026?", a: "No. Governor Brian Kemp is term-limited and cannot seek a third consecutive term, so the 2026 governor's race is for an open seat between Keisha Lance Bottoms and Rick Jackson." },
  { category: "2026 Races", q: "What statewide offices are on Georgia's 2026 ballot?", a: "The 2026 ballot includes Governor, Lieutenant Governor, U.S. Senate, Secretary of State, Attorney General, and other state constitutional offices. It also includes all 14 of Georgia's U.S. House seats and every seat in the Georgia General Assembly, plus local races." },

  // ── How MyVote works ──
  { category: "About MyVote", q: "What is MyVote?", a: "MyVote is a free, nonpartisan civic platform for Georgia voters. It shows your personalized ballot by ZIP code, presents political news from the left, center, and right side by side, and gives you tools to decide for yourself." },
  { category: "About MyVote", q: "Is MyVote affiliated with any political party?", a: "No. MyVote is completely nonpartisan and is not affiliated with any political party, candidate, campaign, or government entity. It is independently funded with no PAC money and no political advertisers." },
  { category: "About MyVote", q: "How does MyVote show news from every side?", a: "For each major story, MyVote provides a neutral synopsis and labels its sources as left, center, or right, always linking out to the original reporting. The goal is to let you see the full spectrum and reach your own conclusion." },

  // ── General ──
  { category: "Election Day", q: "When is the 2026 Georgia general election?", a: "The 2026 Georgia general election is Tuesday, November 3, 2026. Polls are open from 7:00 a.m. to 7:00 p.m." },
  { category: "Election Day", q: "What time do polls open and close in Georgia?", a: "Polling places in Georgia are open from 7:00 a.m. to 7:00 p.m. on Election Day. If you are in line by 7:00 p.m., you are legally allowed to stay and cast your vote." },
  { category: "Election Day", q: "Where do I vote in Georgia?", a: "Find your assigned polling place on the Georgia My Voter Page at mvp.sos.ga.gov. On Election Day you must vote at your assigned precinct, though during early voting you may use any early-voting site in your county." },
  { category: "Election Day", q: "How many U.S. House districts does Georgia have?", a: "Georgia has 14 U.S. House districts, and all 14 seats are on the 2026 ballot. You can see which district you live in, and who is running, by entering your ZIP code on MyVote." },
];

/** Build a schema.org FAQPage object from a set of entries. */
export function faqPageSchema(entries: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((e) => ({
      "@type": "Question",
      name: e.q,
      acceptedAnswer: { "@type": "Answer", text: e.a },
    })),
  };
}
