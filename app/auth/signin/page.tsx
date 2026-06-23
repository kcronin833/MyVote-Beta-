"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { AuthShell } from "@/components/auth/auth-shell"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ email: "", password: "" })

  useEffect(() => {
    if (searchParams.get("error") === "confirmation_failed") {
      setError("Email confirmation failed. The link may have expired. Please try signing up again.")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(form.email, form.password)
    setLoading(false)
    if (error) setError(error)
    else router.push("/")
  }

  return (
    <AuthShell>
      <div style={{ width: "100%", maxWidth: 420, background: "#FDFCF9", borderRadius: 18, boxShadow: "0 24px 64px rgba(0,0,0,0.38), 0 4px 16px rgba(0,0,0,0.18)", padding: "30px 28px 28px" }}>

        <h1 style={{ fontSize: 21, fontWeight: 700, color: "#1A2138", textAlign: "center", marginBottom: 4 }}>Welcome back</h1>
        <p style={{ fontSize: 13.5, color: "#6B7088", textAlign: "center", marginBottom: 22 }}>Pick up where you left off — your ballot, groups, and reminders.</p>

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
            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#3D435A", marginBottom: 5 }}>Password</label>
              <div style={{ position: "relative" }}>
                <Input type={showPassword ? "text" : "password"} placeholder="Your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8B8FA3", padding: 0, lineHeight: 0 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ height: 44, borderRadius: 999, border: "none", background: loading ? "#E4E0D3" : "#3D8073", color: loading ? "#8B8FA3" : "#fff", fontSize: 14.5, fontWeight: 700, cursor: loading ? "default" : "pointer", transition: "background 0.15s", boxShadow: loading ? "none" : "0 2px 12px rgba(61,128,115,0.28)" }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "#8B8FA3", marginTop: 16 }}>
          Don&rsquo;t have an account?{" "}
          <Link href="/auth/signup" style={{ color: "#3D8073", fontWeight: 600, textDecoration: "none" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
