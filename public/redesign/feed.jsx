/* global React, MV_DATA */
const { useState } = React;

// =============== TOP BAR ===============
function TopBar({ user, days }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 18px 10px", background: "var(--paper-50)",
    }}>
      <div>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600,
          color: "var(--ink-500)", letterSpacing: 0.4,
        }}>{user.city}, Georgia</div>
        <img src="redesign/myvote-logo.png" alt="MyVote" style={{ height: 24, width: "auto", display: "block", marginTop: 2 }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--ink-700)" }}>
        <button style={btnGhost}><IconBell /></button>
        <Avatar initials={user.initials} size={32} />
      </div>
    </div>
  );
}

const btnGhost = {
  background: "transparent", border: "none", padding: 0,
  color: "var(--ink-700)", cursor: "pointer", display: "inline-flex",
};

// =============== ELECTION COUNTDOWN STRIP ===============
function CountdownStrip({ election }) {
  const pct = (election.racesDecided / election.racesTotal) * 100;
  return (
    <div style={{
      margin: "0 14px 14px", padding: "12px 14px",
      background: "var(--ink-900)", color: "var(--paper-50)",
      borderRadius: 14, display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700,
            letterSpacing: 1.2, textTransform: "uppercase", opacity: 0.55,
          }}>{election.nextLabel}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{
              fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 600,
              letterSpacing: -0.5, lineHeight: 1,
            }}>{election.daysAway}</span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, opacity: 0.7 }}>
              days · {election.nextDate}
            </span>
          </div>
        </div>
        <button style={{
          background: "var(--paper-50)", color: "var(--ink-900)",
          fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
          padding: "8px 12px", borderRadius: 99, border: "none",
          display: "inline-flex", alignItems: "center", gap: 4,
        }}>
          Finish ballot <IconChevronRight />
        </button>
      </div>
      <div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontFamily: "var(--font-sans)", fontSize: 11, marginBottom: 5, opacity: 0.7,
        }}>
          <span>Your ballot</span>
          <span>{election.racesDecided} / {election.racesTotal} decided</span>
        </div>
        <div style={{
          height: 5, background: "rgba(255,255,255,0.15)", borderRadius: 99,
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${pct}%`, background: "var(--paper-50)",
            borderRadius: 99,
          }} />
        </div>
      </div>
    </div>
  );
}

// =============== DAILY QUESTION ===============
function DailyQuestion({ q }) {
  const [picked, setPicked] = useState(null);
  const answered = picked !== null;
  const totalVotes = q.choices.reduce((s, c) => s + c.count, 0);

  return (
    <div style={{
      margin: "0 14px 16px", padding: 18, background: "var(--paper-50)",
      borderRadius: 16, border: "1px solid var(--rule)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Pill tone="ink">
          <IconSpark size={10} /> Daily Question · Day {MV_DATA.user.streak}
        </Pill>
      </div>
      <h3 style={{
        fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 19,
        lineHeight: 1.25, letterSpacing: -0.2, color: "var(--ink-900)",
        margin: "0 0 6px",
      }}>{q.prompt}</h3>
      <p style={{
        fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--ink-500)",
        margin: "0 0 14px",
      }}>{q.context}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {q.choices.map((c) => {
          const pct = Math.round((c.count / totalVotes) * 100);
          const isPicked = picked === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setPicked(c.id)}
              style={{
                position: "relative", overflow: "hidden",
                border: `1px solid ${isPicked ? "var(--ink-900)" : "var(--rule)"}`,
                background: answered ? "var(--paper-100)" : "var(--paper-50)",
                borderRadius: 10, padding: "11px 13px", cursor: "pointer",
                fontFamily: "var(--font-sans)", textAlign: "left",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                gap: 8,
              }}
            >
              {answered && (
                <div style={{
                  position: "absolute", inset: 0,
                  width: `${pct}%`,
                  background: isPicked ? "var(--ink-100)" : "var(--paper-200)",
                  transition: "width .5s ease",
                }} />
              )}
              <span style={{
                position: "relative", display: "inline-flex",
                alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 500,
                color: "var(--ink-900)",
              }}>
                {isPicked && <IconCheck size={12} />}
                {c.label}
              </span>
              {answered && (
                <span style={{
                  position: "relative", fontFamily: "var(--font-sans)",
                  fontSize: 12, fontWeight: 600, color: "var(--ink-700)",
                }}>{pct}%</span>
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--rule)" }}>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
            letterSpacing: 1, textTransform: "uppercase", color: "var(--ink-500)",
            marginBottom: 8,
          }}>How Georgia answered</div>
          <BreakdownRow label="Fulton County" pct={q.countyBreakdown} />
          <BreakdownRow label="Georgia statewide" pct={q.stateBreakdown} />
          <div style={{
            marginTop: 10, fontFamily: "var(--font-sans)", fontSize: 11.5,
            color: "var(--ink-500)",
          }}>
            {q.neighborsAnswered} people in your district answered today.
          </div>
        </div>
      )}

      {!answered && (
        <div style={{
          marginTop: 12, fontFamily: "var(--font-sans)", fontSize: 11.5,
          color: "var(--ink-500)",
        }}>
          {totalVotes.toLocaleString()} Georgians answered so far. Tap to see the breakdown.
        </div>
      )}
    </div>
  );
}

function BreakdownRow({ label, pct }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        fontFamily: "var(--font-sans)", fontSize: 11.5, marginBottom: 4,
        color: "var(--ink-700)",
      }}>
        <span>{label}</span>
        <span style={{ color: "var(--ink-500)" }}>
          {pct.yes}% yes · {pct.no}% no · {pct.unsure}% unsure
        </span>
      </div>
      <SplitBar segs={[
        { label: "yes",    value: pct.yes,    color: "var(--ink-900)" },
        { label: "no",     value: pct.no,     color: "var(--ink-400)" },
        { label: "unsure", value: pct.unsure, color: "var(--paper-200)" },
      ]} />
    </div>
  );
}

// =============== CROSS-SPECTRUM STORY CARD ===============
function StoryCard({ story }) {
  return (
    <article style={{
      margin: "0 14px 14px", padding: 18, background: "var(--paper-50)",
      borderRadius: 16, border: "1px solid var(--rule)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
        fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-500)",
      }}>
        <Pill tone="paper">
          <IconMap size={10} /> {story.county}
        </Pill>
        <span>·</span>
        <span>{story.sources} sources</span>
        <span>·</span>
        <span>{story.time}</span>
      </div>
      <h3 style={{
        fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 20,
        lineHeight: 1.2, letterSpacing: -0.3, color: "var(--ink-900)",
        margin: "0 0 14px",
      }}>{story.headline}</h3>

      <div style={{
        background: "var(--paper-100)", borderRadius: 12,
        padding: "12px 14px", marginBottom: 14,
      }}>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
          letterSpacing: 1.2, textTransform: "uppercase", color: "var(--ink-500)",
          marginBottom: 8,
        }}>What every source agrees on</div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {story.sharedFacts.slice(0, 3).map((f, i) => (
            <li key={i} style={{
              display: "flex", gap: 8, padding: "5px 0",
              fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.4,
              color: "var(--ink-900)",
            }}>
              <span style={{
                flexShrink: 0, marginTop: 6, width: 4, height: 4,
                borderRadius: 99, background: "var(--ink-900)",
              }} />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {story.perspectives && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <PerspectiveRow side="left"   p={story.perspectives.left} />
          <PerspectiveRow side="center" p={story.perspectives.center} />
          <PerspectiveRow side="right"  p={story.perspectives.right} />
        </div>
      )}

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--rule)",
        fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)",
      }}>
        <span>{story.readers.toLocaleString()} read this · 23 comments</span>
        <button style={{
          background: "transparent", border: "1px solid var(--rule)",
          padding: "6px 12px", borderRadius: 99, fontFamily: "var(--font-sans)",
          fontSize: 12, fontWeight: 600, color: "var(--ink-900)", cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 4,
        }}>
          Read all sides <IconChevronRight size={11} />
        </button>
      </div>
    </article>
  );
}

function PerspectiveRow({ side, p }) {
  const label = side === "left" ? "Left lens" : side === "right" ? "Right lens" : "Shared lens";
  return (
    <div style={{
      display: "flex", gap: 10, padding: "10px 12px",
      background: "var(--paper-100)", borderRadius: 10,
    }}>
      <LeanDot lean={side} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6, marginBottom: 2,
          fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
          letterSpacing: 0.8, textTransform: "uppercase", color: "var(--ink-500)",
        }}>
          <span>{label}</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>{p.source}</span>
        </div>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 12.5, lineHeight: 1.4,
          color: "var(--ink-900)", fontWeight: 500,
        }}>{p.headline}</div>
      </div>
    </div>
  );
}

// =============== COMMON GROUND CARD ===============
function CommonGround({ cg }) {
  return (
    <div style={{
      margin: "0 14px 14px", padding: 18, borderRadius: 16,
      background: "linear-gradient(180deg, #E8F0EE 0%, #F2F6F4 100%)",
      border: "1px solid #C9DDD7",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <Pill tone="teal">Common ground</Pill>
      </div>
      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
        letterSpacing: 1.2, textTransform: "uppercase", color: "#1F5B53",
        marginBottom: 4,
      }}>{cg.issue}</div>
      <p style={{
        fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 500,
        lineHeight: 1.3, letterSpacing: -0.2, color: "var(--ink-900)",
        margin: "0 0 16px",
      }}>{cg.summary}</p>

      <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
        <SupportColumn label="Left voters" pct={cg.left} />
        <SupportColumn label="Right voters" pct={cg.right} />
      </div>
      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 10.5,
        color: "var(--ink-500)", fontStyle: "italic",
      }}>{cg.source}</div>
    </div>
  );
}

function SupportColumn({ label, pct }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600,
        color: "var(--ink-700)", marginBottom: 4,
      }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{
          fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 600,
          color: "var(--ink-900)", letterSpacing: -0.5,
        }}>{pct}%</span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-500)" }}>support</span>
      </div>
      <div style={{ marginTop: 4 }}>
        <ProgressBar value={pct} max={100} tone="teal" />
      </div>
    </div>
  );
}

// =============== LOCAL PULSE ===============
function LocalPulse({ pulse }) {
  return (
    <div style={{
      margin: "0 14px 14px", padding: 18, background: "var(--paper-50)",
      borderRadius: 16, border: "1px solid var(--rule)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <Pill tone="ink"><IconMap size={10} /> Local pulse · {pulse.city}</Pill>
        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-500)",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: 99,
            background: "#2D8C5F", display: "inline-block",
          }} />
          {pulse.activeNow} active
        </div>
      </div>
      <h3 style={{
        fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 18,
        margin: "8px 0 12px", color: "var(--ink-900)", lineHeight: 1.25,
        letterSpacing: -0.2,
      }}>What your neighbors are talking about</h3>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {pulse.topics.map((t) => (
          <span key={t.tag} style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "5px 10px", borderRadius: 99,
            background: "var(--paper-100)", border: "1px solid var(--rule)",
            fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500,
            color: "var(--ink-900)",
          }}>
            #{t.tag}
            {t.trend === "up" && (
              <span style={{ color: "#2D8C5F", display: "inline-flex" }}>
                <IconArrowUp size={10} />
              </span>
            )}
            <span style={{ color: "var(--ink-500)", fontSize: 11 }}>{t.mentions}</span>
          </span>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {pulse.neighborPosts.map((p, i) => (
          <NeighborPost key={i} p={p} />
        ))}
      </div>
    </div>
  );
}

function NeighborPost({ p }) {
  return (
    <div style={{ display: "flex", gap: 10, paddingTop: 12, borderTop: "1px solid var(--rule)" }}>
      <Avatar initials={p.name.split(" ").map(n => n[0]).join("")} size={32} tone="paper" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-500)",
          marginBottom: 4,
        }}>
          <span style={{ fontWeight: 600, color: "var(--ink-900)" }}>{p.name}</span>
          <LeanDot lean={p.lean} />
          <span>· {p.district}</span>
          <span>· {p.time}</span>
        </div>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 13.5, lineHeight: 1.4,
          color: "var(--ink-900)", margin: "0 0 6px",
        }}>{p.text}</p>
        <div style={{
          display: "flex", gap: 16, fontFamily: "var(--font-sans)",
          fontSize: 11.5, color: "var(--ink-500)",
        }}>
          <span>♡ {p.likes}</span>
          <span>↩ {p.replies}</span>
          <span style={{ marginLeft: "auto", fontWeight: 600, color: "var(--ink-700)" }}>Reply</span>
        </div>
      </div>
    </div>
  );
}

// =============== BOTTOM NAV ===============
function BottomNav({ active = "home" }) {
  const items = [
    { id: "home",      icon: IconHome,    label: "Home" },
    { id: "discover",  icon: IconCompass, label: "Stories" },
    { id: "ballot",    icon: IconVote,    label: "Ballot" },
    { id: "network",   icon: IconUsers,   label: "Local" },
    { id: "profile",   icon: IconUsers,   label: "You" },
  ];
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0,
      padding: "8px 14px 22px", background: "var(--paper-50)",
      borderTop: "1px solid var(--rule)",
      display: "flex", justifyContent: "space-around",
    }}>
      {items.map(({ id, icon: Ic, label }) => {
        const isActive = id === active;
        return (
          <button key={id} style={{
            background: "transparent", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: isActive ? "var(--ink-900)" : "var(--ink-400)",
            padding: "4px 12px",
          }}>
            <Ic size={20} />
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600,
              letterSpacing: 0.2,
            }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, {
  TopBar, CountdownStrip, DailyQuestion, StoryCard,
  CommonGround, LocalPulse, NeighborPost, BottomNav,
});
