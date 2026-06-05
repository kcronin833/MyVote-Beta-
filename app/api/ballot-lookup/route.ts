import { NextRequest, NextResponse } from "next/server";
import { getBallotForZip } from "@/lib/georgia-ballot-data";
import { countySlug } from "@/lib/county-utils";

/* GET /api/ballot-lookup?zip=30303
   Resolves a Georgia ZIP to its county and the /g/[county] ballot page.
   Used by the elections-hub ZIP box to route voters to their ballot. */

export function GET(req: NextRequest) {
  const zip = (req.nextUrl.searchParams.get("zip") || "").trim();

  if (!/^\d{5}$/.test(zip)) {
    return NextResponse.json(
      { found: false, error: "Enter a 5-digit ZIP code." },
      { status: 400 }
    );
  }

  const result = getBallotForZip(zip);

  if (!result.found) {
    return NextResponse.json({
      found: false,
      error:
        "We couldn't match that ZIP to a Georgia county. Browse by county or check your registration on the GA My Voter Page.",
    });
  }

  return NextResponse.json({
    found: true,
    zip,
    county: result.county,
    countySlug: countySlug(result.county),
    congressionalDistrict: result.congressionalDistrict,
    href: `/g/${countySlug(result.county)}`,
  });
}
