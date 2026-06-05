/* County slug + lookup helpers for the /g/[county] SEO pages.
   Indexes every Georgia county present in COUNTY_DATA and resolves the
   full ballot (statewide + congressional + county) for each. */

import {
  STATEWIDE_RACES,
  CONGRESSIONAL_RACES,
  COUNTY_DATA,
  COUNTY_TO_CONGRESSIONAL,
  type BallotRace,
} from "@/lib/georgia-ballot-data";
import { slugify, candidateSlug } from "@/lib/candidate-utils";

export function countySlug(countyName: string): string {
  return slugify(countyName);
}

export interface CountyLookup {
  /** Canonical county name, e.g. "Fulton". */
  name: string;
  slug: string;
  /** County seat phone / office string from the data set. */
  pollingInfo: string;
  congressionalDistrict: string;
  /** Statewide races every voter in the county sees. */
  statewideRaces: BallotRace[];
  /** The county's congressional race, if known. */
  congressionalRace: BallotRace | null;
  /** Local (county / school board) races. */
  countyRaces: BallotRace[];
}

/** Sorted list of every county name we have data for. */
export function getAllCountyNames(): string[] {
  return Object.keys(COUNTY_DATA).sort((a, b) => a.localeCompare(b));
}

/** Slugs for generateStaticParams. */
export function getAllCountySlugs(): string[] {
  return getAllCountyNames().map(countySlug);
}

/** Resolve a county by its URL slug, or null. */
export function getCountyBySlug(slug: string): CountyLookup | null {
  const name = getAllCountyNames().find((n) => countySlug(n) === slug);
  if (!name) return null;

  const data = COUNTY_DATA[name];
  const cd = COUNTY_TO_CONGRESSIONAL[name] || "Unknown";
  const congressionalRace = CONGRESSIONAL_RACES[cd] ?? null;

  return {
    name,
    slug,
    pollingInfo: data.pollingInfo,
    congressionalDistrict: cd,
    statewideRaces: STATEWIDE_RACES,
    congressionalRace,
    countyRaces: data.countyRaces,
  };
}

/** Slim listing for index pages / cross-links. */
export interface CountyListItem {
  name: string;
  slug: string;
  congressionalDistrict: string;
  href: string;
}

export function listCounties(): CountyListItem[] {
  return getAllCountyNames().map((name) => ({
    name,
    slug: countySlug(name),
    congressionalDistrict: COUNTY_TO_CONGRESSIONAL[name] || "Unknown",
    href: `/g/${countySlug(name)}`,
  }));
}

/* Only statewide + congressional candidates have detail pages
   (county placeholders don't), so expose a guard the page can use
   to decide whether to render a candidate as a link. */
const DETAIL_SLUGS: Set<string> = (() => {
  const set = new Set<string>();
  const races: BallotRace[] = [
    ...STATEWIDE_RACES,
    ...Object.values(CONGRESSIONAL_RACES),
  ];
  for (const race of races) {
    for (const c of race.candidates) {
      if (c.name.includes("TBD")) continue;
      set.add(candidateSlug(c.name, race.office));
    }
  }
  return set;
})();

/** Detail-page href for a candidate, or null when none exists. */
export function candidateDetailHref(
  name: string,
  raceOffice: string
): string | null {
  if (name.includes("TBD")) return null;
  const slug = candidateSlug(name, raceOffice);
  return DETAIL_SLUGS.has(slug) ? `/elections/candidate/${slug}` : null;
}
