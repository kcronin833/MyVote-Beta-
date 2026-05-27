"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, TrendingUp, Users, Vote, Heart } from "lucide-react"
import { useState } from "react"
import { type CompatibilityScore as CompatibilityScoreType, getCompatibilityLevel } from "@/lib/compatibility-service"

interface CompatibilityScoreProps {
  politicianName: string
  score: CompatibilityScoreType
  compact?: boolean
}

interface CompatibilityScoreSimpleProps {
  compatibility: CompatibilityScoreType
  mode?: "compact" | "full"
}

export function CompatibilityScore({ compatibility, mode = "compact" }: CompatibilityScoreSimpleProps) {
  const level = getCompatibilityLevel(compatibility.overall)

  if (mode === "compact") {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={level.color}>
          {compatibility.overall}% Match
        </Badge>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={level.color}>
          {compatibility.overall}% Match
        </Badge>
        <span className="text-sm text-muted-foreground">{level.level}</span>
      </div>
      <p className="text-xs text-muted-foreground">{level.description}</p>
    </div>
  )
}

export function CompatibilityScoreComponent({ politicianName, score, compact = false }: CompatibilityScoreProps) {
  const [showDetails, setShowDetails] = useState(false)
  const compatibility = getCompatibilityLevel(score.overall)

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={compatibility.color}>
          {score.overall}% Match
        </Badge>
        <span className="text-sm text-muted-foreground">{compatibility.level}</span>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Compatibility with {politicianName}
            </CardTitle>
            <CardDescription>Based on your political engagement and preferences</CardDescription>
          </div>
          <Badge variant="outline" className={`${compatibility.color} text-lg px-3 py-1`}>
            {score.overall}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Compatibility */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Overall Compatibility</span>
            <span className="text-sm text-muted-foreground">{compatibility.level}</span>
          </div>
          <Progress value={score.overall} className="h-3" />
          <p className="text-sm text-muted-foreground">{compatibility.description}</p>
        </div>

        <Separator />

        {/* Breakdown Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Vote className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Political Alignment</span>
            </div>
            <Progress value={score.politicalAlignment} className="h-2" />
            <span className="text-xs text-muted-foreground">{score.politicalAlignment}%</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Issue Alignment</span>
            </div>
            <Progress value={score.issueAlignment} className="h-2" />
            <span className="text-xs text-muted-foreground">{score.issueAlignment}%</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Engagement Similarity</span>
            </div>
            <Progress value={score.engagementSimilarity} className="h-2" />
            <span className="text-xs text-muted-foreground">{score.engagementSimilarity}%</span>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-paper-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Key Insights</h4>
          <div className="space-y-1 text-sm">
            {score.breakdown.sharedIssues.length > 0 && (
              <p className="text-green-700">
                ✓ Shared interest in {score.breakdown.sharedIssues.slice(0, 2).join(", ")}
              </p>
            )}
            {score.breakdown.alignedVotes > 0 && (
              <p className="text-blue-700">
                ✓ Aligned on {score.breakdown.alignedVotes} of {score.breakdown.totalVotes} key votes
              </p>
            )}
            {score.breakdown.conflictingIssues.length > 0 && (
              <p className="text-red-700">
                ⚠ Different views on {score.breakdown.conflictingIssues.slice(0, 1).join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Detailed Breakdown Toggle */}
        <Button variant="outline" onClick={() => setShowDetails(!showDetails)} className="w-full">
          {showDetails ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Show Detailed Analysis
            </>
          )}
        </Button>

        {/* Detailed Analysis */}
        {showDetails && (
          <div className="space-y-4 pt-4 border-t">
            {score.breakdown.reasonsForMatch.length > 0 && (
              <div>
                <h5 className="font-medium text-green-700 mb-2">Why You Match</h5>
                <ul className="space-y-1">
                  {score.breakdown.reasonsForMatch.map((reason, index) => (
                    <li key={index} className="text-sm text-green-600 flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {score.breakdown.reasonsForMismatch.length > 0 && (
              <div>
                <h5 className="font-medium text-red-700 mb-2">Areas of Difference</h5>
                <ul className="space-y-1">
                  {score.breakdown.reasonsForMismatch.map((reason, index) => (
                    <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {score.breakdown.sharedIssues.length > 0 && (
              <div>
                <h5 className="font-medium text-blue-700 mb-2">Shared Issues</h5>
                <div className="flex flex-wrap gap-2">
                  {score.breakdown.sharedIssues.map((issue, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {issue}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
