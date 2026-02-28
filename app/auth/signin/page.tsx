"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/components/auth-context"

export default function SignInPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ email: "", password: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(form.email, form.password)
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-[#1F3A93] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-[#E5E5E5]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-[#4A4A4A]">Welcome Back</CardTitle>
          <CardDescription>Sign in to your MyVote account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-[#4A4A4A]">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#4A4A4A]">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/50"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1F3A93] hover:bg-[#1F3A93]/90 text-white"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <p className="text-center text-sm text-[#4A4A4A]/60 mt-4">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-[#1F3A93] font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
