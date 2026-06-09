/* Desktop redesign shared atoms — Avatar, Chip, Btn, LeanDot, VerifiedMark.
   Built to match the prototype in `design_handoff_myvote_desktop/source/desktop.jsx`
   pixel-for-pixel. Colors are literal hex from the design spec so visual fidelity
   doesn't depend on Tailwind config; surrounding layout uses Tailwind. */

import type { ReactNode, CSSProperties } from "react";
import { C } from "@/lib/design-tokens";

export type AvatarTone = "ink" | "navy" | "plum" | "olive";
type ChipTone = "neutral" | "teal" | "red" | "amber" | "inkSolid";
type BtnVariant = "primary" | "donate" | "outline" | "ghost" | "soft";
type Size = "sm" | "md" | "lg";

const toneBg = (t?: AvatarTone) =>
  t === "navy" ? C.navy : t === "plum" ? C.plum : t === "olive" ? C.olive : C.ink900;

/* ── Avatar ─────────────────────────────────────────────────────────── */
export function Avatar({
  name,
  initials,
  size = 48,
  tone,
  ring,
}: {
  name?: string;
  initials?: string;
  size?: number;
  tone?: AvatarTone;
  ring?: boolean;
}) {
  const label =
    initials || (name || "?").split(" ").map((s) => s[0]).slice(0, 2).join("");
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: toneBg(tone),
        color: "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: size * 0.36,
        letterSpacing: 0.2,
        boxShadow: ring ? `0 0 0 3px ${C.card}, 0 0 0 4px ${C.rule}` : "none",
        flexShrink: 0,
      }}
    >
      {label}
    </div>
  );
}

/* ── LeanDot ────────────────────────────────────────────────────────── */
export function LeanDot({ lean, size = 8 }: { lean: "left" | "right" | "center"; size?: number }) {
  const c = lean === "left" ? "#3A6AA5" : lean === "right" ? "#A53A3A" : "#7A7A7A";
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: c,
      }}
    />
  );
}

/* ── Chip ───────────────────────────────────────────────────────────── */
export function Chip({
  children,
  tone = "neutral",
  size = "md",
}: {
  children: ReactNode;
  tone?: ChipTone;
  size?: "sm" | "md";
}) {
  const styles: Record<ChipTone, { bg: string; fg: string; br: string }> = {
    neutral:  { bg: C.shade,    fg: C.ink700, br: C.rule },
    teal:     { bg: C.tealSoft, fg: C.tealDk, br: "#C9DDD7" },
    red:      { bg: C.redSoft,  fg: C.red,    br: "#E8CDC7" },
    amber:    { bg: C.amberSoft,fg: C.amber,  br: "#E2D2A8" },
    inkSolid: { bg: C.ink900,   fg: "#fff",   br: C.ink900 },
  };
  const s = styles[tone];
  const pad = size === "sm" ? "2px 7px" : "4px 9px";
  const fs = size === "sm" ? 10.5 : 11.5;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: pad,
        borderRadius: 999,
        background: s.bg,
        color: s.fg,
        border: `1px solid ${s.br}`,
        fontSize: fs,
        fontWeight: 600,
        letterSpacing: 0.1,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

/* ── Btn ────────────────────────────────────────────────────────────── */
export function Btn({
  children,
  variant = "primary",
  size = "md",
  icon,
  full,
  style: extraStyle,
  onClick,
}: {
  children: ReactNode;
  variant?: BtnVariant;
  size?: Size;
  icon?: ReactNode;
  full?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  const variants: Record<BtnVariant, { bg: string; fg: string; br: string }> = {
    primary: { bg: C.teal,         fg: "#fff",    br: C.teal },
    donate:  { bg: C.red,          fg: "#fff",    br: C.red },
    outline: { bg: "transparent",  fg: C.ink900,  br: C.ink900 },
    ghost:   { bg: "transparent",  fg: C.ink700,  br: "transparent" },
    soft:    { bg: C.shade,        fg: C.ink900,  br: C.rule },
  };
  const sizes: Record<Size, { p: string; fs: number }> = {
    sm: { p: "6px 12px",  fs: 12.5 },
    md: { p: "9px 16px",  fs: 13.5 },
    lg: { p: "12px 22px", fs: 14.5 },
  };
  const v = variants[variant];
  const s = sizes[size];
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: s.p,
        borderRadius: 999,
        background: v.bg,
        color: v.fg,
        border: `1.5px solid ${v.br}`,
        fontWeight: 600,
        fontSize: s.fs,
        letterSpacing: 0.1,
        cursor: "pointer",
        width: full ? "100%" : "auto",
        ...extraStyle,
      }}
    >
      {icon}
      {children}
    </button>
  );
}

/* ── VerifiedMark — 12-point star with teal fill + white check ─────── */
export function VerifiedMark({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        d="M12 1l2.5 2L18 2l1 3.5 3 1.5-1.5 3L22 13l-3 1-1 3.5-3.5-1L12 19l-2.5-2L6 18l-1-3.5-3-1L3.5 10 2 7l3-1.5L6 2l3.5 1z"
        fill="#3D8073"
      />
      <path
        d="M8 12l3 3 5-6"
        stroke="#fff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* shared color palette (escape hatch for ad-hoc inline styles) */
export const PALETTE = C;
