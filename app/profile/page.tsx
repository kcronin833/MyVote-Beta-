"use client"

import { useState } from "react"
import Link from "next/link"
import { Camera, Vote, Home, Users, Newspaper } from "lucide-react"
import { PoliticalSpectrumBar } from "@/components/political-spectrum-bar"
import { PoliticalProfile } from "@/components/political-profile"
import { useAuth } from "@/components/auth-context"
import { UserAvatar } from "@/components/user-avatar"
import { AvatarUploadModal } from "@/components/avatar-upload-modal"
import { Logo } from "@/components/logo"
import { NotificationBell } from "@/components/notification-bell"
import { UserNav } from "@/components/user-nav"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/news/spectrum", label: "News", icon: Newspaper },
  { href: "/elections", label: "Elections", icon: Vote },
  { href: "/profile", label: "Profile", icon: Users },
]

const ProfilePage = () => {
  const { profile, updateProfile } = useAuth()
  const [showAvatarModal, setShowAvatarModal] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: "var(--paper-100)" }}>
      {showAvatarModal && (
        <AvatarUploadModal
          onClose={() => setShowAvatarModal(false)}
          onSuccess={(url) => updateProfile({ avatar_url: url ?? undefined } as any)}
        />
      )}

      <div className="container mx-auto px-4 pt-5 pb-24 max-w-6xl">
        <div className="flex items-center justify-between pb-5">
          <Logo size="sm" />

          <div className="flex items-center gap-3">
            <NotificationBell />
            <UserNav />
          </div>
        </div>

        <div className="community-card rounded-[1.35rem] p-3 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = href === "/profile"

              return (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all"
                  style={{
                    background: active ? "var(--civic-blue)" : "rgba(255,253,248,0.72)",
                    color: active ? "white" : "var(--ink-700)",
                    border: active ? "1px solid transparent" : "1px solid var(--rule)",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-6 items-start mb-8">
          <div className="community-card rounded-[2rem] p-6">
            {profile && (
              <div className="flex items-center gap-5">
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
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
                    style={{ color: "var(--ink-500)" }}>
                    Civic profile
                  </div>

                  <h1 className="editorial-headline text-4xl mb-2"
                    style={{ color: "var(--ink-900)" }}>
                    {profile.display_name}
                  </h1>

                  <p className="text-sm mb-3" style={{ color: "var(--ink-500)" }}>
                    @{profile.username}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setShowAvatarModal(true)}
                      className="local-pill px-4 py-2 rounded-full text-xs font-semibold"
                    >
                      Change photo
                    </button>

                    <Link
                      href="/elections"
                      className="primary-action px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2"
                    >
                      <Vote className="w-3.5 h-3.5" />
                      View ballot
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="community-card rounded-[2rem] p-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
              style={{ color: "var(--ink-500)" }}>
              Your civic identity
            </div>

            <p className="text-sm leading-relaxed"
              style={{ color: "var(--ink-700)" }}>
              Your profile helps personalize local conversations, elections, district updates, and candidate discovery across MyVote.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
                  style={{ color: "var(--ink-500)" }}>
                  Political profile
                </div>

                <h2 className="text-2xl font-semibold" style={{ color: "var(--ink-900)" }}>
                  Your perspectives & priorities
                </h2>
              </div>

              <PoliticalProfile />
            </div>
          </div>

          <div className="space-y-6">
            <div className="community-card rounded-[1.5rem] p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
                style={{ color: "var(--ink-500)" }}>
                Spectrum overview
              </div>

              <PoliticalSpectrumBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage