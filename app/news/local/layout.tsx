import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Local Georgia Political News · MyVote",
  description:
    "Local political news for your Georgia city — Atlanta, Savannah, Augusta, Macon, Athens, and more — curated from trusted local sources.",
  alternates: { canonical: "/news/local" },
  openGraph: {
    title: "Local Georgia News · MyVote",
    description:
      "Hyper-local Georgia political news for your city, curated from trusted local sources.",
    type: "website",
  },
};

export default function LocalNewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
