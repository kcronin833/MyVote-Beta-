"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Globe, MapPin, User, Home } from "lucide-react"
import { SearchInput } from "@/components/search-input"
import { Logo } from "@/components/logo"
import { UserNav } from "@/components/user-nav"

export function NewsNavigation() {
  const pathname = usePathname()

  return (
    <div className="mb-8">
      <Link href="/">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Link>

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Logo size="lg" />
            <span className="text-2xl font-bold text-gray-700">News Feed</span>
          </div>
          <p className="text-gray-600">Stay informed with balanced news coverage</p>
        </div>

        <div className="flex items-center gap-4">
          <SearchInput />
          <div className="flex gap-2">
            <Link href="/">
              <Button variant={pathname === "/" ? "default" : "outline"} className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <Link href="/news">
              <Button variant={pathname === "/news" ? "default" : "outline"} className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                National
              </Button>
            </Link>
            <Link href="/news/local">
              <Button variant={pathname === "/news/local" ? "default" : "outline"} className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Local
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant={pathname === "/profile" ? "default" : "outline"} className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Your Ballot
              </Button>
            </Link>
          </div>
          <UserNav />
        </div>
      </div>
    </div>
  )
}
