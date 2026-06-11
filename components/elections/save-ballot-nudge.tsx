"use client"

/* SaveBallotNudge — shown in the right rail of county ballot pages to
   logged-out visitors. Checks auth client-side; renders nothing when
   the user is already signed in. One-time dismiss stored in sessionStorage
   so it doesn't nag repeat visitors within the same session. */

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { X, BookmarkCheck } from "lucide-react"

export function SaveBallotNudge() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Don't re-show once dismissed in this session
    if (typeof window !== "undefined" && sessionStorage.getItem("mv_nudge_dismissed")) return

    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) setShow(true)
    })
  }, [])

  function dismiss() {
    sessionStorage.setItem("mv_nudge_dismissed", "true")
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1.5px solid #3D8073",
        borderRadius: 12,
        padding: 14,
        position: "relative",
        boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
      }}
    >
      {/* Dismiss */}
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#8B8FA3",
          padding: 2,
          lineHeight: 0,
        }}
      >
        <X size={14} />
      </button>

      {/* Icon + heading */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, marginRight: 20 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "#E6F0ED",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <BookmarkCheck size={16} color="#3D8073" />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1A2138" }}>
          Save your ballot picks
        </span>
      </div>

      <p style={{ fontSize: 12.5, color: "#3D435A", margin: "0 0 12px", lineHeight: 1.55 }}>
        Create a free account to save your selections, track candidates,
        and get Georgia news from every angle — all year.
      </p>

      <Link
        href="/auth/signup"
        style={{
          display: "block",
          textAlign: "center",
          fontSize: 13,
          fontWeight: 700,
          color: "#fff",
          background: "#B33A2C",
          borderRadius: 999,
          padding: "9px 12px",
          textDecoration: "none",
          marginBottom: 8,
        }}
      >
        Create free account →
      </Link>

      <Link
        href="/auth/signin"
        style={{
          display: "block",
          textAlign: "center",
          fontSize: 12,
          fontWeight: 600,
          color: "#3D8073",
          textDecoration: "none",
        }}
      >
        Already have an account? Sign in
      </Link>
    </div>
  )
}
