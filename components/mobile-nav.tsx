"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Globe, MapPin, Vote, ClipboardCheck } from "lucide-react"

/* ── Mobile bottom tab bar ──────────────────────────────────────────────
   Visible only on screens < 1024px (lg breakpoint).
   Fixed at the bottom with iOS safe-area-inset-bottom padding so it
   never overlaps the home indicator on notched iPhones.
   The parent layout adds pb-14 on mobile so page content scrolls clear. */

const TABS = [
  { href: "/",           icon: Home,           label: "Home"     },
  { href: "/news",       icon: Globe,          label: "News"     },
  { href: "/news/local", icon: MapPin,         label: "Local"    },
  { href: "/elections",  icon: Vote,           label: "Elections"},
  { href: "/register",   icon: ClipboardCheck, label: "Register" },
] as const

function isTabActive(tabHref: string, pathname: string): boolean {
  if (tabHref === "/") return pathname === "/"
  // /news tab: matches /news (and any future /news/* sub-paths) but NOT /news/local
  if (tabHref === "/news") {
    return (
      pathname === "/news" ||
      (pathname.startsWith("/news") && !pathname.startsWith("/news/local"))
    )
  }
  return pathname.startsWith(tabHref)
}

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 inset-x-0 z-50 lg:hidden"
      style={{
        background: "#FFFFFF",
        borderTop: "1px solid #E4E0D3",
        boxShadow: "0 -2px 10px rgba(20,24,40,0.06)",
        /* Respect iOS home indicator */
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex h-14">
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = isTabActive(href, pathname)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="flex-1 flex flex-col items-center justify-center gap-[3px] select-none"
              style={{ textDecoration: "none" }}
            >
              <span
                style={{
                  width: 44,
                  height: 28,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: active ? "#E6F0ED" : "transparent",
                  transition: "background 0.15s ease",
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.3 : 1.6}
                  color={active ? "#2F6358" : "#6B7088"}
                />
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: active ? 700 : 400,
                  color: active ? "#2F6358" : "#8B8FA3",
                  lineHeight: 1,
                  transition: "color 0.15s ease",
                }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
