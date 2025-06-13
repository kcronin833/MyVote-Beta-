import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper, Users, MapPin, User } from "lucide-react"
import { Logo, LogoIcon } from "@/components/logo"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <LogoIcon size="xl" />
          </div>
          <Logo size="xl" className="mb-4" />
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your gateway to politically balanced news and local updates. Get perspectives from across the political
            spectrum in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/news">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                <Newspaper className="w-5 h-5 mr-2" />
                National News
              </Button>
            </Link>
            <Link href="/news/local">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-2">
                <MapPin className="w-5 h-5 mr-2" />
                Local News
              </Button>
            </Link>
            <Link href="/profile">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-2">
                <User className="w-5 h-5 mr-2" />
                Political Profile
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mt-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-2">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-red-600">Left Perspective</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Progressive viewpoints and liberal commentary on current events</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-gray-100 p-3 rounded-full w-fit mb-2">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <CardTitle className="text-gray-600">Just the Facts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Objective reporting and factual analysis without political bias</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-2">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-green-600">Right Perspective</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Conservative viewpoints and traditional values commentary</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit mb-2">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-blue-600">Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>View your representatives, districts, and voting information</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
