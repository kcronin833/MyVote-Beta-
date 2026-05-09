"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Globe, MapPin, User, Home, Vote, Users, BarChart2 } from "lucide-react"
import { SearchInput } from "@/components/search-input"
import { Logo } from "@/components/logo"
import { UserNav } from "@/components/user-nav"
import { NotificationBell } from "@/components/notification-bell"

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/elections", icon: Vote, label: "Elections", accent: "text-[#F39C12]" },
  { href: "/news", icon: Globe, label: "News" },
  { href: "/news/local", icon: MapPin, label: "Local" },
  { href: "/news/spectrum", icon: BarChart2, label: "National" },
  { href: "/discover", icon: Users, label: "Discover" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function NewsNavigation() {
  const pathname = usePathname()

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Logo size="lg" />
          </Link>
          <span className="text-xl font-bold text-gray-700 hidden sm:block">MyVote</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SearchInput />
          <NotificationBell />
          <nav className="flex gap-0.5">
            {NAV_ITEMS.map(({ href, icon: Icon, label, accent }) => {
              const active = pathname === href
              return (
                <Link key={href} href={href}>
                  <button
                    className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium ${
                      active
                        ? "bg-[#1F3A93]/10 text-[#1F3A93] border-b-2 border-[#1F3A93]"
                        : `text-gray-500 hover:text-gray-800 hover:bg-gray-100 ${accent || ""}`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="leading-none">{label}</span>
                  </button>
                </Link>
              )
            })}
          </nav>
          <UserNav />
        </div>
      </div>
    </div>
  )
}
