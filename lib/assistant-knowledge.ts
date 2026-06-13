/* Knowledge base for the MyVote site assistant.
 *
 * Deliberately rule-based, not LLM-backed: (1) $0 budget, no per-message API
 * cost; (2) on an election site, a free-text model could hallucinate
 * candidates or dates — the exact harm we fixed in June 2026. Every answer
 * here is hand-written and accurate, and anything election-specific routes
 * the user to the live ballot tool or the GA Secretary of State rather than
 * stating facts that could go stale.
 *
 * An LLM backend can be layered on later (see /api/assistant stub idea in
 * the component) without changing this curated fallback.
 */

export interface AssistantAction {
  label: string;
  /** Internal route (next/link) or external URL (opens new tab). */
  href: string;
  external?: boolean;
}

export interface Intent {
  id: string;
  /** Lowercase keywords/phrases; matched against the user's message. */
  keywords: string[];
  /** Assistant reply (plain text; rendered with line breaks). */
  answer: string;
  /** Optional action buttons shown under the reply. */
  actions?: AssistantAction[];
  /** Optional follow-up suggestion chips. */
  followups?: string[];
}

/** Shown when the panel first opens. */
export const GREETING =
  "Hi! I'm the MyVote guide. I can explain what this site does, help you find what's on your ballot, or point you to the right page. What would you like to know?";

/** Starter chips shown under the greeting. */
export const STARTER_CHIPS = [
  "What is MyVote?",
  "What's on my ballot?",
  "When do I vote?",
  "Is this nonpartisan?",
  "Take the quiz",
];

export const INTENTS: Intent[] = [
  {
    id: "what-is-myvote",
    keywords: ["what is myvote", "what is this", "what does this site", "what do you do", "about myvote", "what's myvote", "purpose", "what is the site"],
    answer:
      "MyVote is a free, non-partisan voter guide for Georgia's 2026 elections. Enter your ZIP and you'll see your complete ballot — governor, U.S. Senate, your U.S. House district, and local offices — with candidate info. We also gather political news from the left, center, and right in one place, and offer a quick quiz to help you understand your own civic profile. No account required to look things up.",
    actions: [
      { label: "See my ballot", href: "/elections" },
      { label: "About our mission", href: "/about" },
    ],
    followups: ["Why does MyVote exist?", "Is this nonpartisan?", "Is it really free?"],
  },
  {
    id: "why",
    keywords: ["why", "mission", "the problem", "why does this exist", "why do you", "what's the point", "goal"],
    answer:
      "Most people show up to vote knowing the big races but nothing about the local ones — school board, sheriff, county commission — that affect daily life the most. And political news is so polarized it's hard to get a straight picture. MyVote exists to fix both: show you your whole ballot in one place, and let you read how every issue is covered across the political spectrum, so you can make up your own mind.",
    actions: [
      { label: "Read more about us", href: "/about" },
      { label: "Try the news spectrum", href: "/news" },
    ],
    followups: ["Is this nonpartisan?", "What's on my ballot?"],
  },
  {
    id: "nonpartisan",
    keywords: ["nonpartisan", "non-partisan", "biased", "bias", "partisan", "left or right", "lean", "neutral", "fair", "objective", "agenda"],
    answer:
      "MyVote doesn't endorse candidates or parties. For news, we deliberately show coverage from left, center, and right side by side so you can see the full picture rather than one slant. For candidates, we present the same kind of information for everyone. Our goal is to help you decide — not to decide for you.",
    actions: [{ label: "See left/center/right news", href: "/news" }],
    followups: ["Why does MyVote exist?", "Who made this?"],
  },
  {
    id: "ballot",
    keywords: ["ballot", "who's on", "whos on", "my races", "candidates", "who can i vote for", "who is running", "running for", "what's on my", "my ballot", "see my ballot"],
    answer:
      "Enter your ZIP code on the elections page and I'll take you to your county's races. Important: for the exact, official ballot you'll see at your polling place — including any local runoffs — always confirm with the Georgia Secretary of State's My Voter Page, which is the authoritative source.",
    actions: [
      { label: "Look up my ballot", href: "/elections" },
      { label: "Official ballot (GA SoS)", href: "https://mvp.sos.ga.gov", external: true },
    ],
    followups: ["When do I vote?", "Does it cover my county?"],
  },
  {
    id: "dates",
    keywords: ["when do i vote", "when is the election", "election day", "runoff", "when can i vote", "dates", "deadline", "june 16", "voting day", "when's the"],
    answer:
      "Georgia's next election is the June 16, 2026 primary runoff, followed by the general election on November 3, 2026. Runoff and early-voting dates can vary by county, so check the elections page for the current details and confirm your specific dates and polling place on the GA Secretary of State's My Voter Page.",
    actions: [
      { label: "Election dates & races", href: "/elections" },
      { label: "What is a runoff?", href: "/guides/what-is-a-runoff" },
      { label: "Check dates (GA SoS)", href: "https://mvp.sos.ga.gov", external: true },
    ],
    followups: ["What is early voting?", "What's on my ballot?"],
  },
  {
    id: "register",
    keywords: ["register", "registration", "am i registered", "how do i register", "sign up to vote", "registered to vote", "registar"],
    answer:
      "You can register to vote in Georgia online if you have a Georgia driver's license or state ID. You must register at least 29 days before an election. To check whether you're already registered, use the Secretary of State's My Voter Page. Our registration guide walks through the whole process.",
    actions: [
      { label: "Registration guide", href: "/register" },
      { label: "Check registration (GA SoS)", href: "https://mvp.sos.ga.gov", external: true },
    ],
    followups: ["When do I vote?", "What ID do I need?"],
  },
  {
    id: "quiz",
    keywords: ["quiz", "civic profile", "what kind of voter", "personality", "which one are you", "take the quiz", "my profile"],
    answer:
      "The civic profile quiz is 12 quick questions — no partisan labels, no wrong answers. It maps your values to one of 8 civic profiles, each paired with historical figures who shared that outlook, and it's grounded in real political-psychology research. Takes about 2 minutes and your answers stay on your device.",
    actions: [
      { label: "Take the quiz", href: "/quiz" },
      { label: "See all 8 profiles", href: "/profiles" },
    ],
    followups: ["What is MyVote?", "Is my data private?"],
  },
  {
    id: "news",
    keywords: ["news", "spectrum", "left right center", "media", "articles", "headlines", "coverage", "perspectives", "both sides", "local news"],
    answer:
      "MyVote pulls political news into one place and shows how stories are covered across the spectrum — left, center, and right — so you're not stuck in one bubble. There's national coverage and Georgia-local coverage. You can browse without an account.",
    actions: [
      { label: "National news", href: "/news" },
      { label: "Local Georgia news", href: "/news/local" },
    ],
    followups: ["Is this nonpartisan?", "What is MyVote?"],
  },
  {
    id: "early-voting",
    keywords: ["early voting", "advance voting", "vote early", "early vote"],
    answer:
      "Georgia offers in-person early (advance) voting before every election — no excuse needed, and you can use any early-voting site in your county. Exact dates and hours vary by county, so confirm yours on the My Voter Page. Our guide explains how it works.",
    actions: [
      { label: "Early voting guide", href: "/guides/early-voting-georgia" },
      { label: "Find sites (GA SoS)", href: "https://mvp.sos.ga.gov", external: true },
    ],
    followups: ["What ID do I need?", "When do I vote?"],
  },
  {
    id: "voter-id",
    keywords: ["id", "identification", "what do i bring", "photo id", "drivers license", "need to bring"],
    answer:
      "Georgia requires photo ID to vote in person — a Georgia driver's license, free state voter ID card, U.S. passport, military ID, or government employee photo ID all work. If you don't have one, county registrar and DDS offices issue free voter ID cards. Our guide has the full list.",
    actions: [{ label: "Voter ID guide", href: "/guides/georgia-voter-id" }],
    followups: ["What is early voting?", "How do I register?"],
  },
  {
    id: "absentee",
    keywords: ["absentee", "mail", "by mail", "mail in", "mail-in", "vote from home"],
    answer:
      "Any registered Georgia voter can vote by mail — no excuse required. You request an absentee ballot, fill it out, and make sure it's RECEIVED (not just postmarked) by 7pm on election day. Our guide covers requesting, completing, and returning it so it counts.",
    actions: [{ label: "Absentee ballot guide", href: "/guides/georgia-absentee-ballot" }],
    followups: ["When do I vote?", "How do I register?"],
  },
  {
    id: "cost",
    keywords: ["free", "cost", "pay", "price", "how much", "subscription", "is it free"],
    answer:
      "MyVote is completely free. There's no subscription and no paywall — looking up your ballot, reading the news, and taking the quiz all cost nothing. You don't even need an account to use the core features.",
    actions: [{ label: "See my ballot", href: "/elections" }],
    followups: ["Why does MyVote exist?", "Who made this?"],
  },
  {
    id: "account",
    keywords: ["account", "sign up", "log in", "login", "register account", "why make an account", "create account", "do i need an account"],
    answer:
      "You don't need an account to look up your ballot, read news, or take the quiz. An account is optional — it lets you save your ballot picks, sync across devices, and follow balanced news. It's free to create.",
    actions: [
      { label: "Create free account", href: "/auth/signup" },
      { label: "Sign in", href: "/auth/signin" },
    ],
    followups: ["Is my data private?", "Is it really free?"],
  },
  {
    id: "privacy",
    keywords: ["privacy", "data", "sell my", "track", "personal information", "private", "do you sell", "spam"],
    answer:
      "We don't sell your data to political campaigns. Quiz answers are stored on your device by default. If you sign up for election reminders, we use your email only for that — no spam. You can read the full details on our privacy page.",
    actions: [{ label: "Privacy policy", href: "/privacy" }],
    followups: ["Why make an account?", "Who made this?"],
  },
  {
    id: "who",
    keywords: ["who made", "who built", "who's behind", "who runs", "who created", "company", "organization", "team"],
    answer:
      "MyVote is an independent, non-partisan project built to help Georgians vote with confidence. It's not affiliated with any party, campaign, or government agency. You can learn more on the About page — and if you have a question for a person, the contact page reaches us directly.",
    actions: [
      { label: "About MyVote", href: "/about" },
      { label: "Contact us", href: "/contact" },
    ],
    followups: ["Is this nonpartisan?", "Why does MyVote exist?"],
  },
  {
    id: "report-error",
    keywords: ["wrong", "error", "incorrect", "mistake", "outdated", "report", "fix", "inaccurate", "not right"],
    answer:
      "Thank you — accuracy matters more than anything to us. If something looks wrong (a date, a candidate, ballot info), please report it and we'll check it against the Secretary of State and fix it fast. For anything time-sensitive about your own ballot, the GA My Voter Page is always the authoritative source.",
    actions: [
      { label: "Report an error", href: "/contact?topic=correction" },
      { label: "Official ballot (GA SoS)", href: "https://mvp.sos.ga.gov", external: true },
    ],
  },
  {
    id: "counties",
    keywords: ["county", "counties", "my area", "my district", "cover", "does it have", "is my county"],
    answer:
      "MyVote covers all 159 Georgia counties. Enter your ZIP on the elections page to jump straight to yours, or browse the full county list.",
    actions: [
      { label: "Find my county", href: "/elections" },
      { label: "Browse all counties", href: "/g" },
    ],
    followups: ["What's on my ballot?", "When do I vote?"],
  },
  {
    id: "contact",
    keywords: ["contact", "human", "talk to someone", "help", "support", "email you", "reach you", "question for"],
    answer:
      "Happy to point you to a real person. The contact page reaches the MyVote team directly — we read every message and usually reply within a day.",
    actions: [{ label: "Contact us", href: "/contact" }],
  },
];

/** Fallback when nothing matches. */
export const FALLBACK = {
  answer:
    "I'm not sure I have an answer for that, but here are the things I can help with — or you can reach a person on the contact page.",
  followups: ["What is MyVote?", "What's on my ballot?", "When do I vote?", "Take the quiz"],
  actions: [{ label: "Contact a human", href: "/contact" }] as AssistantAction[],
};

/** Score a message against intents and return the best match, or null. */
export function matchIntent(message: string): Intent | null {
  const text = " " + message.toLowerCase().trim() + " ";
  let best: Intent | null = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    let score = 0;
    for (const kw of intent.keywords) {
      if (text.includes(kw)) {
        // Longer keyword phrases are stronger signals than single words.
        score += kw.includes(" ") ? 3 : 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }
  return bestScore > 0 ? best : null;
}
