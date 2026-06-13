"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, CheckCircle, Briefcase, Lightbulb, MessageCircle, AlertTriangle } from "lucide-react"

const C = {
  card:    "#FDFCF9",
  rule:    "#E4E0D3",
  ink900:  "#1A2138",
  ink700:  "#3D435A",
  ink500:  "#6B7088",
  ink400:  "#8B8FA3",
  teal:    "#3D8073",
  tealDk:  "#2F6358",
  tealSoft:"#E6F0ED",
  red:     "#B33A2C",
  page:    "#F5F3EE",
  shade:   "#F0EDE6",
}

const CATEGORIES = [
  {
    id: "business",
    label: "Business Inquiry",
    Icon: Briefcase,
    activeColor: "#1D4ED8",
    activeBg: "#EEF2FF",
    activeBorder: "#3B82F6",
    idleColor: C.ink500,
    desc: "Partnerships, press, or commercial opportunities",
  },
  {
    id: "suggestion",
    label: "Suggestion",
    Icon: Lightbulb,
    activeColor: "#B45309",
    activeBg: "#FFFBEB",
    activeBorder: "#F59E0B",
    idleColor: C.ink500,
    desc: "Ideas to improve MyVote for Georgia voters",
  },
  {
    id: "correction",
    label: "Report an Error",
    Icon: AlertTriangle,
    activeColor: "#9A3412",
    activeBg: "#FFF7ED",
    activeBorder: "#FB923C",
    idleColor: C.ink500,
    desc: "Spotted wrong ballot info, dates, or candidate details? Tell us — accuracy matters most",
  },
  {
    id: "general",
    label: "General",
    Icon: MessageCircle,
    activeColor: C.tealDk,
    activeBg: C.tealSoft,
    activeBorder: C.teal,
    idleColor: C.ink500,
    desc: "Questions, feedback, or anything else",
  },
]

export default function ContactPage() {
  const [category, setCategory] = useState("general")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  // Deep-link prefill: pages link here as /contact?topic=correction&ref=<path>
  // so a visitor reporting bad ballot data lands with the right category and
  // page reference already filled in. Read once on mount (client-only).
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get("topic") === "correction") {
        setCategory("correction")
        const ref = params.get("ref")
        if (ref) {
          setMessage(
            `I think there may be an error on this page: ${ref}\n\nWhat looks wrong:\n`
          )
        }
      }
    } catch {
      /* no-op */
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, category, message }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.")
      } else {
        setSubmitted(true)
      }
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const selected = CATEGORIES.find((c) => c.id === category)!

  return (
    <div style={{ minHeight: "100vh", background: C.page }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 16px 80px" }}>

        {/* Page heading */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 700, color: C.ink900, marginBottom: 4 }}>
            Contact Us
          </h1>
          <p style={{ fontSize: 14, color: C.ink500, lineHeight: 1.6 }}>
            We read every message and typically respond within 24 hours.
          </p>
        </div>

        {submitted ? (
          /* ── Success state ── */
          <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 16, boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)", padding: "48px 32px", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, background: "#ECFDF5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <CheckCircle size={30} color="#059669" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.ink900, marginBottom: 8 }}>Message sent!</h2>
            <p style={{ fontSize: 14, color: C.ink500, marginBottom: 24, lineHeight: 1.6 }}>
              Thanks for reaching out. We'll get back to you at <strong style={{ color: C.ink700 }}>{email}</strong> soon.
            </p>
            <button
              onClick={() => { setSubmitted(false); setName(""); setEmail(""); setMessage(""); setCategory("general") }}
              style={{ padding: "9px 22px", borderRadius: 999, border: `1.5px solid ${C.rule}`, background: "transparent", color: C.ink700, fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
            >
              Send another message
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 16, boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)", padding: "24px 24px 28px" }}>

            {/* Category selector */}
            <div style={{ marginBottom: 22 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.ink900, marginBottom: 10 }}>What&rsquo;s this about?</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                {CATEGORIES.map(({ id, label, Icon, activeColor, activeBg, activeBorder, idleColor }) => {
                  const active = category === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCategory(id)}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                        padding: "14px 10px", borderRadius: 12,
                        border: `2px solid ${active ? activeBorder : C.rule}`,
                        background: active ? activeBg : C.card,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: active ? activeBg : C.shade, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={18} color={active ? activeColor : idleColor} />
                      </div>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: active ? activeColor : C.ink700, textAlign: "center", lineHeight: 1.3 }}>
                        {label}
                      </span>
                    </button>
                  )
                })}
              </div>
              <p style={{ fontSize: 12, color: C.ink400, marginTop: 8, textAlign: "center" }}>{selected.desc}</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: C.ink700, marginBottom: 5 }}>Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: C.ink700, marginBottom: 5 }}>Email</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: C.ink700, marginBottom: 5 }}>Message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    category === "business"
                      ? "Tell us about your organization and what you have in mind…"
                      : category === "suggestion"
                      ? "Describe your idea and how it would help Georgia voters…"
                      : "What's on your mind?"
                  }
                  rows={6}
                  required
                />
                <p style={{ fontSize: 11.5, color: C.ink400, marginTop: 4, textAlign: "right" }}>{message.length} / 2000</p>
              </div>

              {error && (
                <div style={{ fontSize: 13.5, color: "#B33A2C", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || message.length > 2000}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  height: 46, borderRadius: 999, border: "none",
                  background: submitting || message.length > 2000 ? "#E4E0D3" : C.red,
                  color: submitting || message.length > 2000 ? C.ink400 : "#fff",
                  fontSize: 14.5, fontWeight: 700, cursor: submitting || message.length > 2000 ? "default" : "pointer",
                  transition: "background 0.15s",
                }}
              >
                {submitting ? (
                  <>
                    <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "#fff", borderRadius: "50%", animation: "mv-spin 0.75s linear infinite", display: "inline-block" }} />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
