/* MyVote logo — pure SVG / HTML wordmark.
   Replaces the old PNG-clipping approach with a crisp, scalable mark
   that works on any background at any size with zero image dependency.

   Mark:      teal rounded-square ballot checkmark
   Wordmark:  "My" (weight 400) + "Vote" (weight 800) in Inter / system sans

   Usage:
     <Logo size="sm" />             — nav (default / dark-text variant)
     <Logo size="lg" variant="white" /> — on dark backgrounds */

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "white"
  className?: string
}

/** Teal rounded-square with a white ballot checkmark inside. */
function BallotMark({ px }: { px: number }) {
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, display: "block" }}
    >
      <rect width="24" height="24" rx="6" fill="#3D8073" />
      <path
        d="M6 12.5L9.5 16L18 7"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const SIZE_MAP = {
  sm: { mark: 20, text: 16,  gap: 6,  tracking: "-0.03em"  },
  md: { mark: 24, text: 19,  gap: 7,  tracking: "-0.035em" },
  lg: { mark: 30, text: 24,  gap: 9,  tracking: "-0.04em"  },
  xl: { mark: 42, text: 34,  gap: 12, tracking: "-0.045em" },
} as const

export function Logo({
  size = "md",
  variant = "default",
  className = "",
}: LogoProps) {
  const cfg = SIZE_MAP[size] ?? SIZE_MAP.md
  const textColor = variant === "white" ? "#ffffff" : "#1A2138"

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: cfg.gap,
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      <BallotMark px={cfg.mark} />
      <span
        style={{
          fontFamily: "var(--font-sans), Inter, system-ui, sans-serif",
          fontSize: cfg.text,
          lineHeight: 1,
          letterSpacing: cfg.tracking,
          color: textColor,
          whiteSpace: "nowrap",
        }}
        aria-label="MyVote"
      >
        <span style={{ fontWeight: 400 }}>My</span>
        <span style={{ fontWeight: 800 }}>Vote</span>
      </span>
    </div>
  )
}

/* Backward-compat alias */
export function LogoIcon({ size = "md", className = "" }: LogoProps) {
  return <Logo size={size} className={className} />
}
