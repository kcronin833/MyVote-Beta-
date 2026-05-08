import { createClient } from "@/lib/supabase/client"

const QUESTION_LABELS: Record<number, string> = {
  1: "Education",
  3: "Public Safety",
  4: "Environment",
  5: "Economy",
}

export interface SuggestedUser {
  id: string
  username: string
  display_name: string
  avatar_url: string | null
  location: string | null
  created_at: string
  reason: string
  sharedIssues: string[]
  score: number
}

export async function getSuggestedUsers(userId: string, limit = 10): Promise<SuggestedUser[]> {
  const supabase = createClient()

  const [profileResult, myQuizResult, followingResult] = await Promise.all([
    supabase.from("profiles").select("location").eq("id", userId).single(),
    supabase.from("quiz_responses").select("question_id, response").eq("user_id", userId),
    supabase.from("user_follows").select("following_id").eq("follower_id", userId),
  ])

  const myProfile = profileResult.data
  const myQuiz = myQuizResult.data || []
  const followingIds = new Set<string>([
    userId,
    ...((followingResult.data || []).map((r: { following_id: string }) => r.following_id)),
  ])

  const myAnswers: Record<number, string> = {}
  for (const row of myQuiz) {
    myAnswers[row.question_id] = row.response
  }

  // Fetch a pool of recent users — filter excluded IDs in JS to avoid Supabase NOT IN edge cases
  const { data: candidates } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, location, created_at")
    .order("created_at", { ascending: false })
    .limit(80)

  if (!candidates || candidates.length === 0) return []

  const filtered = candidates.filter((c: { id: string }) => !followingIds.has(c.id))
  if (filtered.length === 0) return []

  // Batch-fetch quiz responses for all candidates in one query
  const candidateIds = filtered.map((c: { id: string }) => c.id)
  const { data: allQuizData } = await supabase
    .from("quiz_responses")
    .select("user_id, question_id, response")
    .in("user_id", candidateIds)

  const quizByUser: Record<string, Array<{ question_id: number; response: string }>> = {}
  for (const row of allQuizData || []) {
    if (!quizByUser[row.user_id]) quizByUser[row.user_id] = []
    quizByUser[row.user_id].push(row)
  }

  const scored: SuggestedUser[] = filtered.map((candidate: {
    id: string; username: string; display_name: string;
    avatar_url: string | null; location: string | null; created_at: string
  }) => {
    let score = 0
    const reasons: string[] = []
    const sharedIssues: string[] = []

    // Same city (proxy for same county)
    if (
      candidate.location &&
      myProfile?.location &&
      candidate.location.toLowerCase() === myProfile.location.toLowerCase()
    ) {
      score += 100
      reasons.push(`Same city · ${candidate.location}`)
    }

    // Shared quiz answers = similar views
    const theirQuiz = quizByUser[candidate.id] || []
    if (theirQuiz.length > 0 && myQuiz.length > 0) {
      for (const { question_id, response } of theirQuiz) {
        if (myAnswers[question_id] && myAnswers[question_id] === response) {
          const label = QUESTION_LABELS[question_id]
          if (label) {
            sharedIssues.push(label)
            score += 20
          }
        }
      }
      if (sharedIssues.length > 0) {
        reasons.push(`Agrees on ${sharedIssues.slice(0, 2).join(" & ")}`)
      }
    }

    // Recency bonus (decays over 10 days)
    const daysSinceJoin = (Date.now() - new Date(candidate.created_at).getTime()) / 86400000
    score += Math.max(0, 10 - daysSinceJoin)

    return {
      ...candidate,
      score,
      reason: reasons[0] || "Recently joined",
      sharedIssues,
    }
  })

  return scored.sort((a, b) => b.score - a.score).slice(0, limit)
}
