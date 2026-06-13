"use client";

/**
 * EarlyVotingBanner — time-sensitive urgency strip for the June 16, 2026 Runoff.
 *
 * States (based on current date):
 *   pre        → before June 6:  "Early voting opens in X days"
 *   open       → June 6–11:      "Early voting NOW OPEN"
 *   last_day   → June 12:        "LAST day of early voting — vote today"
 *   final_days → June 13–15:     "June 16 Runoff in X days"
 *   election   → June 16:        "Today is Election Day — go vote!"
 *   null       → before June 4 or after June 16: hidden
 *
 * Dates verified against GA SoS / county election offices: advance voting
 * for the June 16 runoff began June 6–8 depending on county and ends
 * statewide on Friday, June 12 (per O.C.G.A. advance-voting rules).
 */

import { useState, useEffect } from "react";
import Link from "next/link";

// All times in America/New_York
const BANNER_VISIBLE_START = new Date("2026-06-04T00:00:00-04:00");
const EARLY_VOTING_START   = new Date("2026-06-06T00:00:00-04:00");
const EARLY_VOTING_LAST    = new Date("2026-06-12T00:00:00-04:00"); // last day open
const EARLY_VOTING_END     = new Date("2026-06-13T00:00:00-04:00"); // after last day
const RUNOFF_DAY           = new Date("2026-06-16T00:00:00-04:00");
const CUTOFF               = new Date("2026-06-17T00:00:00-04:00"); // banner disappears

type BannerState = "pre" | "open" | "last_day" | "final_days" | "election" | null;

export function EarlyVotingBanner({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<BannerState>(null);
  const [daysUntil, setDaysUntil] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("mv_evb_runoff_dismissed") === "1") {
        setDismissed(true);
        return;
      }
    } catch {}

    const now = new Date();
    if (now < BANNER_VISIBLE_START || now >= CUTOFF) return;

    if (now < EARLY_VOTING_START) {
      const days = Math.ceil(
        (EARLY_VOTING_START.getTime() - now.getTime()) / 86_400_000
      );
      setDaysUntil(days);
      setState("pre");
    } else if (now < EARLY_VOTING_LAST) {
      setState("open");
    } else if (now < EARLY_VOTING_END) {
      setState("last_day");
    } else if (now < RUNOFF_DAY) {
      const days = Math.ceil((RUNOFF_DAY.getTime() - now.getTime()) / 86_400_000);
      setDaysUntil(days);
      setState("final_days");
    } else {
      setState("election");
    }
  }, []);

  function dismiss() {
    try { sessionStorage.setItem("mv_evb_runoff_dismissed", "1"); } catch {}
    setDismissed(true);
  }

  if (dismissed || state === null) return null;

  /* ── shared button styles ── */
  const pillBtn = (href: string, label: string, external?: boolean) =>
    external ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={PILL_STYLE}
      >
        {label}
      </a>
    ) : (
      <Link href={href} style={PILL_STYLE}>
        {label}
      </Link>
    );

  const dismissBtn = (
    <button
      onClick={dismiss}
      aria-label="Dismiss"
      style={{
        background: "none",
        border: "none",
        color: "rgba(255,255,255,0.55)",
        cursor: "pointer",
        fontSize: 20,
        lineHeight: 1,
        padding: "0 4px",
        flexShrink: 0,
      }}
    >
      ×
    </button>
  );

  if (state === "pre") {
    return (
      <Banner color={AMBER_GRAD} icon="🗳️" dismiss={dismissBtn}>
        <strong style={{ color: "#fff" }}>
          Early voting opens in {daysUntil} day{daysUntil !== 1 ? "s" : ""}
        </strong>
        {!compact && (
          <Sub>June 16 Runoff · Early voting starts June 6–8 depending on county · ends June 12</Sub>
        )}
        <Actions>
          {pillBtn("/elections", "See what's on the ballot")}
        </Actions>
      </Banner>
    );
  }

  if (state === "open") {
    return (
      <Banner color={TEAL_GRAD} icon="✅" dismiss={dismissBtn}>
        <strong style={{ color: "#fff" }}>Early voting is NOW OPEN</strong>
        {!compact && (
          <Sub>June 16 Runoff · Ends Friday, June 12 · Hours vary by county — check mvp.sos.ga.gov</Sub>
        )}
        <Actions>
          {pillBtn("https://mvp.sos.ga.gov", "Find my polling place ↗", true)}
          {pillBtn("/elections", "My ballot")}
        </Actions>
      </Banner>
    );
  }

  if (state === "last_day") {
    return (
      <Banner color={RED_GRAD} icon="⚠️" dismiss={dismissBtn}>
        <strong style={{ color: "#fff" }}>
          Last day of early voting — vote today
        </strong>
        {!compact && (
          <Sub>June 16 Runoff · Early voting ends today — most county sites close at 7pm · check your county&rsquo;s hours</Sub>
        )}
        <Actions>
          {pillBtn("https://mvp.sos.ga.gov", "Find my polling place ↗", true)}
        </Actions>
      </Banner>
    );
  }

  if (state === "final_days") {
    return (
      <Banner color={RED_GRAD} icon="🔴" dismiss={dismissBtn}>
        <strong style={{ color: "#fff" }}>
          June 16 Runoff — {daysUntil} day{daysUntil !== 1 ? "s" : ""} away
        </strong>
        {!compact && (
          <Sub>Early voting is over · Election Day polls open 7am–7pm</Sub>
        )}
        <Actions>
          {pillBtn("https://mvp.sos.ga.gov", "Check my registration ↗", true)}
          {pillBtn("/elections", "Review my ballot")}
        </Actions>
      </Banner>
    );
  }

  // state === "election"
  return (
    <Banner color={RED_DARK_GRAD} icon="🗳️" dismiss={dismissBtn}>
      <strong style={{ color: "#fff" }}>
        Today is Election Day — go vote!
      </strong>
      {!compact && (
        <Sub>June 16 Runoff · Polls open 7am–7pm · Photo ID required</Sub>
      )}
      <Actions>
        {pillBtn("https://mvp.sos.ga.gov", "Find my polling place ↗", true)}
      </Actions>
    </Banner>
  );
}

/* ── Color constants ────────────────────────────────────────── */
const AMBER_GRAD = "linear-gradient(135deg, #B8862F 0%, #C99A35 100%)";
const TEAL_GRAD  = "linear-gradient(135deg, #2F6358 0%, #3D8073 100%)";
const RED_GRAD   = "linear-gradient(135deg, #B33A2C 0%, #C94433 100%)";
const RED_DARK_GRAD = "linear-gradient(135deg, #8B2A1C 0%, #B33A2C 100%)";

const PILL_STYLE: React.CSSProperties = {
  fontSize: 11.5,
  fontWeight: 700,
  color: "#fff",
  background: "rgba(255,255,255,0.18)",
  border: "1px solid rgba(255,255,255,0.35)",
  borderRadius: 999,
  padding: "4px 12px",
  textDecoration: "none",
  whiteSpace: "nowrap",
  display: "inline-block",
};

/* ── Layout primitives ──────────────────────────────────────── */
function Banner({
  color,
  icon,
  dismiss,
  children,
}: {
  color: string;
  icon: string;
  dismiss: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: color,
        borderRadius: 10,
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
        {children}
      </div>
      {dismiss}
    </div>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.82)", display: "block", width: "100%", marginTop: 1 }}>
      {children}
    </span>
  );
}

function Actions({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
      {children}
    </div>
  );
}
