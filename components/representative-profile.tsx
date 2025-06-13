"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, GraduationCap, Briefcase, Users, Phone, Mail, Twitter, Facebook, Globe } from "lucide-react"

interface Representative {
  name: string
  party: "Democrat" | "Republican" | "Independent"
  office: string
  district?: string
  photo: string
  coverPhoto: string
  politicalScore: number // -100 (far left) to +100 (far right)
  yearsInOffice: number
  contact: {
    phone: string
    email: string
    website?: string
    twitter?: string
    facebook?: string
  }
  biography: {
    age: number
    hometown: string
    education: string[]
    previousJobs: string[]
    committees: string[]
    keyIssues: string[]
  }
  votingRecord: {
    totalVotes: number
    partyLineVoting: number
    keyVotes: Array<{
      bill: string
      vote: "Yes" | "No" | "Abstain"
      description: string
      date: string
    }>
  }
}

interface RepresentativeProfileProps {
  representative: Representative
}

export function RepresentativeProfile({ representative }: RepresentativeProfileProps) {
  const getPartyColor = (party: string) => {
    switch (party) {
      case "Democrat":
        return "bg-blue-500"
      case "Republican":
        return "bg-red-500"
      case "Independent":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPoliticalPosition = (score: number) => {
    if (score < -60) return { label: "Very Liberal", color: "bg-blue-700" }
    if (score < -30) return { label: "Liberal", color: "bg-blue-500" }
    if (score < -10) return { label: "Lean Left", color: "bg-blue-300" }
    if (score <= 10) return { label: "Moderate", color: "bg-gray-500" }
    if (score <= 30) return { label: "Lean Right", color: "bg-red-300" }
    if (score <= 60) return { label: "Conservative", color: "bg-red-500" }
    return { label: "Very Conservative", color: "bg-red-700" }
  }

  const politicalPosition = getPoliticalPosition(representative.politicalScore)

  return (
    <Card className="overflow-hidden">
      {/* Cover Photo */}
      <div
        className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative"
        style={{
          backgroundImage: `url(${representative.coverPhoto})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>

      {/* Profile Header */}
      <CardHeader className="relative pb-4">
        <div className="flex flex-col sm:flex-row gap-4 -mt-16 relative z-10">
          <div className="relative">
            <img
              src={representative.photo || "/placeholder.svg"}
              alt={representative.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div
              className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${getPartyColor(representative.party)} border-2 border-white flex items-center justify-center`}
            >
              <span className="text-white text-xs font-bold">{representative.party.charAt(0)}</span>
            </div>
          </div>

          <div className="flex-1 pt-16 sm:pt-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{representative.name}</h2>
                <p className="text-lg text-gray-600">{representative.office}</p>
                {representative.district && <p className="text-sm text-gray-500">{representative.district}</p>}
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{representative.biography.hometown}</span>
                  <Calendar className="w-4 h-4 text-gray-400 ml-2" />
                  <span className="text-sm text-gray-600">{representative.yearsInOffice} years in office</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Badge variant="outline" className={`${getPartyColor(representative.party)} text-white border-0`}>
                  {representative.party}
                </Badge>
                <Badge variant="outline" className={`${politicalPosition.color} text-white border-0`}>
                  {politicalPosition.label}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Political Spectrum Indicator */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Very Liberal</span>
            <span>Moderate</span>
            <span>Very Conservative</span>
          </div>
          <div className="relative h-3 bg-gradient-to-r from-blue-600 via-gray-300 to-red-600 rounded-full">
            <div
              className="absolute top-0 w-4 h-4 bg-white border-2 border-gray-800 rounded-full transform -translate-y-0.5"
              style={{
                left: `${((representative.politicalScore + 100) / 200) * 100}%`,
                transform: "translateX(-50%) translateY(-2px)",
              }}
            />
          </div>
          <div className="text-center mt-2">
            <span className="text-sm font-medium">
              Political Score: {representative.politicalScore > 0 ? "+" : ""}
              {representative.politicalScore}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{representative.contact.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{representative.contact.email}</span>
            </div>
            {representative.contact.website && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-gray-400" />
                <a
                  href={representative.contact.website}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Official Website
                </a>
              </div>
            )}
            <div className="flex gap-2">
              {representative.contact.twitter && (
                <Button size="sm" variant="outline" asChild>
                  <a href={representative.contact.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {representative.contact.facebook && (
                <Button size="sm" variant="outline" asChild>
                  <a href={representative.contact.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Education & Background */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Education & Background
          </h3>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm text-gray-700">Education</h4>
              <ul className="text-sm text-gray-600 mt-1">
                {representative.biography.education.map((edu, index) => (
                  <li key={index}>• {edu}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-700">Previous Experience</h4>
              <ul className="text-sm text-gray-600 mt-1">
                {representative.biography.previousJobs.map((job, index) => (
                  <li key={index}>• {job}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator />

        {/* Committee Memberships */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Committee Memberships
          </h3>
          <div className="flex flex-wrap gap-2">
            {representative.biography.committees.map((committee, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {committee}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Key Issues */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Key Policy Focus Areas</h3>
          <div className="flex flex-wrap gap-2">
            {representative.biography.keyIssues.map((issue, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {issue}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Voting Record */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Voting Record
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{representative.votingRecord.totalVotes}</div>
              <div className="text-sm text-gray-600">Total Votes</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{representative.votingRecord.partyLineVoting}%</div>
              <div className="text-sm text-gray-600">Party Line Voting</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700">Recent Key Votes</h4>
            {representative.votingRecord.keyVotes.slice(0, 3).map((vote, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{vote.bill}</span>
                  <Badge
                    variant={vote.vote === "Yes" ? "default" : vote.vote === "No" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {vote.vote}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-1">{vote.description}</p>
                <p className="text-xs text-gray-400">{vote.date}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
