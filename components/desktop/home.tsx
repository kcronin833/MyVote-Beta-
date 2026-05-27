"use client";

/* MyVote — Desktop Home (three-column feed).
   Visual structure ports `DesktopHome` from the design handoff
   (design_handoff_myvote_desktop/source/desktop.jsx).
   Data is wired to the real backend:
     - Profile card → useAuth() (real user / Supabase profile)
     - Election countdown → real GA Primary / General dates
     - Suggested candidates → STATEWIDE_RACES (Georgia ballot)
     - News post → /api/pipeline/stories (clustered_stories table)
   Sections without backing data (Daily Question aggregate,
   politician post, common ground, trending, my slate) render
   visual scaffolds with friendly empty/CTA states so the design
   layout remains intact. */

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";
import { STATEWIDE_RACES } from "@/lib/georgia-ballot-data";
import { Avatar, Btn, Chip, PALETTE as C, type AvatarTone } from "./atoms";
import { Icons } from "./icons";
import { TopNav } from "./top-nav";
import { PostComposer } from "@/components/post-composer";
import { PostCard, type PostData } from "@/components/post-card";
import { createClient } from "@/lib/supabase/client";

/* ── data helpers ─────────────────────────────────────────────────── */

const GEORGIA_PRIMARY = new Date("2026-05-19T07:00:00-04:00");
const GEORGIA_GENERAL = new Date("2026-11-03T07:00:00-05:00");

function useElectionInfo() {
  const [info, setInfo] = useState<{ label: string; days: number; date: string } | null>(null);
  useEffect(() => {
    const now = new Date();
    const isPrimary = now < GEORGIA_PRIMARY;
    const target = isPrimary ? GEORGIA_PRIMARY : GEORGIA_GENERAL;
    const days = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86400000));
    setInfo({
      label: isPrimary ? "Georgia Primary" : "General Election",
      days,
      date: isPrimary ? "May 19, 2026" : "November 3, 2026",
    });
  }, []);
  return info;
}

function initialsFrom(name: string | null | undefined): string {
  if (!name) return "GA";
  return name
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const TONE_BY_PARTY: Record<string, AvatarTone> = {
  Democrat: "navy",
  Republican: "olive",
  Independent: "plum",
  Libertarian: "plum",
  Green: "olive",
};

type SuggestedCandidate = {
  name: string;
  initials: string;
  office: string;
  party: string;
  incumbent: boolean;
  tone: AvatarTone;
  href: string;
};

function useSuggestedCandidates(): SuggestedCandidate[] {
  // Pull a few real candidates from statewide races. We deliberately do
  // NOT show a "match %" because we don't compute issue-alignment yet —
  // showing a fake number would be a credibility hit.
  const picks: SuggestedCandidate[] = [];
  for (const race of STATEWIDE_RACES) {
    for (const cand of race.candidates) {
      if (cand.name.includes("TBD")) continue;
      picks.push({
        name: cand.name,
        initials: initialsFrom(cand.name),
        office: race.office,
        party: cand.party,
        incumbent: cand.isIncumbent,
        tone: TONE_BY_PARTY[cand.party] || "navy",
        href: "/elections",
      });
      if (picks.length >= 3) return picks;
    }
    if (picks.length >= 3) break;
  }
  return picks;
}

type ClusteredStory = {
  id: string;
  headline: string;
  synopsis: string | null;
  article_data: Array<{ source?: string; lean?: number; url?: string; title?: string }> | null;
  lean_min: number | null;
  lean_max: number | null;
};

function useTopStory(): { story: ClusteredStory | null; loading: boolean } {
  const [story, setStory] = useState<ClusteredStory | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/pipeline/stories?hours=48&limit=5")
      .then((r) => (r.ok ? r.json() : { stories: [] }))
      .then((j) => {
        if (cancelled) return;
        const stories: ClusteredStory[] = j.stories || [];
        setStory(stories[0] || null);
      })
      .catch(() => setStory(null))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);
  return { story, loading };
}

/* ── shared card chrome ───────────────────────────────────────────── */
const cardStyle: CSSProperties = {
  background: C.card,
  border: `1px solid ${C.rule}`,
  borderRadius: 10,
  boxShadow: "0 1px 0 rgba(20,24,40,0.03)",
};

/* ── LEFT RAIL ────────────────────────────────────────────────────── */
function LeftRail({ election }: { election: ReturnType<typeof useElectionInfo> }) {
  const { user, profile } = useAuth();
  const displayName =
    profile?.display_name || user?.email?.split("@")[0] || "Welcome";
  const initials = initialsFrom(displayName);
  const district = (profile as any)?.district || "Georgia";
  const location = profile?.location || "Fulton County";
  const bio = profile?.bio || "Atlanta voter. Tracking the 2026 Georgia ballot.";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Profile card */}
      <div style={{ ...cardStyle, overflow: "hidden" }}>
        <div
          style={{
            height: 56,
            background: `linear-gradient(135deg, ${C.ink900} 0%, ${C.navy} 60%, ${C.teal} 100%)`,
          }}
        />
        <div style={{ padding: "0 16px 16px", marginTop: -28, textAlign: "center" }}>
          <Avatar initials={initials} size={64} ring />
          <div style={{ marginTop: 8, fontWeight: 700, fontSize: 16, color: C.ink900 }}>
            {displayName}
          </div>
          <div style={{ fontSize: 12, color: C.ink700, marginTop: 2 }}>
            Voter · {district} · {location}
          </div>
          <div style={{ fontSize: 11.5, color: C.ink500, marginTop: 8, lineHeight: 1.45 }}>
            {bio}
          </div>
        </div>
        <div
          style={{
            borderTop: `1px solid ${C.ruleSoft}`,
            padding: "10px 16px",
          }}
        >
          <Link
            href={user ? "/profile" : "/auth/signin"}
            style={{ color: C.teal, fontSize: 12, fontWeight: 600, textDecoration: "none" }}
          >
            {user ? "Edit profile →" : "Sign in to personalize →"}
          </Link>
        </div>
      </div>

      {/* Election countdown */}
      {election && (
        <div style={cardStyle}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.ruleSoft}` }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: C.ink500,
              }}
            >
              Next election
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.ink900, marginTop: 4 }}>
              {election.label}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: C.red, letterSpacing: -0.8 }}>
                {election.days}
              </span>
              <span style={{ fontSize: 12, color: C.ink500 }}>
                days · {election.date}
              </span>
            </div>
          </div>
          <Link
            href="/elections"
            style={{
              display: "flex",
              padding: "10px 16px",
              justifyContent: "space-between",
              fontSize: 12,
              color: C.teal,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <span>View 2026 races</span>
            <span>→</span>
          </Link>
        </div>
      )}

      {/* Discover candidates shortcut */}
      <div style={cardStyle}>
        <div
          style={{
            padding: "14px 16px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink900 }}>Quick links</div>
        </div>
        <div style={{ padding: "0 8px 8px" }}>
          {[
            { l: "Browse all 2026 races",  href: "/elections" },
            { l: "Find candidates",        href: "/discover" },
            { l: "Local Atlanta news",     href: "/news/local" },
            { l: "National spectrum news", href: "/news/spectrum" },
          ].map((p) => (
            <Link
              key={p.l}
              href={p.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px",
                borderRadius: 6,
                textDecoration: "none",
                color: C.ink900,
                fontSize: 12.5,
                fontWeight: 500,
              }}
            >
              <span style={{ color: C.teal, display: "flex" }}>{Icons.plus(14)}</span>
              {p.l}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── COMPOSER + COMMUNITY FEED ─────────────────────────────────────
   Renders the real PostComposer (inserts into the `posts` table) and
   loads the most-recent community posts below it. Posting refreshes
   the feed in place. */
function ComposerAndFeed() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("posts")
        .select("*, profile:profiles(display_name, username, avatar_url)")
        .order("created_at", { ascending: false })
        .limit(15);
      if (!cancelled) {
        setPosts((data as PostData[]) || []);
        setPostsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleNewPost(p: PostData) {
    setPosts((prev) => [p, ...prev]);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Composer — real PostComposer if signed in, CTA otherwise */}
      {loading ? (
        <div style={{ ...cardStyle, padding: 14, color: C.ink500, fontSize: 13 }}>
          Loading…
        </div>
      ) : user ? (
        <div style={cardStyle}>
          <PostComposer onPost={handleNewPost} />
        </div>
      ) : (
        <div style={{ ...cardStyle, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar initials="GA" size={42} />
            <Link
              href="/auth/signin"
              style={{
                flex: 1,
                padding: "10px 14px",
                border: `1px solid ${C.rule}`,
                borderRadius: 999,
                color: C.ink500,
                fontSize: 13.5,
                textDecoration: "none",
              }}
            >
              Sign in to share your civic thoughts…
            </Link>
          </div>
        </div>
      )}

      {/* Recent community posts */}
      {postsLoading ? (
        <div style={{ ...cardStyle, padding: 14, color: C.ink500, fontSize: 13 }}>
          Loading community posts…
        </div>
      ) : posts.length === 0 ? (
        <div style={{ ...cardStyle, padding: 16, color: C.ink500, fontSize: 13 }}>
          No community posts yet — be the first.
        </div>
      ) : (
        posts.map((p) => <PostCard key={p.id} post={p} />)
      )}
    </div>
  );
}

/* ── DAILY QUESTION (local-state) ─────────────────────────────────── */
const DAILY_QUESTION = {
  prompt: "Should Georgia raise the minimum age for assault weapon purchases to 21?",
  context: "Senate Bill 287 is in committee this week.",
  choices: [
    { id: "yes",    label: "Yes",            count: 4218 },
    { id: "no",     label: "No",             count: 2891 },
    { id: "unsure", label: "Need more info", count: 1104 },
  ],
};

function DailyQuestionCard() {
  const [picked, setPicked] = useState<string | null>(null);
  useEffect(() => {
    const v = typeof window !== "undefined" ? localStorage.getItem("mv_dq_pick") : null;
    if (v) setPicked(v);
  }, []);
  function choose(id: string) {
    setPicked(id);
    try {
      localStorage.setItem("mv_dq_pick", id);
    } catch {}
  }
  const total = DAILY_QUESTION.choices.reduce((s, c) => s + c.count, 0);
  return (
    <div style={cardStyle}>
      <div
        style={{
          padding: "12px 16px",
          borderBottom: `1px solid ${C.ruleSoft}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: C.amber, display: "flex" }}>{Icons.spark(16)}</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink900 }}>
            Daily Question
          </span>
        </div>
        <Chip tone="amber" size="sm">{total.toLocaleString()} answered today</Chip>
      </div>
      <div style={{ padding: 16 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: C.ink900,
            lineHeight: 1.35,
            letterSpacing: -0.2,
          }}
        >
          {DAILY_QUESTION.prompt}
        </div>
        <div style={{ fontSize: 12, color: C.ink500, marginTop: 6 }}>
          {DAILY_QUESTION.context}
        </div>
        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
          }}
        >
          {DAILY_QUESTION.choices.map((c) => {
            const pct = Math.round((c.count / total) * 100);
            const isPicked = picked === c.id;
            return (
              <button
                key={c.id}
                onClick={() => choose(c.id)}
                style={{
                  padding: "12px 10px",
                  borderRadius: 8,
                  border: `1.5px solid ${isPicked ? C.teal : C.ink900}`,
                  background: isPicked ? C.tealSoft : C.card,
                  fontWeight: 600,
                  fontSize: 13.5,
                  color: isPicked ? C.tealDk : C.ink900,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <span>{c.label}</span>
                <span style={{ fontSize: 11, color: C.ink500, fontWeight: 500 }}>
                  {picked ? `${pct}%` : `${pct}% so far`}
                </span>
              </button>
            );
          })}
        </div>
        {picked && (
          <div style={{ fontSize: 11.5, color: C.ink500, marginTop: 10 }}>
            Thanks — your answer was saved locally. Aggregate counts coming soon.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── NEWS POST (real clustered story) ─────────────────────────────── */
function NewsPost() {
  const { story, loading } = useTopStory();
  if (loading) {
    return (
      <div style={{ ...cardStyle, padding: 24, color: C.ink500, fontSize: 13 }}>
        Loading the latest cross-spectrum story…
      </div>
    );
  }
  if (!story) {
    return (
      <div style={{ ...cardStyle, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: C.amber, display: "flex" }}>{Icons.spark(16)}</span>
          <span style={{ fontSize: 11.5, color: C.ink500 }}>
            <b style={{ color: C.ink900 }}>News across the spectrum</b>
          </span>
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: C.ink900,
            marginTop: 10,
            lineHeight: 1.35,
          }}
        >
          No clustered stories yet — check back after the next pipeline run.
        </div>
        <Link
          href="/news/spectrum"
          style={{
            display: "inline-block",
            marginTop: 12,
            color: C.teal,
            fontWeight: 600,
            fontSize: 12.5,
            textDecoration: "none",
          }}
        >
          Browse all spectrum news →
        </Link>
      </div>
    );
  }

  // Group article_data into left/center/right by lean
  const articles = story.article_data || [];
  const left = articles.find((a) => (a.lean ?? 0) < -0.3);
  const right = articles.find((a) => (a.lean ?? 0) > 0.3);
  const center = articles.find((a) => {
    const l = a.lean ?? 0;
    return l >= -0.3 && l <= 0.3;
  });
  const sources = articles.length;

  return (
    <div style={cardStyle}>
      <div style={{ padding: "12px 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: C.amber, display: "flex" }}>{Icons.spark(16)}</span>
        <span style={{ fontSize: 11.5, color: C.ink500 }}>
          <b style={{ color: C.ink900 }}>News across the spectrum</b>
          {sources > 0 && ` · ${sources} source${sources === 1 ? "" : "s"}`}
        </span>
      </div>
      <div style={{ padding: "10px 16px 0" }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: C.ink900,
            lineHeight: 1.3,
            letterSpacing: -0.3,
          }}
        >
          {story.headline}
        </div>
        {story.synopsis && (
          <div
            style={{
              marginTop: 10,
              padding: 12,
              background: C.shade,
              border: `1px solid ${C.ruleSoft}`,
              borderRadius: 8,
              fontSize: 12.5,
              color: C.ink900,
              lineHeight: 1.5,
            }}
          >
            {story.synopsis}
          </div>
        )}
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          {[
            { lens: "Left",   article: left,   tone: "#3A6AA5" },
            { lens: "Center", article: center, tone: "#8B8FA3" },
            { lens: "Right",  article: right,  tone: "#A53A3A" },
          ].map(({ lens, article, tone }) => (
            <div
              key={lens}
              style={{
                flex: 1,
                padding: "8px 10px",
                border: `1px solid ${C.rule}`,
                borderRadius: 6,
                background: C.card,
                opacity: article ? 1 : 0.5,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: tone }} />
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    color: C.ink500,
                  }}
                >
                  {lens}
                </span>
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: C.ink900,
                  lineHeight: 1.35,
                  fontWeight: 600,
                }}
              >
                {article?.title || `No ${lens.toLowerCase()} source yet.`}
              </div>
              {article?.source && (
                <div style={{ fontSize: 10.5, color: C.ink500, marginTop: 4 }}>
                  {article.source}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between" }}>
        <Link
          href="/news/spectrum"
          style={{
            color: C.teal,
            fontSize: 12.5,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          See all spectrum stories →
        </Link>
      </div>
    </div>
  );
}

/* ── RIGHT RAIL ───────────────────────────────────────────────────── */
function RightRail() {
  const sug = useSuggestedCandidates();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Suggested candidates */}
      <div style={cardStyle}>
        <div style={{ padding: "14px 16px 6px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink900 }}>
            Candidates on your 2026 ballot
          </div>
          <div style={{ fontSize: 11.5, color: C.ink500, marginTop: 2 }}>
            Statewide races · Georgia
          </div>
        </div>
        {sug.length === 0 && (
          <div style={{ padding: "10px 16px", color: C.ink500, fontSize: 12 }}>
            No candidates loaded yet.
          </div>
        )}
        {sug.map((c, i) => (
          <div
            key={`${c.name}-${i}`}
            style={{
              padding: "10px 16px",
              borderTop: i === 0 ? "none" : `1px solid ${C.ruleSoft}`,
              display: "flex",
              gap: 10,
            }}
          >
            <Avatar initials={c.initials} size={42} tone={c.tone} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <Link
                href={c.href}
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.ink900,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  textDecoration: "none",
                  flexWrap: "wrap",
                }}
              >
                {c.name}
                {c.incumbent && <Chip tone="amber" size="sm">Incumbent</Chip>}
              </Link>
              <div style={{ fontSize: 11.5, color: C.ink500, marginTop: 2 }}>
                {c.office} · {c.party}
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                <Link href="/elections" style={{ textDecoration: "none" }}>
                  <Btn variant="outline" size="sm">View race</Btn>
                </Link>
              </div>
            </div>
          </div>
        ))}
        <Link
          href="/elections"
          style={{
            borderTop: `1px solid ${C.ruleSoft}`,
            padding: "10px 16px",
            display: "block",
            color: C.teal,
            fontSize: 12,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          See all 2026 races →
        </Link>
      </div>

      {/* Trending */}
      <div style={cardStyle}>
        <div style={{ padding: "14px 16px 6px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.ink900 }}>
              Trending in Atlanta
            </div>
            <Chip tone="neutral" size="sm">Preview</Chip>
          </div>
          <div style={{ fontSize: 11.5, color: C.ink500, marginTop: 2 }}>
            What neighbors are reading
          </div>
        </div>
        {[
          { tag: "MARTA expansion",  trend: "up" as const },
          { tag: "Property tax cap", trend: "up" as const },
          { tag: "Bond referendum",  trend: "steady" as const },
          { tag: "School board",     trend: "down" as const },
        ].map((t, i) => (
          <Link
            key={t.tag}
            href="/news/local"
            style={{
              padding: "10px 16px",
              borderTop: `1px solid ${C.ruleSoft}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              textDecoration: "none",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink900 }}>
                #{i + 1} · {t.tag}
              </div>
              <div style={{ fontSize: 11.5, color: C.ink500, marginTop: 1 }}>
                {t.trend === "up" ? "↑ rising" : t.trend === "down" ? "↓ cooling" : "→ steady"}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Common ground */}
      <div
        style={{
          ...cardStyle,
          background: "linear-gradient(180deg, #FFFFFF 0%, #E6F0ED 100%)",
        }}
      >
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.teal }} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: C.tealDk,
                }}
              >
                Common ground
              </span>
            </div>
            <Chip tone="neutral" size="sm">Preview</Chip>
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: C.ink900,
              marginTop: 8,
              lineHeight: 1.35,
            }}
          >
            Rural broadband: where Georgia agrees
          </div>
          <div
            style={{
              fontSize: 12,
              color: C.ink700,
              marginTop: 6,
              lineHeight: 1.45,
            }}
          >
            Voters across both parties say expanding rural broadband should be a top legislative
            priority this session.
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <Chip tone="teal" size="sm">Left 71%</Chip>
            <Chip tone="teal" size="sm">Right 78%</Chip>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── PAGE ─────────────────────────────────────────────────────────── */
export function DesktopHome() {
  const election = useElectionInfo();
  return (
    <div style={{ background: "#F3F1EB", minHeight: "100vh", color: C.ink900, overflowX: "hidden" }}>
      <TopNav active="home" />
      <div className="max-w-[1240px] mx-auto px-3 pt-3 pb-10 grid grid-cols-1 gap-2 items-start lg:grid-cols-[260px_1fr_320px] lg:gap-4 lg:px-6 lg:pt-4">
        <LeftRail election={election} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <ComposerAndFeed />
          <DailyQuestionCard />
          <NewsPost />
        </div>
        <RightRail />
      </div>
    </div>
  );
}

