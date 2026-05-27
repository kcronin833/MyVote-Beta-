"use client";

/* MyVote — Desktop Home (three-column feed).
   Ports `DesktopHome` from the design handoff prototype to React + Tailwind,
   pulling data from `lib/mv-data.ts`.  Visual structure & exact pixel
   values mirror `design_handoff_myvote_desktop/source/desktop.jsx`. */

import type { CSSProperties, ReactNode } from "react";
import { MV_DATA } from "@/lib/mv-data";
import { Avatar, Btn, Chip, PALETTE as C, VerifiedMark } from "./atoms";
import { Icons } from "./icons";
import { TopNav } from "./top-nav";

const cardStyle: CSSProperties = {
  background: C.card,
  border: `1px solid ${C.rule}`,
  borderRadius: 10,
  boxShadow: "0 1px 0 rgba(20,24,40,0.03)",
};

/* ── LEFT RAIL ─────────────────────────────────────────────────────── */
function LeftRail() {
  const u = MV_DATA.user;
  const slate = MV_DATA.slate;
  const e = MV_DATA.election;
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
          <Avatar initials={u.initials} size={64} ring />
          <div style={{ marginTop: 8, fontWeight: 700, fontSize: 16, color: C.ink900 }}>
            {u.name}
          </div>
          <div style={{ fontSize: 12, color: C.ink700, marginTop: 2 }}>
            Voter · {u.district} · {u.county}
          </div>
          <div style={{ fontSize: 11.5, color: C.ink500, marginTop: 8, lineHeight: 1.45 }}>
            School counselor. Care about education, transit, fair housing.
          </div>
        </div>
        <div
          style={{
            borderTop: `1px solid ${C.ruleSoft}`,
            padding: "10px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {[
            { l: "Politicians you back", v: 3 },
            { l: "Following", v: 84 },
            { l: "Ballot races set", v: `${e.racesDecided} / ${e.racesTotal}` },
          ].map((r) => (
            <div
              key={r.l}
              style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}
            >
              <span style={{ color: C.ink500 }}>{r.l}</span>
              <span style={{ color: C.ink900, fontWeight: 600 }}>{r.v}</span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.ruleSoft}`, padding: "10px 16px", background: C.shade }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: C.amber, display: "flex" }}>{Icons.spark(16)}</span>
            <span style={{ fontSize: 12, color: C.ink900, fontWeight: 600 }}>
              {u.streak}-day streak · keep it going
            </span>
          </div>
        </div>
      </div>

      {/* Election countdown */}
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
            {e.nextLabel}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}>
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: C.red,
                letterSpacing: -0.8,
              }}
            >
              {e.daysAway}
            </span>
            <span style={{ fontSize: 12, color: C.ink500 }}>
              days · {e.nextDate}
            </span>
          </div>
        </div>
        <div
          style={{
            padding: "10px 16px",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
          }}
        >
          <span style={{ color: C.ink500 }}>Your ballot</span>
          <span style={{ color: C.ink900, fontWeight: 600 }}>
            {e.racesDecided} of {e.racesTotal} decided
          </span>
        </div>
      </div>

      {/* Politicians you back */}
      <div style={cardStyle}>
        <div
          style={{
            padding: "14px 16px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink900 }}>My Slate</div>
          <span style={{ color: C.ink500, fontSize: 11.5, fontWeight: 500 }}>
            ${slate.totalDonated} this cycle
          </span>
        </div>
        <div style={{ padding: "0 8px 8px" }}>
          {slate.backed.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px",
                borderRadius: 6,
              }}
            >
              <Avatar initials={p.initials} size={34} tone={p.tone} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: C.ink900,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {p.name}
                </div>
                <div style={{ fontSize: 11, color: C.ink500 }}>
                  {p.office} · {p.match}% match
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: `1px solid ${C.ruleSoft}`,
            padding: "10px 16px",
            color: C.teal,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          See all backed candidates →
        </div>
      </div>
    </div>
  );
}

/* ── COMPOSER ─────────────────────────────────────────────────────── */
function Composer() {
  return (
    <div style={{ ...cardStyle, padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar initials="MC" size={42} />
        <div
          style={{
            flex: 1,
            padding: "10px 14px",
            border: `1px solid ${C.rule}`,
            borderRadius: 999,
            color: C.ink500,
            fontSize: 13.5,
            cursor: "text",
          }}
        >
          Ask your district a question…
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 4,
          marginTop: 10,
          paddingTop: 10,
          borderTop: `1px solid ${C.ruleSoft}`,
        }}
      >
        {[
          { l: "Poll",     c: C.teal,  ico: Icons.thumb() },
          { l: "Event",    c: C.amber, ico: Icons.cal() },
          { l: "Report",   c: C.navy,  ico: Icons.flag() },
          { l: "Question", c: C.plum,  ico: Icons.comment() },
        ].map((x) => (
          <div
            key={x.l}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              padding: "8px 6px",
              borderRadius: 6,
              cursor: "pointer",
              color: C.ink700,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <span style={{ color: x.c, display: "flex" }}>{x.ico}</span>
            {x.l}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── DAILY QUESTION ───────────────────────────────────────────────── */
function DailyQuestionCard() {
  const q = MV_DATA.dailyQuestion;
  const total = q.choices.reduce((s, c) => s + c.count, 0);
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
            Daily Question · Day 8
          </span>
        </div>
        <Chip tone="amber" size="sm">3,210 answered today</Chip>
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
          {q.prompt}
        </div>
        <div style={{ fontSize: 12, color: C.ink500, marginTop: 6 }}>{q.context}</div>
        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
          }}
        >
          {q.choices.map((c) => {
            const pct = Math.round((c.count / total) * 100);
            return (
              <button
                key={c.id}
                style={{
                  padding: "12px 10px",
                  borderRadius: 8,
                  border: `1.5px solid ${C.ink900}`,
                  background: C.card,
                  fontWeight: 600,
                  fontSize: 13.5,
                  color: C.ink900,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <span>{c.label}</span>
                <span style={{ fontSize: 11, color: C.ink500, fontWeight: 500 }}>
                  {pct}% so far
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── POST HEADER + REACTION BAR ───────────────────────────────────── */
type PostAuthor = {
  name: string;
  initials: string;
  role?: string;
  verified?: boolean;
  tone?: "ink" | "navy" | "plum" | "olive";
};

function PostHeader({
  author,
  time,
  scope,
  follow,
  verifiedLabel,
}: {
  author: PostAuthor;
  time: string;
  scope: string;
  follow?: boolean;
  verifiedLabel?: string | null;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 16px 8px" }}>
      <Avatar initials={author.initials} size={48} tone={author.tone} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.ink900 }}>{author.name}</span>
          {author.verified && (
            <span style={{ display: "flex" }}>
              <VerifiedMark />
            </span>
          )}
          {follow && (
            <span style={{ color: C.teal, fontSize: 12, fontWeight: 600, marginLeft: 6 }}>
              · + Follow
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: C.ink500, marginTop: 1 }}>{author.role}</div>
        <div
          style={{
            fontSize: 11.5,
            color: "#8B8FA3",
            marginTop: 2,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>{time}</span>
          <span>·</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
            {scope === "Public" ? Icons.earth(12) : Icons.pin(12)}
            {scope}
          </span>
          {verifiedLabel && (
            <>
              <span>·</span>
              <Chip tone="teal" size="sm">{verifiedLabel}</Chip>
            </>
          )}
        </div>
      </div>
      <span style={{ color: "#8B8FA3", display: "flex", padding: 4, cursor: "pointer" }}>
        {Icons.more()}
      </span>
    </div>
  );
}

function ReactionBar({
  likes,
  comments,
  reposts,
  donate,
}: {
  likes: number;
  comments: number;
  reposts: number;
  donate?: boolean;
}) {
  return (
    <>
      <div
        style={{
          padding: "6px 16px",
          display: "flex",
          justifyContent: "space-between",
          color: C.ink500,
          fontSize: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ display: "inline-flex" }}>
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: C.teal,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                border: `2px solid ${C.card}`,
              }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="white">
                <path d="M7 11v9H4v-9z" />
                <path d="M7 11l4-7c1.5 0 2.5 1 2.5 2.5V10h5.5a2 2 0 012 2.3l-1.2 6A2 2 0 0117.8 20H7" />
              </svg>
            </span>
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: C.amber,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                border: `2px solid ${C.card}`,
                marginLeft: -5,
                fontSize: 9,
                fontWeight: 700,
              }}
            >
              !
            </span>
          </span>
          <span>{likes.toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <span>{comments} comments</span>
          <span>{reposts} reposts</span>
        </div>
      </div>
      <div
        style={{
          borderTop: `1px solid ${C.ruleSoft}`,
          padding: 4,
          display: "flex",
        }}
      >
        {[
          { l: "Back",    ico: Icons.thumb() },
          { l: "Comment", ico: Icons.comment() },
          { l: "Share",   ico: Icons.share() },
          donate
            ? { l: "Donate", ico: Icons.spark(), accent: C.red }
            : { l: "Save",   ico: Icons.bookmark() },
        ].map((a: any) => (
          <div
            key={a.l}
            style={{
              flex: 1,
              padding: "9px 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              color: a.accent || C.ink700,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              borderRadius: 6,
            }}
          >
            {a.ico}
            {a.l}
          </div>
        ))}
      </div>
    </>
  );
}

/* ── POST CARDS ───────────────────────────────────────────────────── */
function PoliticianPost() {
  const pol = MV_DATA.politicianProfile;
  const p = pol.posts[1];
  return (
    <div style={cardStyle}>
      <PostHeader
        author={{
          name: pol.name,
          initials: pol.initials,
          role: `${pol.title} · ${pol.party} · ${pol.district}`,
          verified: true,
          tone: "navy",
        }}
        time={p.time}
        scope="Public"
        follow
      />
      <div style={{ padding: "0 16px 12px", fontSize: 14, color: C.ink900, lineHeight: 1.55 }}>
        {p.text}
      </div>
      <div
        style={{
          margin: "0 16px 14px",
          padding: 14,
          border: `1px solid ${C.rule}`,
          borderRadius: 10,
          background: C.shade,
        }}
      >
        <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink900, marginBottom: 10 }}>
          Should the age be raised to 21?
        </div>
        {[
          { l: "Yes", v: 62 },
          { l: "No", v: 28 },
          { l: "Need more info", v: 10 },
        ].map((o) => (
          <div key={o.l} style={{ marginBottom: 7 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                fontWeight: 500,
                marginBottom: 4,
                color: C.ink900,
              }}
            >
              <span>{o.l}</span>
              <span style={{ color: C.ink500 }}>{o.v}%</span>
            </div>
            <div
              style={{
                height: 6,
                background: C.card,
                borderRadius: 3,
                overflow: "hidden",
                border: `1px solid ${C.ruleSoft}`,
              }}
            >
              <div style={{ height: "100%", width: `${o.v}%`, background: C.ink900 }} />
            </div>
          </div>
        ))}
        <div style={{ fontSize: 11, color: C.ink500, marginTop: 8 }}>
          3,210 responses · closes in 2 days
        </div>
      </div>
      <ReactionBar likes={p.likes} comments={p.comments} reposts={p.reposts} donate />
    </div>
  );
}

function NewsPost() {
  const story = MV_DATA.stories[0];
  return (
    <div style={cardStyle}>
      <div style={{ padding: "12px 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: C.amber, display: "flex" }}>{Icons.spark(16)}</span>
        <span style={{ fontSize: 11.5, color: C.ink500 }}>
          <b style={{ color: C.ink900 }}>News across the spectrum</b> · {story.sources} sources ·{" "}
          {story.time}
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
        <div
          style={{
            marginTop: 10,
            padding: 12,
            background: C.shade,
            border: `1px solid ${C.ruleSoft}`,
            borderRadius: 8,
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: C.ink500,
              marginBottom: 6,
            }}
          >
            Shared facts · {story.sources} sources agree
          </div>
          {story.sharedFacts.slice(0, 3).map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                fontSize: 12.5,
                color: C.ink900,
                marginBottom: 4,
                lineHeight: 1.4,
              }}
            >
              <span style={{ color: C.teal, marginTop: 1, display: "flex" }}>{Icons.check(14)}</span>
              <span>{f}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          {(["Left", "Center", "Right"] as const).map((lens) => {
            const tone = lens === "Left" ? "#3A6AA5" : lens === "Right" ? "#A53A3A" : "#8B8FA3";
            const headline =
              lens === "Left"
                ? story.perspectives.left.headline
                : lens === "Right"
                ? story.perspectives.right.headline
                : story.perspectives.center.headline;
            return (
              <div
                key={lens}
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  border: `1px solid ${C.rule}`,
                  borderRadius: 6,
                  background: C.card,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: tone,
                    }}
                  />
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
                  {headline}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding: "10px 16px 0", fontSize: 12, color: C.ink500 }}>
        <b style={{ color: C.ink900 }}>{story.readers.toLocaleString()}</b> neighbors read this
      </div>
      <ReactionBar likes={story.readers} comments={284} reposts={92} />
    </div>
  );
}

function NeighborPost() {
  const p = MV_DATA.community.posts[0];
  return (
    <div style={cardStyle}>
      <PostHeader
        author={{
          name: p.author.name,
          initials: p.author.initials,
          role: `${p.author.district} · neighbor`,
          tone: "olive",
        }}
        time={p.time}
        scope={p.scope}
        verifiedLabel={p.author.verified ? p.author.verifiedLabel : null}
      />
      <div style={{ padding: "0 16px 12px", fontSize: 14, color: C.ink900, lineHeight: 1.55 }}>
        {p.text}
      </div>
      {p.poll && (
        <div
          style={{
            margin: "0 16px 14px",
            padding: 14,
            border: `1px solid ${C.rule}`,
            borderRadius: 10,
            background: C.shade,
          }}
        >
          <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink900, marginBottom: 10 }}>
            {p.poll.question}
          </div>
          {p.poll.options.map((o) => (
            <div key={o.label} style={{ marginBottom: 7 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  fontWeight: 500,
                  marginBottom: 4,
                  color: C.ink900,
                }}
              >
                <span>{o.label}</span>
                <span style={{ color: C.ink500 }}>{o.val}%</span>
              </div>
              <div
                style={{
                  height: 6,
                  background: C.card,
                  borderRadius: 3,
                  overflow: "hidden",
                  border: `1px solid ${C.ruleSoft}`,
                }}
              >
                <div style={{ height: "100%", width: `${o.val}%`, background: C.teal }} />
              </div>
            </div>
          ))}
          <div style={{ fontSize: 11, color: C.ink500, marginTop: 8 }}>
            {p.poll.totalVotes} neighbors voted
          </div>
        </div>
      )}
      <ReactionBar likes={p.likes} comments={p.replies} reposts={p.reposts} />
    </div>
  );
}

/* ── RIGHT RAIL ───────────────────────────────────────────────────── */
function RightRail() {
  const sug = MV_DATA.discover.candidates.slice(0, 3);
  const cg = MV_DATA.commonGround;
  const lp = MV_DATA.localPulse;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Suggested candidates */}
      <div style={cardStyle}>
        <div style={{ padding: "14px 16px 6px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink900 }}>
            Candidates you may want to back
          </div>
          <div style={{ fontSize: 11.5, color: C.ink500, marginTop: 2 }}>
            Matched to your top issues
          </div>
        </div>
        {sug.map((c, i) => (
          <div
            key={c.id}
            style={{
              padding: "10px 16px",
              borderTop: i === 0 ? "none" : `1px solid ${C.ruleSoft}`,
              display: "flex",
              gap: 10,
            }}
          >
            <Avatar initials={c.initials} size={42} tone={c.tone} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.ink900,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {c.name}
                {c.verified && (
                  <span style={{ display: "flex" }}>
                    <VerifiedMark />
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11.5, color: C.ink500, marginTop: 1 }}>
                {c.office} · {c.party}
              </div>
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.teal }}>
                  {c.match}% match
                </span>
                <span style={{ color: "#8B8FA3", fontSize: 11 }}>·</span>
                <span style={{ fontSize: 11, color: C.ink500 }}>
                  {c.followers.toLocaleString()} followers
                </span>
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                <Btn variant="outline" size="sm" icon={<span style={{ display: "flex" }}>{Icons.plus(14)}</span>}>
                  Follow
                </Btn>
                <Btn variant="donate" size="sm">Donate</Btn>
              </div>
            </div>
          </div>
        ))}
        <div
          style={{
            borderTop: `1px solid ${C.ruleSoft}`,
            padding: "10px 16px",
            color: C.teal,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          See all matches →
        </div>
      </div>

      {/* Trending */}
      <div style={cardStyle}>
        <div style={{ padding: "14px 16px 6px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink900 }}>
            Trending in {lp.city}
          </div>
          <div style={{ fontSize: 11.5, color: C.ink500, marginTop: 2 }}>
            {lp.activeNow} neighbors active now
          </div>
        </div>
        {lp.topics.map((t, i) => (
          <div
            key={t.tag}
            style={{
              padding: "10px 16px",
              borderTop: `1px solid ${C.ruleSoft}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink900 }}>
                #{i + 1} · {t.tag}
              </div>
              <div style={{ fontSize: 11.5, color: C.ink500, marginTop: 1 }}>
                {t.mentions} mentions ·{" "}
                {t.trend === "up"
                  ? "↑ rising"
                  : t.trend === "down"
                  ? "↓ cooling"
                  : "→ steady"}
              </div>
            </div>
          </div>
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
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C.teal,
              }}
            />
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
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: C.ink900,
              marginTop: 8,
              lineHeight: 1.35,
            }}
          >
            {cg.issue}: where Georgia agrees
          </div>
          <div
            style={{
              fontSize: 12,
              color: C.ink700,
              marginTop: 6,
              lineHeight: 1.45,
            }}
          >
            {cg.summary}
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <Chip tone="teal" size="sm">Left {cg.left}%</Chip>
            <Chip tone="teal" size="sm">Right {cg.right}%</Chip>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── PAGE ─────────────────────────────────────────────────────────── */
export function DesktopHome() {
  return (
    <div style={{ background: "#F3F1EB", minHeight: "100vh", color: C.ink900 }}>
      <TopNav active="home" />
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "16px 24px 40px",
          display: "grid",
          gridTemplateColumns: "260px 1fr 320px",
          gap: 16,
          alignItems: "start",
        }}
      >
        <LeftRail />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Composer />
          <DailyQuestionCard />
          <PoliticianPost />
          <NewsPost />
          <NeighborPost />
        </div>
        <RightRail />
      </div>
    </div>
  );
}
