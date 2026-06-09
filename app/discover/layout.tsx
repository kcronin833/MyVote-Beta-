import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Discover Voters · MyVote",
  description:
    "Find and follow Georgia voters who share your civic values and your community.",
  alternates: { canonical: "/discover" },
  robots: { index: false, follow: true },
}

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
