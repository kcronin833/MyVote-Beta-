"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ViewpointLike {
  viewpoint: "left" | "right"
  title: string
  content: string
}

export function PoliticalSpectrumBar() {
  const [viewpointLikes, setViewpointLikes] = useState<ViewpointLike[]>([])
  const [politicalPosition, setPoliticalPosition] = useState<number>(0)

  useEffect(() => {
    const likes = JSON.parse(localStorage.getItem("viewpointLikes") || "[]")
    setViewpointLikes(likes)

    // Calculate political position percentage
    if (likes.length > 0) {
      const leftLikes = likes.filter((like: ViewpointLike) => like.viewpoint === "left").length
      const rightLikes = likes.filter((like: ViewpointLike) => like.viewpoint === "right").length
      const totalLikes = leftLikes + rightLikes

      if (totalLikes > 0) {
        // Calculate percentage: 0% = far left, 50% = center, 100% = far right
        const percentage = (rightLikes / totalLikes) * 100
        setPoliticalPosition(percentage)
      }
    }
  }, [])

  const getPositionLabel = (percentage: number) => {
    if (percentage < 20) return "Very Progressive"
    if (percentage < 40) return "Progressive"
    if (percentage < 60) return "Moderate"
    if (percentage < 80) return "Conservative"
    return "Very Conservative"
  }

  const getPositionColor = (percentage: number) => {
    if (percentage < 20) return "text-red-700"
    if (percentage < 40) return "text-red-500"
    if (percentage < 60) return "text-purple-600"
    if (percentage < 80) return "text-blue-500"
    return "text-blue-700"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Your Political Position
        </CardTitle>
        <CardDescription>Based on your liked viewpoints</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {viewpointLikes.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-sm text-muted-foreground">Like viewpoints in the news feed to see where you stand</p>
            <a
              href="/news"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Go to news feed →
            </a>
          </div>
        ) : (
        <>
        {/* Political Position Percentage */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${getPositionColor(politicalPosition)}`}>
            {Math.round(politicalPosition)}%
          </div>
          <div className={`text-lg font-medium ${getPositionColor(politicalPosition)}`}>
            {getPositionLabel(politicalPosition)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Based on {viewpointLikes.length} liked viewpoints</div>
        </div>

        {/* Spectrum Bar */}
        <div className="relative">
          <div className="h-8 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 rounded-lg"></div>
          <div
            className="absolute top-0 w-1 h-8 bg-card border-2 border-gray-800 rounded transition-all duration-300"
            style={{ left: `${politicalPosition}%`, transform: "translateX(-50%)" }}
          ></div>
        </div>

        {/* Scale Labels */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0% Progressive</span>
          <span>50% Moderate</span>
          <span>100% Conservative</span>
        </div>

        {/* Recent Viewpoint Likes */}
        {viewpointLikes.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-foreground mb-3">Recent Viewpoint Likes</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {viewpointLikes
                .slice(-5)
                .reverse()
                .map((like, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-paper-50 rounded">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        like.viewpoint === "left"
                          ? "bg-red-100 text-red-800 border-red-300"
                          : "bg-blue-100 text-blue-800 border-blue-300"
                      }`}
                    >
                      {like.viewpoint === "left" ? "Left" : "Right"}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{like.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{like.content}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        </>
        )}
      </CardContent>
    </Card>
  )
}
