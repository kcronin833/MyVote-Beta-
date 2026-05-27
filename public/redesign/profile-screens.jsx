/* global React, MV_DATA, TopBar, BottomNav, Avatar, Pill, SplitBar, ProgressBar, LeanDot, StoryRule, IconCheck, IconChevronRight, IconBell, IconMap, IconUsers, IconSpark, IconArrowUp */

// ====================================================
// SHARED helpers
// ====================================================

function StatBlock({ value, label, accent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
      <span style={{
        fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 22,
        color: accent || "var(--ink-900)", letterSpacing: -0.4, lineHeight: 1,
      }}>{value}</span>
      <span style={{
        fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 600,
        letterSpacing: 0.6, textTransform: "uppercase", color: "var(--ink-500)",
      }}>{label}</span>
    </div>
  );
}

function SectionLabel({ children, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", margin: "22px 18px 10px" }}>
      <span style={{
        fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
        letterSpacing: 1.4, textTransform: "uppercase", color: "var(--ink-500)",
      }}>{children}</span>
      {action && (
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 2,
          fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600,
          color: "var(--ink-700)",
        }}>{action} <IconChevronRight size={11}/></span>
      )}
    </div>
  );
}

function IconHeart({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  );
}
function IconChat({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a8 8 0 01-12 7L4 21l1.7-4.6A8 8 0 1121 12z"/>
    </svg>
  );
}
function IconRepost({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/>
      <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/>
    </svg>
  );
}
function IconShare({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
      <polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
    </svg>
  );
}
function IconVerified({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.39 2.05L17.55 4l.05 3.16L19.6 9.6l-1.6 2.4 1.6 2.4-2 2.44-.05 3.16-3.16-.05L12 22l-2.39-2.05L6.45 20l-.05-3.16L4.4 14.4 6 12 4.4 9.6l2-2.44L6.45 4l3.16.05L12 2z" fill="var(--ink-900)"/>
      <polyline points="8.5 12 11 14.5 15.5 9.5" fill="none" stroke="var(--paper-50)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PostActionBar({ likes, comments, reposts }) {
  const item = (Icon, n) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--ink-500)",
      fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500 }}>
      <Icon /> <span>{n >= 1000 ? (n/1000).toFixed(1) + "k" : n}</span>
    </span>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 12 }}>
      {item(IconHeart, likes)}
      {item(IconChat, comments)}
      {item(IconRepost, reposts)}
      <span style={{ marginLeft: "auto", color: "var(--ink-500)" }}><IconShare/></span>
    </div>
  );
}

// ====================================================
// VOTER PROFILE — your own (social-network style)
// ====================================================
function VoterProfileScreen() {
  const p = MV_DATA.voterProfile;
  return (
    <div style={{ minHeight: "100%", background: "var(--paper-100)", paddingBottom: 80 }}>
      <TopBar user={MV_DATA.user} days={MV_DATA.election.daysAway} />

      {/* HERO */}
      <div style={{ margin: "0 14px 0", padding: "20px 18px 16px", background: "var(--paper-50)",
        border: "1px solid var(--rule)", borderRadius: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <Avatar initials={p.initials} size={56}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600,
              color: "var(--ink-900)", letterSpacing: -0.4, lineHeight: 1.1 }}>{p.name}</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--ink-500)", marginTop: 2 }}>
              @{p.handle} · {p.city}, GA · {p.district}
            </div>
          </div>
        </div>

        <p style={{ fontFamily: "var(--font-serif)", fontSize: 14.5, lineHeight: 1.45,
          color: "var(--ink-700)", margin: "0 0 16px" }}>{p.bio}</p>

        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14,
          borderTop: "1px solid var(--rule)" }}>
          <StatBlock value={p.stats.followers} label="Followers"/>
          <StatBlock value={p.stats.following} label="Following"/>
          <StatBlock value={p.stats.questions} label="Answered"/>
          <StatBlock value={p.stats.ballotsCast} label="Ballots"/>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button style={{ flex: 1, background: "var(--ink-900)", color: "var(--paper-50)",
            border: "none", padding: "11px 12px", borderRadius: 10, fontFamily: "var(--font-sans)",
            fontWeight: 600, fontSize: 13, letterSpacing: -0.1 }}>Edit profile</button>
          <button style={{ flex: 1, background: "transparent", color: "var(--ink-900)",
            border: "1px solid var(--ink-400)", padding: "11px 12px", borderRadius: 10,
            fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, letterSpacing: -0.1 }}>Share profile</button>
        </div>
      </div>

      {/* STREAK CARD */}
      <div style={{ margin: "14px 14px 0", padding: "14px 16px", background: "var(--ink-900)",
        color: "var(--paper-50)", borderRadius: 14, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 600, letterSpacing: -1, lineHeight: 1 }}>{p.streak}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 600 }}>Day streak</div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "rgba(250,247,242,0.65)", marginTop: 2 }}>
            Answer today's question to keep it going.
          </div>
        </div>
        <button style={{ background: "var(--paper-50)", color: "var(--ink-900)", border: "none",
          padding: "8px 12px", borderRadius: 8, fontFamily: "var(--font-sans)", fontSize: 11.5,
          fontWeight: 700, letterSpacing: 0.3 }}>OPEN</button>
      </div>

      {/* ISSUE PROFILE */}
      <SectionLabel action="View details">Your issue profile</SectionLabel>
      <div style={{ margin: "0 14px", padding: "14px 16px 4px", background: "var(--paper-50)",
        border: "1px solid var(--rule)", borderRadius: 14 }}>
        {p.issueProfile.map((iss) => {
          const leanColor = iss.lean === "left" ? "#7796C2" : iss.lean === "right" ? "#C29377" : "#9CA39C";
          const dotPct = iss.lean === "left" ? 50 - iss.strength * 45 : iss.lean === "right" ? 50 + iss.strength * 45 : 50;
          return (
            <div key={iss.name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4,
                fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 500, color: "var(--ink-700)" }}>
                <span>{iss.name}</span>
                <span style={{ color: "var(--ink-500)", textTransform: "capitalize", fontSize: 11 }}>{iss.lean}</span>
              </div>
              <div style={{ position: "relative", height: 4, background: "var(--paper-200)", borderRadius: 99 }}>
                <div style={{ position: "absolute", left: "50%", top: -3, width: 1, height: 10,
                  background: "var(--ink-400)" }} />
                <div style={{ position: "absolute", top: -3, left: `calc(${dotPct}% - 5px)`, width: 10, height: 10,
                  borderRadius: 99, background: leanColor, border: "2px solid var(--paper-50)" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTIVITY */}
      <SectionLabel action="See all">Recent activity</SectionLabel>
      <div style={{ margin: "0 14px", background: "var(--paper-50)", border: "1px solid var(--rule)",
        borderRadius: 14, overflow: "hidden" }}>
        {p.activity.map((a, i) => (
          <div key={i} style={{ padding: "14px 16px",
            borderTop: i ? "1px solid var(--rule)" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <ActivityIcon kind={a.kind} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: 1, color: "var(--ink-500)" }}>{a.kind}</span>
              <span style={{ marginLeft: "auto", fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-400)" }}>{a.time}</span>
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 14.5, lineHeight: 1.35,
              color: "var(--ink-900)" }}>
              {a.text}{a.target && (
                <> <span style={{ color: "var(--ink-900)", fontWeight: 600 }}>{a.target}</span>
                  {a.targetMeta && <span style={{ color: "var(--ink-500)", fontWeight: 400 }}> · {a.targetMeta}</span>}
                </>
              )}
            </div>
            {a.detail && (
              <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 4,
                padding: "3px 8px", borderRadius: 6, background: "var(--ink-100)", color: "var(--ink-900)",
                fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600 }}>
                <IconCheck size={10}/> {a.detail}
              </div>
            )}
            {a.likes !== undefined && (
              <div style={{ display: "flex", gap: 18, marginTop: 8, color: "var(--ink-500)",
                fontFamily: "var(--font-sans)", fontSize: 11 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><IconHeart size={11}/> {a.likes}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><IconChat size={11}/> {a.replies}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FRIENDS */}
      <SectionLabel action="See all">Friends · across the spectrum</SectionLabel>
      <div style={{ margin: "0 14px 20px", padding: "16px 16px", background: "var(--paper-50)",
        border: "1px solid var(--rule)", borderRadius: 14, display: "flex", gap: 14, overflowX: "auto" }}>
        {p.friends.map((f) => (
          <div key={f.name} style={{ display: "flex", flexDirection: "column", alignItems: "center",
            gap: 6, minWidth: 56, flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              <Avatar initials={f.initials} size={44} tone="paper"/>
              <div style={{ position: "absolute", bottom: -2, right: -2,
                background: "var(--paper-50)", borderRadius: 99, padding: 1 }}>
                <LeanDot lean={f.lean}/>
              </div>
            </div>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-700)",
              fontWeight: 500, textAlign: "center" }}>{f.name}</span>
          </div>
        ))}
      </div>

      <BottomNav active="profile"/>
    </div>
  );
}

function ActivityIcon({ kind }) {
  const Sym = {
    answered: () => <IconCheck size={11}/>,
    followed: () => <IconUsers size={11}/>,
    posted:   () => <IconChat size={11}/>,
    decided:  () => <IconCheck size={11}/>,
    commented:() => <IconChat size={11}/>,
  }[kind] || (() => <IconSpark size={11}/>);
  return (
    <span style={{ width: 18, height: 18, borderRadius: 99, background: "var(--paper-200)",
      color: "var(--ink-700)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <Sym/>
    </span>
  );
}

// ====================================================
// POLITICIAN PROFILE — Overview (website replacement)
// ====================================================
function PoliticianProfileScreen() {
  const p = MV_DATA.politicianProfile;
  return (
    <div style={{ minHeight: "100%", background: "var(--paper-100)", paddingBottom: 80 }}>
      {/* TOP MINI BAR — replaces TopBar since this isn't your feed */}
      <div style={{ padding: "10px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink-700)", fontWeight: 600 }}>‹ Back</span>
        <div style={{ flex: 1 }}/>
        <span style={{ color: "var(--ink-700)" }}><IconShare/></span>
        <span style={{ color: "var(--ink-700)" }}>···</span>
      </div>

      {/* HERO with banner */}
      <div style={{ margin: "0 14px", borderRadius: 16, overflow: "hidden",
        background: "var(--paper-50)", border: "1px solid var(--rule)" }}>
        {/* banner */}
        <div style={{ height: 86, background: "linear-gradient(135deg, #18244B 0%, #2A3865 100%)",
          position: "relative" }}>
          <svg viewBox="0 0 400 86" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }}>
            <path d="M0 80 Q100 20 200 50 T400 30 L400 86 L0 86 Z" fill="white"/>
          </svg>
        </div>
        <div style={{ padding: "0 18px 16px", marginTop: -38 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{
              width: 76, height: 76, borderRadius: 999, background: "var(--paper-200)",
              border: "4px solid var(--paper-50)", color: "var(--ink-900)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 28, letterSpacing: 0.2,
            }}>{p.initials}</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
              <button style={{ background: "var(--ink-900)", color: "var(--paper-50)",
                border: "none", padding: "9px 16px", borderRadius: 999, fontFamily: "var(--font-sans)",
                fontWeight: 600, fontSize: 12.5 }}>+ Follow</button>
              <button style={{ background: "var(--civic-red)", color: "#fff",
                border: "none", padding: "9px 16px", borderRadius: 999, fontFamily: "var(--font-sans)",
                fontWeight: 600, fontSize: 12.5, display: "inline-flex", alignItems: "center", gap: 5 }}>
                <IconHeart size={12}/> Donate
              </button>
            </div>
          </div>

          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600,
              letterSpacing: -0.4, color: "var(--ink-900)", lineHeight: 1 }}>{p.name}</span>
            {p.verified && <span style={{ display: "inline-flex" }}><IconVerified size={16}/></span>}
          </div>
          <div style={{ marginTop: 4, fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--ink-500)" }}>
            @{p.handle} · {p.title} · {p.district}
          </div>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 14, lineHeight: 1.45,
            color: "var(--ink-700)", margin: "12px 0 14px" }}>{p.bio}</p>

          <div style={{ display: "flex", gap: 16, alignItems: "center", fontFamily: "var(--font-sans)",
            fontSize: 11.5, color: "var(--ink-500)", paddingTop: 12, borderTop: "1px solid var(--rule)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><IconMap size={12}/> {p.location}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><IconUsers size={12}/> {(p.stats.followers/1000).toFixed(1)}k followers</span>
          </div>
        </div>
      </div>

      {/* YOUR MATCH STRIP */}
      <div style={{ margin: "14px 14px 0", padding: "16px 18px",
        background: "var(--ink-900)", color: "var(--paper-50)", borderRadius: 14,
        display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 40, fontWeight: 600,
          letterSpacing: -1.5, lineHeight: 1 }}>{p.stats.yourMatch}%</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "rgba(250,247,242,0.6)" }}>Your match</div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 14.5, marginTop: 2 }}>
            You agree on healthcare, education, and climate.
          </div>
        </div>
        <span style={{ color: "var(--paper-50)" }}><IconChevronRight size={14}/></span>
      </div>

      {/* TABS */}
      <div style={{ margin: "20px 14px 0", display: "flex", gap: 4, padding: 4,
        background: "var(--paper-200)", borderRadius: 12, fontFamily: "var(--font-sans)",
        fontSize: 12, fontWeight: 600 }}>
        {["Overview", "Updates", "Positions", "Events", "Record"].map((t, i) => (
          <div key={t} style={{ flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: 8,
            background: i === 0 ? "var(--paper-50)" : "transparent",
            color: i === 0 ? "var(--ink-900)" : "var(--ink-500)" }}>{t}</div>
        ))}
      </div>

      {/* KEY ISSUES */}
      <SectionLabel action={`${p.keyIssues.length} positions`}>Where I stand</SectionLabel>
      <div style={{ margin: "0 14px", background: "var(--paper-50)", border: "1px solid var(--rule)",
        borderRadius: 14, overflow: "hidden" }}>
        {p.keyIssues.map((iss, i) => (
          <div key={iss.name} style={{ padding: "14px 16px",
            borderTop: i ? "1px solid var(--rule)" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
                letterSpacing: 1.4, textTransform: "uppercase", color: "var(--ink-700)" }}>{iss.name}</span>
              <Pill tone="teal" style={{ marginLeft: "auto" }}><IconCheck size={9}/> Agrees w/ you</Pill>
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 14, lineHeight: 1.4,
              color: "var(--ink-900)" }}>{iss.stance}</div>
          </div>
        ))}
      </div>

      {/* UPCOMING EVENTS */}
      <SectionLabel action="All events">Upcoming events</SectionLabel>
      <div style={{ margin: "0 14px", background: "var(--paper-50)", border: "1px solid var(--rule)",
        borderRadius: 14, overflow: "hidden" }}>
        {p.events.map((e, i) => {
          const [mon, day] = e.date.split(" ");
          return (
            <div key={e.title} style={{ padding: "14px 16px", display: "flex", gap: 14,
              alignItems: "center", borderTop: i ? "1px solid var(--rule)" : "none" }}>
              <div style={{ width: 44, textAlign: "center", padding: "6px 0",
                background: "var(--paper-100)", borderRadius: 8 }}>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 700,
                  letterSpacing: 1, textTransform: "uppercase", color: "var(--ink-500)" }}>{mon}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 600,
                  color: "var(--ink-900)", lineHeight: 1, marginTop: 2 }}>{day}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 14, fontWeight: 500,
                  color: "var(--ink-900)", lineHeight: 1.25 }}>{e.title}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)",
                  marginTop: 3 }}>{e.place}</div>
              </div>
              <span style={{ color: "var(--ink-400)" }}><IconChevronRight/></span>
            </div>
          );
        })}
      </div>

      {/* ENDORSEMENTS */}
      <SectionLabel>Endorsed by</SectionLabel>
      <div style={{ margin: "0 14px 20px", padding: "14px 16px", background: "var(--paper-50)",
        border: "1px solid var(--rule)", borderRadius: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {p.endorsements.map((e) => (
          <span key={e} style={{ padding: "6px 10px", background: "var(--paper-100)",
            borderRadius: 8, fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 500,
            color: "var(--ink-700)" }}>{e}</span>
        ))}
      </div>

      {/* FUNDRAISING DISCLOSURE */}
      <div style={{ margin: "0 14px 16px", padding: "10px 14px",
        fontFamily: "var(--font-sans)", fontSize: 10.5, color: "var(--ink-500)",
        lineHeight: 1.5, textAlign: "center" }}>
        Donations routed via verified fundraising partner. Federal contribution limits apply.
      </div>

      <BottomNav active="discover"/>
    </div>
  );
}

// ====================================================
// POLITICIAN PROFILE — Updates feed (their X/Threads)
// ====================================================
function PoliticianUpdatesScreen() {
  const p = MV_DATA.politicianProfile;
  return (
    <div style={{ minHeight: "100%", background: "var(--paper-100)", paddingBottom: 80 }}>
      <div style={{ padding: "10px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink-700)", fontWeight: 600 }}>‹ Back</span>
        <div style={{ flex: 1 }}/>
        <span style={{ color: "var(--ink-700)" }}><IconBell/></span>
      </div>

      {/* COMPACT HEADER */}
      <div style={{ margin: "0 14px", padding: "14px 16px", background: "var(--paper-50)",
        border: "1px solid var(--rule)", borderRadius: 14, display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar initials={p.initials} size={44} tone="paper"/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 600,
              color: "var(--ink-900)", letterSpacing: -0.2 }}>{p.name}</span>
            <IconVerified size={13}/>
          </div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)" }}>
            {p.title} · {(p.stats.followers/1000).toFixed(1)}k followers
          </div>
        </div>
        <button style={{ background: "var(--ink-900)", color: "var(--paper-50)",
          border: "none", padding: "7px 13px", borderRadius: 999, fontFamily: "var(--font-sans)",
          fontWeight: 600, fontSize: 11.5 }}>Following</button>
      </div>

      {/* TABS */}
      <div style={{ margin: "12px 14px 0", display: "flex", gap: 4, padding: 4,
        background: "var(--paper-200)", borderRadius: 12, fontFamily: "var(--font-sans)",
        fontSize: 12, fontWeight: 600 }}>
        {["Overview", "Updates", "Positions", "Events", "Record"].map((t) => (
          <div key={t} style={{ flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: 8,
            background: t === "Updates" ? "var(--paper-50)" : "transparent",
            color: t === "Updates" ? "var(--ink-900)" : "var(--ink-500)" }}>{t}</div>
        ))}
      </div>

      {/* POSTS */}
      <div style={{ margin: "14px 14px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {p.posts.map((post) => (
          <article key={post.id} style={{ background: "var(--paper-50)", border: "1px solid var(--rule)",
            borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Avatar initials={p.initials} size={32} tone="paper"/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
                    color: "var(--ink-900)" }}>{p.name}</span>
                  <IconVerified size={11}/>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)" }}>· {post.time}</span>
                </div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-500)" }}>
                  @{p.handle}
                </div>
              </div>
            </div>

            <div style={{ fontFamily: "var(--font-serif)", fontSize: 15, lineHeight: 1.45,
              color: "var(--ink-900)" }}>{post.text}</div>

            {post.attachment?.kind === "poll" && (
              <div style={{ marginTop: 12, padding: 12, border: "1px solid var(--rule)",
                borderRadius: 10, background: "var(--paper-100)" }}>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
                  color: "var(--ink-900)", marginBottom: 10 }}>{post.attachment.question}</div>
                {[
                  { label: "Yes", val: post.attachment.yes },
                  { label: "No", val: post.attachment.no },
                  { label: "Need more info", val: post.attachment.unsure },
                ].map((opt) => (
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
              </div>
            )}

            {post.attachment?.kind === "image" && (
              <div style={{ marginTop: 12, height: 130, borderRadius: 10,
                background: "linear-gradient(135deg, #DDD6C7 0%, #B5AC97 100%)",
                position: "relative", overflow: "hidden",
                display: "flex", alignItems: "flex-end", padding: 10 }}>
                <div style={{ padding: "4px 9px", background: "rgba(26,33,56,0.78)",
                  color: "var(--paper-50)", borderRadius: 6, fontFamily: "var(--font-sans)",
                  fontSize: 10.5, fontWeight: 500 }}>{post.attachment.caption}</div>
              </div>
            )}

            {post.attachment?.kind === "issue" && (
              <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Pill tone="paper">Tagged · {post.attachment.label}</Pill>
              </div>
            )}

            <PostActionBar likes={post.likes} comments={post.comments} reposts={post.reposts}/>
          </article>
        ))}
      </div>

      <BottomNav active="discover"/>
    </div>
  );
}

Object.assign(window, {
  VoterProfileScreen, PoliticianProfileScreen, PoliticianUpdatesScreen,
});
