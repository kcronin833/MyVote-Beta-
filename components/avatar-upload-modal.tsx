"use client"

import { useRef, useState } from "react"
import { Camera, Upload, Trash2, X, Check, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-context"

interface AvatarUploadModalProps {
  onClose: () => void
  onSuccess: (url: string | null) => void
}

export function AvatarUploadModal({ onClose, onSuccess }: AvatarUploadModalProps) {
  const { user, updateProfile } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function pickFile(capture?: boolean) {
    const ref = capture ? cameraRef : fileRef
    ref.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) {
      setError("File must be under 5 MB")
      return
    }
    setError(null)
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleUpload() {
    if (!file || !user) return
    setUploading(true)
    setError(null)

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const path = `${user.id}/avatar.${ext}`
    const supabase = createClient()

    const { error: uploadErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadErr) {
      setError("Upload failed. Please try again.")
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path)
    // Bust cache with timestamp
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`
    await updateProfile({ avatar_url: publicUrl })
    onSuccess(publicUrl)
    onClose()
  }

  async function handleRemove() {
    if (!user) return
    setUploading(true)
    await updateProfile({ avatar_url: null })
    onSuccess(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Profile photo</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Circular preview */}
        {preview && (
          <div className="flex flex-col items-center gap-3">
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border-4 border-teal-200"
            />
            <p className="text-xs text-muted-foreground">Looks good?</p>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {uploading ? "Uploading…" : "Save photo"}
            </button>
          </div>
        )}

        {!preview && (
          <div className="space-y-2">
            {error && <p className="text-xs text-red-600 text-center">{error}</p>}
            <button
              onClick={() => pickFile(false)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-sm font-medium"
            >
              <Upload className="w-5 h-5 text-teal-600" />
              Upload a photo
            </button>
            <button
              onClick={() => pickFile(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-sm font-medium"
            >
              <Camera className="w-5 h-5 text-teal-600" />
              Take a photo
            </button>
            <button
              onClick={handleRemove}
              disabled={uploading}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium text-red-600"
            >
              <Trash2 className="w-5 h-5" />
              Remove photo
            </button>
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}
