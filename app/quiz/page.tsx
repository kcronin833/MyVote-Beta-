import type { Metadata } from "next"
import { IntakeQuizPage } from "./intake-quiz-page"

export const metadata: Metadata = {
  title: "Civic Profile Quiz · MyVote",
  description:
    "Answer 12 quick questions to personalize your MyVote experience — no partisan labels, no wrong answers. Discover your civic profile.",
  alternates: { canonical: "/quiz" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "What's Your Civic Profile? · MyVote",
    description:
      "12 questions. No partisan labels. Discover which of 8 civic profiles matches your values — and see the historical figures who shared them.",
    type: "website",
  },
}

export default function QuizPage() {
  return <IntakeQuizPage />
}
