/* Slug + lookup helpers for candidate detail pages.
   We index every candidate across STATEWIDE_RACES and CONGRESSIONAL_RACES
   by a URL-safe slug derived from name + race office. */

import {
  STATEWIDE_RACES,
  CONGRESSIONAL_RACES,
  type BallotCandidate,
  type BallotRace,
} from "@/lib/georgia-ballot-data";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Stable slug for a candidate. Includes race office so two
 *  candidates with the same name in different races don't collide. */
export function candidateSlug(name: string, raceOffice: string): string {
  return `${slugify(name)}--${slugify(raceOffice)}`;
}

export interface CandidateLookup {
  candidate: BallotCandidate;
  race: BallotRace;
  /** Other candidates in the same race, excluding this one. */
  otherCandidates: BallotCandidate[];
  slug: string;
}

/** Walk both race indexes and yield every (candidate, race, slug). */
function* allCandidates(): Generator<CandidateLookup> {
  const races: BallotRace[] = [
    ...STATEWIDE_RACES,
    ...Object.values(CONGRESSIONAL_RACES),
  ];
  for (const race of races) {
    for (const candidate of race.candidates) {
      if (candidate.name.includes("TBD")) continue;
      const slug = candidateSlug(candidate.name, race.office);
      yield {
        candidate,
        race,
        otherCandidates: race.candidates.filter(
          (c) => c.name !== candidate.name && !c.name.includes("TBD")
        ),
        slug,
      };
    }
  }
}

/** Every candidate slug — used by generateStaticParams. */
export function getAllCandidateSlugs(): string[] {
  return Array.from(allCandidates()).map((x) => x.slug);
}

/** Look up a candidate by slug, or null. */
export function getCandidateBySlug(slug: string): CandidateLookup | null {
  for (const x of allCandidates()) {
    if (x.slug === slug) return x;
  }
  return null;
}

/** Slim listing for navigation / right-rail cards. */
export interface CandidateListItem {
  slug: string;
  name: string;
  initials: string;
  party: BallotCandidate["party"];
  office: string;
  incumbent: boolean;
  href: string;
}

/** Candidates (with detail pages) whose full name appears in a block of text —
 *  used to link news stories back to the profiles of candidates they mention.
 *  Word-boundary, full-name matching keeps it precise (no "Brian Jack" inside
 *  "Brian Jackson", no bare common surnames), so a link is only shown when the
 *  match is unambiguous. */
export function findMentionedCandidates(text: string): CandidateListItem[] {
  if (!text) return [];
  const out: CandidateListItem[] = [];
  const seen = new Set<string>();
  for (const c of listCandidates()) {
    if (c.name.includes("TBD") || seen.has(c.slug)) continue;
    const escaped = c.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`\\b${escaped}\\b`, "i").test(text)) {
      seen.add(c.slug);
      out.push(c);
    }
  }
  return out;
}

export function listCandidates(): CandidateListItem[] {
  return Array.from(allCandidates()).map((x) => ({
    slug: x.slug,
    name: x.candidate.name,
    initials: x.candidate.name
      .split(/\s+/)
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase(),
    party: x.candidate.party,
    office: x.race.office,
    incumbent: x.candidate.isIncumbent,
    href: `/elections/candidate/${x.slug}`,
  }));
}
