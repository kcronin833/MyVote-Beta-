"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PoliticalSpectrumBar } from "@/components/political-spectrum-bar"
import { PoliticalProfile } from "@/components/political-profile"
import { CountyPicker } from "@/components/profile/county-picker"
import { useAuth } from "@/components/auth-context"
import { UserAvatar } from "@/components/user-avatar"
import { AvatarUploadModal } from "@/components/avatar-upload-modal"
import { ARCHETYPES, type QuizResult } from "@/lib/quiz-engine"

const ProfilePage = () => {
  const { profile, updateProfile } = useAuth()
  const [showAvatarModal, setShowAvatarModal] = useState(false)

  // Load civic quiz result from localStorage
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("mv_intake_result")
      if (raw && raw !== "dismissed") setQuizResult(JSON.parse(raw) as QuizResult)
    } catch { /* ignore malformed */ }
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      {showAvatarModal && (
        <AvatarUploadModal
          onClose={() => setShowAvatarModal(false)}
          onSuccess={(url) => updateProfile({ avatar_url: url ?? undefined } as any)}
        />
      )}

      <div className="mb-6">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Button>
        </Link>
      </div>

      {/* Profile header with tappable avatar */}
      {profile && (
        <div className="flex items-center gap-4 mb-8 p-4 bg-paper-50 rounded-2xl border border-border">
          <button
            onClick={() => setShowAvatarModal(true)}
            className="relative group flex-shrink-0"
            title="Update profile photo"
          >
            <UserAvatar avatarUrl={profile.avatar_url} displayName={profile.display_name} size="lg" />
            <span className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </span>
          </button>
          <div>
            <p className="font-bold text-lg text-foreground">{profile.display_name}</p>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
            <button
              onClick={() => setShowAvatarModal(true)}
              className="text-xs text-teal-600 hover:underline mt-1"
            >
              Change photo
            </button>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-semibold mb-6">Your Political Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PoliticalProfile />
        </div>
        <div className="space-y-6">
          {/* Civic profile quiz card */}
          {quizResult ? (
            <div className="p-4 rounded-2xl border border-border bg-paper-50 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{ARCHETYPES[quizResult.archetype]?.emoji}</span>
                <div>
                  <p className="text-xs font-bold text-teal-600 uppercase tracking-wide">Civic Profile</p>
                  <p className="font-bold text-foreground text-sm">{ARCHETYPES[quizResult.archetype]?.label}</p>
                </div>
              </div>
              {quizResult.selectedIssues.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {quizResult.selectedIssues.map((issue) => (
                    <span key={issue} className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                      {issue}
                    </span>
                  ))}
                </div>
              )}
              <Link href="/quiz" className="text-xs text-teal-600 hover:underline">
                Retake quiz →
              </Link>
            </div>
          ) : (
            <div className="p-4 rounded-2xl border border-dashed border-border bg-paper-50 text-center space-y-2">
              <p className="text-sm font-semibold text-foreground">No civic profile yet</p>
              <p className="text-xs text-muted-foreground">Answer 12 quick questions to personalize your experience.</p>
              <Link href="/quiz">
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white mt-1">
                  Take the quiz →
                </Button>
              </Link>
            </div>
          )}
          <CountyPicker />
          <PoliticalSpectrumBar />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
