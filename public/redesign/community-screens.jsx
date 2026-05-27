/* global React, MV_DATA, TopBar, BottomNav, Avatar, Pill, LeanDot, SplitBar, IconCheck, IconChevronRight, IconHeart, IconChat, IconRepost, IconShare, IconVerified, IconBell, IconArrowUp, IconSpark, IconMap, IconUsers, PostActionBar, SectionLabel */

// ====================================================
// COMMUNITY FEED — user-generated participation core
// ====================================================
function CommunityFeedScreen() {
  const c = MV_DATA.community;
  const u = MV_DATA.user;
  return (
    <div style={{ minHeight: "100%", background: "var(--paper-100)", paddingBottom: 80 }}>
      <TopBar user={u} days={MV_DATA.election.daysAway} />

      {/* SCOPE SWITCHER */}
      <div style={{ margin: "0 14px 12px", display: "flex", gap: 4, padding: 4,
        background: "var(--paper-200)", borderRadius: 12, fontFamily: "var(--font-sans)",
        fontSize: 11.5, fontWeight: 600 }}>
        {[
          { l: "My district", s: "GA-5" },
          { l: "My county", s: "Fulton" },
          { l: "Georgia", s: "Statewide" },
        ].map((t, i) => (
          <div key={t.l} style={{ flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: 8,
            background: i === 0 ? "var(--paper-50)" : "transparent",
            color: i === 0 ? "var(--ink-900)" : "var(--ink-500)" }}>
            <div>{t.l}</div>
            <div style={{ fontSize: 9.5, fontWeight: 500, color: i === 0 ? "var(--ink-500)" : "var(--ink-400)", marginTop: 1 }}>{t.s}</div>
          </div>
        ))}
      </div>

      {/* COMPOSER */}
      <div style={{ margin: "0 14px 12px", background: "var(--paper-50)",
        border: "1px solid var(--rule)", borderRadius: 14, padding: "14px 14px 12px" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Avatar initials={u.initials} size={36}/>
          <div style={{ flex: 1, padding: "10px 12px", border: "1px solid var(--rule)",
            borderRadius: 999, background: "var(--paper-100)",
            fontFamily: "var(--font-serif)", fontSize: 13.5, color: "var(--ink-500)" }}>
            What's happening in GA-5?
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 12, paddingTop: 12,
          borderTop: "1px solid var(--rule)", overflowX: "auto" }}>
          {[
            { i: "question", l: "Question" },
            { i: "poll",     l: "Poll" },
            { i: "event",    l: "Event" },
            { i: "photo",    l: "Photo" },
          ].map((b) => (
            <span key={b.l} style={{ padding: "6px 11px", borderRadius: 999,
              background: "var(--paper-100)", border: "1px solid var(--rule)",
              fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 600,
              color: "var(--ink-700)", flexShrink: 0, display: "inline-flex",
              alignItems: "center", gap: 4 }}>
              <ComposerIcon kind={b.i}/> {b.l}
            </span>
          ))}
        </div>
      </div>

      {/* TRENDING TOPICS */}
      <div style={{ margin: "0 14px 4px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
          letterSpacing: 1.4, textTransform: "uppercase", color: "var(--ink-500)" }}>
          Trending here · 312 active
        </span>
      </div>
      <div style={{ margin: "8px 14px 14px", display: "flex", gap: 6, overflowX: "auto" }}>
        {c.topics.map((t) => (
          <span key={t.tag} style={{ padding: "6px 11px", borderRadius: 999,
            background: "var(--paper-50)", border: "1px solid var(--rule)",
            fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 500,
            color: "var(--ink-700)", flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5 }}>
            #{t.tag} <span style={{ color: "var(--ink-400)", fontSize: 10.5 }}>{t.count}</span>
          </span>
        ))}
      </div>

      {/* POSTS */}
      <div style={{ margin: "0 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {c.posts.map((p) => <CommunityPost key={p.id} post={p}/>)}
      </div>

      <BottomNav active="network"/>
      <FAB/>
    </div>
  );
}

function ComposerIcon({ kind }) {
  if (kind === "question") return <span style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: 13, lineHeight: 1 }}>?</span>;
  if (kind === "poll")     return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="6" y1="20" x2="6" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="18" y1="20" x2="18" y2="14"/></svg>;
  if (kind === "event")    return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>;
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><polyline points="21 16 16 11 5 20"/></svg>;
}

function KindBadge({ kind }) {
  const map = {
    question: { l: "QUESTION", bg: "#F1ECDF" },
    poll:     { l: "POLL",     bg: "#E4ECF1" },
    event:    { l: "EVENT",    bg: "#F1E4DF" },
    report:   { l: "REPORT",   bg: "#E5ECE3" },
  };
  const m = map[kind] || map.question;
  return (
    <span style={{ padding: "2px 7px", borderRadius: 4, background: m.bg,
      fontFamily: "var(--font-sans)", fontSize: 9.5, fontWeight: 700, letterSpacing: 1,
      color: "var(--ink-700)" }}>{m.l}</span>
  );
}

function CommunityPost({ post, embedded }) {
  return (
    <article style={{ background: "var(--paper-50)", border: "1px solid var(--rule)",
      borderRadius: 14, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ position: "relative" }}>
          <Avatar initials={post.author.initials} size={36} tone="paper"/>
          <div style={{ position: "absolute", bottom: -2, right: -2, background: "var(--paper-50)",
            borderRadius: 99, padding: 1 }}>
            <LeanDot lean={post.author.lean}/>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
              color: "var(--ink-900)" }}>{post.author.name}</span>
            {post.author.verified && <IconVerified size={11}/>}
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)" }}>· {post.time}</span>
          </div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, color: "var(--ink-500)",
            display: "flex", alignItems: "center", gap: 4 }}>
            <IconMap size={10}/> {post.scope}
          </div>
        </div>
        {post.kind && <KindBadge kind={post.kind}/>}
      </div>

      <div style={{ fontFamily: "var(--font-serif)", fontSize: 14.5, lineHeight: 1.45,
        color: "var(--ink-900)" }}>{post.text}</div>

      {post.poll && (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid var(--rule)",
          borderRadius: 10, background: "var(--paper-100)" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
            color: "var(--ink-900)", marginBottom: 10 }}>{post.poll.question}</div>
          {post.poll.options.map((opt) => (
            <div key={opt.label} style={{ position: "relative", marginBottom: 5, padding: "8px 11px",
              borderRadius: 6, background: "var(--paper-50)", border: "1px solid var(--rule)",
              overflow: "hidden", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ position: "absolute", inset: 0, width: `${opt.val}%`,
                background: "var(--ink-100)" }}/>
              <span style={{ position: "relative", fontFamily: "var(--font-sans)", fontSize: 12,
                fontWeight: 500, color: "var(--ink-900)" }}>{opt.label}</span>
              <span style={{ position: "relative", fontFamily: "var(--font-sans)", fontSize: 11.5,
                fontWeight: 600, color: "var(--ink-700)" }}>{opt.val}%</span>
            </div>
          ))}
          <div style={{ marginTop: 6, fontFamily: "var(--font-sans)", fontSize: 10.5,
            color: "var(--ink-500)" }}>{post.poll.totalVotes} neighbor votes</div>
        </div>
      )}

      {post.event && (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid var(--rule)",
          borderRadius: 10, background: "var(--paper-100)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: "var(--ink-900)",
            color: "var(--paper-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
              color: "var(--ink-900)" }}>{post.event.date}</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-500)",
              marginTop: 2 }}>{post.event.place}</div>
          </div>
          <button style={{ background: "var(--ink-900)", color: "var(--paper-50)", border: "none",
            padding: "7px 12px", borderRadius: 999, fontFamily: "var(--font-sans)", fontSize: 11,
            fontWeight: 600 }}>RSVP</button>
        </div>
      )}

      {post.attachment?.kind === "image" && (
        <div style={{ marginTop: 12, height: 140, borderRadius: 10,
          background: "linear-gradient(135deg, #5C6C8A 0%, #2B3550 100%)",
          position: "relative", overflow: "hidden",
          display: "flex", alignItems: "flex-end", padding: 10 }}>
          <div style={{ padding: "4px 9px", background: "rgba(26,33,56,0.78)",
            color: "var(--paper-50)", borderRadius: 6, fontFamily: "var(--font-sans)",
            fontSize: 10.5, fontWeight: 500 }}>{post.attachment.caption}</div>
        </div>
      )}

      {post.tags && (
        <div style={{ marginTop: 10, display: "flex", gap: 5, flexWrap: "wrap" }}>
          {post.tags.map((t) => (
            <span key={t} style={{ padding: "3px 8px", borderRadius: 4, background: "var(--paper-100)",
              fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 500, color: "var(--ink-700)" }}>#{t}</span>
          ))}
        </div>
      )}

      <PostActionBar likes={post.likes} comments={post.replies} reposts={post.reposts}/>

      {post.topReply && !embedded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--rule)",
          display: "flex", gap: 10 }}>
          <div style={{ width: 4, alignSelf: "stretch", background: "var(--paper-200)",
            borderRadius: 4, flexShrink: 0 }}/>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <Avatar initials={post.topReply.author.initials} size={20} tone="paper"/>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 600,
                color: "var(--ink-900)" }}>{post.topReply.author.name}</span>
              <LeanDot lean={post.topReply.author.lean}/>
              <span style={{ marginLeft: "auto", fontFamily: "var(--font-sans)", fontSize: 10.5,
                color: "var(--ink-400)" }}>↑ {post.topReply.likes}</span>
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 13, lineHeight: 1.4,
              color: "var(--ink-700)" }}>{post.topReply.text}</div>
          </div>
        </div>
      )}

      {post.replies > 1 && !embedded && (
        <div style={{ marginTop: 10, fontFamily: "var(--font-sans)", fontSize: 11.5,
          fontWeight: 600, color: "var(--ink-700)" }}>
          View {post.replies - 1} more {post.replies - 1 === 1 ? "reply" : "replies"} ›
        </div>
      )}
    </article>
  );
}

// ====================================================
// COMPOSE — full-screen create post
// ====================================================
function ComposeScreen() {
  const u = MV_DATA.user;
  return (
    <div style={{ minHeight: "100%", background: "var(--paper-50)", display: "flex", flexDirection: "column" }}>
      {/* HEADER */}
      <div style={{ padding: "12px 18px", display: "flex", alignItems: "center",
        borderBottom: "1px solid var(--rule)" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, color: "var(--ink-700)" }}>Cancel</span>
        <span style={{ flex: 1, textAlign: "center", fontFamily: "var(--font-serif)",
          fontSize: 16, fontWeight: 600, color: "var(--ink-900)" }}>New post</span>
        <button style={{ background: "var(--ink-900)", color: "var(--paper-50)", border: "none",
          padding: "7px 16px", borderRadius: 999, fontFamily: "var(--font-sans)",
          fontWeight: 600, fontSize: 12.5 }}>Post</button>
      </div>

      {/* TYPE PICKER */}
      <div style={{ padding: "14px 18px 0", display: "flex", gap: 6 }}>
        {[
          { i: "question", l: "Question", active: false },
          { i: "poll",     l: "Poll",     active: true },
          { i: "event",    l: "Event",    active: false },
          { i: "report",   l: "Report",   active: false },
        ].map((b) => (
          <span key={b.l} style={{ padding: "7px 12px", borderRadius: 999,
            background: b.active ? "var(--ink-900)" : "var(--paper-100)",
            color: b.active ? "var(--paper-50)" : "var(--ink-700)",
            border: b.active ? "none" : "1px solid var(--rule)",
            fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 600,
            display: "inline-flex", alignItems: "center", gap: 5 }}>
            <ComposerIcon kind={b.i}/> {b.l}
          </span>
        ))}
      </div>

      {/* BODY */}
      <div style={{ padding: "16px 18px", flex: 1 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <Avatar initials={u.initials} size={36}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
              color: "var(--ink-900)" }}>{u.name}</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-500)",
              display: "inline-flex", alignItems: "center", gap: 6, marginTop: 2,
              padding: "3px 9px", border: "1px solid var(--rule)", borderRadius: 999,
              background: "var(--paper-100)" }}>
              <IconMap size={10}/> Visible to: GA-5 · Fulton County
              <IconChevronRight size={10}/>
            </div>
          </div>
        </div>

        <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, lineHeight: 1.4,
          color: "var(--ink-900)", padding: "4px 0", minHeight: 60 }}>
          Beltline Phase 2 funding — your call before Thursday's vote?
        </div>

        {/* POLL OPTIONS EDITOR */}
        <div style={{ marginTop: 12, padding: 14, border: "1px solid var(--rule)",
          borderRadius: 12, background: "var(--paper-100)" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
            letterSpacing: 1.2, textTransform: "uppercase", color: "var(--ink-500)", marginBottom: 10 }}>
            Poll options
          </div>
          {["Yes, fund Phase 2 now", "No, redirect to bus rapid transit", "Wait for audit on Phase 1", "+ Add option"].map((o, i) => (
            <div key={i} style={{ padding: "11px 13px", marginBottom: 6,
              borderRadius: 8, background: i === 3 ? "transparent" : "var(--paper-50)",
              border: i === 3 ? "1px dashed var(--rule)" : "1px solid var(--rule)",
              fontFamily: "var(--font-sans)", fontSize: 12.5,
              color: i === 3 ? "var(--ink-500)" : "var(--ink-900)",
              display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{o}</span>
              {i < 3 && <span style={{ color: "var(--ink-400)", fontSize: 11 }}>✕</span>}
            </div>
          ))}
          <div style={{ marginTop: 8, paddingTop: 10, borderTop: "1px solid var(--rule)",
            display: "flex", justifyContent: "space-between",
            fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-500)" }}>
            <span>Closes in</span>
            <span style={{ color: "var(--ink-900)", fontWeight: 600 }}>3 days ›</span>
          </div>
        </div>

        {/* TAGS */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
            letterSpacing: 1.2, textTransform: "uppercase", color: "var(--ink-500)", marginBottom: 8 }}>
            Tag a topic
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[{ l: "MARTA expansion", on: true }, { l: "Transit", on: true }, { l: "Bonds", on: false }, { l: "City budget", on: false }].map((t) => (
              <span key={t.l} style={{ padding: "5px 10px", borderRadius: 999,
                background: t.on ? "var(--ink-900)" : "var(--paper-100)",
                color: t.on ? "var(--paper-50)" : "var(--ink-700)",
                border: t.on ? "none" : "1px solid var(--rule)",
                fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 500 }}>#{t.l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* COMPOSE TOOLBAR */}
      <div style={{ padding: "10px 18px", borderTop: "1px solid var(--rule)",
        display: "flex", gap: 14, alignItems: "center", color: "var(--ink-500)" }}>
        <span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><polyline points="21 16 16 11 5 20"/></svg></span>
        <span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
        <span><IconMap size={20}/></span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-sans)", fontSize: 11,
          color: "var(--ink-400)" }}>54 / 280</span>
      </div>
    </div>
  );
}

// ====================================================
// POST DETAIL — threaded comments
// ====================================================
function PostDetailScreen() {
  const t = MV_DATA.community.thread;
  return (
    <div style={{ minHeight: "100%", background: "var(--paper-100)", paddingBottom: 80 }}>
      {/* HEADER */}
      <div style={{ padding: "10px 18px 12px", display: "flex", alignItems: "center",
        gap: 12, background: "var(--paper-50)", borderBottom: "1px solid var(--rule)" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink-700)", fontWeight: 600 }}>‹ GA-5</span>
        <span style={{ flex: 1, textAlign: "center", fontFamily: "var(--font-serif)",
          fontSize: 15, fontWeight: 600, color: "var(--ink-900)" }}>Thread</span>
        <span style={{ color: "var(--ink-700)" }}>···</span>
      </div>

      {/* PARENT POST */}
      <div style={{ margin: "12px 14px 0" }}>
        <CommunityPost post={t.post} embedded/>
      </div>

      {/* REPLIES HEADER */}
      <div style={{ display: "flex", alignItems: "center", margin: "20px 18px 8px" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
          letterSpacing: 1.4, textTransform: "uppercase", color: "var(--ink-500)" }}>
          {t.comments.length} replies
        </span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-sans)", fontSize: 11.5,
          fontWeight: 600, color: "var(--ink-700)" }}>Top ▾</span>
      </div>

      {/* COMMENTS */}
      <div style={{ margin: "0 14px", background: "var(--paper-50)",
        border: "1px solid var(--rule)", borderRadius: 14, overflow: "hidden" }}>
        {t.comments.map((c, i) => (
          <div key={c.id} style={{ padding: "14px 16px",
            borderTop: i ? "1px solid var(--rule)" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
              <div style={{ position: "relative" }}>
                <Avatar initials={c.author.initials} size={32} tone="paper"/>
                <div style={{ position: "absolute", bottom: -2, right: -2, background: "var(--paper-50)",
                  borderRadius: 99, padding: 1 }}>
                  <LeanDot lean={c.author.lean}/>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 600,
                    color: "var(--ink-900)" }}>{c.author.name}</span>
                  {c.author.verified && <IconVerified size={11}/>}
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-500)" }}>· {c.time}</span>
                </div>
              </div>
              <span style={{ color: "var(--ink-400)" }}>···</span>
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 14, lineHeight: 1.45,
              color: "var(--ink-900)", paddingLeft: 41 }}>{c.text}</div>
            <div style={{ paddingLeft: 41, marginTop: 8, display: "flex", gap: 18,
              fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><IconHeart size={11}/> {c.likes}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><IconChat size={11}/> Reply</span>
              {c.replies > 0 && <span style={{ color: "var(--ink-700)", fontWeight: 600 }}>{c.replies} {c.replies === 1 ? "reply" : "replies"} ›</span>}
            </div>
          </div>
        ))}
      </div>

      {/* COMPOSE REPLY BAR */}
      <div style={{ position: "sticky", bottom: 0, marginTop: 12, padding: "10px 14px 12px",
        background: "var(--paper-50)", borderTop: "1px solid var(--rule)",
        display: "flex", gap: 10, alignItems: "center" }}>
        <Avatar initials={MV_DATA.user.initials} size={28}/>
        <div style={{ flex: 1, padding: "9px 14px", borderRadius: 999,
          background: "var(--paper-100)", border: "1px solid var(--rule)",
          fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--ink-500)" }}>
          Add to this thread…
        </div>
        <button style={{ background: "var(--ink-900)", color: "var(--paper-50)", border: "none",
          padding: "8px 14px", borderRadius: 999, fontFamily: "var(--font-sans)",
          fontWeight: 600, fontSize: 12 }}>Reply</button>
      </div>
    </div>
  );
}

// ====================================================
// FAB — compose entry point (overlays home & community)
// ====================================================
function FAB() {
  return (
    <button style={{
      position: "absolute", right: 18, bottom: 92, width: 54, height: 54, borderRadius: 999,
      background: "var(--ink-900)", color: "var(--paper-50)", border: "none",
      boxShadow: "0 12px 28px rgba(26,33,56,0.32), 0 2px 6px rgba(0,0,0,0.18)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5,
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </button>
  );
}

Object.assign(window, {
  CommunityFeedScreen, ComposeScreen, PostDetailScreen, FAB,
});
