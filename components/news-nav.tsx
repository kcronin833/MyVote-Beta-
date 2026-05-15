"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Globe, MapPin, User, Home, Vote, Users, Search } from "lucide-react"
import { SearchInput } from "@/components/search-input"
import { Logo } from "@/components/logo"
import { UserNav } from "@/components/user-nav"
import { NotificationBell } from "@/components/notification-bell"

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home", helper: "Feed" },
  { href: "/news/local", icon: MapPin, label: "Local", helper: "Near you" },
  { href: "/elections", icon: Vote, label: "Elections", helper: "Ballot" },
  { href: "/discover", icon: Users, label: "Community", helper: "People" },
  { href: "/news/spectrum", icon: Globe, label: "News", helper: "All sides" },
  { href: "/profile", icon: User, label: "Profile", helper: "You" },
]

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  if (href === "/news/spectrum") return pathname === "/news" || pathname.startsWith("/news/spectrum")
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function NewsNavigation() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 -mx-4 mb-6 px-4 pt-3 pb-3 backdrop-blur-xl">
      <div className="community-card mx-auto max-w-6xl rounded-[1.6rem] p-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="shrink-0">
            <Logo size="md" />
          </Link>

          <div className="hidden min-w-[220px] max-w-sm flex-1 md:block">
            <SearchInput />
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell />
            <UserNav />
          </div>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV_ITEMS.map(({ href, icon: Icon, label, helper }) => {
            const active = isActive(pathname, href)

            return (
              <Link
                key={href}
                href={href}
                className="inline-flex min-w-fit items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{
                  background: active ? "var(--civic-blue)" : "rgba(255,253,248,0.72)",
                  color: active ? "white" : "var(--ink-700)",
                  border: active ? "1px solid transparent" : "1px solid var(--rule)",
                  boxShadow: active ? "0 10px 24px rgba(34,60,117,0.18)" : "none",
                }}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                <span
                  className="hidden text-[10px] font-medium opacity-70 lg:inline"
                  style={{ color: active ? "rgba(255,255,255,0.76)" : "var(--ink-500)" }}
                >
                  {helper}
                </span>
              </Link>
            )
          })}
        </div>

        <div className="mt-2 flex items-center gap-2 rounded-full px-3 py-2 md:hidden"
          style={{ background: "rgba(255,253,248,0.58)", border: "1px solid var(--rule)" }}>
          <Search className="h-4 w-4" style={{ color: "var(--ink-500)" }} />
          <span className="text-sm" style={{ color: "var(--ink-500)" }}>
            Search people, issues, races, or stories
          </span>
        </div>
      </div>
    </header>
  )
}