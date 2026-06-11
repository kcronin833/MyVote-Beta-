"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useEffect } from "react"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key) return
    // Defer analytics init off the critical path — first paint and
    // interactivity shouldn't wait on a tracking library.
    const init = () =>
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: false, // handled by Next.js router below
      })
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(init, { timeout: 4000 })
      return () => cancelIdleCallback(id)
    }
    const t = setTimeout(init, 2000)
    return () => clearTimeout(t)
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
