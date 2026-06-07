"use client"

/**
 * Google AdSense ad units for MyVote.
 *
 * Required Vercel environment variables (all NEXT_PUBLIC_ so they're
 * inlined at build time and available in the browser):
 *
 *   NEXT_PUBLIC_ADSENSE_PUBLISHER_ID   — ca-pub-XXXXXXXXXXXXXXXX
 *   NEXT_PUBLIC_ADSENSE_SLOT_NEWS_FEED — 10-digit slot ID for in-feed ads
 *   NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR   — 10-digit slot ID for right-rail ads
 *   NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL— 10-digit slot ID for banner ads
 *
 * Get slot IDs from: AdSense dashboard → Ads → By ad unit → Create new ad unit.
 * All units return null in dev (publisher ID not set) and when blocked by ad-blockers.
 */

import { useEffect, useRef } from "react"

declare global {
  interface Window { adsbygoogle: object[] }
}

const PUB = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? ""

interface AdUnitProps {
  slot: string
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal"
  layout?: string          // e.g. "in-article" for fluid in-content ads
  label?: boolean          // show small "Advertisement" label (default true)
  className?: string
}

export function AdUnit({
  slot,
  format = "auto",
  layout,
  label = true,
  className = "",
}: AdUnitProps) {
  const pushed = useRef(false)

  useEffect(() => {
    if (!PUB || !slot || pushed.current) return
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense not loaded or blocked by ad-blocker — fail silently
    }
  }, [slot])

  // Render nothing in dev (no publisher ID) or if slot ID not yet configured
  if (!PUB || !slot) return null

  return (
    <div className={`ad-unit overflow-hidden ${className}`}>
      {label && (
        <p className="text-center text-[10px] font-medium text-ink-400/70 uppercase tracking-widest mb-1 select-none">
          Advertisement
        </p>
      )}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={PUB}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layout ? { "data-ad-layout": layout } : {})}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// ─── Named placement wrappers ────────────────────────────────────────────────
// Each maps to a distinct ad slot so AdSense can optimise per placement.

/** Inserted between articles in the national / local news feed. */
export function NewsFeedAd() {
  return (
    <AdUnit
      slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_NEWS_FEED ?? ""}
      format="fluid"
      layout="in-article"
      className="my-1 rounded-xl border border-rule bg-paper-50 px-4 py-3"
    />
  )
}

/** Right-rail rectangle on candidate profile pages. */
export function SidebarAd() {
  return (
    <AdUnit
      slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? ""}
      format="rectangle"
      className="rounded-xl border border-rule bg-paper-50 p-3"
    />
  )
}

/** Full-width leaderboard / banner — used between major page sections. */
export function HorizontalAd() {
  return (
    <AdUnit
      slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL ?? ""}
      format="horizontal"
      className="rounded-xl border border-rule bg-paper-50 px-4 py-3"
    />
  )
}
