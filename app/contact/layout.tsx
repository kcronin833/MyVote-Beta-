import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us · MyVote",
  description:
    "Questions, feedback, or partnership inquiries about MyVote — Georgia's non-partisan 2026 voter guide. We read every message.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
