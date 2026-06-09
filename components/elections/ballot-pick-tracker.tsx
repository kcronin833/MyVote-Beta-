"use client";

/**
 * BallotPickTracker — right-rail progress card showing how many races
 * the user has decided on. Listens to "mv-pick-changed" events so it
 * stays in sync with the PickButtons in real time.
 *
 * Usage in a server component:
 *   <BallotPickTracker races={allRaces} countyName="Fulton" countySlug="fulton" />
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getPicks, PICK_CHANGED_EVENT } from "./pick-button";
import { C } from "@/lib/design-tokens";

export type RaceForTracker = {
  office: string;
  candidates: string[]; // display names only
};

interface Props {
  races: RaceForTracker[];
  countyName: string;
  countySlug: string;
}

export function BallotPickTracker({ races, countyName, countySlug }: Props) {
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const syncPicks = useCallback(() => {
    setPicks(getPicks());
  }, []);

  useEffect(() => {
    syncPicks();
    window.addEventListener(PICK_CHANGED_EVENT, syncPicks);
    return () => window.removeEventListener(PICK_CHANGED_EVENT, syncPicks);
  }, [syncPicks]);

  const decided = Object.keys(picks).filter((office) =>
    races.some((r) => r.office === office)
  ).length;
  const total = races.length;
  const pct = total > 0 ? Math.round((decided / total) * 100) : 0;

  async function shareMyBallot() {
    const url = `https://myvote.app/g/${countySlug}`;
    const text = `I'm reviewing my 2026 Georgia ballot for ${countyName} County on MyVote — see every candidate and key date: ${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My 2026 Georgia Ballot", text, url });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {}
  }

  function clearPicks() {
    try {
      // Only clear picks relevant to this county's races
      const current = getPicks();
      for (const race of races) {
        delete current[race.office];
      }
      localStorage.setItem("mv_ballot_picks_v1", JSON.stringify(current));
      window.dispatchEvent(new Event(PICK_CHANGED_EVENT));
    } catch {}
  }

  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.rule}`,
        borderRadius: 10,
        boxShadow: "0 1px 0 rgba(20,24,40,0.03)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 14px 10px",
          borderBottom: `1px solid ${C.ruleSoft}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink900 }}>
            Your ballot picks
          </div>
          <span style={{ fontSize: 11.5, color: C.ink500, fontWeight: 600 }}>
            {decided}/{total} decided
          </span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: 6,
            background: C.shade,
            borderRadius: 99,
            overflow: "hidden",
            border: `1px solid ${C.ruleSoft}`,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background:
                pct === 100
                  ? C.teal
                  : pct > 50
                  ? "#6BAD9D"
                  : "#A8D4CC",
              borderRadius: 99,
              transition: "width 0.3s ease",
            }}
          />
        </div>

        {decided === 0 && (
          <p style={{ fontSize: 11.5, color: C.ink500, marginTop: 6, lineHeight: 1.45 }}>
            Tap <strong>○</strong> next to any candidate to mark your pick.
          </p>
        )}
        {decided > 0 && decided < total && (
          <p style={{ fontSize: 11.5, color: C.ink500, marginTop: 6, lineHeight: 1.45 }}>
            {total - decided} race{total - decided !== 1 ? "s" : ""} left to decide.
          </p>
        )}
        {decided === total && total > 0 && (
          <p style={{ fontSize: 11.5, color: C.tealDk, marginTop: 6, fontWeight: 600, lineHeight: 1.45 }}>
            All races decided — you&apos;re ballot-ready! 🎉
          </p>
        )}
      </div>

      {/* Race list — only show if user has made at least one pick */}
      {decided > 0 && (
        <div style={{ maxHeight: 240, overflowY: "auto" }}>
          {races.map((race, i) => {
            const pick = picks[race.office];
            return (
              <div
                key={race.office}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  padding: "7px 14px",
                  borderTop: i === 0 ? "none" : `1px solid ${C.ruleSoft}`,
                  background: pick ? C.tealSoft : "transparent",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.ink500,
                      textTransform: "uppercase",
                      letterSpacing: 0.3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {race.office}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: pick ? 700 : 400,
                      color: pick ? C.tealDk : C.ink400,
                      marginTop: 1,
                    }}
                  >
                    {pick || "—"}
                  </div>
                </div>
                {pick && (
                  <span
                    style={{
                      fontSize: 14,
                      color: C.teal,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer actions */}
      <div
        style={{
          padding: "10px 14px",
          borderTop: `1px solid ${C.ruleSoft}`,
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={shareMyBallot}
          style={{
            flex: 1,
            padding: "7px 10px",
            borderRadius: 7,
            border: `1.5px solid ${C.teal}`,
            background: C.teal,
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {copied ? "✓ Copied!" : "📤 Share ballot"}
        </button>

        {decided > 0 && (
          <button
            onClick={clearPicks}
            style={{
              padding: "7px 10px",
              borderRadius: 7,
              border: `1px solid ${C.rule}`,
              background: "transparent",
              color: C.ink400,
              fontSize: 11.5,
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
