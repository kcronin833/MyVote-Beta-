"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-context"

const QUESTIONS = [
  {
    id: 1,
    text: "Local schools should receive more public funding even if it means higher property taxes.",
    issue: "Education",
  },
  {
    id: 2,
    text: "Georgia should expand access to early and mail-in voting.",
    issue: "Voting Access",
  },
  {
    id: 3,
    text: "Law enforcement funding in Atlanta should be increased.",
    issue: "Public Safety",
  },
  {
    id: 4,
    text: "Environmental regulations are worth the cost to local businesses.",
    issue: "Environment",
  },
  {
    id: 5,
    text: "Georgia should do more to attract large corporations and new development.",
    issue: "Economy",
  },
]

const RESPONSES = ["Strongly Agree", "Agree", "Disagree", "Strongly Disagree"] as const
type Response = typeof RESPONSES[number]

// Maps a response to an agreement percentage contribution for the Common Ground widget
function responseToScore(r: Response): number {
  if (r === "Strongly Agree") return 85
  if (r === "Agree") return 72
  if (r === "Disagree") return 45
  return 28
}

interface OnboardingQuizProps {
  onDismiss: () => void
}

export function OnboardingQuiz({ onDismiss }: OnboardingQuizProps) {
  const { user } = useAuth()
  const [step, setStep] = useState(0) // 0-4 = questions, 5 = done
  const [answers, setAnswers] = useState<Record<number, Response>>({})
  const [saving, setSaving] = useState(false)

  const current = QUESTIONS[step]
  const isLastQuestion = step === QUESTIONS.length - 1

  async function saveAndFinish(finalAnswers: Record<number, Response>) {
    setSaving(true)
    if (user && Object.keys(finalAnswers).length > 0) {
      const supabase = createClient()
      const rows = Object.entries(finalAnswers).map(([qid, response]) => ({
        user_id: user.id,
        question_id: parseInt(qid),
        response,
      }))
      await supabase.from("quiz_responses").upsert(rows, { onConflict: "user_id,question_id" })

      // Persist scores to localStorage for Common Ground widget
      const scores: Record<string, number> = {}
      QUESTIONS.forEach((q) => {
        const ans = finalAnswers[q.id]
        if (ans) scores[q.issue] = responseToScore(ans)
      })
      localStorage.setItem("mv_quiz_scores", JSON.stringify(scores))
    }
    localStorage.setItem("mv_quiz_shown", "true")
    setSaving(false)
    setStep(QUESTIONS.length) // show done screen
  }

  function handleAnswer(response: Response) {
    const next = { ...answers, [current.id]: response }
    setAnswers(next)
    if (isLastQuestion) {
      saveAndFinish(next)
    } else {
      setStep((s) => s + 1)
    }
  }

  function handleSkip() {
    localStorage.setItem("mv_quiz_shown", "true")
    onDismiss()
  }

  // Completion screen
  if (step >= QUESTIONS.length) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-600/95 p-6">
        <div className="text-center text-white max-w-sm space-y-6">
          <div className="text-6xl">🎉</div>
          <h1 className="text-2xl font-bold leading-tight">You're all set!</h1>
          <p className="text-teal-100 text-base leading-relaxed">
            Your civic profile is ready. We'll use your answers to show how your views
            compare with your Georgia neighbors.
          </p>
          <button
            onClick={onDismiss}
            disabled={saving}
            className="w-full py-3 bg-card text-teal-700 font-bold text-base rounded-2xl hover:bg-teal-50 transition-colors"
          >
            {saving ? "Saving…" : "Continue to MyVote →"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-paper-50">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex-1">
          <div className="h-1.5 bg-paper-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${((step) / QUESTIONS.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Question {step + 1} of {QUESTIONS.length}</p>
        </div>
        <button
          onClick={handleSkip}
          className="ml-4 text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
        >
          Skip for now
        </button>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10 max-w-lg mx-auto w-full">
        <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center mb-6">
          <span className="text-2xl">🏛️</span>
        </div>
        <h2 className="text-xl font-bold text-foreground text-center leading-snug mb-8">
          {current.text}
        </h2>

        <div className="w-full space-y-3">
          {RESPONSES.map((response) => (
            <button
              key={response}
              onClick={() => handleAnswer(response)}
              className="w-full py-3.5 px-5 rounded-2xl border-2 border-border bg-card text-foreground font-semibold text-sm hover:border-teal-400 hover:bg-teal-50 hover:text-teal-800 active:scale-[0.98] transition-all"
            >
              {response}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
