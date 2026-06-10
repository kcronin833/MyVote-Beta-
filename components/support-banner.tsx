"use client";

/* Site-wide support banner — a slim strip at the very top of every page
   (above the sticky GlobalNav). Promotes Kevin's roofing service as a way
   to support MyVote's development. Dismissible per-browser via localStorage,
   but shown by default so every visitor sees it on first load. */

import { useEffect, useState } from "react";
import { PALETTE as C } from "@/components/desktop/atoms";

const DISMISS_KEY = "mv_support_banner_dismissed";

export function SupportBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") setDismissed(true);
    } catch {
      /* localStorage unavailable — keep banner visible */
    }
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  if (dismissed) return null;

  return (
    <div
      role="complementary"
      aria-label="Support MyVote"
      style={{
        background: C.ink900,
        color: "#fff",
        borderBottom: `1px solid ${C.ink700}`,
      }}
    >
      <div
        className="max-w-[1240px] mx-auto px-3 lg:px-6"
        style={{
          minHeight: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          flexWrap: "wrap",
          padding: "7px 36px",
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: 13,
            lineHeight: 1.4,
            textAlign: "center",
            color: "rgba(255,255,255,0.92)",
          }}
        >
          <span aria-hidden style={{ marginRight: 6 }}>🏠</span>
          <strong style={{ color: "#fff" }}>Support the development of MyVote</strong>
          {" — "}
          Roof leak or need a full replacement? Call Kevin for a free inspection.
        </span>

        <a
          href="tel:+14014191025"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: C.amber,
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            padding: "5px 14px",
            borderRadius: 999,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          <span aria-hidden>📞</span> Call (401) 419-1025
        </a>

        <button
          onClick={dismiss}
          aria-label="Dismiss support banner"
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.6)",
            fontSize: 18,
            lineHeight: 1,
            cursor: "pointer",
            padding: 4,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
