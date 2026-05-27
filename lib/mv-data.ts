/* Mock data for the MyVote desktop redesign.
   Shape mirrors `window.MV_DATA` from the design-handoff `data.js`.
   Swap to real API/Supabase calls per the design README.
*/

export type AvatarTone = "ink" | "navy" | "plum" | "olive";
export type Lean = "left" | "center" | "right";

export const MV_DATA = {
  user: {
    name: "Maya Chen",
    handle: "maya_atl",
    city: "Atlanta",
    county: "Fulton County",
    district: "GA-5",
    streak: 7,
    initials: "MC",
  },

  election: {
    nextLabel: "Georgia Primary",
    nextDate: "May 19, 2026",
    daysAway: 8,
    racesTotal: 12,
    racesDecided: 5,
  },

  dailyQuestion: {
    id: "dq-2026-05-11",
    prompt: "Should Georgia raise the minimum age for assault weapon purchases to 21?",
    context: "Senate Bill 287 is in committee this week.",
    choices: [
      { id: "yes", label: "Yes", count: 4218 },
      { id: "no", label: "No", count: 2891 },
      { id: "unsure", label: "Need more info", count: 1104 },
    ],
  },

  stories: [
    {
      id: "s1",
      headline: "Georgia House passes $36B budget after late-night vote",
      sharedFacts: [
        "Passed 142–38 just before midnight Thursday.",
        "Includes a $2,000 raise for public school teachers.",
        "Rainy-day fund stays at record $5.2B.",
      ],
      sources: 14,
      perspectives: {
        left:   { headline: "Budget falls short on Medicaid expansion, advocates say" },
        center: { headline: "Georgia legislators approve $36B spending plan" },
        right:  { headline: "Conservatives cheer rainy-day fund discipline in budget" },
      },
      readers: 8420,
      time: "2h",
    },
  ],

  commonGround: {
    issue: "Rural broadband",
    summary: "74% of Georgia voters across both parties say expanding rural broadband should be a top legislative priority this session.",
    left: 71,
    right: 78,
  },

  localPulse: {
    city: "Atlanta",
    activeNow: 312,
    topics: [
      { tag: "MARTA expansion", mentions: 184, trend: "up" as const },
      { tag: "Property tax cap", mentions: 142, trend: "up" as const },
      { tag: "Bond referendum", mentions: 89,  trend: "steady" as const },
      { tag: "School board",    mentions: 67,  trend: "down" as const },
    ],
  },

  politicianProfile: {
    name: "Marcus Holloway",
    initials: "MH",
    title: "U.S. Senate Candidate",
    party: "Democratic",
    district: "Georgia",
    posts: [
      { id: "p1", time: "3h", text: "Met with teachers in Clayton County this morning. Class sizes are up, pay still trails Alabama. We can fix this in 2026 — fully fund the QBE formula and stop dipping into the reserve.", likes: 1240, comments: 86,  reposts: 184 },
      { id: "p2", time: "1d", text: "Senate Bill 287 is in committee this week. I support raising the minimum age for assault weapon purchases to 21. Georgia gun owners I've spoken with overwhelmingly agree.", likes: 3210, comments: 412, reposts: 540 },
    ],
  },

  community: {
    posts: [
      {
        id: "c3",
        author: { name: "Lena P.", initials: "LP", lean: "left" as Lean, district: "GA-5", verified: false, verifiedLabel: null as string | null },
        time: "1h",
        scope: "GA-5 · Atlanta",
        text: "Quick neighbor poll — Beltline rail Phase 2 funding. Yes, no, or wait for cost overrun review?",
        poll: {
          question: "Beltline Phase 2 funding — your call?",
          options: [
            { label: "Yes, fund now",       val: 52 },
            { label: "No, redirect to bus", val: 23 },
            { label: "Wait for review",     val: 25 },
          ],
          totalVotes: 287,
        },
        likes: 96, replies: 41, reposts: 12,
      },
    ],
  },

  slate: {
    totalDonated: 145,
    backed: [
      { id: "nw", name: "Nikema Williams", initials: "NW", office: "U.S. House · GA-5", match: 91, tone: "navy"  as AvatarTone },
      { id: "mh", name: "Marcus Holloway", initials: "MH", office: "U.S. Senate · GA",  match: 84, tone: "navy"  as AvatarTone },
      { id: "rb", name: "Renata Burns",    initials: "RB", office: "Governor · GA",     match: 78, tone: "plum"  as AvatarTone },
    ],
  },

  discover: {
    candidates: [
      { id: "nw", name: "Nikema Williams", initials: "NW", office: "U.S. House — GA-5", party: "Democratic", match: 91, followers: 84300, verified: true, tone: "navy"  as AvatarTone },
      { id: "mh", name: "Marcus Holloway", initials: "MH", office: "U.S. Senate",        party: "Democratic", match: 84, followers: 28400, verified: true, tone: "navy"  as AvatarTone },
      { id: "rb", name: "Renata Burns",    initials: "RB", office: "Governor of GA",     party: "Democratic", match: 78, followers: 62400, verified: true, tone: "plum"  as AvatarTone },
    ],
  },
};

export type MvData = typeof MV_DATA;
