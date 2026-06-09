"use client"

import { usePathname } from "next/navigation"
import { TopNav } from "@/components/desktop/top-nav"

/**
 * Global persistent top navigation — rendered once in the root layout.
 *
 * Hidden on routes that manage their own header or need no chrome:
 *   /          → Landing page (logged-out) or DesktopHome (logged-in) — both
 *                supply their own nav/header.
 *   /auth/*    → Sign-in / sign-up flows use a minimal centered layout.
 *   /quiz      → Full-screen civic-profile quiz experience.
 *   /welcome   → Onboarding welcome screen (if present).
 */

const HIDE_EXACT = new Set(["/", "/quiz", "/welcome"])
const HIDE_PREFIX = ["/auth/"]

export function GlobalNav() {
  const pathname = usePathname()

  if (HIDE_EXACT.has(pathname)) return null
  if (HIDE_PREFIX.some((p) => pathname.startsWith(p))) return null

  return <TopNav />
}
