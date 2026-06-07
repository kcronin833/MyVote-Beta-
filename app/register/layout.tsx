import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Georgia 2026 Voter Registration Guide · MyVote",
  description:
    "Everything you need to vote in Georgia 2026 — registration deadlines, photo ID requirements, absentee ballot requests, polling place lookup, and the full election timeline.",
  alternates: { canonical: "/register" },
  openGraph: {
    title: "Georgia 2026 Voter Registration — MyVote",
    description:
      "Deadlines, ID requirements, absentee ballots, and county election offices — all in one place for Georgia voters.",
    type: "website",
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
