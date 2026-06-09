"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Globe, MapPin } from "lucide-react"

/* ── News section sub-nav ────────────────────────────────────────────────
   A slim tab strip that sits just below the GlobalNav on /news and
   /news/local. The global TopNav already provides Logo, Search, UserNav,
   and the top-level site links — this component only adds the
   National / Local section toggle. */

const SECTION_TABS = [
  { href: "/news",       icon: Globe,  label: "National" },
  { href: "/news/local", icon: MapPin, label: "Local"    },
] as const

export function NewsNavigation() {
  const pathname = usePathname()

  return (
    <div className="flex gap-0 mb-6 border-b border-rule -mx-4 px-4">
      {SECTION_TABS.map(({ href, icon: Icon, label }) => {
        const active =
          href === "/news"
            ? pathname === "/news"
            : pathname.startsWith(href)

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              active
                ? "border-ink-900 text-ink-900"
                : "border-transparent text-ink-500 hover:text-ink-900 hover:border-ink-300"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </Link>
        )
      })}
    </div>
  )
}
