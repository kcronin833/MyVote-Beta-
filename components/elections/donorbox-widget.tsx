"use client"

import Script from "next/script"
import { Heart } from "lucide-react"

/* Donorbox popup widget.
   Loads Donorbox's script once per page; any <a class="dbox-donation-button">
   pointing to donorbox.org is intercepted and opens as a modal overlay.
   Falls back to a plain link if their JS doesn't load (e.g. ad-blocker). */

export function DonorboxWidget({
  campaignUrl,
  candidateName,
  variant = "full",
}: {
  campaignUrl: string
  candidateName: string
  /** "full" = wide button for right rail; "compact" = smaller inline version */
  variant?: "full" | "compact"
}) {
  const isCompact = variant === "compact"

  return (
    <>
      <Script
        id="donorbox-widget-js"
        src="https://donorbox.org/widget.js"
        strategy="lazyOnload"
        data-paypal-express="false"
      />
      <a
        href={campaignUrl}
        className="dbox-donation-button"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: isCompact ? "auto" : "100%",
          padding: isCompact ? "8px 16px" : "13px 20px",
          borderRadius: 10,
          background: "#3D8073",
          color: "#fff",
          fontWeight: 700,
          fontSize: isCompact ? 13 : 15,
          textDecoration: "none",
          cursor: "pointer",
          letterSpacing: -0.1,
          boxShadow: "0 1px 3px rgba(61,128,115,0.35)",
          transition: "opacity 0.15s",
        }}
        onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.88" }}
        onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1" }}
      >
        <Heart size={isCompact ? 14 : 16} fill="currentColor" strokeWidth={0} />
        {isCompact ? "Donate" : `Donate to ${candidateName}`}
      </a>
    </>
  )
}
