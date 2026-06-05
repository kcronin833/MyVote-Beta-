"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PoliticalSpectrumBar } from "@/components/political-spectrum-bar"
import { PoliticalProfile } from "@/components/political-profile"
import { CountyPicker } from "@/components/profile/county-picker"
import { useAuth } from "@/components/auth-context"
import { UserAvatar } from "@/components/user-avatar"
import { AvatarUploadModal } from "@/components/avatar-upload-modal"

const ProfilePage = () => {
  const router = useRouter()
  const { profile, updateProfile } = useAuth()
  const [showAvatarModal, setShowAvatarModal] = useState(false)

  return (
    <div className="container mx-auto py-8 px-4">
      {showAvatarModal && (
        <AvatarUploadModal
          onClose={() => setShowAvatarModal(false)}
          onSuccess={(url) => updateProfile({ avatar_url: url ?? undefined } as any)}
        />
      )}

      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
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

      <h1 className="text-3xl font-semibold mb-6">Your Ballot</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PoliticalProfile />
        </div>
        <div className="space-y-6">
          <CountyPicker />
          <PoliticalSpectrumBar />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
