"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Globe, MapPin, User, Home, Vote, Users } from "lucide-react"
import { SearchInput } from "@/components/search-input"
import { Logo } from "@/components/logo"
import { UserNav } from "@/components/user-nav"
import { NotificationBell } from "@/components/notification-bell"

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/elections", icon: Vote, label: "Elections", accent: "text-[#F39C12]" },
  { href: "/news", icon: Globe, label: "News" },
  { href: "/news/local", icon: MapPin, label: "Local" },
  { href: "/discover", icon: Users, label: "Discover" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function NewsNavigation() {
  const pathname = usePathname()

  return (
    <div className="mb-6 rounded-2xl px-4 py-3" style={{ background: "var(--paper-50)", border: "1px solid var(--rule)" }}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link href="/">
          <Logo size="lg" />
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          <SearchInput />
          <NotificationBell />
          <nav className="flex gap-0.5">
            {NAV_ITEMS.map(({ href, icon: Icon, label, accent }) => {
              const active = pathname === href
              return (
                <Link key={href} href={href}>
                  <button
                    className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium`}
                    style={{
                      background: active ? "var(--ink-900)" : "transparent",
                      color: active ? "var(--paper-50)" : "var(--ink-500)",
                    }}
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
