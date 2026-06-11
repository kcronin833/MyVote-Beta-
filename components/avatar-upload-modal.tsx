"use client"

import { useRef, useState } from "react"
import { Camera, Upload, Trash2, X, Check, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-context"

const C = {
  card:   "#FDFCF9",
  rule:   "#E4E0D3",
  ink900: "#1A2138",
  ink700: "#3D435A",
  ink500: "#6B7088",
  ink400: "#8B8FA3",
  teal:   "#3D8073",
  shade:  "#F0EDE6",
}

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
    if (f.size > 5 * 1024 * 1024) { setError("File must be under 5 MB"); return }
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
    if (uploadErr) { setError("Upload failed. Please try again."); setUploading(false); return }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path)
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

  const rowBtn = (danger?: boolean): React.CSSProperties => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "11px 14px",
    borderRadius: 10,
    border: "none",
    background: "transparent",
    color: danger ? "#B33A2C" : C.ink700,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.12s",
  })

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        style={{ background: C.card, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 400, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: C.ink900, margin: 0 }}>Profile photo</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.ink400, padding: 2, lineHeight: 0 }}>
            <X size={20} />
          </button>
        </div>

        {preview ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <img src={preview} alt="Preview" style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "4px solid #B2D8D0" }} />
            <p style={{ fontSize: 12.5, color: C.ink500, margin: 0 }}>Looks good?</p>
            {error && <p style={{ fontSize: 12, color: "#B33A2C", margin: 0 }}>{error}</p>}
            <button
              onClick={handleUpload}
              disabled={uploading}
              style={{ width: "100%", height: 42, borderRadius: 999, border: "none", background: uploading ? "#E4E0D3" : C.teal, color: uploading ? C.ink400 : "#fff", fontSize: 14, fontWeight: 700, cursor: uploading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {uploading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={16} />}
              {uploading ? "Uploading…" : "Save photo"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {error && <p style={{ fontSize: 12, color: "#B33A2C", textAlign: "center", margin: "0 0 8px" }}>{error}</p>}
            <button
              onClick={() => pickFile(false)}
              style={rowBtn()}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.shade)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Upload size={18} color={C.teal} />
              Upload a photo
            </button>
            <button
              onClick={() => pickFile(true)}
              style={rowBtn()}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.shade)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Camera size={18} color={C.teal} />
              Take a photo
            </button>
            <button
              onClick={handleRemove}
              disabled={uploading}
              style={rowBtn(true)}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FEF2F2")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Trash2 size={18} />
              Remove photo
            </button>
          </div>
        )}

        {/* Hidden file inputs */}
        <input ref={fileRef}   type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handleFileChange} />
        <input ref={cameraRef} type="file" accept="image/*" capture="user"           style={{ display: "none" }} onChange={handleFileChange} />
      </div>
    </div>
  )
}
