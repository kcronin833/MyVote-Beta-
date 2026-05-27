import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Crown,
  DollarSign,
  Award,
  Briefcase,
  FileText,
  Calendar,
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Globe,
} from "lucide-react"

export interface CandidateDetailProps {
  candidate: {
    name: string
    party: "Democrat" | "Republican" | "Independent" | "Green" | "Libertarian"
    isIncumbent: boolean
    photo: string
    website?: string
    experience: string[]
    keyIssues: string[]
    endorsements: string[]
    fundraising: {
      totalRaised: string
      lastQuarter: string
    }
    // Extended properties for detailed view
    bio?: string
    age?: number
    education?: string[]
    hometown?: string
    family?: string
    previousElections?: Array<{
      year: string
      office: string
      result: string
      votePercentage: number
    }>
    positions?: Array<{
      issue: string
      stance: string
      description: string
    }>
    votingRecord?: Array<{
      bill: string
      vote: "Yes" | "No" | "Abstain" | "Not in office"
      date: string
      description: string
    }>
    endorsementDetails?: Array<{
      organization: string
      type: string
      quote?: string
    }>
    campaignFinance?: {
      totalRaised: string
      totalSpent: string
      cashOnHand: string
      averageDonation: string
      smallDonorPercentage: string
      topIndustries: Array<{
        name: string
        amount: string
      }>
    }
    socialMedia?: {
      twitter?: string
      facebook?: string
      instagram?: string
      youtube?: string
    }
    contactInfo?: {
      email?: string
      phone?: string
      campaignOffice?: string
    }
    events?: Array<{
      name: string
      date: string
      location: string
      description: string
    }>
  }
  office: string
  electionDate: string
}

export function CandidateProfileDetail({ candidate, office, electionDate, ...props }: CandidateDetailProps) {
  const getPartyColor = (party: string) => {
    switch (party) {
      case "Democrat":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Republican":
        return "bg-red-100 text-red-800 border-red-200"
      case "Independent":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Green":
        return "bg-green-100 text-green-800 border-green-200"
      case "Libertarian":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-paper-100 text-foreground border-rule"
    }
  }

  const getPartyBgColor = (party: string) => {
    switch (party) {
      case "Democrat":
        return "bg-blue-600"
      case "Republican":
        return "bg-red-600"
      case "Independent":
        return "bg-purple-600"
      case "Green":
        return "bg-green-600"
      case "Libertarian":
        return "bg-yellow-600"
      default:
        return "bg-foreground/50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Candidate Header */}
      <div className="relative">
        <div className={`h-32 ${getPartyBgColor(candidate.party)} opacity-20 rounded-t-lg`}></div>
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={candidate.photo || "/placeholder.svg"} alt={candidate.name} />
              <AvatarFallback className="text-2xl">
                {candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white drop-shadow-md">{candidate.name}</h2>
                {candidate.isIncumbent && (
                  <Badge className="bg-blue-600">
                    <Crown className="w-3 h-3 mr-1" />
                    Incumbent
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={`${getPartyColor(candidate.party)}`}>
                  {candidate.party}
                </Badge>
                <span className="text-sm text-white drop-shadow-md">Candidate for {office}</span>
              </div>
            </div>
          </div>
          {candidate.website && (
            <Button variant="outline" size="sm" className="bg-card" asChild>
              <a href={candidate.website} target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4 mr-1" />
                Campaign Website
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Candidate Details */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="endorsements">Endorsements</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="col-span-2">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">About {candidate.name}</h3>
                <p className="text-foreground mb-4">{candidate.bio || "No detailed biography available."}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {candidate.age && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Age</h4>
                      <p>{candidate.age}</p>
                    </div>
                  )}
                  {candidate.hometown && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Hometown</h4>
                      <p>{candidate.hometown}</p>
                    </div>
                  )}
                  {candidate.family && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Family</h4>
                      <p>{candidate.family}</p>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-2">Key Issues</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {candidate.keyIssues.map((issue, i) => (
                    <Badge key={i} variant="secondary">
                      {issue}
                    </Badge>
                  ))}
                </div>

                {candidate.education && candidate.education.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold mb-2">Education</h3>
                    <ul className="list-disc pl-5 mb-4">
                      {candidate.education.map((edu, i) => (
                        <li key={i} className="text-foreground">
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Election Info
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Election Date</h4>
                      <p>{electionDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Office</h4>
                      <p>{office}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {candidate.contactInfo && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      {candidate.contactInfo.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <a href={`mailto:${candidate.contactInfo.email}`} className="text-blue-600 hover:underline">
                            {candidate.contactInfo.email}
                          </a>
                        </div>
                      )}
                      {candidate.contactInfo.phone && (
                        <div className="flex items-center gap-2">
                          <span className="text-foreground">{candidate.contactInfo.phone}</span>
                        </div>
                      )}
                      {candidate.contactInfo.campaignOffice && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{candidate.contactInfo.campaignOffice}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {candidate.socialMedia && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      Social Media
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.socialMedia.twitter && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={candidate.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {candidate.socialMedia.facebook && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={candidate.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                            <Facebook className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {candidate.socialMedia.instagram && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={candidate.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                            <Instagram className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {candidate.socialMedia.youtube && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={candidate.socialMedia.youtube} target="_blank" rel="noopener noreferrer">
                            <Youtube className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {candidate.events && candidate.events.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Upcoming Events
                </h3>
                <div className="space-y-3">
                  {candidate.events.map((event, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{event.name}</h4>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                        <Badge variant="outline">{event.date}</Badge>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Positions Tab */}
        <TabsContent value="positions" className="space-y-4">
          {candidate.positions && candidate.positions.length > 0 ? (
            <div className="space-y-4">
              {candidate.positions.map((position, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{position.issue}</h3>
                      <Badge>{position.stance}</Badge>
                    </div>
                    <p className="text-foreground">{position.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No detailed positions available</h3>
                <p className="text-muted-foreground">
                  We don't have detailed position information for this candidate yet. Check their campaign website for
                  more information.
                </p>
                {candidate.website && (
                  <Button className="mt-4" asChild>
                    <a href={candidate.website} target="_blank" rel="noopener noreferrer">
                      Visit Campaign Website
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Professional Experience
              </h3>
              <ul className="list-disc pl-5 mb-4">
                {candidate.experience.map((exp, i) => (
                  <li key={i} className="text-foreground mb-2">
                    {exp}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {candidate.previousElections && candidate.previousElections.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Previous Elections
                </h3>
                <div className="space-y-3">
                  {candidate.previousElections.map((election, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            {election.year} - {election.office}
                          </h4>
                          <p className="text-sm text-muted-foreground">{election.result}</p>
                        </div>
                        <Badge
                          variant={election.result.includes("Won") ? "default" : "secondary"}
                          className={election.result.includes("Won") ? "bg-green-600" : ""}
                        >
                          {election.votePercentage}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {candidate.votingRecord && candidate.votingRecord.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Voting Record
                </h3>
                <div className="space-y-3">
                  {candidate.votingRecord.map((record, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{record.bill}</h4>
                          <p className="text-sm text-muted-foreground">{record.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{record.date}</p>
                        </div>
                        <Badge
                          variant={
                            record.vote === "Yes" ? "default" : record.vote === "No" ? "destructive" : "secondary"
                          }
                        >
                          {record.vote}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Endorsements Tab */}
        <TabsContent value="endorsements" className="space-y-4">
          {candidate.endorsementDetails && candidate.endorsementDetails.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {candidate.endorsementDetails.map((endorsement, i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-2">
                        <Award className="w-5 h-5 text-yellow-500 mt-1" />
                        <div>
                          <h3 className="font-semibold">{endorsement.organization}</h3>
                          <p className="text-sm text-muted-foreground">{endorsement.type}</p>
                          {endorsement.quote && <p className="text-sm italic mt-2">"{endorsement.quote}"</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Endorsements</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.endorsements.map((endorsement, i) => (
                    <Badge key={i} variant="outline" className="text-sm">
                      {endorsement}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Finances Tab */}
        <TabsContent value="finances" className="space-y-4">
          {candidate.campaignFinance ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Campaign Finances
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Total Raised</h4>
                      <p className="text-lg font-bold text-green-600">{candidate.campaignFinance.totalRaised}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Total Spent</h4>
                      <p className="text-lg font-bold text-red-600">{candidate.campaignFinance.totalSpent}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Cash on Hand</h4>
                      <p className="text-lg font-bold">{candidate.campaignFinance.cashOnHand}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Average Donation</h4>
                      <p>{candidate.campaignFinance.averageDonation}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Small Donor Percentage</h4>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={Number.parseInt(candidate.campaignFinance.smallDonorPercentage)}
                        className="h-2"
                      />
                      <span className="text-sm">{candidate.campaignFinance.smallDonorPercentage}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">Top Industries</h3>
                  <div className="space-y-3">
                    {candidate.campaignFinance.topIndustries.map((industry, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span>{industry.name}</span>
                        <span className="font-medium">{industry.amount}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Campaign Finances
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Total Raised</h4>
                    <p className="text-lg font-bold text-green-600">{candidate.fundraising.totalRaised}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Last Quarter</h4>
                    <p className="text-lg font-bold">{candidate.fundraising.lastQuarter}</p>
                  </div>
                </div>
                <div className="mt-4 text-center text-muted-foreground text-sm">
                  <p>Detailed campaign finance information is not available.</p>
                  <p>
                    Visit the{" "}
                    <a
                      href="https://www.fec.gov/data/candidates/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      FEC website
                    </a>{" "}
                    for more information.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function CandidateProfileDialog({
  candidate,
  office,
  electionDate,
  open,
  onOpenChange,
}: CandidateDetailProps & {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Candidate Profile: {candidate.name}</DialogTitle>
        </DialogHeader>
        <CandidateProfileDetail candidate={candidate} office={office} electionDate={electionDate} />
      </DialogContent>
    </Dialog>
  )
}
