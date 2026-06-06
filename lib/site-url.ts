/* Single source of truth for the site's absolute base URL.

   Resolution order:
   1. NEXT_PUBLIC_SITE_URL — explicit override. Set in Vercel only if the
      canonical domain ever changes.
   2. Production → the canonical www domain. Apex (myvotega.com) 307-redirects
      to www, so www is the canonical host for SEO.
   3. VERCEL_URL — the per-deployment URL Vercel injects (used for preview
      deploys, which have no stable domain).
   4. localhost — local dev fallback.

   Used by metadataBase (root layout), sitemap.ts, and robots.ts so every
   absolute URL we emit stays consistent. */
const CANONICAL_PROD_URL = "https://www.myvotega.com";

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_ENV === "production") {
    return CANONICAL_PROD_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
