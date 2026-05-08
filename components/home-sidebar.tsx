"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Flame, MapPin, Vote } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { Progress } from "@/components/ui/progress"

const ISSUES = [
  { label: "Education", pct: 81 },
  { label: "Public Safety", pct: 77 },
  { label: "Economy", pct: 68 },
  { label: "Healthcare", pct: 72 },
  { label: "Environment", pct: 58 },
]

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
  const { profile } = useAuth()
  const [streak, setStreak] = useState(1)
  const [viewpoints, setViewpoints] = useState(0)

  useEffect(() => {
    setStreak(getCivicStreak())
    const likes = JSON.parse(localStorage.getItem("viewpointLikes") || "[]")
    setViewpoints(likes.length)
  }, [])

  const initials = profile?.display_name
    ? profile.display_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "MV"

  const avgAgreement = Math.round(ISSUES.reduce((s, i) => s + i.pct, 0) / ISSUES.length)
  const remaining = totalRaces - racesDecided

  return (
    <div className="space-y-3">
      {/* Card 1 — Profile */}
      <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#1F3A93] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {initials}
          </div>
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
          <p className="text-[10px] text-muted-foreground">Agreement with Georgia voters across key issues</p>
        </div>
        <div className="text-center py-1">
          <p className="text-4xl font-bold text-teal-600">{avgAgreement}%</p>
        </div>
        <div className="space-y-2">
          {ISSUES.map(({ label, pct }) => {
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
      </div>

      {/* Card 3 — Ballot Progress */}
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
