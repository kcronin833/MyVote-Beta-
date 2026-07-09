# MyVote

**Georgia's free, nonpartisan civic platform** — live at **[myvotega.com](https://www.myvotega.com)**.

Enter a ZIP to see your exact 2026 ballot, read political news from left/center/right
(with a spectrum "wheel" on each story), organize around local issues in **Groups**,
start and sign **Petitions**, and take a civic **Quiz**. Self-funded, $0 budget,
Georgia-only.

---

## Stack

- **Next.js 15** (App Router, React 19, Server + Client Components, ISR)
- **Supabase** — Postgres + Row-Level Security + Auth
- **Vercel** — hosting; **pushing to `main` auto-deploys production**
- **Claude Haiku** (Anthropic) — grounded "just the facts" news synthesis
- **NewsAPI / GNews + RSS** — news ingestion
- Styling: inline-style design-token system (no Tailwind color classes) — see `lib/design-tokens.ts`

---

## Getting started

**Prereqs:** Node 18+, npm, and access to the Supabase project (ask Kevin).

```bash
git clone https://github.com/kcronin833/MyVote-Beta-.git
cd MyVote-Beta-
cp .env.example .env.local     # then fill in the values (see below)
npm install
npm run dev                    # http://localhost:3000
```

Other scripts: `npm run build` (production build), `npm run lint`, `npm start`.

### Environment variables

Copy `.env.example` → `.env.local` and fill it in. The essentials to run locally:

- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public, connect to the DB.
- `ANTHROPIC_API_KEY`, `NEWS_API_KEY`, `GNEWS_API_KEY` — for the news feed. These are
  **paid/rate-limited**; prefer your **own free keys** for local dev.
- `SUPABASE_SERVICE_ROLE_KEY` — ⚠️ bypasses all RLS (full DB access). Only for server/pipeline code.

`.env.local` is gitignored — **never commit secrets.** Vercel injects `VERCEL_ENV`/`VERCEL_URL` automatically.

---

## Project map

| Path | What it is |
|---|---|
| `app/page.tsx` | Homepage (logged-out landing + logged-in shell) |
| `app/elections/`, `app/g/[county]/` | Ballot guide, county pages, `elections/candidate/[slug]` |
| `app/news/` | National news feed; `news/story/[id]` permanent spectrum pages; `news/local`, `news/recap` |
| `app/groups/`, `app/petitions/` | Community groups + standalone petitions |
| `app/quiz/`, `app/guides/` | Civic quiz + voter-education guides |
| `app/how-to-vote-georgia/`, `app/georgia-voter-faq/` | SEO content pages |
| `app/api/` | Route handlers (news, pipeline crons, ballot lookup, reminders) |
| `app/admin/` | Admin panel (RLS-gated: reminders export, moderation) |
| `lib/` | Core logic (see subsystems below) |
| `components/` | UI (desktop/mobile nav, news feed, groups, petitions, spectrum wheel, …) |

### Subsystems

- **News.** `lib/news-service.ts` fetches cross-spectrum RSS + NewsAPI/GNews and filters
  junk/opinion. `lib/news-ai.ts` calls Claude Haiku to **cluster** coverage into one event
  per story and write a neutral headline + facts (grounded — no outside knowledge).
  `lib/news-feed.ts` assembles the final feed. Served via `/api/news/factual` and
  server-rendered on `/news`. A separate cron pipeline (`lib/pipeline/*`,
  `app/api/pipeline/*`) builds permanent `clustered_stories` for `/news/story/[id]`.
- **Ballot data.** `lib/georgia-ballot-data.ts` holds `STATEWIDE_RACES`,
  `CONGRESSIONAL_RACES`, and county data. `lib/candidate-utils.ts` / `lib/county-utils.ts`
  derive slugs and lookups for the 159 counties + candidate pages.
- **Auth + DB.** Supabase clients in `lib/supabase/{client,server,middleware,service}.ts`.
  RLS protects all user data; `is_admin()` gates admin/takedown. User PII lives in
  `election_reminders`, `petition_signatures`, `profiles` — handle with care.
- **Design system.** Colors/spacing tokens in `lib/design-tokens.ts`. The logo is the
  official brand PNG (`public/redesign/myvote-logo-nav.png`) — never recreate it as SVG.
- **SEO.** `app/sitemap.ts` (dynamic), JSON-LD schema across pages, and the content pages above.

---

## Conventions (please read before contributing)

- **Deploy = push to `main`.** Vercel auto-builds and deploys. A failed build keeps the
  previous deploy live, so production never breaks from a bad push. Workflow: edit →
  `npx tsc --noEmit` → commit → push → verify live.
- **Database changes** go through Supabase migrations (SQL). RLS must cover every new table.
- **Accuracy rule (non-negotiable).** Never publish election facts (dates, candidates,
  results) from memory — always verify against an authoritative source (GA Secretary of
  State, AP, Ballotpedia) first. A wrong date already burned us once.
- **Brand rules.** Official logo PNG only; stick to the palette in `lib/design-tokens.ts`.
- **Nonpartisan.** No partisan framing anywhere in product copy; news is presented as
  neutral facts with the full spectrum shown.

---

## Deploying

Merging/pushing to `main` triggers a Vercel production deploy automatically. Preview
deploys are created for other branches / PRs. Env vars are managed in the Vercel project
settings (production) and `.env.local` (local).
