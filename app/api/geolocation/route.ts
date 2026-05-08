import { NextRequest, NextResponse } from "next/server"

// This endpoint is only called when the user explicitly requests location detection.
// Auto-detection has been removed — the app uses profile.location as the source of truth.
export async function GET(request: NextRequest) {
  const city = request.headers.get("x-vercel-ip-city")
  const region = request.headers.get("x-vercel-ip-region")
  const country = request.headers.get("x-vercel-ip-country")

  if (city && region) {
    return NextResponse.json({
      city: decodeURIComponent(city),
      region: decodeURIComponent(region),
      country: country || "US",
    })
  }

  return NextResponse.json({ city: null, region: null, country: null })
}
