"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send, CheckCircle, Briefcase, Lightbulb, MessageCircle } from "lucide-react"

const CATEGORIES = [
  {
    id: "business",
    label: "Business Inquiry",
    icon: Briefcase,
    color: "text-[#1B2B5E]",
    bg: "bg-blue-50",
    activeBg: "bg-[#1B2B5E]",
    desc: "Partnerships, press, or commercial opportunities",
  },
  {
    id: "suggestion",
    label: "Suggestion",
    icon: Lightbulb,
    color: "text-amber-600",
    bg: "bg-amber-50",
    activeBg: "bg-amber-500",
    desc: "Ideas to improve MyVote for Georgia voters",
  },
  {
    id: "general",
    label: "General",
    icon: MessageCircle,
    color: "text-teal-600",
    bg: "bg-teal-50",
    activeBg: "bg-teal-600",
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
    <div className="min-h-screen bg-[#F5F6FA]">
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6 text-[#4A4A4A]/60 hover:text-[#1B2B5E]">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1B2B5E]">Contact Us</h1>
          <p className="text-[#4A4A4A]/60 mt-1">We read every message and typically respond within 24 hours.</p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-[#1B2B5E] mb-2">Message sent!</h2>
            <p className="text-[#4A4A4A]/60 mb-6">
              Thanks for reaching out. We'll get back to you at <strong>{email}</strong> soon.
            </p>
            <Button
              variant="outline"
              onClick={() => { setSubmitted(false); setName(""); setEmail(""); setMessage(""); setCategory("general") }}
            >
              Send another message
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">

            {/* Category selector */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-[#1B2B5E] mb-3">What's this about?</p>
              <div className="grid grid-cols-3 gap-3">
                {CATEGORIES.map(({ id, label, icon: Icon, color, bg, activeBg, desc }) => {
                  const active = category === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCategory(id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                        active
                          ? "border-[#1B2B5E] bg-[#1B2B5E]/5"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? "bg-[#1B2B5E]/10" : bg}`}>
                        <Icon className={`w-5 h-5 ${active ? "text-[#1B2B5E]" : color}`} />
                      </div>
                      <span className={`text-xs font-semibold leading-tight ${active ? "text-[#1B2B5E]" : "text-[#4A4A4A]"}`}>
                        {label}
                      </span>
                    </button>
                  )
                })}
              </div>
              <p className="text-xs text-[#4A4A4A]/50 mt-2 text-center">{selected.desc}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1.5">Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1.5">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1.5">Message</label>
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
                <p className="text-xs text-[#4A4A4A]/40 mt-1 text-right">{message.length} / 2000</p>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={submitting || message.length > 2000}
                className="w-full bg-[#CC2020] hover:bg-[#aa1818] text-white font-semibold h-11"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Sending…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </span>
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
