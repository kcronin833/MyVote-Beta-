/**
 * Civic Profile Store — OkCupid-style incremental civic profiling.
 *
 * Every daily question answer nudges the user's civic dimension scores.
 * The quiz provides a strong baseline; daily answers refine it over time.
 *
 * Stored in localStorage under "mv_civic_profile".
 */

import type { DimKey, DimensionScores, QuizResult } from "./quiz-engine"

const STORAGE_KEY = "mv_civic_profile"

// ─── Types ────────────────────────────────────────────────────────────────

export interface DailyAnswerEntry {
  date: string          // ISO date string
  questionId: string
  prompt: string
  choiceLabel: string
  nudges: Partial<Record<DimKey, number>>  // 0–100 per dimension
}

export interface CivicProfile {
  /** Base result from the orientation quiz (null if not taken) */
  quizResult: QuizResult | null
  /** Blended scores: quiz × 10 + daily answers × 1 each, weighted average */
  scores: DimensionScores
  /**
   * 0–100 profile completeness:
   *   Quiz taken = 60 base pts
   *   Each daily answer = +2 pts (max +40)
   */
  strength: number
  /** Count of unique daily questions answered */
  dailyAnswerCount: number
  /** Most-recent 90 daily answer log entries */
  history: DailyAnswerEntry[]
  /** ISO string of last profile write */
  updatedAt: string
}

// ─── Defaults ─────────────────────────────────────────────────────────────

const DEFAULT_SCORES: DimensionScores = {
  economicFreedom:      50,
  socialFreedom:        50,
  governmentActivism:   50,
  institutionalTrust:   50,
  localFocus:           50,
  nationalFocus:        50,
  communityOrientation: 50,
  publicSafetyPriority: 50,
  globalEngagement:     50,
}

// ─── Dimension Signal Detection ───────────────────────────────────────────

interface DimSignal {
  patterns: RegExp[]
  dim: DimKey
  /**
   * agreeDir = 1  → choosing the FIRST option (most agreement) raises this dim
   * agreeDir = -1 → choosing the first option LOWERS this dim
   */
  agreeDir: 1 | -1
}

/**
 * Keyword → dimension mapping.
 * Order matters: first matching pattern for a dimension wins.
 */
const DIM_SIGNALS: DimSignal[] = [
  // Economic freedom
  {
    patterns: [/tax(es|ing|payer)?/i, /government spend/i, /government fund/i, /public fund/i],
    dim: "economicFreedom",
    agreeDir: -1,   // agreeing with "raise taxes / gov fund" = lower economic freedom
  },
  {
    patterns: [/free market/i, /private sector/i, /deregulat/i, /market.based/i],
    dim: "economicFreedom",
    agreeDir: 1,
  },
  // Government activism
  {
    patterns: [/government.*require/i, /mandate/i, /government.*expand/i, /government.*role/i, /should the state/i, /should the federal/i],
    dim: "governmentActivism",
    agreeDir: 1,
  },
  {
    patterns: [/limit.*government/i, /reduce.*government/i, /less.*regulation/i],
    dim: "governmentActivism",
    agreeDir: -1,
  },
  // Community / shared responsibility
  {
    patterns: [/medicaid/i, /medicare/i, /welfare/i, /safety net/i, /universal health/i, /affordable care/i, /food stamp/i, /snap/i, /affordable housing/i, /housing assistance/i],
    dim: "communityOrientation",
    agreeDir: 1,
  },
  {
    patterns: [/education.*fund/i, /school.*fund/i, /public school/i, /teacher.*pay/i, /student.*loan/i, /pell grant/i],
    dim: "communityOrientation",
    agreeDir: 1,
  },
  {
    patterns: [/climate/i, /environment/i, /green energy/i, /renewable/i, /carbon emission/i, /clean energy/i, /pollution/i],
    dim: "communityOrientation",
    agreeDir: 1,
  },
  // Public safety priority
  {
    patterns: [/police/i, /law enforcement/i, /public safety/i, /crime rate/i, /criminal justice/i, /sheriff/i, /more officers/i],
    dim: "publicSafetyPriority",
    agreeDir: 1,
  },
  {
    patterns: [/gun control/i, /firearm.*restrict/i, /background check/i, /assault weapon/i],
    dim: "publicSafetyPriority",
    agreeDir: -1,   // agreeing with gun control = lower "safety authority" score
  },
  {
    patterns: [/second amendment/i, /gun right/i, /right to carry/i, /concealed carry/i],
    dim: "socialFreedom",
    agreeDir: 1,
  },
  // Institutional trust
  {
    patterns: [/trust.*government/i, /confidence in.*government/i, /trust.*institution/i, /trust.*media/i, /mainstream media/i],
    dim: "institutionalTrust",
    agreeDir: 1,
  },
  {
    patterns: [/government.*transparent/i, /government.*accountab/i, /government.*corrupt/i, /politician.*honest/i],
    dim: "institutionalTrust",
    agreeDir: -1,
  },
  // Local focus
  {
    patterns: [/local government/i, /county commission/i, /city council/i, /school board/i, /municipal/i, /local control/i, /local decision/i],
    dim: "localFocus",
    agreeDir: 1,
  },
  // National focus
  {
    patterns: [/federal government/i, /congress/i, /washington.*dc/i, /national policy/i, /federal fund/i, /senate/i, /house of representatives/i],
    dim: "nationalFocus",
    agreeDir: 1,
  },
  // Global engagement
  {
    patterns: [/foreign aid/i, /foreign policy/i, /united nations/i, /nato/i, /international/i, /ally|allies/i, /trade deal/i, /global leadership/i],
    dim: "globalEngagement",
    agreeDir: 1,
  },
  // Social freedom
  {
    patterns: [/personal freedom/i, /individual right/i, /personal choice/i, /free speech/i, /first amendment/i, /civil liberties/i, /right to choose/i],
    dim: "socialFreedom",
    agreeDir: 1,
  },
  {
    patterns: [/voter id/i, /photo id/i, /voter suppression/i, /voting access/i, /mail.in ballot/i, /early voting/i, /absentee/i],
    dim: "institutionalTrust",
    agreeDir: 1,
  },
]

/**
 * Detect which dimensions are relevant to the question prompt.
 * Returns at most one entry per dimension (first match wins).
 */
function detectDimensions(prompt: string): { dim: DimKey; agreeDir: 1 | -1 }[] {
  const found: { dim: DimKey; agreeDir: 1 | -1 }[] = []
  const seen = new Set<DimKey>()
  for (const signal of DIM_SIGNALS) {
    if (seen.has(signal.dim)) continue
    if (signal.patterns.some((pat) => pat.test(prompt))) {
      found.push({ dim: signal.dim, agreeDir: signal.agreeDir })
      seen.add(signal.dim)
    }
  }
  return found
}

/**
 * Map choice position to an agreement score (0–100).
 *   choiceIndex=0 of N choices → 100 (most agreeable)
 *   choiceIndex=N-1 of N choices → 0 (least agreeable)
 *   For odd counts, middle index → 50 (neutral)
 *
 * Assumption: choices are ordered most→least agreeable (Yes/No, Agree/Disagree, etc.)
 */
function choiceToAgreement(choiceIndex: number, totalChoices: number): number {
  if (totalChoices <= 1) return 50
  return Math.round(100 - (choiceIndex / (totalChoices - 1)) * 100)
}

// ─── Scoring Functions ────────────────────────────────────────────────────

/**
 * Compute dimension nudges (0–100 each) from a daily question answer.
 * Returns an empty object if no dimensions were detected.
 */
export function computeNudges(
  prompt: string,
  choiceIndex: number,
  totalChoices: number
): Partial<Record<DimKey, number>> {
  const dims = detectDimensions(prompt)
  if (dims.length === 0) return {}

  const agreeScore = choiceToAgreement(choiceIndex, totalChoices)
  const nudges: Partial<Record<DimKey, number>> = {}

  for (const { dim, agreeDir } of dims) {
    // agreeDir=1:  high agreement → high dimension score
    // agreeDir=-1: high agreement → low dimension score
    nudges[dim] = agreeDir === 1 ? agreeScore : 100 - agreeScore
  }

  return nudges
}

/**
 * Blend quiz baseline scores with accumulated daily nudges.
 *
 * Formula: weighted average where quiz = weight 10, each daily answer = weight 1.
 * Dimensions with no daily data keep their quiz (or default 50) value.
 */
export function blendScores(
  quizScores: DimensionScores | null,
  history: DailyAnswerEntry[]
): DimensionScores {
  const QUIZ_WEIGHT = 10

  // Accumulate daily nudges per dimension
  const dimSums: Partial<Record<DimKey, number>> = {}
  const dimCounts: Partial<Record<DimKey, number>> = {}

  for (const entry of history) {
    for (const [dim, value] of Object.entries(entry.nudges) as [DimKey, number][]) {
      dimSums[dim] = (dimSums[dim] ?? 0) + value
      dimCounts[dim] = (dimCounts[dim] ?? 0) + 1
    }
  }

  const result = { ...(quizScores ?? DEFAULT_SCORES) }

  for (const dim of Object.keys(DEFAULT_SCORES) as DimKey[]) {
    const count = dimCounts[dim] ?? 0
    if (count === 0) continue   // no daily data — keep quiz/default score

    const dailyAvg = (dimSums[dim] ?? 0) / count
    const baseScore = quizScores ? quizScores[dim] : 50
    const baseWeight = quizScores ? QUIZ_WEIGHT : 0
    const totalWeight = baseWeight + count

    result[dim] = Math.round((baseScore * baseWeight + dailyAvg * count) / totalWeight)
  }

  return result
}

/**
 * Compute 0–100 profile strength.
 *   Quiz taken          → 60 base points
 *   Each daily answer   → +2 points (max +40 additional)
 */
export function computeStrength(quizTaken: boolean, dailyAnswerCount: number): number {
  const base = quizTaken ? 60 : 0
  const fromDaily = Math.min(40, dailyAnswerCount * 2)
  return Math.min(100, base + fromDaily)
}

// ─── Storage ──────────────────────────────────────────────────────────────

function readQuizFromStorage(): QuizResult | null {
  try {
    const raw = localStorage.getItem("mv_intake_result")
    if (raw && raw !== "dismissed") return JSON.parse(raw) as QuizResult
  } catch { /* ignore */ }
  return null
}

function buildProfile(
  quizResult: QuizResult | null,
  history: DailyAnswerEntry[]
): CivicProfile {
  const scores = blendScores(quizResult?.scores ?? null, history)
  const strength = computeStrength(!!quizResult, history.length)
  return {
    quizResult,
    scores,
    strength,
    dailyAnswerCount: history.length,
    history,
    updatedAt: new Date().toISOString(),
  }
}

/** Load the civic profile from localStorage, bootstrapping from the quiz if first load. */
export function loadCivicProfile(): CivicProfile {
  if (typeof window === "undefined") {
    return buildProfile(null, [])
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as CivicProfile
      // If quiz was completed after the profile was first written, sync it in
      if (!parsed.quizResult) {
        const quiz = readQuizFromStorage()
        if (quiz) {
          const updated = buildProfile(quiz, parsed.history)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
          return updated
        }
      }
      return parsed
    }
  } catch { /* corrupt — rebuild */ }

  // First load: bootstrap from quiz result if available
  const quiz = readQuizFromStorage()
  const profile = buildProfile(quiz, [])
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  return profile
}

export function saveCivicProfile(profile: CivicProfile): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

// ─── Public API ───────────────────────────────────────────────────────────

/**
 * Record a daily question answer and update dimension scores.
 * Idempotent: answering the same questionId twice has no effect.
 *
 * @param questionId   Unique ID for the daily question
 * @param prompt       Full question text (used for dimension detection)
 * @param choiceLabel  Human-readable label of the chosen answer
 * @param choiceIndex  0-based index of the chosen answer in the choices array
 * @param totalChoices Total number of choices available
 * @returns Updated CivicProfile
 */
export function updateWithDailyAnswer(params: {
  questionId: string
  prompt: string
  choiceLabel: string
  choiceIndex: number
  totalChoices: number
}): CivicProfile {
  const profile = loadCivicProfile()

  // Idempotency: skip if this question was already recorded
  if (profile.history.some((h) => h.questionId === params.questionId)) {
    return profile
  }

  const nudges = computeNudges(params.prompt, params.choiceIndex, params.totalChoices)

  const entry: DailyAnswerEntry = {
    date: new Date().toISOString(),
    questionId: params.questionId,
    prompt: params.prompt,
    choiceLabel: params.choiceLabel,
    nudges,
  }

  const history = [...profile.history, entry].slice(-90)
  const quizResult = profile.quizResult ?? readQuizFromStorage()
  const updated = buildProfile(quizResult, history)

  saveCivicProfile(updated)
  return updated
}

/**
 * Fold in a freshly-completed quiz result, keeping existing daily answer history.
 * Call this right after the quiz completes.
 */
export function syncQuizResult(quizResult: QuizResult): CivicProfile {
  const profile = loadCivicProfile()
  const updated = buildProfile(quizResult, profile.history)
  saveCivicProfile(updated)
  return updated
}

/**
 * Dispatch a browser event so any mounted CivicProfileWidget re-reads from storage.
 * Safe to call during SSR (no-op).
 */
export function notifyProfileUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("civic-profile-updated"))
  }
}
