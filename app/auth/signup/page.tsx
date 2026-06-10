"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Logo } from "@/components/logo"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useAuth } from "@/components/auth-context"

export default function SignUpPage() {
  const router = useRouter()
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
      setError("Username must be 3-20 characters, lowercase letters, numbers, or underscores")
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

  if (success) {
    return (
      <div className="min-h-screen flex flex-col p-4" style={{ background: "linear-gradient(145deg, #0F1929 0%, #1A2138 45%, #142E2A 100%)" }}>
        <div className="w-full max-w-md mx-auto pt-4 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md border-rule" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <CardTitle className="text-ink-700">Check Your Email</CardTitle>
            <CardDescription>
              We sent a confirmation link to <strong>{form.email}</strong>. Click the link to activate your account, then come back and sign in.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth/signin">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                Go to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col p-4" style={{ background: "linear-gradient(145deg, #0F1929 0%, #1A2138 45%, #142E2A 100%)" }}>
      <div className="w-full max-w-md mx-auto pt-4 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center">
      <Card className="w-full max-w-md border-rule" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-ink-700">Create Your Free Account</CardTitle>
          <CardDescription>Your complete 2026 Georgia ballot guide, saved and personalized</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Value props */}
          <div className="bg-teal-50 border border-teal-100 rounded-lg px-4 py-3 mb-4 space-y-1.5">
            {[
              "See every race on your ballot — governor to school board",
              "Email reminders before the June 16 runoff & November election",
              "Read Georgia politics from left, right, and center in one place",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-teal-800">
                <span className="text-teal-600 font-bold mt-0.5 flex-shrink-0">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-ink-700">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700">Username</label>
              <Input
                placeholder="Choose a username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700">Display Name</label>
              <Input
                placeholder="Your full name"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700">Location (Georgia)</label>
              <Select value={form.location} onValueChange={(v) => setForm({ ...form, location: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Atlanta",
                    "Savannah",
                    "Augusta",
                    "Columbus",
                    "Macon",
                    "Athens",
                    "Sandy Springs",
                    "Roswell",
                    "Albany",
                    "Johns Creek",
                    "Warner Robins",
                    "Alpharetta",
                    "Marietta",
                    "Valdosta",
                    "Smyrna",
                    "Brookhaven",
                    "Dunwoody",
                    "Peachtree City",
                    "Gainesville",
                    "Newnan",
                    "Milton",
                    "Decatur",
                    "East Point",
                    "Kennesaw",
                    "Statesboro",
                    "Dalton",
                    "Lawrenceville",
                    "Woodstock",
                    "Canton",
                    "Carrollton",
                    "Rome",
                    "Tucker",
                    "Stone Mountain",
                    "College Park",
                    "Hinesville",
                    "Douglasville",
                    "Griffin",
                    "Pooler",
                    "Duluth",
                    "LaGrange",
                  ].map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}, GA
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700">Political Leaning <span className="font-normal text-ink-500">(optional — helps us show relevant stories first)</span></label>
              <Select value={form.politicalLean} onValueChange={(v) => setForm({ ...form, politicalLean: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select or skip" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Liberal / Progressive</SelectItem>
                  <SelectItem value="center">Moderate / Independent</SelectItem>
                  <SelectItem value="right">Conservative</SelectItem>
                  <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
          <p className="text-center text-sm text-ink-700/60 mt-4">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-teal-600 font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
