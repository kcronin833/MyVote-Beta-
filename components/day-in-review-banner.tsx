import Link from "next/link";

/* Entry point to the daily recap, shown atop the National and Local news
   pages so the return-habit hook is the first thing readers see. */
export function DayInReviewBanner() {
  return (
    <Link
      href="/news/recap"
      className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 mb-4 hover:border-teal-300 transition-colors"
    >
      <div className="min-w-0">
        <p className="text-sm font-bold text-foreground">📅 The Day in Review</p>
        <p className="text-xs text-muted-foreground">
          Yesterday &amp; today, every story in one place — across the spectrum
        </p>
      </div>
      <span className="text-sm font-semibold text-teal-700 whitespace-nowrap">Catch up →</span>
    </Link>
  );
}
