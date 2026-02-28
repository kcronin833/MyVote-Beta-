"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Send, ThumbsUp, Lightbulb, Bug, Handshake, CheckCircle } from "lucide-react"
import { Logo } from "@/components/logo"

interface Suggestion {
  id: string
  title: string
  description: string
  votes: number
  status: "pending" | "under-review" | "approved" | "implemented"
  author: string
  date: string
}

const mockSuggestions: Suggestion[] = [
  {
    id: "1",
    title: "Add election countdown timers",
    description: "Show countdown timers for upcoming elections in the user dashboard.",
    votes: 42,
    status: "approved",
    author: "atlanta_sarah",
    date: "2024-01-10",
  },
  {
    id: "2",
    title: "Dark mode support",
    description: "Add a dark mode theme option for comfortable nighttime reading.",
    votes: 38,
    status: "under-review",
    author: "mike_atl",
    date: "2024-01-12",
  },
  {
    id: "3",
    title: "Candidate comparison tool",
    description: "Side-by-side comparison of candidates on key issues.",
    votes: 56,
    status: "implemented",
    author: "policy_expert_atl",
    date: "2024-01-05",
  },
]

export default function ContactPage() {
  const [formType, setFormType] = useState("general")
  const [submitted, setSubmitted] = useState(false)
  const [suggestions, setSuggestions] = useState(mockSuggestions)
  const [votedSuggestions, setVotedSuggestions] = useState<Set<string>>(new Set())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleVote = (id: string) => {
    if (votedSuggestions.has(id)) return
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, votes: s.votes + 1 } : s)),
    )
    setVotedSuggestions((prev) => new Set([...prev, id]))
  }

  const getStatusBadge = (status: Suggestion["status"]) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      "under-review": "bg-blue-100 text-blue-800 border-blue-300",
      approved: "bg-green-100 text-green-800 border-green-300",
      implemented: "bg-purple-100 text-purple-800 border-purple-300",
    }
    const labels = {
      pending: "Pending",
      "under-review": "Under Review",
      approved: "Approved",
      implemented: "Implemented",
    }
    return (
      <Badge variant="outline" className={styles[status]}>
        {labels[status]}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Logo size="md" />
          <div>
            <h1 className="text-2xl font-bold text-[#4A4A4A]">Contact & Suggestions</h1>
            <p className="text-[#4A4A4A]/60">Get in touch or help shape the future of MyVote</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="border-[#E5E5E5]">
            <CardHeader>
              <CardTitle className="text-[#4A4A4A]">Send Us a Message</CardTitle>
              <CardDescription>We typically respond within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-[#27AE60] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#4A4A4A]">Message Sent!</h3>
                  <p className="text-[#4A4A4A]/60">Thank you for reaching out. We will get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#4A4A4A]">Inquiry Type</label>
                    <Select value={formType} onValueChange={setFormType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="suggestion">Feature Suggestion</SelectItem>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4A4A4A]">Name</label>
                    <Input placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4A4A4A]">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4A4A4A]">Message</label>
                    <Textarea placeholder="Tell us what's on your mind..." rows={5} />
                  </div>
                  <Button type="submit" className="w-full bg-[#1F3A93] hover:bg-[#1F3A93]/90 text-white">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Community Suggestions */}
          <div className="space-y-6">
            <Card className="border-[#E5E5E5]">
              <CardHeader>
                <CardTitle className="text-[#4A4A4A] flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-[#F39C12]" />
                  Community Suggestions
                </CardTitle>
                <CardDescription>Vote on ideas or suggest your own</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestions
                  .sort((a, b) => b.votes - a.votes)
                  .map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-[#E5E5E5] hover:border-[#3498DB]/30 transition-colors"
                    >
                      <button
                        onClick={() => handleVote(suggestion.id)}
                        disabled={votedSuggestions.has(suggestion.id)}
                        className={`flex flex-col items-center min-w-[48px] p-2 rounded ${
                          votedSuggestions.has(suggestion.id)
                            ? "bg-[#1F3A93]/10 text-[#1F3A93]"
                            : "bg-[#FAFAFA] text-[#4A4A4A] hover:bg-[#1F3A93]/5"
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm font-bold">{suggestion.votes}</span>
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-[#4A4A4A]">{suggestion.title}</h4>
                          {getStatusBadge(suggestion.status)}
                        </div>
                        <p className="text-sm text-[#4A4A4A]/60">{suggestion.description}</p>
                        <p className="text-xs text-[#4A4A4A]/40 mt-1">
                          by @{suggestion.author} on {new Date(suggestion.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Quick Help */}
            <Card className="border-[#E5E5E5]">
              <CardHeader>
                <CardTitle className="text-[#4A4A4A] text-lg">Quick Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-[#F39C12] mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-[#4A4A4A]">Feature ideas?</h4>
                    <p className="text-xs text-[#4A4A4A]/60">Submit a suggestion and let the community vote on it.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Bug className="w-5 h-5 text-[#D64541] mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-[#4A4A4A]">Found a bug?</h4>
                    <p className="text-xs text-[#4A4A4A]/60">Use the contact form with "Bug Report" selected.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Handshake className="w-5 h-5 text-[#27AE60] mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-[#4A4A4A]">Partnership inquiries?</h4>
                    <p className="text-xs text-[#4A4A4A]/60">Select "Partnership" and tell us about your organization.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
