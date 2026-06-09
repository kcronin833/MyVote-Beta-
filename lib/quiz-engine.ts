/**
 * MyVote Civic Intake Quiz — Scoring Engine
 *
 * Dimensions (each scored 0–100):
 *  - economicFreedom      High = prefers markets & limited gov spending
 *  - socialFreedom        High = prefers personal autonomy
 *  - governmentActivism   High = prefers active government role
 *  - institutionalTrust   High = trusts gov / media / corporations
 *  - localFocus           High = local government matters most
 *  - nationalFocus        High = federal government matters most
 *  - communityOrientation High = collective / shared-responsibility mindset
 *  - publicSafetyPriority High = law-enforcement authority prioritized
 *  - globalEngagement     High = US should lead internationally
 *
 * Skipped answers are excluded from that dimension's average.
 * Every dimension defaults to 50 if no applicable questions were answered.
 */

// ─── Types ────────────────────────────────────────────────────────────────

export type ScaleValue = 0 | 25 | 50 | 75 | 100
export type ScaleAnswer = ScaleValue | "skip"

export type DimKey =
  | "economicFreedom"
  | "socialFreedom"
  | "governmentActivism"
  | "institutionalTrust"
  | "localFocus"
  | "nationalFocus"
  | "communityOrientation"
  | "publicSafetyPriority"
  | "globalEngagement"

export interface DimensionScores {
  economicFreedom: number
  socialFreedom: number
  governmentActivism: number
  institutionalTrust: number
  localFocus: number
  nationalFocus: number
  communityOrientation: number
  publicSafetyPriority: number
  globalEngagement: number
}

export interface QuizResult {
  /** Scale answers keyed by question id (1–9), value is 0/25/50/75/100 or "skip" */
  scaleAnswers: Record<number, ScaleAnswer>
  /** Q10 – who should address problems first */
  problemSolver: string | null
  /** Q11 – up to 3 issue interests */
  selectedIssues: string[]
  /** Q12 – preferred content format */
  contentPreference: string | null
  scores: DimensionScores
  archetype: ArchetypeKey
  completedAt: string
}

// ─── Scale Question Definitions ───────────────────────────────────────────

export interface ScaleQuestion {
  type: "scale"
  id: number
  text: string
  /**
   * Each entry names a dimension and a direction.
   * weight  1 → Agree increases this dimension's score
   * weight -1 → Agree decreases this dimension's score
   */
  dimensions: { key: DimKey; weight: 1 | -1 }[]
}

/**
 * The nine Likert-scale questions. Order is the DISPLAY order — change the
 * array order to change what appears on screen first. Each question's `id`
 * is stable and maps to scaleAnswers keys regardless of display position.
 *
 * Design intent for ordering:
 *  – Open with concrete, non-loaded civic questions (local/national scope,
 *    global role) so early answers don't prime the quiz as left or right.
 *  – Move the classic tax-and-spend questions to the middle once the user
 *    is already invested.
 *  – End with institutional trust — the highest-signal differentiator.
 */
export const SCALE_QUESTIONS: ScaleQuestion[] = [
  // Q9 first — local-vs-national scope feels concrete and non-partisan
  {
    type: "scale",
    id: 9,
    text: "The government decisions that affect my daily life most are usually made locally, not nationally.",
    dimensions: [
      { key: "localFocus",    weight: 1 },
      { key: "nationalFocus", weight: -1 },
    ],
  },
  // Community / traditions — still fairly neutral as an opener
  {
    type: "scale",
    id: 4,
    text: "Protecting local communities, traditions, and culture should be a major priority.",
    dimensions: [
      { key: "localFocus",           weight: 1 },
      { key: "communityOrientation", weight: 1 },
    ],
  },
  // US world role — interesting and differentiating without being economic
  {
    type: "scale",
    id: 7,
    text: "The United States should play a strong leadership role in world affairs.",
    dimensions: [
      { key: "globalEngagement", weight: 1 },
      { key: "nationalFocus",    weight: 1 },
    ],
  },
  // Public safety — concrete, doesn't feel partisan before context is set
  {
    type: "scale",
    id: 6,
    text: "Public safety sometimes requires giving law enforcement broader authority.",
    dimensions: [{ key: "publicSafetyPriority", weight: 1 }],
  },
  // Free markets — now the user is halfway through, less primed
  {
    type: "scale",
    id: 3,
    text: "Free markets usually solve problems better than government regulation.",
    dimensions: [
      { key: "economicFreedom",    weight: 1 },
      { key: "governmentActivism", weight: -1 },
    ],
  },
  // Taxes/services — classic left-right, but now in position 6 of 9
  {
    type: "scale",
    id: 1,
    text: "Government should provide more services, even if it means higher taxes.",
    dimensions: [
      { key: "governmentActivism", weight: 1 },
      { key: "economicFreedom",    weight: -1 },
    ],
  },
  // Safety net — related to Q1 but from a moral-obligation framing
  {
    type: "scale",
    id: 5,
    text: "Society has a responsibility to ensure that everyone has access to basic healthcare, food, and shelter.",
    dimensions: [
      { key: "communityOrientation", weight: 1 },
      { key: "governmentActivism",   weight: 1 },
    ],
  },
  // REPLACED Q2: original "lifestyle choices" question had near-zero
  // differentiation — virtually everyone agreed. New question measures the
  // same socialFreedom dimension but from the opposite direction (tradition
  // vs. personal autonomy), which splits responses across the spectrum.
  {
    type: "scale",
    id: 2,
    text: "How people choose to live should reflect shared community values and traditions, not just personal preference.",
    dimensions: [
      { key: "socialFreedom",        weight: -1 },
      { key: "communityOrientation", weight: 1  },
    ],
  },
  // Institutional trust last — the most differentiating single question,
  // best saved for when the user is already engaged.
  {
    type: "scale",
    id: 8,
    text: "Large institutions — government, media, and corporations — generally act in the public interest.",
    dimensions: [{ key: "institutionalTrust", weight: 1 }],
  },
]

// ─── Multi-choice Q10 ─────────────────────────────────────────────────────

export const PROBLEM_SOLVER_OPTIONS = [
  { label: "Individuals",                  value: "individuals" },
  { label: "Families & local communities", value: "communities" },
  { label: "Local government",             value: "local_gov" },
  { label: "State government",             value: "state_gov" },
  { label: "Federal government",           value: "federal_gov" },
  { label: "International organizations",  value: "international" },
] as const

/** Dimension contributions for each Q10 answer. */
const PROBLEM_SOLVER_SCORES: Record<string, Partial<DimensionScores>> = {
  individuals:   { economicFreedom: 85, socialFreedom: 70, governmentActivism: 15, communityOrientation: 35, localFocus: 55 },
  communities:   { communityOrientation: 90, localFocus: 80, economicFreedom: 55, governmentActivism: 25 },
  local_gov:     { localFocus: 92, nationalFocus: 18, governmentActivism: 62, communityOrientation: 62 },
  state_gov:     { localFocus: 58, nationalFocus: 52, governmentActivism: 60 },
  federal_gov:   { nationalFocus: 88, governmentActivism: 88, localFocus: 18 },
  international: { globalEngagement: 92, nationalFocus: 68, governmentActivism: 72 },
}

// ─── Issue Options (Q11) ──────────────────────────────────────────────────

export const ISSUE_OPTIONS = [
  "Economy",
  "Taxes",
  "Immigration",
  "Healthcare",
  "Education",
  "Housing",
  "Crime & public safety",
  "Environment",
  "Transportation",
  "Local development",
  "Religion & culture",
  "Technology & privacy",
  "Foreign policy",
]

// ─── Content Preference Options (Q12) ─────────────────────────────────────

export const CONTENT_PREF_OPTIONS = [
  "Just the facts",
  "Short summaries",
  "Deep analysis",
  "Data and charts",
  "Multiple viewpoints side by side",
  "Local impact first",
]

// ─── Scoring Functions ─────────────────────────────────────────────────────

interface Accumulator { sum: number; count: number }
type AccMap = Record<DimKey, Accumulator>

function emptyAcc(): AccMap {
  const keys: DimKey[] = [
    "economicFreedom", "socialFreedom", "governmentActivism",
    "institutionalTrust", "localFocus", "nationalFocus",
    "communityOrientation", "publicSafetyPriority", "globalEngagement",
  ]
  return Object.fromEntries(keys.map((k) => [k, { sum: 0, count: 0 }])) as AccMap
}

/**
 * Main scoring entry point.
 *
 * @param scaleAnswers  Map of questionId → ScaleAnswer from Q1–Q9
 * @param problemSolver Selected value from Q10, or null if skipped
 * @returns Normalized 0–100 scores for every dimension
 */
export function computeScores(
  scaleAnswers: Record<number, ScaleAnswer>,
  problemSolver: string | null
): DimensionScores {
  const acc = emptyAcc()

  // Q1–Q9: Likert scale
  for (const q of SCALE_QUESTIONS) {
    const ans = scaleAnswers[q.id]
    if (ans === undefined || ans === "skip") continue
    for (const { key, weight } of q.dimensions) {
      // weight  1 → raw score used as-is
      // weight -1 → invert (100 - raw)
      const contribution = weight === 1 ? (ans as ScaleValue) : 100 - (ans as ScaleValue)
      acc[key].sum += contribution
      acc[key].count += 1
    }
  }

  // Q10: multi-choice problem solver.
  // Uses a fractional weight so this single answer nudges scores without
  // being able to override a consensus from Q1–Q9. At 0.65 it counts as
  // roughly 2/3 of one Likert answer — meaningful but not dominant.
  const Q10_WEIGHT = 0.65
  if (problemSolver && PROBLEM_SOLVER_SCORES[problemSolver]) {
    for (const [dim, score] of Object.entries(PROBLEM_SOLVER_SCORES[problemSolver]) as [DimKey, number][]) {
      acc[dim].sum   += score * Q10_WEIGHT
      acc[dim].count += Q10_WEIGHT
    }
  }

  // Normalize: mean of contributed scores, default 50 if nothing answered
  const norm = (a: Accumulator) => (a.count === 0 ? 50 : Math.round(a.sum / a.count))

  return {
    economicFreedom:      norm(acc.economicFreedom),
    socialFreedom:        norm(acc.socialFreedom),
    governmentActivism:   norm(acc.governmentActivism),
    institutionalTrust:   norm(acc.institutionalTrust),
    localFocus:           norm(acc.localFocus),
    nationalFocus:        norm(acc.nationalFocus),
    communityOrientation: norm(acc.communityOrientation),
    publicSafetyPriority: norm(acc.publicSafetyPriority),
    globalEngagement:     norm(acc.globalEngagement),
  }
}

// ─── Archetypes ────────────────────────────────────────────────────────────

export type ArchetypeKey =
  | "institutional_skeptic"
  | "freedom_first"
  | "public_safety"
  | "local_impact"
  | "independent_localist"
  | "community_builder"
  | "national_policy_watcher"
  | "civic_pragmatist"

export interface Archetype {
  key: ArchetypeKey
  label: string
  emoji: string
  headline: string
  description: string
  /** Short tag shown on profile chip */
  tag: string
}

export const ARCHETYPES: Record<ArchetypeKey, Archetype> = {
  institutional_skeptic: {
    key: "institutional_skeptic",
    label: "Institutional Skeptic",
    emoji: "🔍",
    tag: "Skeptic",
    headline: "You question whether the establishment is working for you — and you're not alone.",
    description:
      "You tend to doubt that large institutions — government, media, or corporations — consistently act in the public interest. You value transparency, accountability, and independent information sources. We'll prioritize fact-based coverage, show primary sources, and give you multiple perspectives on every story so you can judge for yourself.",
  },
  freedom_first: {
    key: "freedom_first",
    label: "Freedom-First Voter",
    emoji: "🗽",
    tag: "Freedom First",
    headline: "Personal freedom and limited government are your guiding values.",
    description:
      "You believe strongly in individual liberty — both personal and economic — and are skeptical of government overreach. You tend to prefer market-based and community-driven solutions over government programs. We'll surface stories about regulations, taxes, property rights, and civil liberties.",
  },
  public_safety: {
    key: "public_safety",
    label: "Public Safety Voter",
    emoji: "🛡️",
    tag: "Public Safety",
    headline: "Safe communities are the foundation everything else is built on.",
    description:
      "You believe law enforcement needs adequate authority to keep communities secure, and you're willing to accept tradeoffs to get there. You follow crime, policing, and community safety news closely. We'll make sure public safety coverage, local crime reports, and policing policy stories are front and center.",
  },
  local_impact: {
    key: "local_impact",
    label: "Local Impact Voter",
    emoji: "📍",
    tag: "Local Impact",
    headline: "Real change starts at the local level, not in Washington.",
    description:
      "You believe the most consequential decisions happen at the city, county, and state level — not in Congress. You want to know what's happening at your school board, city hall, and state legislature. We'll focus your feed on local races, local government decisions, and community news.",
  },
  independent_localist: {
    key: "independent_localist",
    label: "Independent Localist",
    emoji: "🏘️",
    tag: "Independent",
    headline: "You're a free thinker who believes in the power of community.",
    description:
      "You combine a strong belief in personal freedom with a genuine investment in your local community. You probably don't fit neatly into any political label and care more about practical outcomes than ideology. We'll show you local news, candidate comparisons, and coverage that cuts through partisan noise.",
  },
  community_builder: {
    key: "community_builder",
    label: "Community Builder",
    emoji: "🤝",
    tag: "Community",
    headline: "We're stronger when we look out for each other.",
    description:
      "You believe in shared responsibility — healthcare, education, housing, and making sure no one gets left behind. You're likely interested in social programs, community investment, and how policy affects people who are struggling. We'll surface stories about healthcare, housing, education, and civic institutions.",
  },
  national_policy_watcher: {
    key: "national_policy_watcher",
    label: "National Policy Watcher",
    emoji: "🏛️",
    tag: "Policy Watcher",
    headline: "You follow national and global affairs closely.",
    description:
      "You're engaged with federal policy, Congress, and America's role in the world. You prefer content about major legislation, foreign affairs, and the macro forces shaping the country. We'll keep you current on national politics, federal agencies, Supreme Court decisions, and international news.",
  },
  civic_pragmatist: {
    key: "civic_pragmatist",
    label: "Civic Pragmatist",
    emoji: "⚖️",
    tag: "Pragmatist",
    headline: "You evaluate issues on their merits, not party lines.",
    description:
      "Your views are balanced across multiple dimensions and you resist being boxed into a single ideology. You weigh policies based on evidence and real-world impact rather than labels. We'll show you balanced coverage, factual summaries, and multiple perspectives so you can form your own well-informed opinions.",
  },
}

/**
 * Assigns an archetype based on computed dimension scores using a best-fit
 * model. Every archetype gets a fit score; the highest wins.
 *
 * Why: the old greedy first-match approach made institutional_skeptic fire
 * on ANY user with institutionalTrust < 35 — before checking anything else.
 * That single threshold captured libertarians, progressives, and MAGA voters
 * alike, all for completely different reasons. Best-fit means every archetype
 * competes simultaneously and the most representative one wins.
 *
 * civic_pragmatist holds a floor of 38 so it wins whenever no specific
 * profile generates a stronger signal (genuinely balanced users).
 */
export function assignArchetype(s: DimensionScores): ArchetypeKey {
  // Helper: clamp a raw score contribution to [0, 100]
  const c = (v: number) => Math.max(0, Math.min(100, v))

  const fit: Record<ArchetypeKey, number> = {
    // Institutional Skeptic: very low trust is the defining trait.
    // Only scores above 0 if trust is meaningfully below the midpoint (50).
    // Scales linearly so trust=0 → score≈100, trust=40 → score≈25.
    institutional_skeptic:
      s.institutionalTrust < 45
        ? c((45 - s.institutionalTrust) * 2.2)
        : 0,

    // Freedom First: economic freedom + social autonomy + small government.
    // Requires BOTH freedom axes to be elevated — not just one.
    freedom_first:
      s.economicFreedom > 52 && s.socialFreedom < 52   // socialFreedom inverted: high score = less community-values
        ? c((s.economicFreedom + (100 - s.socialFreedom) + (100 - s.governmentActivism)) / 3)
        : s.economicFreedom > 60 && s.governmentActivism < 45
        ? c((s.economicFreedom + (100 - s.governmentActivism)) / 2 * 0.85)
        : 0,

    // Public Safety: single dominant dimension — a clear and strong signal.
    public_safety: c(s.publicSafetyPriority),

    // Local Impact: strong local preference with clearly NOT national focus.
    local_impact:
      s.localFocus > 55
        ? c((s.localFocus * 1.3 + (100 - s.nationalFocus) * 0.7) / 2)
        : 0,

    // National Policy Watcher: engaged both globally and federally.
    national_policy_watcher:
      s.globalEngagement > 52 && s.nationalFocus > 48
        ? c((s.globalEngagement + s.nationalFocus) / 2)
        : 0,

    // Community Builder: collective responsibility + active government.
    community_builder:
      s.communityOrientation > 55 && s.governmentActivism > 50
        ? c((s.communityOrientation + s.governmentActivism) / 2)
        : 0,

    // Independent Localist: local + individual-freedom lean, not collectivist.
    // socialFreedom stored inverted — LOW score means individual-leaning.
    independent_localist:
      s.localFocus > 55 && s.socialFreedom < 50 && s.communityOrientation < 60
        ? c((s.localFocus + (100 - s.socialFreedom)) / 2 * 0.9)
        : s.localFocus > 55 && s.economicFreedom > 55 && s.communityOrientation < 60
        ? c((s.localFocus + s.economicFreedom) / 2 * 0.85)
        : 0,

    // Civic Pragmatist: baseline. Wins when no archetype dominates.
    civic_pragmatist: 38,
  }

  let best: ArchetypeKey = "civic_pragmatist"
  let bestScore = 0
  for (const [key, score] of Object.entries(fit) as [ArchetypeKey, number][]) {
    if (score > bestScore) {
      bestScore = score
      best = key as ArchetypeKey
    }
  }
  return best
}

/**
 * One-sentence ballot relevance callout shown on the results screen.
 * Connects the civic profile to the 2026 Georgia races.
 */
export const ARCHETYPE_BALLOT_HOOK: Record<ArchetypeKey, string> = {
  institutional_skeptic:
    "Look closely at candidates' transparency records, campaign finance sources, and whether they've actually delivered on past promises.",
  freedom_first:
    "The governor's race and state legislature directly control Georgia's tax policy, business regulations, and personal-liberty laws.",
  public_safety:
    "Sheriff, DA, and state attorney general races — plus the governor who sets law-enforcement policy — are most relevant to your priorities.",
  local_impact:
    "Your county commission, school board, and state legislature races matter most. These officials make the decisions closest to your daily life.",
  national_policy_watcher:
    "Georgia's U.S. Senate seat and all 14 congressional races have direct national impact — these deserve close attention from you.",
  community_builder:
    "The governor's race and state legislature control healthcare funding, education spending, and social programs across Georgia.",
  independent_localist:
    "County and state-level races are where you can make the biggest difference. Look for candidates focused on local accountability over party loyalty.",
  civic_pragmatist:
    "Georgia's Senate race, governor's race, and your local U.S. House race all appear on your 2026 ballot — see every candidate side by side.",
}

/** Human-readable labels for the dimension score bars shown on the results screen */
export const DIM_LABELS: { key: DimKey; label: string; low: string; high: string }[] = [
  { key: "economicFreedom",      label: "Economic approach",    low: "Gov. managed",  high: "Free market"       },
  { key: "socialFreedom",        label: "Personal freedom",     low: "Collective",    high: "Individual"        },
  { key: "governmentActivism",   label: "Government role",      low: "Limited gov",   high: "Active gov"        },
  { key: "institutionalTrust",   label: "Institutional trust",  low: "Skeptical",     high: "Trusting"          },
  { key: "localFocus",           label: "Government level",     low: "National",      high: "Local"             },
  { key: "communityOrientation", label: "Responsibility",       low: "Individual",    high: "Shared"            },
  { key: "publicSafetyPriority", label: "Safety vs liberty",   low: "Liberty first", high: "Safety first"      },
  { key: "globalEngagement",     label: "US world role",        low: "Stay home",     high: "Lead globally"     },
]
