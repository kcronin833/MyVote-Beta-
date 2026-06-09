"use client"

import { IntakeQuiz } from "@/components/intake-quiz"

export function IntakeQuizPage() {
  // Navigation after the quiz is handled inside IntakeQuiz via continueHref.
  // The results screen is shown first; the user clicks "Continue to MyVote →"
  // to navigate — this way they always see their archetype results.
  return <IntakeQuiz continueHref="/" />
}
