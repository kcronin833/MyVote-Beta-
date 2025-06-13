"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Clock, MapPin, Building, Calendar, Users } from "lucide-react"
import { NewsNavigation } from "@/components/news-nav"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const localNews = {
  "San Francisco, CA": [
    {
      title: "City Council Approves New Housing Development in Mission District",
      url: "https://www.sfgate.com/bayarea/article/san-francisco-mission-housing-development-approved-18234567.php",
      description:
        "The San Francisco City Council approved a new affordable housing development in the Mission District that will provide 200 units.",
      time: "3 hours ago",
      category: "Government",
      icon: Building,
      source: "SF Gate",
    },
    {
      title: "Local Tech Company Announces 200 New Jobs in SOMA",
      url: "https://www.bizjournals.com/sanfrancisco/news/2024/01/15/tech-company-hiring-soma-jobs.html",
      description:
        "A San Francisco-based tech company plans to hire 200 new employees over the next six months in their SOMA headquarters.",
      time: "5 hours ago",
      category: "Business",
      icon: Users,
      source: "San Francisco Business Times",
    },
    {
      title: "Weekend Arts Festival to Close Downtown Streets",
      url: "https://www.sfchronicle.com/entertainment/article/sf-arts-festival-street-closures-weekend-18234890.php",
      description:
        "The annual Arts Festival will close several downtown streets this weekend. Check alternate routes and public transit options.",
      time: "1 day ago",
      category: "Events",
      icon: Calendar,
      source: "SF Chronicle",
    },
    {
      title: "Golden Gate Park Renovation Project Begins Phase Two",
      url: "https://www.kqed.org/news/11945678/golden-gate-park-renovation-phase-two-begins",
      description:
        "The second phase of Golden Gate Park's major renovation includes new playground equipment and improved accessibility features.",
      time: "2 days ago",
      category: "Government",
      icon: Building,
      source: "KQED",
    },
  ],
  "Austin, TX": [
    {
      title: "City Expands Public Transportation Routes to East Austin",
      url: "https://www.austinmonitor.com/stories/2024/01/capmetro-expands-routes-east-austin/",
      description:
        "Austin's transit authority announced five new bus routes to serve growing neighborhoods in East Austin.",
      time: "4 hours ago",
      category: "Government",
      icon: Building,
      source: "Austin Monitor",
    },
    {
      title: "Local Startup Secures $10M in Series A Funding",
      url: "https://www.bizjournals.com/austin/news/2024/01/14/austin-startup-series-a-funding-renewable-energy.html",
      description:
        "An Austin-based startup focused on renewable energy storage has secured $10 million in Series A funding from local investors.",
      time: "1 day ago",
      category: "Business",
      icon: Users,
      source: "Austin Business Journal",
    },
    {
      title: "South by Southwest Announces Lineup for March Event",
      url: "https://www.austinchronicle.com/music/2024-01-12/sxsw-2024-lineup-announcement/",
      description:
        "The popular Austin music and tech festival has announced its full lineup for the March 2024 event, featuring over 2,000 performers.",
      time: "2 days ago",
      category: "Events",
      icon: Calendar,
      source: "Austin Chronicle",
    },
    {
      title: "Austin-Bergstrom Airport Adds New International Routes",
      url: "https://www.kvue.com/article/travel/austin-airport-new-international-routes-2024/269-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      description:
        "Austin-Bergstrom International Airport announced three new direct international routes starting this summer.",
      time: "3 days ago",
      category: "Business",
      icon: Users,
      source: "KVUE",
    },
  ],
  "Chicago, IL": [
    {
      title: "City Announces $500M Infrastructure Improvement Plan",
      url: "https://www.chicagotribune.com/politics/ct-chicago-infrastructure-plan-500-million-20240115-story.html",
      description:
        "Chicago officials unveiled a $500 million plan to repair roads, bridges, and water systems over the next three years.",
      time: "6 hours ago",
      category: "Government",
      icon: Building,
      source: "Chicago Tribune",
    },
    {
      title: "Local Restaurant Chain Expands to Three Suburban Locations",
      url: "https://chicago.eater.com/2024/1/14/24038567/chicago-restaurant-chain-suburban-expansion",
      description:
        "A popular Chicago restaurant chain is opening three new locations in Evanston, Oak Park, and Schaumburg this spring.",
      time: "1 day ago",
      category: "Business",
      icon: Users,
      source: "Eater Chicago",
    },
    {
      title: "Lakefront Summer Concert Series Schedule Released",
      url: "https://www.timeout.com/chicago/music/chicago-lakefront-summer-concerts-2024",
      description:
        "The annual free concert series at Millennium Park will begin next month with performances by local jazz and blues artists.",
      time: "3 days ago",
      category: "Events",
      icon: Calendar,
      source: "Time Out Chicago",
    },
    {
      title: "Chicago Public Schools Announces New STEM Initiative",
      url: "https://www.chalkbeat.org/chicago/2024/01/12/cps-stem-initiative-technology-funding/",
      description:
        "CPS will launch a new STEM education program in 50 schools, focusing on coding, robotics, and environmental science.",
      time: "4 days ago",
      category: "Government",
      icon: Building,
      source: "Chalkbeat Chicago",
    },
  ],
}

const locations = Object.keys(localNews)

const categories = [
  { value: "all", label: "All Categories" },
  { value: "Government", label: "Government" },
  { value: "Business", label: "Business" },
  { value: "Events", label: "Events" },
]

export default function LocalNewsFeed() {
  const [selectedLocation, setSelectedLocation] = useState("San Francisco, CA")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredNews = localNews[selectedLocation as keyof typeof localNews].filter(
    (article) => selectedCategory === "all" || article.category === selectedCategory,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <NewsNavigation />

        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <Badge variant="outline" className="text-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {selectedLocation}
            </Badge>
          </div>

          <div className="grid gap-4">
            {filteredNews.map((article, i) => {
              const Icon = article.icon
              return (
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
                          <Badge variant="secondary" className="text-xs">
                            <Icon className="w-3 h-3 mr-1" />
                            {article.category}
                          </Badge>
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
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center"
                      >
                        Read Full Article
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
