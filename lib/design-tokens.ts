/**
 * MyVote Design Tokens — single source of truth for all inline-style colors.
 *
 * Import in any component:
 *   import { C } from "@/lib/design-tokens"
 *
 * The `C` object is intentionally flat so usages read like CSS:
 *   style={{ color: C.ink700, background: C.tealSoft }}
 *
 * PALETTE is an alias kept for `components/desktop/atoms.tsx` backward compat.
 */

export const C = {
  // ── Backgrounds ─────────────────────────────────────────────────────────
  /** Warm paper page background */
  page:        "#F3F1EB",
  /** Pure white card surface */
  card:        "#FFFFFF",
  /** Subtle inner-card shading */
  shade:       "#F7F5EF",

  // ── Borders / rules ─────────────────────────────────────────────────────
  rule:        "#E4E0D3",
  ruleSoft:    "#EFEBE0",

  // ── Ink scale (text) ────────────────────────────────────────────────────
  ink900:      "#1A2138",
  ink700:      "#3D435A",
  ink500:      "#6B7088",
  /** Muted label / placeholder — ⚠ 2.9:1 on white, WCAG AA fail, use sparingly */
  ink400:      "#8B8FA3",
  /** Decorative only — ⚠ 2.9:1 on white, never for readable text */
  ink300:      "#B0B4C4",

  // ── Teal (brand primary) ────────────────────────────────────────────────
  teal:        "#3D8073",
  tealDk:      "#2F6358",
  tealSoft:    "#E6F0ED",
  tealMid:     "#C0DAD4",
  /** DS-canonical tint-surface border */
  tealBorder:  "#C9DDD7",

  // ── Red ─────────────────────────────────────────────────────────────────
  red:         "#B33A2C",
  redSoft:     "#F5E3DF",
  /** DS-canonical tint-surface border */
  redBorder:   "#E8CDC7",

  // ── Amber ───────────────────────────────────────────────────────────────
  amber:       "#B8862F",
  amberSoft:   "#F4ECD8",
  amberMid:    "#E8D9B2",
  amberBorder: "#E2D2A8",

  // ── Party / lean accents ────────────────────────────────────────────────
  plum:        "#6B3A6B",
  plumSoft:    "#F2E8F2",
  /** Democrat / progressive lean */
  navy:        "#1F3A5F",
  /** Republican / conservative lean */
  olive:       "#5A6A2E",

  // ── Muted lenses — non-partisan editorial voice (DS canonical) ──────────
  leanLeftMuted:   "#7796C2",
  leanRightMuted:  "#C29377",
  leanCenterMuted: "#9CA39C",

  // ── Semantic blue (links, info states) ──────────────────────────────────
  blue:        "#1D4ED8",
  blueSoft:    "#DBEAFE",
} as const;

export type DesignTokens = typeof C;

/** Alias exported by components/desktop/atoms.tsx — kept for backward compat */
export const PALETTE = C;
