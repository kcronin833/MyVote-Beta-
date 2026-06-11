"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"
import { Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/components/auth-context"

const CITIES = [
  "Atlanta","Savannah","Augusta","Columbus","Macon","Athens",
  "Sandy Springs","Roswell","Albany","Johns Creek","Warner Robins",
  "Alpharetta","Marietta","Valdosta","Smyrna","Brookhaven","Dunwoody",
  "Peachtree City","Gainesville","Newnan","Milton","Decatur","East Point",
  "Kennesaw","Statesboro","Dalton","Lawrenceville","Woodstock","Canton",
  "Carrollton","Rome","Tucker","Stone Mountain","College Park","Hinesville",
  "Douglasville","Griffin","Pooler","Duluth","LaGrange",
]

const VALUE_PROPS = [
  "See every race on your ballot — governor to school board",
  "Email reminders before the June 16 runoff & November election",
  "Read Georgia politics from left, right, and center in one place",
]

const selectStyle: React.CSSProperties = {
  width: "100%",
  height: 40,
  paddingLeft: 12,
  paddingRight: 12,
  borderRadius: 8,
  border: "1px solid #E4E0D3",
  background: "#FDFCF9",
  color: "#1A2138",
  fontSize: 14,
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238B8FA3' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
}

export default function SignUpPage() {
  const { signUp } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
    location: "",
    politicalLean: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.username.match(/^[a-z0-9_]{3,20}$/)) {
      setError("Username must be 3–20 characters: lowercase letters, numbers, or underscores only")
      return
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    const { error } = await signUp(form.email, form.password, form.username, form.displayName, form.location, form.politicalLean)
    setLoading(false)

    if (error) {
      setError(error)
    } else {
      setSuccess(true)
    }
  }

  const bg = "linear-gradient(145deg, #0F1929 0%, #1A2138 45%, #142E2A 100%)"

  const card = (
    <div style={{ width: "100%", maxWidth: 440, background: "#FDFCF9", borderRadius: 18, boxShadow: "0 24px 64px rgba(0,0,0,0.38), 0 4px 16px rgba(0,0,0,0.18)", padding: "32px 28px 28px" }}>
      {/* Logo */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <Logo size="lg" />
      </div>

      {success ? (
        /* ── Success state ── */
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <CheckCircle2 size={28} color="#059669" />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2138", marginBottom: 8 }}>Check Your Email</h1>
          <p style={{ fontSize: 13.5, color: "#6B7088", lineHeight: 1.6, marginBottom: 24 }}>
            We sent a confirmation link to{" "}
            <strong style={{ color: "#3D435A" }}>{form.email}</strong>.
            Click the link to activate your account, then sign in.
          </p>
          <Link
            href="/auth/signin"
            style={{ display: "inline-block", height: 42, lineHeight: "42px", paddingLeft: 22, paddingRight: 22, borderRadius: 999, background: "#3D8073", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none", boxShadow: "0 2px 12px rgba(61,128,115,0.28)" }}
          >
            Go to Sign In
          </Link>
        </div>
      ) : (
        /* ── Form ── */
        <>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2138", textAlign: "center", marginBottom: 4 }}>Create Your Free Account</h1>
          <p style={{ fontSize: 13.5, color: "#6B7088", textAlign: "center", marginBottom: 18 }}>Your complete 2026 Georgia ballot guide, saved and personalized</p>

          {/* Value props */}
          <div style={{ background: "#E6F0ED", border: "1px solid #B2D8D0", borderRadius: 10, padding: "12px 14px", marginBottom: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            {VALUE_PROPS.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#2F6358", lineHeight: 1.45 }}>
                <span style={{ color: "#3D8073", fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#B33A2C", padding: "10px 14px", borderRadius: 8, fontSize: 13, lineHeight: 1.5 }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#3D435A", marginBottom: 5 }}>Email</label>
              <Input type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#3D435A", marginBottom: 5 }}>Username</label>
                <Input placeholder="e.g. john_voter" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })} required />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#3D435A", marginBottom: 5 }}>Display Name</label>
                <Input placeholder="Your full name" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} required />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#3D435A", marginBottom: 5 }}>Password</label>
              <div style={{ position: "relative" }}>
                <Input type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8B8FA3", padding: 0, lineHeight: 0 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#3D435A", marginBottom: 5 }}>Location (Georgia)</label>
              <select
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                style={selectStyle}
              >
                <option value="">Select your city…</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}, GA</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#3D435A", marginBottom: 5 }}>
                Political Leaning{" "}
                <span style={{ fontWeight: 400, color: "#8B8FA3" }}>(optional)</span>
              </label>
              <select
                value={form.politicalLean}
                onChange={(e) => setForm({ ...form, politicalLean: e.target.value })}
                style={selectStyle}
              >
                <option value="">Select or skip…</option>
                <option value="left">Liberal / Progressive</option>
                <option value="center">Moderate / Independent</option>
                <option value="right">Conservative</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ height: 44, borderRadius: 999, border: "none", background: loading ? "#E4E0D3" : "#3D8073", color: loading ? "#8B8FA3" : "#fff", fontSize: 14.5, fontWeight: 700, cursor: loading ? "default" : "pointer", transition: "background 0.15s", boxShadow: loading ? "none" : "0 2px 12px rgba(61,128,115,0.28)" }}
            >
              {loading ? "Creating Account…" : "Create Free Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "#8B8FA3", marginTop: 16 }}>
            Already have an account?{" "}
            <Link href="/auth/signin" style={{ color: "#3D8073", fontWeight: 600, textDecoration: "none" }}>
              Sign In
            </Link>
          </p>
        </>
      )}
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: 16, background: bg }}>
      {/* Back link */}
      <div style={{ width: "100%", maxWidth: 440, margin: "0 auto", paddingTop: 16, paddingBottom: 24 }}>
        <Link
          href="/"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,0.75)", textDecoration: "none" }}
        >
          <ArrowLeft size={15} />
          Back to Home
        </Link>
      </div>

      {/* Centered card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {card}
      </div>
    </div>
  )
}
