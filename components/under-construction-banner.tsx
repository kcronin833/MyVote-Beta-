"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

/* Site-wide notice — visible on every page until the user dismisses it.
   The dismissal is sticky (localStorage) so repeat visitors aren't nagged. */

const STORAGE_KEY = "mv_under_construction_dismissed";

export function UnderConstructionBanner() {
  const [dismissed, setDismissed] = useState(true); // hide on first render to avoid hydration flash

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  if (dismissed) return null;

  return (
    <div
      role="status"
      style={{
        background: "#B8862F",
        color: "#fff",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 12.5,
        fontWeight: 500,
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        position: "relative",
        zIndex: 50,
      }}
    >
      <span style={{ fontWeight: 700, letterSpacing: 0.3 }}>
        🚧 MyVote is under construction
      </span>
      <span style={{ opacity: 0.9 }}>
        — features are landing daily; some sections may show placeholder content.
      </span>
      <button
        aria-label="Dismiss"
        onClick={() => {
          try {
            localStorage.setItem(STORAGE_KEY, "1");
          } catch {}
          setDismissed(true);
        }}
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          color: "#fff",
          opacity: 0.8,
          cursor: "pointer",
          padding: 4,
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
