import { AlertTriangle } from "lucide-react";

/* Trust guardrail: shown wherever we display candidate/race detail. All 2026
   primaries, runoffs, and the GA-13 special election are settled; the November 3
   general-election matchups are set (re-verified 2026-09-10 — GA-13 special won
   by Everton Blair (D); full-term GA-13 nominee is Jasmine Clark (D)). Point
   voters to the authoritative GA SoS source. Update whenever data is re-verified. */
export function BallotDataDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 ${className}`}
      role="note"
    >
      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
      <div className="text-[13px] leading-snug text-amber-900">
        <strong className="font-semibold">November 3 nominees are set (verified September 2026).</strong>{" "}
        For your official ballot, polling place, and registration status, always verify at the{" "}
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
