"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-context"

const C = {
  card: "#FFFFFF", rule: "#E9EBEF", ink900: "#030213", ink700: "#3D435A",
  ink500: "#717182", ink400: "#8B8FA3", teal: "#030213", tealDk: "#030213", tealSoft: "#EFEFF3",
}

function suggestFromEmail(email: string) {
  const local = (email.split("@")[0] || "").trim()
  const username = local.toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "").slice(0, 20)
  const display = local.replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim()
  return { username: username.length >= 3 ? username : "", display }
}

const inp: React.CSSProperties = {
  height: 44, width: "100%", borderRadius: 10, border: `1px solid ${C.rule}`,
  background: "#fff", color: C.ink900, fontSize: 14, padding: "0 14px", outline: "none",
}

export function ClaimForm({
  email,
  token,
  alreadyClaimed,
}: {
  email: string | null
  token: string | null
  alreadyClaimed: boolean
}) {
  const { signUp } = useAuth()
  const seed = email ? suggestFromEmail(email) : { username: "", display: "" }

  const [emailValue, setEmailValue] = useState(email ?? "")
  const [displayName, setDisplayName] = useState(seed.display)
  const [username, setUsername] = useState(seed.username)
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function submit() {
    if (busy) return
    if (!emailValue.trim()) { setErr("Enter your email."); return }
    if (!displayName.trim()) { setErr("Add a display name."); return }
    if (!/^[a-z0-9_]{3,20}$/.test(username)) { setErr("Username: 3–20 lowercase letters, numbers, or underscores."); return }
    if (password.length < 6) { setErr("Password must be at least 6 characters."); return }
    setBusy(true); setErr(null)

    const { error } = await signUp(emailValue.trim(), password, username, displayName.trim())
    if (error) {
      if (/already|registered|exists/i.test(error)) {
        setErr("You already have an account with this email — sign in instead.")
      } else {
        setErr(error)
      }
      setBusy(false)
      return
    }

    // Best-effort: mark this reminder subscriber as converted.
    if (token) {
      try {
        await fetch("/api/claim/mark", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token }),
        })
      } catch { /* non-blocking */ }
    }
    setDone(true)
    setBusy(false)
  }

  if (done) {
    return (
      <div style={{ background: C.tealSoft, border: "1px solid #D9DCE3", borderRadius: 14, padding: "20px 18px", textAlign: "center" }}>
        <p style={{ fontSize: 16, fontWeight: 800, color: C.tealDk, margin: "0 0 6px" }}>✓ Profile created</p>
        <p style={{ fontSize: 13.5, color: C.ink700, margin: "0 0 14px", lineHeight: 1.6 }}>
          Check <strong>{emailValue}</strong> for a confirmation link to finish signing in.
          Then your ballot, groups, and friends are all yours.
        </p>
        <Link href="/elections" style={{ display: "inline-block", background: C.teal, color: "#fff", fontWeight: 700, fontSize: 14, padding: "11px 22px", borderRadius: 999, textDecoration: "none" }}>
          Browse your ballot →
        </Link>
      </div>
    )
  }

  return (
    <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 14, boxShadow: "0 2px 10px rgba(20,24,40,0.07)", padding: "18px 18px 16px" }}>
      {alreadyClaimed && (
        <div style={{ fontSize: 12.5, color: C.tealDk, background: C.tealSoft, border: "1px solid #D9DCE3", borderRadius: 8, padding: "8px 12px", marginBottom: 14, lineHeight: 1.5 }}>
          Looks like you may have started this already. If you have an account,{" "}
          <Link href="/auth/signin" style={{ color: C.tealDk, fontWeight: 700 }}>sign in</Link> — otherwise finish below.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <label style={{ fontSize: 11.5, fontWeight: 700, color: C.ink500, display: "block", marginBottom: 4 }}>Email</label>
          <input
            type="email" value={emailValue} onChange={(e) => setEmailValue(e.target.value)}
            readOnly={!!email}
            style={{ ...inp, background: email ? "#F0F0F3" : "#fff", color: email ? C.ink500 : C.ink900 }}
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label style={{ fontSize: 11.5, fontWeight: 700, color: C.ink500, display: "block", marginBottom: 4 }}>Display name</label>
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} style={inp} placeholder="Your name" />
        </div>
        <div>
          <label style={{ fontSize: 11.5, fontWeight: 700, color: C.ink500, display: "block", marginBottom: 4 }}>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} style={inp} placeholder="e.g. john_voter" />
        </div>
        <div>
          <label style={{ fontSize: 11.5, fontWeight: 700, color: C.ink500, display: "block", marginBottom: 4 }}>Create a password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()} style={inp} placeholder="At least 6 characters" />
        </div>

        {err && (
          <div style={{ fontSize: 12.5, color: "#D4183D", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "8px 12px", lineHeight: 1.5 }}>
            {err}{" "}
            {/already have an account/i.test(err) && (
              <Link href="/auth/signin" style={{ color: "#D4183D", fontWeight: 700 }}>Sign in →</Link>
            )}
          </div>
        )}

        <button
          onClick={submit} disabled={busy}
          style={{ height: 46, borderRadius: 999, border: "none", background: busy ? C.rule : C.teal, color: busy ? C.ink400 : "#fff", fontSize: 15, fontWeight: 700, cursor: busy ? "default" : "pointer", marginTop: 2, boxShadow: busy ? "none" : "0 2px 12px rgba(3,2,19,0.3)" }}
        >
          {busy ? "Creating your profile…" : "Create my free profile"}
        </button>
        <p style={{ fontSize: 11, color: C.ink400, textAlign: "center", margin: "2px 0 0" }}>
          Already have an account?{" "}
          <Link href="/auth/signin" style={{ color: C.teal, fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
