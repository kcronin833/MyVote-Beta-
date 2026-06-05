/* Shared presentational pieces for ballot surfaces (elections hub +
   /g/[county] pages) so candidates and races render identically and
   every candidate links to the same detail page. Server-safe — no hooks. */

import Link from "next/link";
import { candidateDetailHref } from "@/lib/county-utils";
import type { BallotRace, BallotCandidate } from "@/lib/georgia-ballot-data";

export const C = {
  page: "#F3F1EB",
  card: "#FFFFFF",
  rule: "#E4E0D3",
  ruleSoft: "#EFEBE0",
  shade: "#F7F5EF",
  ink900: "#1A2138",
  ink700: "#3D435A",
  ink500: "#6B7088",
  ink400: "#8B8FA3",
  teal: "#3D8073",
  tealDk: "#2F6358",
  tealSoft: "#E6F0ED",
  red: "#B33A2C",
  redSoft: "#F5E3DF",
  amber: "#B8862F",
  amberSoft: "#F4ECD8",
  plum: "#6B3A6B",
  navy: "#1F3A5F",
  olive: "#5A6A2E",
};

export const TONE_BY_PARTY: Record<string, string> = {
  Democrat: C.navy,
  Republican: C.olive,
  Independent: C.plum,
  Libertarian: C.plum,
  Green: C.olive,
};

const PARTY_ABBR: Record<string, string> = {
  Democrat: "D",
  Republican: "R",
  Independent: "I",
  Libertarian: "L",
  Green: "G",
};

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function cardStyle(): React.CSSProperties {
  return {
    background: C.card,
    border: `1px solid ${C.rule}`,
    borderRadius: 10,
    boxShadow: "0 1px 0 rgba(20,24,40,0.03)",
  };
}

export function CandidateRow({
  candidate,
  raceOffice,
}: {
  candidate: BallotCandidate;
  raceOffice: string;
}) {
  const href = candidateDetailHref(candidate.name, raceOffice);
  const tone = TONE_BY_PARTY[candidate.party] || C.ink900;
  const abbr = PARTY_ABBR[candidate.party] || "·";

  const inner = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 8,
        border: `1px solid ${C.ruleSoft}`,
        background: C.shade,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: tone,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {initialsOf(candidate.name)}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 600,
            color: C.ink900,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {candidate.name}
          </span>
          {candidate.isIncumbent && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.teal,
                background: C.tealSoft,
                borderRadius: 4,
                padding: "1px 5px",
                whiteSpace: "nowrap",
              }}
            >
              Incumbent
            </span>
          )}
        </div>
        <div style={{ fontSize: 11.5, color: C.ink500 }}>
          {candidate.party}
          {candidate.keyIssues.length > 0 && (
            <span style={{ color: C.ink400 }}>
              {" · "}
              {candidate.keyIssues.slice(0, 2).join(", ")}
            </span>
          )}
        </div>
      </div>
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          border: `1px solid ${tone}`,
          color: tone,
          fontSize: 10.5,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {abbr}
      </span>
      {href && (
        <span style={{ fontSize: 11, color: C.teal, fontWeight: 600, flexShrink: 0 }}>
          View →
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none" }}>
        {inner}
      </Link>
    );
  }
  return inner;
}

export function RaceCard({ race }: { race: BallotRace }) {
  const named = race.candidates.filter((c) => !c.name.includes("TBD"));
  const tbdCount = race.candidates.length - named.length;

  return (
    <div style={{ ...cardStyle(), padding: 14 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 4,
        }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: 0 }}>
          {race.office}
        </h3>
        <span style={{ fontSize: 11, color: C.ink500, whiteSpace: "nowrap" }}>
          {race.date}
        </span>
      </div>
      <p style={{ fontSize: 12.5, color: C.ink700, margin: "0 0 10px", lineHeight: 1.5 }}>
        {race.description}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {named.map((c) => (
          <CandidateRow key={c.name} candidate={c} raceOffice={race.office} />
        ))}
        {tbdCount > 0 && (
          <div style={{ fontSize: 11.5, color: C.ink400, padding: "4px 10px" }}>
            {tbdCount} nominee{tbdCount > 1 ? "s" : ""} to be determined after the
            primary.
          </div>
        )}
      </div>
    </div>
  );
}

export function SectionHeading({ label, count }: { label: string; count: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        margin: "6px 2px 2px",
      }}
    >
      <h2
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.4,
          textTransform: "uppercase",
          color: C.ink500,
          margin: 0,
        }}
      >
        {label}
      </h2>
      <span style={{ fontSize: 11, color: C.ink400 }}>{count}</span>
      <div style={{ flex: 1, height: 1, background: C.rule }} />
    </div>
  );
}
