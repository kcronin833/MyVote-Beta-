"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Clock, TrendingUp, MessageCircle } from "lucide-react"
import { NewsNavigation } from "@/components/news-nav"
import { CommentSystem } from "@/components/comment-system"
import { AIFactualNews } from "@/components/ai-factual-news"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const sampleNews = {
  left: [
    {
      title: "Progressive Policy Gains Support in Latest Poll",
      url: "https://www.huffpost.com/entry/progressive-policies-polling_n_5f8a1234e4b0c5b1f8d9e123",
      description: "New polling data shows increasing support for progressive initiatives across key demographics.",
      time: "2 hours ago",
      trending: true,
      source: "HuffPost",
    },
    {
      title: "Climate Action Rally Draws Thousands to Capitol",
      url: "https://www.motherjones.com/environment/2024/01/climate-rally-capitol-thousands/",
      description:
        "Environmental activists gather to demand stronger climate legislation and renewable energy investments.",
      time: "4 hours ago",
      trending: false,
      source: "Mother Jones",
    },
    {
      title: "Healthcare Reform Advocates Push for Universal Coverage",
      url: "https://www.thenation.com/article/politics/healthcare-universal-coverage-reform/",
      description: "Coalition of healthcare advocates presents comprehensive plan for universal healthcare system.",
      time: "6 hours ago",
      trending: false,
      source: "The Nation",
    },
    {
      title: "Workers' Rights Movement Gains Momentum Across States",
      url: "https://www.commondreams.org/news/workers-rights-movement-states",
      description:
        "Labor organizers report increased union activity and worker protection legislation in multiple states.",
      time: "8 hours ago",
      trending: false,
      source: "Common Dreams",
    },
  ],
  right: [
    {
      title: "Tax Reform Proposal Backed by Conservative Coalition",
      url: "https://www.foxnews.com/politics/tax-reform-proposal-conservative-coalition-support",
      description: "Business leaders and conservative lawmakers unite behind comprehensive tax reduction plan.",
      time: "1 hour ago",
      trending: true,
      source: "Fox News",
    },
    {
      title: "Second Amendment Debate Intensifies in State Legislatures",
      url: "https://www.dailywire.com/news/second-amendment-debate-state-legislatures-gun-rights",
      description: "Gun rights advocates mobilize as several states consider new firearms legislation.",
      time: "3 hours ago",
      trending: false,
      source: "The Daily Wire",
    },
    {
      title: "Traditional Values Coalition Launches Education Initiative",
      url: "https://www.washingtonexaminer.com/policy/education/traditional-values-education-initiative",
      description: "Conservative groups announce new program to promote traditional family values in schools.",
      time: "7 hours ago",
      trending: false,
      source: "Washington Examiner",
    },
    {
      title: "Border Security Measures Show Positive Results",
      url: "https://www.breitbart.com/politics/2024/01/border-security-measures-positive-results/",
      description: "New data shows decreased illegal crossings following implementation of enhanced border policies.",
      time: "10 hours ago",
      trending: false,
      source: "Breitbart",
    },
  ],
}

const perspectives = [
  { key: "left", label: "Left", color: "bg-red-500 hover:bg-red-600", activeColor: "bg-red-500" },
  { key: "facts", label: "Just the Facts", color: "bg-gray-500 hover:bg-gray-600", activeColor: "bg-gray-500" },
  { key: "right", label: "Right", color: "bg-green-500 hover:bg-green-600", activeColor: "bg-green-500" },
]

export default function NewsFeed() {
  const [selectedTab, setSelectedTab] = useState("facts")

  const currentPerspective = perspectives.find((p) => p.key === selectedTab)

  const renderRegularNews = (newsArray: typeof sampleNews.left) => (
    <div className="grid gap-4">
      {newsArray.map((article, i) => (
        <Card key={i} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">{article.time}</span>
                  <Badge variant="outline" className="text-xs">
                    {article.source}
                  </Badge>
                  {article.trending && (
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg mb-2 hover:text-blue-600 cursor-pointer">
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {article.title}
                  </a>
                </CardTitle>
                <CardDescription className="text-sm">{article.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                  Read Full Article
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Discuss
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-left">{article.title}</DialogTitle>
                  </DialogHeader>
                  <CommentSystem articleUrl={article.url} articleTitle={article.title} />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <NewsNavigation />

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {perspectives.map((perspective) => (
            <Button
              key={perspective.key}
              onClick={() => setSelectedTab(perspective.key)}
              className={`${
                selectedTab === perspective.key
                  ? `${perspective.activeColor} text-white`
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {perspective.label}
            </Button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <Badge variant="outline" className="text-sm">
              {currentPerspective?.label} Perspective
            </Badge>
          </div>

          {selectedTab === "facts" ? (
            <AIFactualNews />
          ) : (
            renderRegularNews(sampleNews[selectedTab as keyof typeof sampleNews])
          )}
        </div>
      </div>
    </div>
  )
}
