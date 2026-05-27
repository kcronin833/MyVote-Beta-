/* global React */
// Shared UI atoms for MyVote redesign
const { useState } = React;

// Lean-aware accent color — neutral by default, never partisan red/blue
function LeanDot({ lean }) {
  const map = {
    left:   { bg: "#7796C2", label: "L" }, // muted slate-blue
    right:  { bg: "#C29377", label: "R" }, // muted terracotta
    center: { bg: "#9CA39C", label: "C" },
  };
  const s = map[lean] || map.center;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 14, height: 14, borderRadius: 999, background: s.bg,
        color: "#fff", fontSize: 8, fontWeight: 700, letterSpacing: 0,
      }}
      title={`${s.label} - district perspective`}
    >{s.label}</span>
  );
}

function Avatar({ initials, size = 36, tone = "ink" }) {
  const bg = tone === "ink" ? "var(--ink-900)" : "var(--paper-200)";
  const fg = tone === "ink" ? "var(--paper-50)" : "var(--ink-900)";
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: bg, color: fg,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: size * 0.36,
      letterSpacing: 0.2, flexShrink: 0,
    }}>{initials}</div>
  );
}

function Pill({ children, tone = "ink", style }) {
  const tones = {
    ink:    { bg: "var(--paper-200)", fg: "var(--ink-700)", bd: "transparent" },
    red:    { bg: "#F7E6E1", fg: "#8C2510", bd: "transparent" },
    teal:   { bg: "#DDECE9", fg: "#1F5B53", bd: "transparent" },
    paper:  { bg: "var(--paper-50)", fg: "var(--ink-700)", bd: "var(--rule)" },
    ghost:  { bg: "transparent", fg: "var(--ink-500)", bd: "var(--rule)" },
  };
  const t = tones[tone] || tones.ink;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 8px", borderRadius: 999,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      fontFamily: "var(--font-sans)", fontWeight: 600,
      fontSize: 10.5, letterSpacing: 0.4, textTransform: "uppercase",
      lineHeight: 1, ...style,
    }}>{children}</span>
  );
}

function StoryRule({ label, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0 10px" }}>
      <span style={{
        fontFamily: "var(--font-sans)", fontSize: 10.5,
        fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase",
        color: "var(--ink-500)",
      }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: "var(--rule)" }} />
      {right && <span style={{
        fontFamily: "var(--font-sans)", fontSize: 10.5,
        color: "var(--ink-400)", fontWeight: 500,
      }}>{right}</span>}
    </div>
  );
}

function ProgressBar({ value, max, tone = "ink" }) {
  const pct = Math.min(100, (value / max) * 100);
  const fill = tone === "red" ? "var(--civic-red)" : tone === "teal" ? "var(--common-teal)" : "var(--ink-900)";
  return (
    <div style={{
      width: "100%", height: 6, background: "var(--paper-200)",
      borderRadius: 99, overflow: "hidden",
    }}>
      <div style={{
        height: "100%", width: `${pct}%`, background: fill,
        borderRadius: 99, transition: "width .4s ease",
      }} />
    </div>
  );
}

// Stacked horizontal bar showing left/center/right or yes/no/unsure split
function SplitBar({ segs, height = 8 }) {
  const total = segs.reduce((s, x) => s + x.value, 0);
  return (
    <div style={{
      display: "flex", width: "100%", height,
      borderRadius: 99, overflow: "hidden", background: "var(--paper-200)",
    }}>
      {segs.map((s, i) => (
        <div key={i} title={`${s.label}: ${Math.round((s.value/total)*100)}%`}
          style={{ width: `${(s.value/total)*100}%`, background: s.color }} />
      ))}
    </div>
  );
}

function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 003.4 0" />
    </svg>
  );
}

function IconCheck({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconChevronRight({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconCircle({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function IconSpark({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </svg>
  );
}

function IconMap({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-6.5-7-12a7 7 0 1114 0c0 5.5-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function IconHome({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" />
    </svg>
  );
}

function IconCompass({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polygon points="15 9 13 13 9 15 11 11 15 9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconVote({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l4-4h10l4 4" /><path d="M3 17v3h18v-3" />
      <path d="M9 8l2 2 4-5" />
    </svg>
  );
}

function IconUsers({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
      <circle cx="9.5" cy="7" r="3.5" />
      <path d="M21 21v-2a4 4 0 00-3-3.87" />
      <path d="M17 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function IconArrowUp({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

Object.assign(window, {
  LeanDot, Avatar, Pill, StoryRule, ProgressBar, SplitBar,
  IconBell, IconCheck, IconChevronRight, IconCircle, IconSpark,
  IconMap, IconHome, IconCompass, IconVote, IconUsers, IconArrowUp,
});
