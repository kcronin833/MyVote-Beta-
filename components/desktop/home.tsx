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

import React, { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";
import { STATEWIDE_RACES } from "@/lib/georgia-ballot-data";
import { Avatar, Btn, Chip, PALETTE as C, type AvatarTone } from "./atoms";
import { Icons } from "./icons";
import { TopNav } from "./top-nav";
import { PostComposer } from "@/components/post-composer";
import { PostCard, type PostData } from "@/components/post-card";
import { createClient } from "@/lib/supabase/client";
import { useDailyQuestion } from "@/lib/use-daily-question";
import { candidateSlug } from "@/lib/candidate-utils";
import { resolveCountySlug } from "@/lib/county-utils";
import { EarlyVotingBanner } from "@/components/early-voting-banner";
import { updateWithDailyAnswer, notifyProfileUpdated, loadCivicProfile } from "@/lib/civic-profile-store";
import { ARCHETYPES } from "@/lib/quiz-engine";

/* ── data helpers ─────────────────────────────────────────────────── */

const GEORGIA_PRIMARY = new Date("2026-05-19T07:00:00-04:00");
const GEORGIA_RUNOFF  = new Date("2026-06-16T07:00:00-04:00");
const GEORGIA_GENERAL = new Date("2026-11-03T07:00:00-05:00");

function useElectionInfo() {
  const [info, setInfo] = useState<{ label: string; days: number; date: string } | null>(null);
  useEffect(() => {
    const now = new Date();
    let target: Date, label: string, date: string;
    if (now < GEORGIA_PRIMARY) {
      target = GEORGIA_PRIMARY; label = "Georgia Primary"; date = "May 19, 2026";
    } else if (now < GEORGIA_RUNOFF) {
      target = GEORGIA_RUNOFF;  label = "June 16 Runoff";  date = "June 16, 2026";
    } else {
      target = GEORGIA_GENERAL; label = "General Election"; date = "November 3, 2026";
    }
    const days = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86400000));
    setInfo({ label, days, date });
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
  // showing a fake number would be a credibility hit. Each card links
  // to the real candidate detail page now.
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
        href: `/elections/candidate/${candidateSlug(cand.name, race.office)}`,
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
  article_data: Array<{ source?: string; lean?: number; url?: string; title?: string; image_url?: string | null }> | null;
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

type TrendingTopic = { topic: string; count: number };

/* Real trending topics, derived from recent community posts.
   No fabricated data — if nobody's posted with topics, the card hides. */
function useTrendingTopics(): { topics: TrendingTopic[]; loading: boolean } {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    const since = new Date(Date.now() - 14 * 86400000).toISOString();
    supabase
      .from("posts")
      .select("topic")
      .gte("created_at", since)
      .not("topic", "is", null)
      .limit(500)
      .then(({ data }) => {
        if (cancelled) return;
        const counts = new Map<string, number>();
        for (const row of (data as { topic: string | null }[]) || []) {
          const t = (row.topic || "").trim();
          if (!t) continue;
          counts.set(t, (counts.get(t) || 0) + 1);
        }
        const sorted = Array.from(counts.entries())
          .map(([topic, count]) => ({ topic, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setTopics(sorted);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return { topics, loading };
}

/* ── shared card chrome ───────────────────────────────────────────── */
const cardStyle: CSSProperties = {
  background: C.card,
  border: `1px solid ${C.rule}`,
  borderRadius: 10,
  boxShadow: "0 1px 0 rgba(20,24,40,0.03)",
};

/* ── LEFT RAIL ────────────────────────────────────────────────────── */
function LeftRail({
  election,
  streak,
  streakLoading,
  signedIn,
}: {
  election: ReturnType<typeof useElectionInfo>;
  streak: number;
  streakLoading: boolean;
  signedIn: boolean;
}) {
  const { user, profile } = useAuth();
  const displayName =
    profile?.display_name || user?.email?.split("@")[0] || "Welcome";
  const initials = initialsFrom(displayName);
  const district = (profile as any)?.district || "Georgia";
  const location = profile?.location || "Fulton County";
  const countyBallotSlug = resolveCountySlug(location);

  // Civic archetype chip — loads from localStorage, updates on quiz/daily answers
  const [civicChip, setCivicChip] = useState<{ emoji: string; label: string } | null>(null);
  useEffect(() => {
    function sync() {
      const p = loadCivicProfile();
      if (p.quizResult) {
        const arch = ARCHETYPES[p.quizResult.archetype];
        setCivicChip({ emoji: arch.emoji, label: arch.label });
      } else {
        setCivicChip(null);
      }
    }
    sync();
    window.addEventListener("civic-profile-updated", sync);
    return () => window.removeEventListener("civic-profile-updated", sync);
  }, []);

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
          {countyBallotSlug && (
            <Link
              href={`/g/${countyBallotSlug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginTop: 8,
                fontSize: 12,
                fontWeight: 600,
                color: C.teal,
                textDecoration: "none",
              }}
            >
              View your county ballot <span aria-hidden>→</span>
            </Link>
          )}
          {civicChip ? (
            <Link
              href="/profile"
              style={{ textDecoration: "none", display: "inline-block", marginTop: 10 }}
            >
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 11px",
                borderRadius: 20,
                background: "#E6F0ED",
                border: "1px solid #C0DAD4",
                fontSize: 12,
                fontWeight: 700,
                color: "#2F6358",
                cursor: "pointer",
              }}>
                {civicChip.emoji} {civicChip.label} →
              </span>
            </Link>
          ) : (
            <Link
              href="/quiz"
              style={{ textDecoration: "none", display: "inline-block", marginTop: 10 }}
            >
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 11px",
                borderRadius: 20,
                background: "transparent",
                border: `1px dashed ${C.rule}`,
                fontSize: 12,
                fontWeight: 600,
                color: C.ink500,
                cursor: "pointer",
              }}>
                🗳️ Build your civic profile →
              </span>
            </Link>
          )}
        </div>
        {/* Streak chip — real data from useDailyQuestion */}
        {signedIn && !streakLoading && streak > 0 && (
          <div
            style={{
              borderTop: `1px solid ${C.ruleSoft}`,
              padding: "10px 16px",
              background: C.shade,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: C.amber, display: "flex" }}>{Icons.spark(16)}</span>
            <span style={{ fontSize: 12, color: C.ink900, fontWeight: 600 }}>
              {streak}-day streak · keep it going
            </span>
          </div>
        )}
        {signedIn && !streakLoading && streak === 0 && (
          <div
            style={{
              borderTop: `1px solid ${C.ruleSoft}`,
              padding: "10px 16px",
              background: C.shade,
              fontSize: 12,
              color: C.ink700,
            }}
          >
            Answer today&apos;s question to start a streak ↓
          </div>
        )}
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
            { l: "National spectrum news", href: "/news" },
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
  const { user, profile, loading } = useAuth();
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

  /* Compute exactly which composer state to show so we never
     render an inert pill that looks clickable but does nothing. */
  let composerSlot: React.ReactNode;
  if (loading) {
    composerSlot = (
      <div style={{ ...cardStyle, padding: 14, color: C.ink500, fontSize: 13 }}>
        Loading composer…
      </div>
    );
  } else if (user && profile) {
    // The happy path — real composer with profile, writes to Supabase.
    composerSlot = (
      <div style={cardStyle}>
        <PostComposer onPost={handleNewPost} />
      </div>
    );
  } else if (user && !profile) {
    // Signed in but profile row missing (trigger didn't fire / new account).
    // Don't render a broken composer — explain the situation and link them out.
    composerSlot = (
      <div style={{ ...cardStyle, padding: 16 }}>
        <div style={{ fontSize: 13.5, color: C.ink900, fontWeight: 600, marginBottom: 6 }}>
          Almost ready to post.
        </div>
        <div style={{ fontSize: 12.5, color: C.ink500, lineHeight: 1.5, marginBottom: 10 }}>
          We need a display name and a username before your posts can attribute
          to you. Finish setting up your profile to start posting.
        </div>
        <Link href="/profile" style={{ textDecoration: "none" }}>
          <Btn variant="primary" size="sm">Complete profile →</Btn>
        </Link>
      </div>
    );
  } else {
    // Signed out — explicit sign-in CTA. No pseudo-input that could mislead.
    composerSlot = (
      <div style={{ ...cardStyle, padding: 16 }}>
        <div style={{ fontSize: 13.5, color: C.ink900, fontWeight: 600, marginBottom: 6 }}>
          Join the conversation.
        </div>
        <div style={{ fontSize: 12.5, color: C.ink500, lineHeight: 1.5, marginBottom: 10 }}>
          Sign in to share what your neighbors are thinking about Georgia 2026.
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/auth/signin" style={{ textDecoration: "none" }}>
            <Btn variant="primary" size="sm">Sign in</Btn>
          </Link>
          <Link href="/auth/signup" style={{ textDecoration: "none" }}>
            <Btn variant="outline" size="sm">Sign up</Btn>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {composerSlot}

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

/* ── DAILY QUESTION (real — uses useDailyQuestion hook) ──────────── */
function DailyQuestionCard({ dq }: { dq: ReturnType<typeof useDailyQuestion> }) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  if (dq.loading) {
    return (
      <div style={{ ...cardStyle, padding: 20, color: C.ink500, fontSize: 13 }}>
        Loading today&apos;s question…
      </div>
    );
  }

  if (dq.error || !dq.questionId) {
    return (
      <div style={{ ...cardStyle, padding: 20 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink900, marginBottom: 6 }}>
          Daily Question
        </div>
        <div style={{ fontSize: 12.5, color: C.ink500, lineHeight: 1.5 }}>
          {dq.error
            ? "Couldn't load today's question. Please refresh in a moment."
            : "No question is active right now — check back tomorrow."}
        </div>
      </div>
    );
  }

  const total = dq.totalAnswers;
  const userAnswer = dq.userAnswer;

  async function choose(choiceId: string) {
    setSubmitError(null);
    if (!user) {
      setSubmitError("Sign in to record your answer.");
      return;
    }
    setSubmitting(true);
    const res = await dq.submit(choiceId);
    setSubmitting(false);
    if (!res.ok) {
      setSubmitError(res.error || "Couldn't save your answer.");
      return;
    }
    // Update the incremental civic profile with this answer
    if (dq.questionId && dq.prompt) {
      const choiceIdx = dq.choices.findIndex((c) => c.id === choiceId);
      const choiceLabel = dq.choices[choiceIdx]?.label ?? choiceId;
      updateWithDailyAnswer({
        questionId: dq.questionId,
        prompt: dq.prompt,
        choiceLabel,
        choiceIndex: choiceIdx >= 0 ? choiceIdx : 0,
        totalChoices: dq.choices.length,
      });
      notifyProfileUpdated();
    }
  }

  return (
    <div style={cardStyle}>
      <div
        style={{
          padding: "12px 16px",
          borderBottom: `1px solid ${C.ruleSoft}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: C.amber, display: "flex" }}>{Icons.spark(16)}</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink900 }}>
            Daily Question
          </span>
        </div>
        <Chip tone="amber" size="sm">
          {total.toLocaleString()} answered{total === 1 ? "" : ""}
        </Chip>
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
          {dq.prompt}
        </div>
        {dq.context && (
          <div style={{ fontSize: 12, color: C.ink500, marginTop: 6 }}>{dq.context}</div>
        )}
        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: `repeat(${Math.max(dq.choices.length, 1)}, 1fr)`,
            gap: 8,
          }}
        >
          {dq.choices.map((c) => {
            const count = dq.counts[c.id] || 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const isPicked = userAnswer === c.id;
            return (
              <button
                key={c.id}
                onClick={() => choose(c.id)}
                disabled={submitting}
                style={{
                  padding: "12px 10px",
                  borderRadius: 8,
                  border: `1.5px solid ${isPicked ? C.teal : C.ink900}`,
                  background: isPicked ? C.tealSoft : C.card,
                  fontWeight: 600,
                  fontSize: 13.5,
                  color: isPicked ? C.tealDk : C.ink900,
                  cursor: submitting ? "wait" : "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  textAlign: "left",
                }}
              >
                <span>{c.label}</span>
                <span style={{ fontSize: 11, color: C.ink500, fontWeight: 500 }}>
                  {userAnswer
                    ? `${pct}% (${count.toLocaleString()})`
                    : total > 0
                    ? `${pct}% so far`
                    : "Be the first"}
                </span>
              </button>
            );
          })}
        </div>
        {submitError && (
          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              color: C.red,
              background: C.redSoft,
              border: `1px solid #E8CDC7`,
              borderRadius: 6,
              padding: "6px 10px",
            }}
          >
            {submitError}
            {!user && (
              <>
                {" "}
                <Link
                  href="/auth/signin"
                  style={{ color: C.red, textDecoration: "underline", fontWeight: 600 }}
                >
                  Sign in →
                </Link>
              </>
            )}
          </div>
        )}
        {userAnswer && !submitError && (() => {
          const myCount = dq.counts[userAnswer] || 0;
          const myPct = total > 0 ? Math.round((myCount / total) * 100) : 0;
          const majority = myPct >= 50;
          const toss = myPct >= 45 && myPct <= 55;
          const msg = toss
            ? `Georgia is split on this — ${myPct}% agree with you.`
            : majority
            ? `You voted with the majority — ${myPct}% of Georgia voters agree.`
            : `You're in the minority — only ${myPct}% of voters agree.`;
          return (
            <div
              style={{
                marginTop: 12,
                padding: "9px 12px",
                borderRadius: 8,
                background: majority ? C.tealSoft : C.amberSoft,
                border: `1px solid ${majority ? "#C0DAD4" : "#E8D9B2"}`,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <span style={{ fontSize: 12.5, fontWeight: 700, color: majority ? C.tealDk : C.amber }}>
                {msg}
              </span>
              {dq.streak > 0 && (
                <span style={{ fontSize: 11.5, color: C.ink500 }}>
                  🔥 {dq.streak}-day streak — keep answering daily to maintain it!
                </span>
              )}
            </div>
          );
        })()}
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
          href="/news"
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
  // First image available across any article in this cluster
  const heroImage = articles.find((a) => a.image_url)?.image_url ?? null;

  return (
    <div style={{ ...cardStyle, overflow: "hidden" }}>
      {/* Story hero image */}
      {heroImage && (
        <Link href="/news" style={{ display: "block" }}>
          <div style={{ width: "100%", aspectRatio: "16/9", maxHeight: 180, overflow: "hidden" }}>
            <img
              src={heroImage}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = "none" }}
            />
          </div>
        </Link>
      )}
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
          href="/news"
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

/* ── SOCIAL COMMENT FEED ────────────────────────────────────────────
   Shows recent article comments posted by the signed-in user and
   everyone they follow — a "what is my network discussing?" stream.
   Relies on comments.user_id → profiles FK (applied in migration
   fix_comments_user_id_fk_to_profiles). */

type FeedComment = {
  id: string;
  user_id: string;
  article_url: string;
  article_title: string | null;
  content: string;
  created_at: string;
  profile: {
    username: string;
    display_name: string;
    avatar_url: string | null;
    political_lean: string | null;
  } | null;
};

function useSocialComments(userId: string | undefined) {
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      const supabase = createClient();

      // Resolve who I follow
      const { data: follows } = await supabase
        .from("user_follows")
        .select("following_id")
        .eq("follower_id", userId);

      const followingIds = (follows || []).map(
        (f: { following_id: string }) => f.following_id
      );
      const userIds = [userId, ...followingIds];

      // Comments from me + network, newest first
      const { data } = await supabase
        .from("comments")
        .select(
          "id, user_id, article_url, article_title, content, created_at, " +
          "profile:profiles(username, display_name, avatar_url, political_lean)"
        )
        .in("user_id", userIds)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!cancelled) {
        setComments((data as unknown as FeedComment[]) || []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  return { comments, loading };
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

function SocialCommentFeed() {
  const { user } = useAuth();
  const { comments, loading } = useSocialComments(user?.id);

  if (!user) return null;

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: `1px solid ${C.ruleSoft}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ color: C.teal, display: "flex" }}>{Icons.comment(16)}</span>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink900 }}>
          Discussion · you &amp; people you follow
        </span>
      </div>

      {loading ? (
        <div style={{ padding: 16, color: C.ink500, fontSize: 13 }}>
          Loading discussions…
        </div>
      ) : comments.length === 0 ? (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 13, color: C.ink500, lineHeight: 1.5 }}>
            No discussion activity yet. Open any article and leave a comment —
            or follow neighbors to see what they&apos;re saying.
          </div>
          <Link
            href="/discover"
            style={{
              display: "inline-block",
              marginTop: 10,
              fontSize: 12.5,
              fontWeight: 600,
              color: C.teal,
              textDecoration: "none",
            }}
          >
            Find neighbors to follow →
          </Link>
        </div>
      ) : (
        <div>
          {comments.map((c, i) => {
            const name =
              c.profile?.display_name || c.profile?.username || "Neighbor";
            const initials = initialsFrom(name);
            const lean = c.profile?.political_lean;
            const tone: AvatarTone =
              lean === "left" ? "navy" : lean === "right" ? "olive" : "plum";
            const leanColor =
              lean === "left" ? C.navy : lean === "right" ? C.red : C.ink500;
            const isMine = c.user_id === user.id;

            return (
              <div
                key={c.id}
                style={{
                  padding: "12px 16px",
                  borderTop: i === 0 ? "none" : `1px solid ${C.ruleSoft}`,
                }}
              >
                {/* Author row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <Avatar initials={initials} size={30} tone={tone} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: C.ink900,
                      }}
                    >
                      {isMine ? "You" : name}
                    </span>
                    {lean && (
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: 10.5,
                          fontWeight: 600,
                          color: leanColor,
                          textTransform: "capitalize",
                        }}
                      >
                        {lean}
                      </span>
                    )}
                    <span
                      style={{ marginLeft: 8, fontSize: 11, color: C.ink500 }}
                    >
                      {timeAgo(c.created_at)}
                    </span>
                  </div>
                </div>

                {/* Article reference */}
                {c.article_title && (
                  <div
                    style={{
                      fontSize: 11,
                      color: C.ink500,
                      marginBottom: 5,
                      display: "flex",
                      gap: 4,
                      alignItems: "baseline",
                    }}
                  >
                    <span>on</span>
                    <a
                      href={c.article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: C.teal,
                        fontWeight: 600,
                        textDecoration: "none",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 260,
                        display: "inline-block",
                      }}
                    >
                      {c.article_title}
                    </a>
                  </div>
                )}

                {/* Comment body */}
                <div
                  style={{
                    fontSize: 13,
                    color: C.ink900,
                    lineHeight: 1.5,
                  }}
                >
                  {c.content.length > 220
                    ? `${c.content.slice(0, 220)}…`
                    : c.content}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── RIGHT RAIL ───────────────────────────────────────────────────── */
function RightRail() {
  const sug = useSuggestedCandidates();
  const { topics: trending } = useTrendingTopics();
  const [quizDone, setQuizDone] = React.useState(() => {
    if (typeof window === "undefined") return true; // SSR: hide card
    return !!localStorage.getItem("mv_intake_result");
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Civic quiz card — shown until completed */}
      {!quizDone && (
        <div style={{
          ...cardStyle,
          background: "linear-gradient(135deg, #1A2138 0%, #3D8073 100%)",
          color: "#fff",
        }}>
          <div style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 18, marginBottom: 6 }}>🗳️</div>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4 }}>
              Build your civic profile
            </div>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.5, margin: "0 0 12px" }}>
              12 quick questions. No partisan labels. Personalizes everything you see on MyVote.
            </p>
            <Link href="/quiz" style={{ textDecoration: "none" }}>
              <div style={{
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 13, fontWeight: 700, color: "#fff",
                textAlign: "center", cursor: "pointer",
              }}>
                Start quiz (~3 min) →
              </div>
            </Link>
            <button
              onClick={() => { localStorage.setItem("mv_intake_result", "dismissed"); setQuizDone(true); }}
              style={{
                background: "none", border: "none",
                fontSize: 11.5, color: "rgba(255,255,255,0.45)",
                cursor: "pointer", marginTop: 8, width: "100%",
                textDecoration: "underline",
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

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
                <Link href={c.href} style={{ textDecoration: "none" }}>
                  <Btn variant="outline" size="sm">View profile</Btn>
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

      {/* Trending — real topics from community posts (hides if none) */}
      {trending.length > 0 && (
        <div style={cardStyle}>
          <div style={{ padding: "14px 16px 6px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.ink900 }}>
              Trending topics
            </div>
            <div style={{ fontSize: 11.5, color: C.ink500, marginTop: 2 }}>
              What the community is posting about
            </div>
          </div>
          {trending.map((t, i) => (
            <Link
              key={t.topic}
              href={`/search?q=${encodeURIComponent(t.topic)}`}
              style={{
                padding: "10px 16px",
                borderTop: `1px solid ${C.ruleSoft}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                textDecoration: "none",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink900 }}>
                #{i + 1} · {t.topic}
              </div>
              <div style={{ fontSize: 11.5, color: C.ink500 }}>
                {t.count} {t.count === 1 ? "post" : "posts"}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Be ballot-ready — real voter actions */}
      <div
        style={{
          ...cardStyle,
          background: "linear-gradient(180deg, #FFFFFF 0%, #E6F0ED 100%)",
        }}
      >
        <div style={{ padding: "14px 16px" }}>
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
              Be ballot-ready
            </span>
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
            See your 2026 ballot and make a plan to vote
          </div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            <Link href="/elections" style={{ textDecoration: "none" }}>
              <Btn variant="primary" size="sm">Find my ballot by ZIP</Btn>
            </Link>
            <a
              href="https://registertovote.sos.ga.gov/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Btn variant="outline" size="sm">Register / update registration ↗</Btn>
            </a>
            <a
              href="https://mvp.sos.ga.gov/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Btn variant="ghost" size="sm">Check my registration ↗</Btn>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── PAGE ─────────────────────────────────────────────────────────── */
export function DesktopHome() {
  const election = useElectionInfo();
  // Single source of truth for the Daily Question — shared between the
  // streak chip in LeftRail and the DailyQuestionCard in the center
  // column so they stay in sync after a vote.
  const dq = useDailyQuestion();
  return (
    <div style={{ background: "#F3F1EB", minHeight: "100vh", color: C.ink900, overflowX: "hidden" }}>
      <TopNav active="home" />
      <div className="max-w-[1240px] mx-auto px-3 pt-3 pb-10 grid grid-cols-1 gap-2 items-start lg:grid-cols-[260px_1fr_320px] lg:gap-4 lg:px-6 lg:pt-4">
        <LeftRail
          election={election}
          streak={dq.streak}
          streakLoading={dq.loading}
          signedIn={dq.signedIn}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <EarlyVotingBanner />
          <ComposerAndFeed />
          <SocialCommentFeed />
          <DailyQuestionCard dq={dq} />
          <NewsPost />
        </div>
        <RightRail />
      </div>
    </div>
  );
}

