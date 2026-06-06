import { AlertTriangle } from "lucide-react";

/* Trust guardrail: shown wherever we display candidate/race detail. Our
   hardcoded ballot data was compiled before the May 19, 2026 primary and has
   not yet been refreshed to final nominees, so we tell voters plainly that it's
   provisional and point them to the authoritative source (GA SoS My Voter Page).
   Remove or soften this once the data is sourced from an authoritative feed. */
export function BallotDataDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 ${className}`}
      role="note"
    >
      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
      <div className="text-[13px] leading-snug text-amber-900">
        <strong className="font-semibold">Candidate data is provisional.</strong>{" "}
        This guide was compiled before the May 19, 2026 primary and may not reflect
        final nominees or runoff results. Always confirm your official ballot,
        registration, and polling place at the{" "}
        <a
          href="https://mvp.sos.ga.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2 hover:text-amber-700"
        >
          Georgia Secretary of State&rsquo;s My Voter Page
        </a>
        .
      </div>
    </div>
  );
}
