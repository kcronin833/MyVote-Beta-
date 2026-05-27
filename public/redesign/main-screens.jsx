/* global React, MV_DATA */

// =============== HOME SCREEN ===============
function HomeScreen() {
  return (
    <div style={{ minHeight: "100%", background: "var(--paper-100)", paddingBottom: 80 }}>
      <TopBar user={MV_DATA.user} days={MV_DATA.election.daysAway} />
      <CountdownStrip election={MV_DATA.election} />
      <DailyQuestion q={MV_DATA.dailyQuestion} />
      <StoryCard story={MV_DATA.stories[0]} />
      <CommonGround cg={MV_DATA.commonGround} />
      <LocalPulse pulse={MV_DATA.localPulse} />
      <BottomNav active="home" />
    </div>
  );
}

// =============== STORY DETAIL ===============
function StoryDetailScreen() {
  const story = MV_DATA.stories[0];
  const [tab, setTab] = React.useState("shared");
  const tabs = [
    { id: "shared", label: "Shared facts" },
    { id: "left",   label: "Left lens" },
    { id: "right",  label: "Right lens" },
  ];

  return (
    <div style={{ minHeight: "100%", background: "var(--paper-50)", paddingBottom: 80 }}>
      {/* Back bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "14px 18px 8px", color: "var(--ink-900)",
      }}>
        <button style={{
          background: "transparent", border: "none", cursor: "pointer",
          color: "var(--ink-900)", padding: 0,
          fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
          display: "inline-flex", alignItems: "center", gap: 4,
        }}>‹ Stories</button>
      </div>

      <div style={{ padding: "0 18px 14px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          <Pill tone="paper"><IconMap size={10} /> {story.county}</Pill>
          <Pill tone="ghost">{story.sources} sources</Pill>
        </div>
        <h1 style={{
          fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 600,
          letterSpacing: -0.6, lineHeight: 1.15, color: "var(--ink-900)",
          margin: "0 0 8px",
        }}>{story.headline}</h1>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--ink-500)",
        }}>
          {story.readers.toLocaleString()} Georgians read this · updated {story.time} ago
        </div>
      </div>

      {/* Lens tabs */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        padding: "0 14px 0",
        background: "var(--paper-50)",
        borderBottom: "1px solid var(--rule)",
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "12px 6px", border: "none", background: "transparent",
              fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
              color: tab === t.id ? "var(--ink-900)" : "var(--ink-400)",
              cursor: "pointer",
              borderBottom: `2px solid ${tab === t.id ? "var(--ink-900)" : "transparent"}`,
              marginBottom: -1,
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 18px" }}>
        {tab === "shared" && (
          <div>
            <div style={{
              fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
              letterSpacing: 1.2, textTransform: "uppercase", color: "var(--ink-500)",
              marginBottom: 12,
            }}>What every source agrees on</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {story.sharedFacts.map((f, i) => (
                <li key={i} style={{
                  display: "flex", gap: 12, padding: "10px 0",
                  borderBottom: "1px solid var(--rule)",
                }}>
                  <span style={{
                    flexShrink: 0,
                    fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 600,
                    color: "var(--ink-400)", minWidth: 18,
                  }}>{i + 1}</span>
                  <span style={{
                    fontFamily: "var(--font-serif)", fontSize: 16, lineHeight: 1.4,
                    color: "var(--ink-900)",
                  }}>{f}</span>
                </li>
              ))}
            </ul>

            <div style={{
              marginTop: 22, padding: 14, background: "var(--paper-100)",
              borderRadius: 12,
            }}>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
                letterSpacing: 1.2, textTransform: "uppercase", color: "var(--ink-500)",
                marginBottom: 8,
              }}>Coverage spread</div>
              <SplitBar height={10} segs={[
                { label: "Left",   value: 5, color: "#7796C2" },
                { label: "Center", value: 4, color: "#9CA39C" },
                { label: "Right",  value: 5, color: "#C29377" },
              ]} />
              <div style={{
                display: "flex", justifyContent: "space-between", marginTop: 8,
                fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--ink-700)",
              }}>
                <span>5 left-leaning</span>
                <span>4 center</span>
                <span>5 right-leaning</span>
              </div>
            </div>
          </div>
        )}

        {tab === "left" && <PerspectiveDetail p={story.perspectives.left} side="left" />}
        {tab === "right" && <PerspectiveDetail p={story.perspectives.right} side="right" />}
      </div>

      <BottomNav active="discover" />
    </div>
  );
}

function PerspectiveDetail({ p, side }) {
  const label = side === "left" ? "How left-leaning outlets framed it" : "How right-leaning outlets framed it";
  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
      }}>
        <LeanDot lean={side} />
        <span style={{
          fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
          letterSpacing: 1.2, textTransform: "uppercase", color: "var(--ink-500)",
        }}>{label}</span>
      </div>
      <h2 style={{
        fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 500,
        lineHeight: 1.25, letterSpacing: -0.3, color: "var(--ink-900)",
        margin: "0 0 10px",
      }}>{p.headline}</h2>
      <p style={{
        fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.5,
        color: "var(--ink-700)", margin: "0 0 14px",
      }}>{p.excerpt}</p>
      <div style={{
        padding: 12, background: "var(--paper-100)", borderRadius: 10,
        fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--ink-500)",
      }}>Source: <span style={{ color: "var(--ink-900)", fontWeight: 600 }}>{p.source}</span></div>
    </div>
  );
}

// =============== MARKETING / LANDING (logged out) ===============
function LandingScreen() {
  return (
    <div style={{ minHeight: "100%", background: "var(--paper-50)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <img src="redesign/myvote-logo.png" alt="MyVote" style={{ height: 22, width: "auto", display: "block" }} />
        <button style={{
          background: "transparent", border: "none", padding: 0, cursor: "pointer",
          fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
          color: "var(--ink-700)",
        }}>Sign in</button>
      </div>

      <div style={{ padding: "40px 22px 0", flex: 1 }}>
        <Pill tone="paper" style={{ marginBottom: 18 }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--civic-red)", display: "inline-block" }} />
          Georgia 2026 · {MV_DATA.election.daysAway} days
        </Pill>

        <h1 style={{
          fontFamily: "var(--font-serif)", fontSize: 36, fontWeight: 500,
          letterSpacing: -1.2, lineHeight: 1.05, color: "var(--ink-900)",
          margin: "0 0 16px",
        }}>
          See what's<br />
          <em style={{ fontStyle: "italic", color: "var(--ink-700)" }}>actually</em><br />
          happening<br />
          where you live.
        </h1>

        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.5,
          color: "var(--ink-700)", margin: "0 0 28px", maxWidth: 300,
        }}>
          Read the same shared facts as your neighbors — left, center, and right. Build a ballot you can defend. No ads, no algorithm bait.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          <button style={{
            background: "var(--ink-900)", color: "var(--paper-50)",
            padding: "14px 18px", borderRadius: 99, border: "none",
            fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600,
            cursor: "pointer",
          }}>Get my Georgia ballot →</button>
          <button style={{
            background: "transparent", color: "var(--ink-900)",
            padding: "14px 18px", borderRadius: 99,
            border: "1px solid var(--rule)",
            fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600,
            cursor: "pointer",
          }}>Browse without signing up</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { k: "Three lenses, one truth", v: "Every story shown left, center, right — facts on top." },
            { k: "Your district, your voice", v: "See what neighbors in your zip code are debating right now." },
            { k: "A ballot you can defend", v: "Match your views to every race — federal to soil & water." },
          ].map(item => (
            <div key={item.k} style={{
              display: "flex", gap: 12, padding: "12px 0",
              borderTop: "1px solid var(--rule)",
            }}>
              <span style={{
                fontFamily: "var(--font-serif)", fontSize: 14, fontWeight: 600,
                color: "var(--ink-400)", letterSpacing: -0.2, paddingTop: 1,
                minWidth: 18,
              }}>0{["k","v","x"].indexOf(item.k[0]) + 1 || "•"}</span>
              <div>
                <div style={{
                  fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 600,
                  color: "var(--ink-900)",
                }}>{item.k}</div>
                <div style={{
                  fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--ink-500)",
                  lineHeight: 1.4, marginTop: 2,
                }}>{item.v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        padding: "18px 22px 28px",
        fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-400)",
        textAlign: "center",
      }}>
        MyVote is non-partisan and not affiliated with any party or campaign.
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, StoryDetailScreen, LandingScreen });
