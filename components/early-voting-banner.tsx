"use client";

/**
 * EarlyVotingBanner — time-sensitive urgency strip for the November 3, 2026
 * General Election, led by the voter-registration deadline.
 *
 * States (based on current date, America/New_York):
 *   register     → before Oct 5:   "Register to vote by Oct 5 — X days left"
 *   reg_last_day → Oct 5:          "LAST day to register to vote"
 *   pre_ev       → Oct 6–12:       "Early voting opens Oct 13 in X days"
 *   ev_open      → Oct 13–29:      "Early voting is NOW OPEN — through Oct 30"
 *   ev_last      → Oct 30:         "LAST day of early voting"
 *   final        → Oct 31–Nov 2:   "Election Day Nov 3 — X days away"
 *   election     → Nov 3:          "Today is Election Day — go vote!"
 *   null         → before Sep 15 or after Nov 3: hidden
 *
 * Dates verified against the Georgia Secretary of State (sos.ga.gov) and
 * georgia.gov for the Nov 3, 2026 general election:
 *   - Voter registration deadline: October 5, 2026
 *   - Early voting: October 13–30, 2026 (three weeks, incl. two Saturdays)
 *   - Election Day: November 3, 2026, polls 7am–7pm
 * October is EDT (-04:00); DST ends Nov 1, 2026, so Nov 3 is EST (-05:00).
 */

import { useState, useEffect } from "react";
import Link from "next/link";

const VISIBLE_START       = new Date("2026-09-15T00:00:00-04:00");
const REG_LAST_DAY_START  = new Date("2026-10-05T00:00:00-04:00"); // Oct 5 = last day to register
const REG_CLOSED_START    = new Date("2026-10-06T00:00:00-04:00");
const EV_START            = new Date("2026-10-13T00:00:00-04:00");
const EV_LAST_DAY_START   = new Date("2026-10-30T00:00:00-04:00"); // Oct 30 = last day of early voting
const EV_END              = new Date("2026-10-31T00:00:00-04:00");
const ELECTION_DAY_START  = new Date("2026-11-03T00:00:00-05:00");
const CUTOFF              = new Date("2026-11-04T00:00:00-05:00"); // banner disappears

const REGISTER_URL = "https://registertovote.sos.ga.gov/";
const MVP_URL      = "https://mvp.sos.ga.gov/";

type BannerState =
  | "register" | "reg_last_day" | "pre_ev" | "ev_open" | "ev_last" | "final" | "election" | null;

function daysBetween(from: Date, to: Date) {
  return Math.max(0, Math.ceil((to.getTime() - from.getTime()) / 86_400_000));
}

export function EarlyVotingBanner({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<BannerState>(null);
  const [daysUntil, setDaysUntil] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("mv_evb_general_dismissed") === "1") {
        setDismissed(true);
        return;
      }
    } catch {}

    const now = new Date();
    if (now < VISIBLE_START || now >= CUTOFF) return;

    if (now < REG_LAST_DAY_START) {
      setDaysUntil(daysBetween(now, REG_LAST_DAY_START));
      setState("register");
    } else if (now < REG_CLOSED_START) {
      setState("reg_last_day");
    } else if (now < EV_START) {
      setDaysUntil(daysBetween(now, EV_START));
      setState("pre_ev");
    } else if (now < EV_LAST_DAY_START) {
      setState("ev_open");
    } else if (now < EV_END) {
      setState("ev_last");
    } else if (now < ELECTION_DAY_START) {
      setDaysUntil(daysBetween(now, ELECTION_DAY_START));
      setState("final");
    } else {
      setState("election");
    }
  }, []);

  function dismiss() {
    try { sessionStorage.setItem("mv_evb_general_dismissed", "1"); } catch {}
    setDismissed(true);
  }

  if (dismissed || state === null) return null;

  const pillBtn = (href: string, label: string, external?: boolean) =>
    external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" style={PILL_STYLE}>
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

  if (state === "register") {
    return (
      <Banner color={AMBER_GRAD} icon="🗳️" dismiss={dismissBtn}>
        <strong style={{ color: "#fff" }}>
          Register to vote by Oct 5 — {daysUntil} day{daysUntil !== 1 ? "s" : ""} left
        </strong>
        {!compact && (
          <Sub>November 3 General Election · Not registered, or moved? Fix it before the Oct 5 deadline.</Sub>
        )}
        <Actions>
          {pillBtn(REGISTER_URL, "Register to vote ↗", true)}
          {pillBtn(MVP_URL, "Check my registration ↗", true)}
        </Actions>
      </Banner>
    );
  }

  if (state === "reg_last_day") {
    return (
      <Banner color={RED_GRAD} icon="⚠️" dismiss={dismissBtn}>
        <strong style={{ color: "#fff" }}>
          Today is the LAST day to register to vote
        </strong>
        {!compact && (
          <Sub>November 3 General Election · Register online by 11:59pm tonight to be eligible.</Sub>
        )}
        <Actions>
          {pillBtn(REGISTER_URL, "Register now ↗", true)}
        </Actions>
      </Banner>
    );
  }

  if (state === "pre_ev") {
    return (
      <Banner color={AMBER_GRAD} icon="🗳️" dismiss={dismissBtn}>
        <strong style={{ color: "#fff" }}>
          Early voting opens in {daysUntil} day{daysUntil !== 1 ? "s" : ""}
        </strong>
        {!compact && (
          <Sub>November 3 General Election · Early voting runs Oct 13–30 · Review your ballot now.</Sub>
        )}
        <Actions>
          {pillBtn("/elections", "See what's on my ballot")}
          {pillBtn(MVP_URL, "Check my registration ↗", true)}
        </Actions>
      </Banner>
    );
  }

  if (state === "ev_open") {
    return (
      <Banner color={TEAL_GRAD} icon="✅" dismiss={dismissBtn}>
        <strong style={{ color: "#fff" }}>Early voting is NOW OPEN</strong>
        {!compact && (
          <Sub>November 3 General Election · Vote through Oct 30 at any early-voting site in your county · hours vary — check mvp.sos.ga.gov</Sub>
        )}
        <Actions>
          {pillBtn(MVP_URL, "Find my polling place ↗", true)}
          {pillBtn("/elections", "My ballot")}
        </Actions>
      </Banner>
    );
  }

  if (state === "ev_last") {
    return (
      <Banner color={RED_GRAD} icon="⚠️" dismiss={dismissBtn}>
        <strong style={{ color: "#fff" }}>
          Last day of early voting — vote today
        </strong>
        {!compact && (
          <Sub>November 3 General Election · Early voting ends today · or vote on Election Day, Nov 3, 7am–7pm</Sub>
        )}
        <Actions>
          {pillBtn(MVP_URL, "Find my polling place ↗", true)}
        </Actions>
      </Banner>
    );
  }

  if (state === "final") {
    return (
      <Banner color={RED_GRAD} icon="🔴" dismiss={dismissBtn}>
        <strong style={{ color: "#fff" }}>
          Election Day is {daysUntil} day{daysUntil !== 1 ? "s" : ""} away
        </strong>
        {!compact && (
          <Sub>November 3 · Early voting is over · Polls open 7am–7pm · Bring photo ID</Sub>
        )}
        <Actions>
          {pillBtn(MVP_URL, "Find my polling place ↗", true)}
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
        <Sub>November 3 General Election · Polls open 7am–7pm · Photo ID required · in line by 7pm = you can vote</Sub>
      )}
      <Actions>
        {pillBtn(MVP_URL, "Find my polling place ↗", true)}
      </Actions>
    </Banner>
  );
}

/* ── Color constants ────────────────────────────────────────── */
const AMBER_GRAD = "linear-gradient(135deg, #B8862F 0%, #C99A35 100%)";
const TEAL_GRAD  = "linear-gradient(135deg, #030213 0%, #030213 100%)";
const RED_GRAD   = "linear-gradient(135deg, #D4183D 0%, #C94433 100%)";
const RED_DARK_GRAD = "linear-gradient(135deg, #8B2A1C 0%, #D4183D 100%)";

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
