import type { Metadata } from "next";

/* The contact page is a client component, so its metadata lives here. The
   self-canonical is the important part: "report an error" links across the
   site point to /contact?topic=correction&ref=/g/<county>, which Google was
   treating as hundreds of duplicate pages (wasting crawl budget on a young,
   low-authority site). Canonicalizing them all to /contact consolidates them. */
export const metadata: Metadata = {
  title: "Contact MyVote",
  description:
    "Get in touch with MyVote — questions, corrections to ballot data, suggestions, or partnership inquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
