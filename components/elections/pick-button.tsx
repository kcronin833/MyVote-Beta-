"use client";

/**
 * PickButton — inline candidate pick toggle.
 *
 * Reads/writes `mv_ballot_picks_v1` in localStorage.
 * Format: { [raceOffice]: candidateName }
 * Dispatches a custom "mv-pick-changed" event on window after each toggle
 * so the BallotPickTracker in the right rail updates in real time.
 */

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "mv_ballot_picks_v1";

export const PICK_CHANGED_EVENT = "mv-pick-changed";

export function getPicks(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function savePicks(picks: Record<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(picks));
    window.dispatchEvent(new Event(PICK_CHANGED_EVENT));
  } catch {}
}

export function PickButton({
  candidateName,
  raceOffice,
}: {
  candidateName: string;
  raceOffice: string;
}) {
  const [isPicked, setIsPicked] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const picks = getPicks();
    setIsPicked(picks[raceOffice] === candidateName);
  }, [candidateName, raceOffice]);

  // Keep in sync when another PickButton in the same race is clicked
  useEffect(() => {
    function onPickChanged() {
      const picks = getPicks();
      setIsPicked(picks[raceOffice] === candidateName);
    }
    window.addEventListener(PICK_CHANGED_EVENT, onPickChanged);
    return () => window.removeEventListener(PICK_CHANGED_EVENT, onPickChanged);
  }, [candidateName, raceOffice]);

  const toggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // don't follow the parent Link
      e.stopPropagation();
      const picks = getPicks();
      if (picks[raceOffice] === candidateName) {
        // Un-pick
        delete picks[raceOffice];
      } else {
        picks[raceOffice] = candidateName;
      }
      savePicks(picks);
      setIsPicked(picks[raceOffice] === candidateName);
    },
    [candidateName, raceOffice]
  );

  return (
    <button
      onClick={toggle}
      title={isPicked ? "Remove pick" : "Pick this candidate"}
      aria-label={
        isPicked
          ? `Remove ${candidateName} as your pick`
          : `Pick ${candidateName}`
      }
      style={{
        flexShrink: 0,
        width: 32,
        height: "100%",
        minHeight: 50,
        borderRadius: 8,
        border: `1.5px solid ${isPicked ? "#3D8073" : "#C8C3B5"}`,
        background: isPicked ? "#E6F0ED" : "#F7F5EF",
        color: isPicked ? "#2F6358" : "#8B8FA3",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        transition: "all 0.15s ease",
      }}
    >
      {isPicked ? "✓" : "○"}
    </button>
  );
}
