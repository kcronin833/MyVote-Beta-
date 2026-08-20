import { AlertTriangle } from "lucide-react";

/* Trust guardrail: shown wherever we display candidate/race detail. The May 19
   primary and June 16 runoffs are certified and the November general-election
   nominees are set (verified 2026-08-20). The one race still unsettled is the
   GA-13 special election, which is in an August 25, 2026 runoff. Point voters to
   the authoritative GA SoS source. Update this whenever the ballot data is
   re-verified. */
export function BallotDataDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 ${className}`}
      role="note"
    >
      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
      <div className="text-[13px] leading-snug text-amber-900">
        <strong className="font-semibold">November nominees are set (verified August 2026).</strong>{" "}
        The GA-13 special election is in an August 25 runoff. For your official ballot,
        polling place, and registration status, always verify at the{" "}
        <a
          href="https://mvp.sos.ga.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2 hover:text-amber-700"
        >
          Georgia Secretary of State&rsquo;s My Voter Page ↗
        </a>
        .
      </div>
    </div>
  );
}
