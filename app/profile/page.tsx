"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Camera } from "lucide-react"
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

  const cardStyle: React.CSSProperties = {
    background: "#FDFCF9",
    border: "1px solid #E4E0D3",
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
  }

  return (
    <div className="min-h-screen bg-paper-100">
      <div className="max-w-[1100px] mx-auto px-3 pt-3 pb-10 lg:px-6 lg:pt-4">
        {showAvatarModal && (
          <AvatarUploadModal
            onClose={() => setShowAvatarModal(false)}
            onSuccess={(url) => updateProfile({ avatar_url: url ?? undefined } as any)}
          />
        )}

        <div style={{ marginBottom: 14 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600, color: "#3D8073", textDecoration: "none" }}>
            <ArrowLeft style={{ width: 14, height: 14 }} />
            Home
          </Link>
        </div>

        {/* Profile hero header */}
        {profile && (
          <div style={{ ...cardStyle, overflow: "hidden", marginBottom: 16 }}>
            {/* Dark banner */}
            <div style={{ height: 72, background: "linear-gradient(135deg, #0F1929 0%, #1A2138 45%, #142E2A 100%)", position: "relative", overflow: "hidden" }}>
              <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.15 }}>
                <defs>
                  <pattern id="pdots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#fff" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pdots)" />
              </svg>
            </div>
            {/* Identity row */}
            <div style={{ padding: "0 20px 18px", display: "flex", alignItems: "flex-end", gap: 14 }}>
              <button
                onClick={() => setShowAvatarModal(true)}
                className="relative group flex-shrink-0"
                title="Update profile photo"
                style={{ marginTop: -30, position: "relative", zIndex: 10, display: "inline-block" }}
              >
                <UserAvatar avatarUrl={profile.avatar_url} displayName={profile.display_name} size="lg" />
                <span className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </span>
              </button>
              <div style={{ paddingTop: 10, flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600, color: "#1A2138", margin: 0, letterSpacing: -0.3, lineHeight: 1.2 }}>{profile.display_name}</p>
                <p style={{ fontSize: 13, color: "#6B7088", margin: "2px 0 0" }}>@{profile.username}</p>
              </div>
              <button
                onClick={() => setShowAvatarModal(true)}
                style={{ fontSize: 12, fontWeight: 600, color: "#3D8073", background: "#E6F0ED", border: "1px solid #C9DDD7", borderRadius: 999, padding: "5px 12px", cursor: "pointer", flexShrink: 0, marginBottom: 4 }}
              >
                Change photo
              </button>
            </div>
          </div>
        )}

        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 600, color: "#1A2138", margin: "0 0 16px", letterSpacing: -0.3 }}>Your Political Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <PoliticalProfile />
          </div>
          <div className="space-y-4">
            {/* Civic profile quiz card */}
            {quizResult ? (
              <div style={{ ...cardStyle, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 22 }}>{ARCHETYPES[quizResult.archetype]?.emoji}</span>
                  <div>
                    <p style={{ fontSize: 10.5, fontWeight: 700, color: "#3D8073", textTransform: "uppercase", letterSpacing: 0.4, margin: 0 }}>Civic Profile</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#1A2138", margin: 0 }}>{ARCHETYPES[quizResult.archetype]?.label}</p>
                  </div>
                </div>
                {quizResult.selectedIssues.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                    {quizResult.selectedIssues.map((issue) => (
                      <span key={issue} style={{ fontSize: 11.5, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: "#E6F0ED", color: "#2F6358", border: "1px solid #C9DDD7" }}>
                        {issue}
                      </span>
                    ))}
                  </div>
                )}
                <Link href="/quiz" style={{ fontSize: 12, fontWeight: 600, color: "#3D8073", textDecoration: "none" }}>
                  Retake quiz →
                </Link>
              </div>
            ) : (
              <div style={{ ...cardStyle, padding: 16, textAlign: "center", border: "1.5px dashed #E4E0D3" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1A2138", margin: "0 0 4px" }}>No civic profile yet</p>
                <p style={{ fontSize: 12.5, color: "#6B7088", margin: "0 0 12px", lineHeight: 1.5 }}>Answer 12 quick questions to personalize your experience.</p>
                <Link href="/quiz">
                  <button style={{ background: "#3D8073", color: "#fff", borderRadius: 999, padding: "8px 20px", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}>
                    Take the quiz →
                  </button>
                </Link>
              </div>
            )}
            <CountyPicker />
            <PoliticalSpectrumBar />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
