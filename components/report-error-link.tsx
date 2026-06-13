import Link from "next/link";
import { Flag } from "lucide-react";

/* Self-correction affordance. After the June 2026 accuracy incident, every
   ballot/candidate page invites visitors to flag wrong info — turning readers
   into a continuous fact-check instead of waiting for a public complaint.
   Deep-links to the contact form prefilled with this page's path. */
export function ReportErrorLink({ refPath }: { refPath: string }) {
  return (
    <Link
      href={`/contact?topic=correction&ref=${encodeURIComponent(refPath)}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12.5,
        fontWeight: 600,
        color: "#6B7088",
        textDecoration: "none",
      }}
    >
      <Flag size={13} style={{ flexShrink: 0 }} />
      See something wrong on this page? Report it
    </Link>
  );
}
