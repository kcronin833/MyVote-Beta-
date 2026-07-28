/* Which MyVote groups have a live city meeting portal, and which bodies to show.
 *
 * Only groups tied to a city that runs a public PrimeGov portal get the
 * auto-populated meeting schedule. Keyed by group slug. committeeIds are the
 * PrimeGov committee IDs to include (find them via the portal's committee list
 * API). Add a new entry here to light up the Meetings schedule for another
 * group. */

export interface GroupPortal {
  tenant: string; // PrimeGov subdomain, e.g. "brookhavenga"
  committeeIds: number[]; // bodies to show
  cityLabel: string; // for the "Open the … portal" link
}

export const GROUP_PORTALS: Record<string, GroupPortal> = {
  // Brookhaven: City Council (1) + Planning Commission (2)
  "brookhaven-property-tax-increase-2026": {
    tenant: "brookhavenga",
    committeeIds: [1, 2],
    cityLabel: "Brookhaven",
  },
};
