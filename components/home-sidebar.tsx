"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Flame, MapPin, Vote, Camera, ClipboardList } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { Progress } from "@/components/ui/progress"
import { UserAvatar } from "@/components/user-avatar"
import { AvatarUploadModal } from "@/components/avatar-upload-modal"
import { SuggestedNeighbors } from "@/components/suggested-neighbors"
import { createClient } from "@/lib/supabase/client"

// Question IDs → issue label in the sidebar
const QUESTION_TO_ISSUE: Record<number, string> = {
  1: "Education",
  3: "Public Safety",
  4: "Environment",
  5: "Economy",
  // Q2 (Voting Access) has no sidebar counterpart; Healthcare has no quiz question
}

// Maps a quiz response string to a 0-100 agreement score
function responseToScore(response: string): number {
  switch (response) {
    case "Strongly Agree":    return 91
    case "Agree":             return 68
    case "Disagree":          return 36
    case "Strongly Disagree": return 12
    default:                  return 50
  }
}

interface IssueScore {
  label: string
  pct: number
  fromQuiz: boolean
}

function issueColor(pct: number) {
  if (pct >= 75) return { bar: "bg-teal-500", text: "text-teal-700" }
  if (pct >= 50) return { bar: "bg-amber-400", text: "text-amber-700" }
  return { bar: "bg-coral-500 bg-[#E07060]", text: "text-[#C0504A]" }
}

function getCivicStreak(): number {
  if (typeof window === "undefined") return 1
  const today = new Date().toDateString()
  const stored = localStorage.getItem("mv_streak")
  if (!stored) {
    localStorage.setItem("mv_streak", JSON.stringify({ date: today, count: 1 }))
    return 1
  }
  const { date, count } = JSON.parse(stored)
  if (date === today) return count
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const newCount = date === yesterday.toDateString() ? count + 1 : 1
  localStorage.setItem("mv_streak", JSON.stringify({ date: today, count: newCount }))
  return newCount
}

interface HomeSidebarProps {
  racesDecided: number
  totalRaces: number
}

export function HomeSidebar({ racesDecided, totalRaces }: HomeSidebarProps) {
  const { user, profile, updateProfile } = useAuth()
  const [streak, setStreak] = useState(1)
  const [viewpoints, setViewpoints] = useState(0)
  const [issues, setIssues] = useState<IssueScore[]>([])
  const [quizLoading, setQuizLoading] = useState(true)
  const [showAvatarModal, setShowAvatarModal] = useState(false)

  useEffect(() => {
    setStreak(getCivicStreak())
    const likes = JSON.parse(localStorage.getItem("viewpointLikes") || "[]")
    setViewpoints(likes.length)
  }, [])

  // Fetch quiz responses from Supabase and compute real issue scores
  useEffect(() => {
    async function loadQuizScores() {
      if (!user) { setQuizLoading(false); return }
      const supabase = createClient()
      const { data } = await supabase
        .from("quiz_responses")
        .select("question_id, response")
        .eq("user_id", user.id)

      if (!data || data.length === 0) {
        setIssues([])
        setQuizLoading(false)
        return
      }

      // Build a map of question_id → response
      const responseMap: Record<number, string> = {}
      for (const row of data) {
        responseMap[row.question_id] = row.response
      }

      // Compute scores for each sidebar issue
      const computed: IssueScore[] = [
        { label: "Education",     pct: responseMap[1] ? responseToScore(responseMap[1]) : 0, fromQuiz: !!responseMap[1] },
        { label: "Public Safety", pct: responseMap[3] ? responseToScore(responseMap[3]) : 0, fromQuiz: !!responseMap[3] },
        { label: "Economy",       pct: responseMap[5] ? responseToScore(responseMap[5]) : 0, fromQuiz: !!responseMap[5] },
        { label: "Environment",   pct: responseMap[4] ? responseToScore(responseMap[4]) : 0, fromQuiz: !!responseMap[4] },
      ].filter((i) => i.fromQuiz)

      setIssues(computed)
      setQuizLoading(false)
    }
    loadQuizScores()
  }, [user])

  const hasQuizData = issues.length > 0
  const avgAgreement = hasQuizData
    ? Math.round(issues.reduce((s, i) => s + i.pct, 0) / issues.length)
    : 0
  const remaining = totalRaces - racesDecided

  return (
    <div className="space-y-3">
      {showAvatarModal && (
        <AvatarUploadModal
          onClose={() => setShowAvatarModal(false)}
          onSuccess={(url) => updateProfile({ avatar_url: url ?? undefined } as any)}
        />
      )}
      {/* Card 1 — Profile */}
      <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAvatarModal(true)}
            className="relative flex-shrink-0 group"
            title="Update profile photo"
          >
            <UserAvatar avatarUrl={profile?.avatar_url} displayName={profile?.display_name} size="lg" />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-teal-600 rounded-full flex items-center justify-center border border-white opacity-90 group-hover:opacity-100">
              <Camera className="w-2.5 h-2.5 text-white" />
            </span>
          </button>
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">{profile?.display_name || "Neighbor"}</p>
            {profile?.location && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {profile.location}, GA
              </p>
            )}
          </div>
          <span className="ml-auto flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">
            <Flame className="w-3 h-3" />
            {streak}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border">
          <div className="text-center">
            <p className="text-lg font-bold text-[#1F3A93]">{racesDecided}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">Races decided</p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-lg font-bold text-[#1F3A93]">0</p>
            <p className="text-[10px] text-muted-foreground leading-tight">Discussions</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-[#1F3A93]">{viewpoints}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">Viewpoints liked</p>
          </div>
        </div>
      </div>

      {/* Card 2 — Common Ground */}
      <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
        <div>
          <p className="font-semibold text-foreground text-sm">Your common ground</p>
          <p className="text-[10px] text-muted-foreground">Your views across key civic issues</p>
        </div>

        {quizLoading ? (
          <div className="space-y-2 animate-pulse">
            {[1,2,3,4].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-2.5 bg-muted rounded w-1/2" />
                <div className="h-1.5 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : hasQuizData ? (
          <>
            <div className="text-center py-1">
              <p className="text-4xl font-bold text-teal-600">{avgAgreement}%</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">avg. agreement score</p>
            </div>
            <div className="space-y-2">
              {issues.map(({ label, pct }) => {
                const { bar, text } = issueColor(pct)
                return (
                  <div key={label} className="space-y-0.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{label}</span>
                      <span className={`font-semibold ${text}`}>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-3 space-y-2">
            <ClipboardList className="w-8 h-8 text-teal-500 mx-auto opacity-80" />
            <p className="text-xs text-muted-foreground leading-snug">
              Answer 5 quick questions to see your civic profile scores
            </p>
            <Link href="/">
              <button
                onClick={() => localStorage.removeItem("mv_quiz_shown")}
                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Complete your civic profile
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Card 3 — Suggested Neighbors */}
      <div className="bg-white rounded-2xl border border-border p-4">
        <SuggestedNeighbors limit={3} showHeader showSeeAll />
      </div>

      {/* Card 4 — Ballot Progress */}
      <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-foreground text-sm">Your ballot</p>
          <Vote className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="space-y-1.5">
          <Progress value={totalRaces > 0 ? (racesDecided / totalRaces) * 100 : 0} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{racesDecided} of {totalRaces} decided</span>
            {remaining > 0 && <span>{remaining} remaining</span>}
          </div>
        </div>
        <Link href="/profile">
          <button className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold py-2 rounded-xl transition-colors">
            {racesDecided === 0 ? "Start building ballot" : "Continue building ballot"}
          </button>
        </Link>
      </div>
    </div>
  )
}
