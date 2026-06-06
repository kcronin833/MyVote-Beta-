/* Single source of truth for the site's absolute base URL.

   Resolution order:
   1. NEXT_PUBLIC_SITE_URL — set this in Vercel to your custom/canonical domain
      (e.g. https://myvote.vote). This is the only value safe for canonical tags.
   2. VERCEL_URL — the per-deployment URL Vercel injects automatically. Good
      enough for preview builds; changes every deploy so not ideal as canonical.
   3. localhost — local dev fallback.

   Used by metadataBase (root layout), sitemap.ts, and robots.ts so every
   absolute URL we emit stays consistent. */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
