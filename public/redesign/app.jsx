/* global React */
const { useState } = React;
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "headlineSerif": "Source Serif 4",
  "accent": "ink",
  "showOnboarding": false
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  return (
    <React.Fragment>
      <style>{`
        :root {
          --font-serif: "${tweaks.headlineSerif}", "Source Serif 4", "Source Serif Pro", Georgia, serif;
          --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;

          /* Paper-cream neutrals — warm, editorial */
          --paper-50:  #FAF7F2;
          --paper-100: #F2EEE6;
          --paper-200: #E6E0D4;
          --rule:      #DDD6C7;

          /* Ink (deep navy-black, evolved from #1B2B5E) */
          --ink-900:   #1A2138;
          --ink-700:   #3D435A;
          --ink-500:   #6B7088;
          --ink-400:   #8B8FA3;
          --ink-100:   #DEE0E9;

          /* Civic accents — used sparingly, never to claim a side */
          --civic-red:    #B33A2C;
          --common-teal:  #3D8073;
        }
      `}</style>

      <DesignCanvas>
        <DCSection id="home" title="Daily home" subtitle="The engagement spine — countdown, daily question, cross-spectrum story, common ground, local pulse.">
          <DCArtboard id="home-default" label="Home — feed" width={420} height={880}>
            <IOSDevice width={402} height={874}>
              <HomeScreen />
            </IOSDevice>
          </DCArtboard>
          <DCArtboard id="home-answered" label="Home — after answering" width={420} height={880}>
            <IOSDevice width={402} height={874}>
              <HomeScreenAnswered />
            </IOSDevice>
          </DCArtboard>
        </DCSection>

        <DCSection id="stories" title="Story — three lenses" subtitle="Shared facts on top. Tabs surface partisan framing without privileging it.">
          <DCArtboard id="story-shared" label="Story — shared facts" width={420} height={880}>
            <IOSDevice width={402} height={874}>
              <StoryDetailScreen />
            </IOSDevice>
          </DCArtboard>
        </DCSection>

        <DCSection id="ballot" title="Ballot & candidate match" subtitle="A ballot you can defend. Progress is ambient, not panic-inducing.">
          <DCArtboard id="ballot" label="Ballot — progress" width={420} height={880}>
            <IOSDevice width={402} height={874}>
              <BallotScreen />
            </IOSDevice>
          </DCArtboard>
          <DCArtboard id="match" label="Candidate match" width={420} height={880}>
            <IOSDevice width={402} height={874}>
              <MatchScreen />
            </IOSDevice>
          </DCArtboard>
        </DCSection>

        <DCSection id="landing" title="Logged-out landing" subtitle="Trust-first. Local promise leads — not a hero of vague civic copy.">
          <DCArtboard id="landing" label="Landing — guest" width={420} height={880}>
            <IOSDevice width={402} height={874}>
              <LandingScreen />
            </IOSDevice>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel>
        <TweakSection label="Type">
          <TweakRadio
            label="Headline font"
            value={tweaks.headlineSerif}
            options={["Source Serif 4", "Newsreader", "Fraunces"]}
            onChange={(v) => setTweak("headlineSerif", v)}
          />
        </TweakSection>
        <TweakSection label="Engagement">
          <TweakToggle
            label="Show first-run onboarding"
            value={tweaks.showOnboarding}
            onChange={(v) => setTweak("showOnboarding", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

// Variant: home with daily question already answered so reviewers see both states.
function HomeScreenAnswered() {
  // Use the same components but force answered state by injecting a wrapper.
  return (
    <div style={{ minHeight: "100%", background: "var(--paper-100)", paddingBottom: 80 }}>
      <TopBar user={MV_DATA.user} days={MV_DATA.election.daysAway} />
      <CountdownStrip election={{ ...MV_DATA.election, racesDecided: 8 }} />
      <DailyQuestionAnswered q={MV_DATA.dailyQuestion} />
      <CommonGround cg={MV_DATA.commonGround} />
      <StoryCard story={MV_DATA.stories[0]} />
      <LocalPulse pulse={MV_DATA.localPulse} />
      <BottomNav active="home" />
    </div>
  );
}

function DailyQuestionAnswered({ q }) {
  // copy of DailyQuestion with initial picked state
  const totalVotes = q.choices.reduce((s, c) => s + c.count, 0);
  const picked = "yes";

  return (
    <div style={{
      margin: "0 14px 16px", padding: 18, background: "var(--paper-50)",
      borderRadius: 16, border: "1px solid var(--rule)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Pill tone="ink">
          <IconSpark size={10} /> Daily Question · Day 8
        </Pill>
        <Pill tone="teal" style={{ marginLeft: "auto" }}>
          <IconCheck size={9} /> Answered
        </Pill>
      </div>
      <h3 style={{
        fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 18,
        lineHeight: 1.25, letterSpacing: -0.2, color: "var(--ink-900)",
        margin: "0 0 14px",
      }}>{q.prompt}</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        {q.choices.map((c) => {
          const pct = Math.round((c.count / totalVotes) * 100);
          const isPicked = picked === c.id;
          return (
            <div key={c.id} style={{
              position: "relative", overflow: "hidden",
              border: `1px solid ${isPicked ? "var(--ink-900)" : "var(--rule)"}`,
              borderRadius: 10, padding: "11px 13px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "var(--paper-100)",
            }}>
              <div style={{
                position: "absolute", inset: 0, width: `${pct}%`,
                background: isPicked ? "var(--ink-100)" : "var(--paper-200)",
              }} />
              <span style={{
                position: "relative", display: "inline-flex",
                alignItems: "center", gap: 8,
                fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 500,
                color: "var(--ink-900)",
              }}>
                {isPicked && <IconCheck size={12} />}{c.label}
              </span>
              <span style={{
                position: "relative",
                fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
                color: "var(--ink-700)",
              }}>{pct}%</span>
            </div>
          );
        })}
      </div>

      <div style={{ paddingTop: 12, borderTop: "1px solid var(--rule)" }}>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
          letterSpacing: 1, textTransform: "uppercase", color: "var(--ink-500)",
          marginBottom: 8,
        }}>How Georgia answered</div>
        <BreakdownRow label="Fulton County" pct={q.countyBreakdown} />
        <BreakdownRow label="Georgia statewide" pct={q.stateBreakdown} />
      </div>
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

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
