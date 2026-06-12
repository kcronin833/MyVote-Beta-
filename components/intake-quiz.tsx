"use client"

/**
 * IntakeQuiz — 12-question civic orientation quiz for MyVote.
 *
 * Flow:
 *   0 = intro screen
 *   1–9 = Likert scale questions
 *   10 = Q10: problem-solver multi-choice
 *   11 = Q11: issue-priority chip picker (max 3)
 *   12 = Q12: content-preference single-select
 *   13 = results screen
 *
 * All answers are stored in local state and written to:
 *   • localStorage (key: "mv_intake_result") as structured JSON
 *   • Supabase profiles.quiz_result column (if user is signed in)
 */

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ChevronLeft } from "lucide-react"
import {
  SCALE_QUESTIONS,
  PROBLEM_SOLVER_OPTIONS,
  ISSUE_OPTIONS,
  CONTENT_PREF_OPTIONS,
  DIM_LABELS,
  ARCHETYPES,
  ARCHETYPE_BALLOT_HOOK,
  computeScores,
  assignArchetype,
  type ScaleAnswer,
  type ScaleValue,
  type DimensionScores,
  type QuizResult,
} from "@/lib/quiz-engine"
import { ARCHETYPE_PROFILE_DATA } from "@/lib/civic-profile-data"
import { shareUrl, shareText } from "@/lib/civic-share"
import { ReminderSignup } from "@/components/reminder-signup"
import { syncQuizResult, notifyProfileUpdated } from "@/lib/civic-profile-store"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-context"
import { CandidatePhoto } from "@/components/elections/candidate-photo"
import { C } from "@/lib/design-tokens"

// ─── Scale Option Labels ──────────────────────────────────────────────────

const SCALE_OPTIONS: { label: string; short: string; value: ScaleValue }[] = [
  { label: "Strongly Agree",    short: "Strongly agree",    value: 100 },
  { label: "Agree",             short: "Agree",             value: 75  },
  { label: "Neutral",           short: "Neutral",           value: 50  },
  { label: "Disagree",          short: "Disagree",          value: 25  },
  { label: "Strongly Disagree", short: "Strongly disagree", value: 0   },
]

// ─── Total step count ─────────────────────────────────────────────────────
// Step 0 = intro, 1–9 = scale, 10 = problem solver, 11 = issues, 12 = content pref
// Step 13 = results (not counted in progress)
const TOTAL_STEPS = 12

// ─── Props ────────────────────────────────────────────────────────────────

interface Props {
  /** Called when user finishes or explicitly exits; receives null if exited early */
  onComplete?: (result: QuizResult | null) => void
  /** Where to send the user after results. Defaults to "/" */
  continueHref?: string
}

// ─── Component ────────────────────────────────────────────────────────────

export function IntakeQuiz({ onComplete, continueHref = "/" }: Props) {
  const { user } = useAuth()
  const router = useRouter()

  const [step, setStep]               = useState(0)  // 0 = intro
  const [scaleAnswers, setScaleAnswers] = useState<Record<number, ScaleAnswer>>({})
  const [problemSolver, setProblemSolver] = useState<string | null>(null)
  const [selectedIssues, setSelectedIssues] = useState<string[]>([])
  const [contentPref, setContentPref]   = useState<string | null>(null)
  const [saving, setSaving]             = useState(false)
  const [result, setResult]             = useState<QuizResult | null>(null)
  // Prevents double-tap / accidental mis-answers — selection shows briefly
  // before advancing so the user can see what they picked.
  const [transitioning, setTransitioning] = useState(false)

  // ── Navigation helpers ──────────────────────────────────────────────

  const canGoBack = step > 1   // can't go back past the intro

  function goBack() {
    setStep((s) => Math.max(1, s - 1))
  }

  // ── Answer handlers ─────────────────────────────────────────────────

  function answerScale(qid: number, value: ScaleValue | "skip") {
    if (transitioning) return
    setScaleAnswers((prev) => ({ ...prev, [qid]: value }))
    // Show selection for 280ms so the user can see what they picked before
    // the screen advances — prevents accidental answers from going unnoticed.
    setTransitioning(true)
    setTimeout(() => {
      setStep((s) => s + 1)
      setTransitioning(false)
    }, 280)
  }

  function skipScale(qid: number) {
    // Skip is intentional — no delay needed
    setScaleAnswers((prev) => ({ ...prev, [qid]: "skip" }))
    setStep((s) => s + 1)
  }

  function answerProblemSolver(value: string) {
    if (transitioning) return
    setProblemSolver(value)
    setTransitioning(true)
    setTimeout(() => {
      setStep(11)
      setTransitioning(false)
    }, 280)
  }

  function skipProblemSolver() {
    setProblemSolver(null)
    setStep(11)
  }

  function toggleIssue(issue: string) {
    setSelectedIssues((prev) => {
      if (prev.includes(issue)) return prev.filter((i) => i !== issue)
      if (prev.length >= 3) return prev
      return [...prev, issue]
    })
  }

  function finishIssues() { setStep(12) }
  function skipIssues()    { setSelectedIssues([]); setStep(12) }

  function answerContentPref(value: string) {
    setContentPref(value)
    submitQuiz(value)
  }

  function skipContentPref() {
    setContentPref(null)
    submitQuiz(null)
  }

  // ── Submit ──────────────────────────────────────────────────────────

  const submitQuiz = useCallback(
    async (finalContentPref: string | null) => {
      const scores: DimensionScores = computeScores(scaleAnswers, problemSolver)
      const archetypeKey = assignArchetype(scores)
      const archetype = ARCHETYPES[archetypeKey]

      const quizResult: QuizResult = {
        scaleAnswers,
        problemSolver,
        selectedIssues,
        contentPreference: finalContentPref,
        scores,
        archetype: archetypeKey,
        completedAt: new Date().toISOString(),
      }

      // Persist to localStorage
      localStorage.setItem("mv_intake_result", JSON.stringify(quizResult))
      localStorage.setItem("mv_quiz_shown", "true")

      // Fold quiz into the incremental civic profile
      syncQuizResult(quizResult)
      notifyProfileUpdated()

      // Persist to Supabase if signed in
      if (user) {
        setSaving(true)
        try {
          const supabase = createClient()
          await supabase
            .from("profiles")
            .update({ quiz_result: quizResult })
            .eq("id", user.id)
        } catch {
          // Non-fatal — localStorage is the source of truth
        } finally {
          setSaving(false)
        }
      }

      setResult(quizResult)
      setStep(13)
      // onComplete is NOT called here — it's called when the user clicks
      // "Continue to MyVote →" in ResultsScreen so they actually see their results.
    },
    [scaleAnswers, problemSolver, selectedIssues, user, onComplete]
  )

  // ── Exit early ───────────────────────────────────────────────────────

  function exitEarly() {
    localStorage.setItem("mv_quiz_shown", "true")
    onComplete?.(null)
    router.push(continueHref)
  }

  // ─────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────

  // ── Intro Screen ─────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <Screen>
        <div style={{ textAlign: "center", maxWidth: 460, margin: "0 auto" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🗳️</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.ink900, margin: "0 0 12px", lineHeight: 1.2 }}>
            Your civic profile
          </h1>
          <p style={{ fontSize: 15, color: C.ink700, lineHeight: 1.6, margin: "0 0 8px" }}>
            12 quick questions to personalize your MyVote experience. No partisan labels. No wrong answers.
          </p>
          <p style={{ fontSize: 13, color: C.ink500, margin: "0 0 32px" }}>About 2–3 minutes</p>

          <button
            onClick={() => setStep(1)}
            style={{
              width: "100%", maxWidth: 360,
              padding: "14px 24px",
              background: C.teal, color: "#fff",
              borderRadius: 12, border: "none",
              fontSize: 16, fontWeight: 700,
              cursor: "pointer",
              marginBottom: 12,
            }}
          >
            Start quiz →
          </button>

          <button
            onClick={exitEarly}
            style={{
              width: "100%", maxWidth: 360,
              padding: "10px 24px",
              background: "transparent", color: C.ink500,
              borderRadius: 12, border: `1px solid ${C.rule}`,
              fontSize: 14, fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Skip for now
          </button>

          <p style={{ fontSize: 12, color: C.ink300, marginTop: 24, lineHeight: 1.5 }}>
            Your answers stay on your device and are never sold or shared with political campaigns.
          </p>
        </div>
      </Screen>
    )
  }

  // ── Results Screen ───────────────────────────────────────────────────
  if (step === 13 && result) {
    return (
      <ResultsScreen
        result={result}
        saving={saving}
        continueHref={continueHref}
        onContinue={onComplete}
      />
    )
  }

  // ── Progress bar — show non-zero progress from question 1 ───────────
  // Divide by TOTAL_STEPS + 1 so step 1 shows ~8% and step 12 shows ~92%.
  const progressPct = Math.round((step / (TOTAL_STEPS + 1)) * 100)

  // ── Scale Questions Q1–Q9 ─────────────────────────────────────────────
  if (step >= 1 && step <= 9) {
    const q = SCALE_QUESTIONS[step - 1]
    const currentAnswer = scaleAnswers[q.id]

    return (
      <Screen>
        <QuizHeader
          step={step}
          total={TOTAL_STEPS}
          progress={progressPct}
          canGoBack={canGoBack}
          onBack={goBack}
          onExit={exitEarly}
        />
        <QuestionArea>
          <StepChip>Question {step} of {TOTAL_STEPS}</StepChip>
          <QuestionText>{q.text}</QuestionText>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SCALE_OPTIONS.map((opt) => (
              <AnswerButton
                key={opt.value}
                selected={currentAnswer === opt.value}
                disabled={transitioning && currentAnswer !== opt.value}
                onClick={() => answerScale(q.id, opt.value)}
              >
                {opt.label}
              </AnswerButton>
            ))}
          </div>

          <SkipLink onClick={() => skipScale(q.id)} />
        </QuestionArea>
      </Screen>
    )
  }

  // ── Q10: Problem Solver ───────────────────────────────────────────────
  if (step === 10) {
    return (
      <Screen>
        <QuizHeader
          step={step}
          total={TOTAL_STEPS}
          progress={progressPct}
          canGoBack={canGoBack}
          onBack={goBack}
          onExit={exitEarly}
        />
        <QuestionArea>
          <StepChip>Question {step} of {TOTAL_STEPS}</StepChip>
          <QuestionText>When a major problem exists, who should usually address it first?</QuestionText>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PROBLEM_SOLVER_OPTIONS.map((opt) => (
              <AnswerButton
                key={opt.value}
                selected={problemSolver === opt.value}
                onClick={() => answerProblemSolver(opt.value)}
              >
                {opt.label}
              </AnswerButton>
            ))}
          </div>

          <SkipLink onClick={skipProblemSolver} />
        </QuestionArea>
      </Screen>
    )
  }

  // ── Q11: Issue Priority ───────────────────────────────────────────────
  if (step === 11) {
    return (
      <Screen>
        <QuizHeader
          step={step}
          total={TOTAL_STEPS}
          progress={progressPct}
          canGoBack={canGoBack}
          onBack={goBack}
          onExit={exitEarly}
        />
        <QuestionArea>
          <StepChip>Question {step} of {TOTAL_STEPS}</StepChip>
          <QuestionText>Which issues matter most to you?</QuestionText>
          <p style={{ fontSize: 13, color: C.ink500, margin: "-8px 0 16px", textAlign: "center" }}>
            Pick up to 3
            {selectedIssues.length > 0 && (
              <span style={{ color: C.teal, fontWeight: 700 }}>
                {" "}({selectedIssues.length}/3 selected)
              </span>
            )}
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginBottom: 16,
          }}>
            {ISSUE_OPTIONS.map((issue) => {
              const selected = selectedIssues.includes(issue)
              const maxed = selectedIssues.length >= 3 && !selected
              return (
                <button
                  key={issue}
                  onClick={() => !maxed && toggleIssue(issue)}
                  aria-pressed={selected}
                  disabled={maxed}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: `2px solid ${selected ? C.teal : C.rule}`,
                    background: selected ? C.tealSoft : C.card,
                    color: selected ? C.tealDk : maxed ? C.ink300 : C.ink900,
                    fontSize: 13,
                    fontWeight: selected ? 700 : 500,
                    cursor: maxed ? "not-allowed" : "pointer",
                    textAlign: "left",
                    transition: "all 0.12s",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    opacity: maxed ? 0.5 : 1,
                  }}
                >
                  {selected && (
                    <CheckCircle size={14} style={{ color: C.teal, flexShrink: 0 }} />
                  )}
                  {issue}
                </button>
              )
            })}
          </div>

          <button
            onClick={finishIssues}
            disabled={selectedIssues.length === 0}
            style={{
              width: "100%",
              padding: "13px 24px",
              background: selectedIssues.length > 0 ? C.teal : C.rule,
              color: selectedIssues.length > 0 ? "#fff" : C.ink500,
              borderRadius: 12, border: "none",
              fontSize: 15, fontWeight: 700,
              cursor: selectedIssues.length > 0 ? "pointer" : "not-allowed",
              marginBottom: 8,
            }}
          >
            Continue →
          </button>
          <SkipLink onClick={skipIssues} />
        </QuestionArea>
      </Screen>
    )
  }

  // ── Q12: Content Preference ───────────────────────────────────────────
  if (step === 12) {
    return (
      <Screen>
        <QuizHeader
          step={step}
          total={TOTAL_STEPS}
          progress={progressPct}
          canGoBack={canGoBack}
          onBack={goBack}
          onExit={exitEarly}
        />
        <QuestionArea>
          <StepChip>Question {step} of {TOTAL_STEPS}</StepChip>
          <QuestionText>How do you prefer to receive political and civic information?</QuestionText>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CONTENT_PREF_OPTIONS.map((opt) => (
              <AnswerButton
                key={opt}
                selected={contentPref === opt}
                onClick={() => answerContentPref(opt)}
              >
                {opt}
              </AnswerButton>
            ))}
          </div>

          <SkipLink onClick={skipContentPref} />
        </QuestionArea>
      </Screen>
    )
  }

  return null
}

// ─── Results Screen ───────────────────────────────────────────────────────

function ResultsScreen({
  result,
  saving,
  continueHref,
  onContinue,
}: {
  result: QuizResult
  saving: boolean
  continueHref: string
  onContinue?: (result: QuizResult) => void
}) {
  const router = useRouter()
  const archetype = ARCHETYPES[result.archetype]
  const profileData = ARCHETYPE_PROFILE_DATA[result.archetype]
  const allFigures = [profileData.primaryFigure, ...profileData.moreFigures]

  return (
    <Screen scrollable>
      <div style={{ maxWidth: 520, margin: "0 auto", paddingBottom: 40 }}>

        {/* Archetype hero */}
        <div style={{
          background: `linear-gradient(135deg, #1A2138 0%, #3D8073 100%)`,
          borderRadius: 16,
          padding: "28px 24px",
          textAlign: "center",
          marginBottom: 20,
          color: "#fff",
        }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>{archetype.emoji}</div>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.2,
            color: "rgba(255,255,255,0.65)",
            marginBottom: 4,
          }}>
            YOUR CIVIC PROFILE
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 10px", lineHeight: 1.2 }}>
            {archetype.label}
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.88)", margin: 0 }}>
            {archetype.headline}
          </p>
        </div>

        {/* Share bar — the result is the most shareable moment in the product */}
        <ShareBar archetypeKey={result.archetype} label={archetype.label} />

        {/* Description */}
        <div style={{
          background: C.card, border: `1px solid ${C.rule}`,
          borderRadius: 12, padding: "16px 18px", marginBottom: 16,
        }}>
          <p style={{ fontSize: 14, color: C.ink700, lineHeight: 1.65, margin: 0 }}>
            {archetype.description}
          </p>
        </div>

        {/* Historical figures */}
        <div style={{
          background: C.card, border: `1px solid ${C.rule}`,
          borderRadius: 12, padding: "16px 18px", marginBottom: 16,
        }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: C.ink500, letterSpacing: 0.5, margin: "0 0 14px" }}>
            HISTORICAL FIGURES WHO SHARED THIS PROFILE
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {allFigures.map((fig, idx) => (
              <div
                key={fig.name}
                style={{
                  display: "flex", gap: 12, alignItems: "center",
                  padding: idx === 0 ? "12px" : "10px 12px",
                  borderRadius: 10,
                  background: idx === 0 ? "#F3F1EB" : "transparent",
                  border: `1px solid ${idx === 0 ? C.rule : "transparent"}`,
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  <CandidatePhoto
                    name={fig.name}
                    wikipediaTitle={fig.wikiTitle}
                    size={idx === 0 ? 56 : 44}
                    shape="circle"
                    partyColor="#6B7088"
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <p style={{ fontSize: idx === 0 ? 13.5 : 12.5, fontWeight: 700, color: C.ink900, margin: 0 }}>
                      {fig.name}
                    </p>
                    {idx === 0 && (
                      <span style={{
                        fontSize: 9.5, fontWeight: 700, letterSpacing: 0.5,
                        textTransform: "uppercase",
                        background: C.tealSoft, color: C.tealDk,
                        border: `1px solid #C0DAD4`,
                        borderRadius: 20, padding: "1px 7px",
                      }}>Primary</span>
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: C.ink500, margin: "2px 0 0" }}>
                    {fig.years} · {fig.role}
                  </p>
                  {idx === 0 && (
                    <p style={{ fontSize: 11.5, fontStyle: "italic", color: C.ink700, margin: "6px 0 0", lineHeight: 1.5 }}>
                      "{fig.quote}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <a
            href={`/profiles#${result.archetype}`}
            style={{
              display: "block", textAlign: "center", marginTop: 12,
              fontSize: 12, color: C.teal, fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Read full historical context on the profiles page →
          </a>
        </div>

        {/* Science backing */}
        <div style={{
          background: "#EEF2FF", border: "1px solid #C7D2FE",
          borderRadius: 12, padding: "14px 16px", marginBottom: 16,
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: "#6366F1", margin: "0 0 6px" }}>
            The Research Behind This Profile
          </p>
          <p style={{ fontSize: 12.5, color: C.ink700, lineHeight: 1.6, margin: 0 }}>
            {profileData.science.replace(/\*\*[^*]+\*\*\s*/g, "")}
          </p>
        </div>

        {/* Dimension scores */}
        <div style={{
          background: C.card, border: `1px solid ${C.rule}`,
          borderRadius: 12, padding: "16px 18px", marginBottom: 16,
        }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: C.ink500, letterSpacing: 0.5, margin: "0 0 14px" }}>
            YOUR PROFILE DIMENSIONS
          </h2>
          {DIM_LABELS.map(({ key, label, low, high }) => {
            const score = result.scores[key]
            // Human-readable phrase instead of a raw number
            const phrase =
              score >= 70 ? `Leans: ${high}` :
              score >= 58 ? `Slight lean: ${high}` :
              score <= 30 ? `Leans: ${low}` :
              score <= 42 ? `Slight lean: ${low}` :
              "Balanced"
            const barColor =
              score >= 58 ? C.teal :
              score <= 42 ? C.amber :
              C.ink300
            return (
              <div key={key} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: C.ink700 }}>{label}</span>
                  <span style={{ fontSize: 11, color: C.ink500, fontStyle: "italic" }}>{phrase}</span>
                </div>
                <div style={{
                  height: 6, borderRadius: 4,
                  background: C.rule, overflow: "hidden", position: "relative",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${score}%`,
                    background: barColor,
                    borderRadius: 4,
                    transition: "width 0.6s ease",
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                  <span style={{ fontSize: 10, color: C.ink300 }}>{low}</span>
                  <span style={{ fontSize: 10, color: C.ink300 }}>{high}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Top issues */}
        {result.selectedIssues.length > 0 && (
          <div style={{
            background: C.card, border: `1px solid ${C.rule}`,
            borderRadius: 12, padding: "16px 18px", marginBottom: 16,
          }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: C.ink500, letterSpacing: 0.5, margin: "0 0 10px" }}>
              YOUR TOP ISSUES
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {result.selectedIssues.map((issue) => (
                <span key={issue} style={{
                  padding: "5px 11px", borderRadius: 20,
                  background: C.tealSoft, color: C.tealDk,
                  fontSize: 13, fontWeight: 600,
                  border: `1px solid #C0DAD4`,
                }}>
                  {issue}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ballot connection — ties profile to 2026 Georgia races */}
        <div style={{
          background: C.tealSoft,
          border: `1px solid #C0DAD4`,
          borderRadius: 12, padding: "14px 16px", marginBottom: 16,
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: C.tealDk, margin: "0 0 6px" }}>
            🗳️ Your 2026 Georgia Ballot
          </p>
          <p style={{ fontSize: 13, color: C.ink700, lineHeight: 1.6, margin: "0 0 10px" }}>
            {ARCHETYPE_BALLOT_HOOK[result.archetype]}
          </p>
          <a
            href="/elections"
            style={{ fontSize: 13, fontWeight: 700, color: C.tealDk, textDecoration: "none" }}
          >
            See every 2026 Georgia race →
          </a>
        </div>

        {/* Retention: capture email at the moment of highest engagement */}
        <div style={{ marginBottom: 16 }}>
          <ReminderSignup source="quiz-results" compact />
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            onContinue?.(result)
            router.push(continueHref)
          }}
          disabled={saving}
          style={{
            width: "100%", padding: "14px 24px",
            background: C.teal, color: "#fff",
            borderRadius: 12, border: "none",
            fontSize: 16, fontWeight: 700,
            cursor: saving ? "wait" : "pointer",
            marginBottom: 10,
          }}
        >
          {saving ? "Saving profile…" : "Continue to MyVote →"}
        </button>

        <a
          href="/profiles"
          style={{
            display: "block", textAlign: "center",
            padding: "11px 20px",
            background: "transparent",
            border: `1px solid ${C.teal}`,
            borderRadius: 12,
            fontSize: 14, color: C.teal, fontWeight: 700,
            textDecoration: "none", marginBottom: 12,
          }}
        >
          Explore all 8 civic profiles →
        </a>

        <p style={{ fontSize: 12, color: C.ink500, textAlign: "center", lineHeight: 1.6 }}>
          <span style={{ fontWeight: 600, color: C.ink700 }}>No account needed</span> — your results are saved on this device.{" "}
          <a
            href="/auth/signup"
            style={{ color: C.teal, fontWeight: 600, textDecoration: "underline" }}
          >
            Create a free account
          </a>{" "}
          to sync across devices and track how your views evolve over time.
        </p>
      </div>
    </Screen>
  )
}

// ─── Share bar ────────────────────────────────────────────────────────────

function ShareBar({ archetypeKey, label }: { archetypeKey: QuizResult["archetype"]; label: string }) {
  const [copied, setCopied] = useState(false)
  const url = shareUrl(archetypeKey)
  const text = shareText(label)

  async function nativeShare() {
    try {
      await navigator.share({ title: "MyVote Civic Profile", text, url })
    } catch {
      /* user dismissed the sheet — not an error */
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${text} ${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const pill: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderRadius: 999,
    border: `1px solid ${C.rule}`,
    background: C.card,
    color: C.ink700,
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
  }

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share

  return (
    <div style={{ textAlign: "center", marginBottom: 16 }}>
      <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.6, color: C.ink500, margin: "0 0 8px" }}>
        SHARE YOUR RESULT
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
        {canNativeShare && (
          <button onClick={nativeShare} style={pill}>
            Share
          </button>
        )}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={pill}
        >
          Post on X
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={pill}
        >
          Facebook
        </a>
        <button onClick={copyLink} style={{ ...pill, ...(copied ? { background: C.tealSoft, color: C.tealDk, borderColor: "#C0DAD4" } : {}) }}>
          {copied ? "Copied ✓" : "Copy link"}
        </button>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────

function Screen({ children, scrollable }: { children: React.ReactNode; scrollable?: boolean }) {
  return (
    <div style={{
      minHeight: "100dvh",
      background: C.page,
      display: "flex",
      flexDirection: "column",
      overflowY: scrollable ? "auto" : "hidden",
    }}>
      {children}
    </div>
  )
}

function QuizHeader({
  step, total, progress, canGoBack, onBack, onExit,
}: {
  step: number; total: number; progress: number
  canGoBack: boolean; onBack: () => void; onExit: () => void
}) {
  return (
    <div style={{ padding: "16px 20px 12px", flexShrink: 0 }}>
      {/* Progress bar */}
      <div style={{ height: 4, borderRadius: 4, background: C.rule, overflow: "hidden", marginBottom: 12 }}>
        <div style={{
          height: "100%", width: `${progress}%`,
          background: C.teal, borderRadius: 4,
          transition: "width 0.35s ease",
        }} />
      </div>
      {/* Back / Exit row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {canGoBack ? (
          <button
            onClick={onBack}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "none", border: "none",
              fontSize: 13, color: C.ink500, fontWeight: 600,
              cursor: "pointer", padding: "4px 0",
            }}
          >
            <ChevronLeft size={15} /> Back
          </button>
        ) : <div />}
        <button
          onClick={onExit}
          style={{
            background: "none", border: "none",
            fontSize: 12.5, color: C.ink300, fontWeight: 500,
            cursor: "pointer", padding: "4px 0",
            textDecoration: "underline",
          }}
        >
          Exit quiz
        </button>
      </div>
    </div>
  )
}

function QuestionArea({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      flex: 1,
      display: "flex", flexDirection: "column",
      alignItems: "center",
      padding: "8px 20px 32px",
      maxWidth: 480,
      width: "100%",
      margin: "0 auto",
      overflowY: "auto",
    }}>
      {children}
    </div>
  )
}

function StepChip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11.5, fontWeight: 700, color: C.teal,
      background: C.tealSoft, border: `1px solid #C0DAD4`,
      borderRadius: 20, padding: "3px 10px",
      marginBottom: 18, alignSelf: "center",
    }}>
      {children}
    </div>
  )
}

function QuestionText({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: 20, fontWeight: 700, color: C.ink900,
      textAlign: "center", lineHeight: 1.35,
      margin: "0 0 24px", width: "100%",
    }}>
      {children}
    </h2>
  )
}

function AnswerButton({
  children, selected, disabled, onClick,
}: {
  children: React.ReactNode; selected?: boolean; disabled?: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "13px 16px",
        borderRadius: 12,
        border: `2px solid ${selected ? C.teal : C.rule}`,
        background: selected ? C.tealSoft : C.card,
        color: selected ? C.tealDk : disabled ? C.ink300 : C.ink900,
        fontSize: 15, fontWeight: selected ? 700 : 500,
        textAlign: "left", cursor: disabled ? "default" : "pointer",
        transition: "all 0.12s",
        display: "flex", alignItems: "center", gap: 10,
        opacity: disabled ? 0.55 : 1,
      }}
    >
      {selected && <CheckCircle size={16} style={{ color: C.teal, flexShrink: 0 }} />}
      {children}
    </button>
  )
}

function SkipLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none", border: "none",
        fontSize: 13, color: C.ink300,
        cursor: "pointer", marginTop: 12,
        textDecoration: "underline", padding: "4px 8px",
      }}
    >
      Skip this question
    </button>
  )
}
