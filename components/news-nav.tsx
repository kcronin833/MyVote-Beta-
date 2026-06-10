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
    <div className="flex gap-1 mb-6 -mx-4 px-4 pb-3 border-b border-rule">
      {SECTION_TABS.map(({ href, icon: Icon, label }) => {
        const active =
          href === "/news"
            ? pathname === "/news"
            : pathname.startsWith(href)

        return (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 13.5,
              fontWeight: active ? 600 : 500,
              color: active ? "#2F6358" : "#6B7088",
              background: active ? "#E6F0ED" : "transparent",
              textDecoration: "none",
              transition: "color 0.15s ease, background 0.15s ease",
            }}
          >
            <Icon size={14} />
            {label}
          </Link>
        )
      })}
    </div>
  )
}
