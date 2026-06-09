import { AlertTriangle } from "lucide-react";

/* Trust guardrail: shown wherever we display candidate/race detail. Our
   hardcoded ballot data was compiled before the May 19, 2026 primary. The primary
   has now passed (June 8, 2026) and a June 16 runoff is in progress, so nominees
   may differ from what is shown. Point voters to the authoritative GA SoS source.
   Remove or soften this once the data is sourced from an authoritative feed. */
export function BallotDataDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 ${className}`}
      role="note"
    >
      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
      <div className="text-[13px] leading-snug text-amber-900">
        <strong className="font-semibold">Data current through the May 19 primary.</strong>{" "}
        A June 16 runoff is in progress — runoff nominees update when certified by the GA SoS.
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
