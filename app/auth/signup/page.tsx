"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Logo } from "@/components/logo"
import { Eye, EyeOff } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
    location: "",
    politicalLean: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push("/")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#1F3A93] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-[#E5E5E5]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-[#4A4A4A]">Create Your Account</CardTitle>
          <CardDescription>Join the MyVote community and stay informed</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="text-sm font-medium text-[#4A4A4A]">Username</label>
              <Input
                placeholder="Choose a username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#4A4A4A]">Display Name</label>
              <Input
                placeholder="Your full name"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#4A4A4A]">Password</label>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/50"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#4A4A4A]">Location</label>
              <Input
                placeholder="City, State (e.g. Atlanta, GA)"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#4A4A4A]">Political Leaning (optional)</label>
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
              className="w-full bg-[#1F3A93] hover:bg-[#1F3A93]/90 text-white"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
          <p className="text-center text-sm text-[#4A4A4A]/60 mt-4">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-[#1F3A93] font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
