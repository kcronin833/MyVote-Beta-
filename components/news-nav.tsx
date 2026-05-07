"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Globe, MapPin, User, Home, Vote } from "lucide-react"
import { SearchInput } from "@/components/search-input"
import { Logo } from "@/components/logo"
import { UserNav } from "@/components/user-nav"

export function NewsNavigation() {
  const pathname = usePathname()

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Logo size="lg" />
          </Link>
          <span className="text-xl font-bold text-gray-700 hidden sm:block">MyVote</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SearchInput />
          <nav className="flex gap-1 flex-wrap">
            <Link href="/">
              <Button size="sm" variant={pathname === "/" ? "default" : "ghost"} className="flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Home</span>
              </Button>
            </Link>
            <Link href="/elections">
              <Button size="sm" variant={pathname === "/elections" ? "default" : "ghost"} className="flex items-center gap-1.5 text-[#F39C12] hover:text-[#E67E22] data-[variant=default]:text-white">
                <Vote className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Elections 2026</span>
              </Button>
            </Link>
            <Link href="/news">
              <Button size="sm" variant={pathname === "/news" ? "default" : "ghost"} className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden md:inline">National</span>
              </Button>
            </Link>
            <Link href="/news/local">
              <Button size="sm" variant={pathname === "/news/local" ? "default" : "ghost"} className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Local</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button size="sm" variant={pathname === "/profile" ? "default" : "ghost"} className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Your Ballot</span>
              </Button>
            </Link>
          </nav>
          <UserNav />
        </div>
      </div>
    </div>
  )
}
