/* global React, MV_DATA */
const { useState } = React;

// =============== BALLOT SCREEN ===============
function BallotScreen() {
  const { ballot, election } = MV_DATA;
  const decided = ballot.filter(b => b.status === "decided").length;
  const leaning = ballot.filter(b => b.status === "leaning").length;
  const pct = (decided / ballot.length) * 100;

  return (
    <div style={{ minHeight: "100%", background: "var(--paper-100)", paddingBottom: 80 }}>
      <div style={{ padding: "14px 18px 6px" }}>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600,
          color: "var(--ink-500)", letterSpacing: 0.4, marginBottom: 2,
        }}>{election.nextLabel} · {election.daysAway} days</div>
        <h1 style={{
          fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 600,
          letterSpacing: -0.6, color: "var(--ink-900)", margin: "0 0 4px",
          lineHeight: 1.1,
        }}>Your ballot</h1>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink-500)",
          margin: 0,
        }}>{ballot.length} races · {decided} decided · {leaning} leaning</p>
      </div>

      <div style={{
        margin: "14px 14px 18px", padding: 16, background: "var(--paper-50)",
        borderRadius: 14, border: "1px solid var(--rule)",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
            letterSpacing: 1.2, textTransform: "uppercase", color: "var(--ink-500)",
          }}>Progress</div>
          <div style={{
            fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600,
            color: "var(--ink-900)", letterSpacing: -0.4,
          }}>{Math.round(pct)}%</div>
        </div>
        <ProgressBar value={decided} max={ballot.length} />
        <div style={{
          display: "flex", justifyContent: "space-between", marginTop: 8,
          fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-500)",
        }}>
          <span>Decided {decided}</span>
          <span>Leaning {leaning}</span>
          <span>Undecided {ballot.length - decided - leaning}</span>
        </div>
      </div>

      <StoryRule label="Federal" right="3 races" />
      <RaceCardGroup races={ballot.slice(0, 3)} />
      <StoryRule label="State executive" right="5 races" />
      <RaceCardGroup races={ballot.slice(3, 8)} />
      <StoryRule label="Local" right="4 races" />
      <RaceCardGroup races={ballot.slice(8)} />

      <BottomNav active="ballot" />
    </div>
  );
}

function RaceCardGroup({ races }) {
  return (
    <div style={{ margin: "0 14px", display: "flex", flexDirection: "column", gap: 6 }}>
      {races.map(r => <RaceRow key={r.id} race={r} />)}
    </div>
  );
}

function RaceRow({ race }) {
  const statusMap = {
    decided:   { icon: <IconCheck size={11} />, color: "var(--ink-900)", bg: "var(--ink-100)", label: "Decided" },
    leaning:   { icon: "·", color: "#8E5919", bg: "#F6ECD8", label: "Leaning" },
    undecided: { icon: <IconCircle size={11} />, color: "var(--ink-500)", bg: "var(--paper-200)", label: "Open" },
  };
  const s = statusMap[race.status];
  return (
    <div style={{
      padding: "13px 14px", background: "var(--paper-50)", borderRadius: 12,
      border: "1px solid var(--rule)", display: "flex",
      alignItems: "center", gap: 12,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 99,
        background: s.bg, color: s.color,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>{s.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 600,
          color: "var(--ink-900)",
        }}>{race.race}</div>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)",
        }}>{race.match || s.label}</div>
      </div>
      <span style={{ color: "var(--ink-400)" }}><IconChevronRight /></span>
    </div>
  );
}

// =============== CANDIDATE MATCH SCREEN ===============
function MatchScreen() {
  const { candidates } = MV_DATA;
  const top = candidates[0];
  const rest = candidates.slice(1);

  return (
    <div style={{ minHeight: "100%", background: "var(--paper-100)", paddingBottom: 80 }}>
      <div style={{ padding: "14px 18px 8px" }}>
        <Pill tone="paper" style={{ marginBottom: 8 }}>
          <IconMap size={10} /> U.S. Senate · GA
        </Pill>
        <h1 style={{
          fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 600,
          letterSpacing: -0.5, color: "var(--ink-900)", margin: "0 0 4px",
          lineHeight: 1.15,
        }}>How your views align</h1>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--ink-500)",
          margin: 0, maxWidth: 280,
        }}>Based on 18 issue stances. Tap any issue to compare in detail.</p>
      </div>

      <TopMatchCard c={top} />

      <StoryRule label="Other candidates" />
      <div style={{ margin: "0 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {rest.map(c => <CandidateRow key={c.name} c={c} />)}
      </div>

      <div style={{
        margin: "20px 14px 0", padding: 14, background: "var(--paper-50)",
        borderRadius: 12, border: "1px dashed var(--rule)",
        fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--ink-500)",
        lineHeight: 1.4,
      }}>
        Compatibility reflects your answers to MyVote's policy questions, not endorsements.
        Update yours anytime in Profile.
      </div>

      <BottomNav active="ballot" />
    </div>
  );
}

function TopMatchCard({ c }) {
  return (
    <div style={{
      margin: "10px 14px 16px", padding: 18,
      background: "var(--ink-900)", color: "var(--paper-50)",
      borderRadius: 16, position: "relative", overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 99,
          background: "var(--paper-100)", color: "var(--ink-900)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 20,
        }}>{c.initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "var(--font-serif)", fontSize: 19, fontWeight: 600,
            letterSpacing: -0.3, lineHeight: 1.1,
          }}>{c.name}</div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, opacity: 0.65 }}>{c.role}</div>
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6,
      }}>
        <span style={{
          fontFamily: "var(--font-serif)", fontSize: 56, fontWeight: 600,
          letterSpacing: -2, lineHeight: 1,
        }}>{c.match}</span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, opacity: 0.7 }}>% alignment</span>
      </div>

      <div style={{ marginBottom: 14 }}>
        <SplitBar segs={[
          { label: "agree",   value: c.issues.filter(i => i.agree === "agree").length,   color: "#F2EBE3" },
          { label: "partial", value: c.issues.filter(i => i.agree === "partial").length, color: "rgba(242,235,227,0.45)" },
          { label: "disagree",value: c.issues.filter(i => i.agree === "disagree").length,color: "rgba(242,235,227,0.18)" },
        ]} height={6} />
        <div style={{
          display: "flex", gap: 12, marginTop: 8,
          fontFamily: "var(--font-sans)", fontSize: 11, opacity: 0.7,
        }}>
          <span>{c.issues.filter(i => i.agree === "agree").length} agree</span>
          <span>{c.issues.filter(i => i.agree === "partial").length} partial</span>
          <span>{c.issues.filter(i => i.agree === "disagree").length} disagree</span>
        </div>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14,
      }}>
        {c.issues.slice(0, 6).map(iss => (
          <div key={iss.name} style={{
            padding: "8px 10px", borderRadius: 8,
            background: "rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: 99,
              background: iss.agree === "agree" ? "#9FCFA8"
                       : iss.agree === "partial" ? "#E6CB73"
                       : "rgba(255,255,255,0.3)",
            }} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 500 }}>{iss.name}</span>
          </div>
        ))}
      </div>

      <button style={{
        width: "100%", padding: "11px", borderRadius: 99, border: "none",
        background: "var(--paper-50)", color: "var(--ink-900)",
        fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
        cursor: "pointer", display: "inline-flex",
        alignItems: "center", justifyContent: "center", gap: 4,
      }}>
        Read full profile <IconChevronRight size={12} />
      </button>
    </div>
  );
}

function CandidateRow({ c }) {
  return (
    <div style={{
      padding: 14, background: "var(--paper-50)", borderRadius: 12,
      border: "1px solid var(--rule)",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <Avatar initials={c.initials} tone="paper" size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 600,
          color: "var(--ink-900)",
        }}>{c.name}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)" }}>{c.role}</div>
        <div style={{ marginTop: 6 }}>
          <ProgressBar value={c.match} max={100} />
        </div>
      </div>
      <div style={{
        fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600,
        color: "var(--ink-900)", letterSpacing: -0.4, minWidth: 44, textAlign: "right",
      }}>{c.match}%</div>
    </div>
  );
}

Object.assign(window, { BallotScreen, MatchScreen });
