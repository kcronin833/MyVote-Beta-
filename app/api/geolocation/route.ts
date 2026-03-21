import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Try Vercel's free geo headers first (available in production)
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

  // Fallback for local dev: use ip-api.com (free, no key needed)
  try {
    const res = await fetch("http://ip-api.com/json/?fields=city,regionName,country", {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json({
        city: data.city || "Atlanta",
        region: data.regionName || "Georgia",
        country: data.country || "US",
      })
    }
  } catch (err) {
    console.error("Geolocation fallback failed:", err)
  }

  // Default fallback
  return NextResponse.json({
    city: "Atlanta",
    region: "Georgia",
    country: "US",
  })
}
