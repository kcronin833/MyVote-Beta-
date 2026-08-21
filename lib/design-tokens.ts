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
  page:        "#F5F5F7",
  /** Pure white card surface */
  card:        "#FFFFFF",
  /** Subtle inner-card shading */
  shade:       "#F0F0F3",

  // ── Borders / rules ─────────────────────────────────────────────────────
  rule:        "#E9EBEF",
  ruleSoft:    "#EEEFF3",

  // ── Ink scale (text) ────────────────────────────────────────────────────
  ink900:      "#030213",
  ink700:      "#3D435A",
  ink500:      "#717182",
  /** Muted label / placeholder — ⚠ 2.9:1 on white, WCAG AA fail, use sparingly */
  ink400:      "#8B8FA3",
  /** Decorative only — ⚠ 2.9:1 on white, never for readable text */
  ink300:      "#B0B4C4",

  // ── Teal (brand primary) ────────────────────────────────────────────────
  teal:        "#030213",
  tealDk:      "#030213",
  tealSoft:    "#EFEFF3",
  tealMid:     "#D9DCE3",
  /** DS-canonical tint-surface border */
  tealBorder:  "#D9DCE3",

  // ── Red ─────────────────────────────────────────────────────────────────
  red:         "#D4183D",
  redSoft:     "#FCE7EA",
  /** DS-canonical tint-surface border */
  redBorder:   "#F3C9D1",

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
