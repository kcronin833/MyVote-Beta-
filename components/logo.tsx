/* MyVote logo — uses the official brand PNG.
   Source: /redesign/myvote-logo.png  (1050 × 400 px, ratio 2.625)
   Intentionally uses a plain <img> tag — simpler and works universally.

   variant="white" wraps the logo in a frosted-white pill so it reads
   cleanly on dark/gradient hero backgrounds. */

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "white"
  className?: string
}

// Rendered heights; width auto-scales at 2.625 : 1
const HEIGHT: Record<string, number> = {
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64,
}

export function Logo({
  size = "md",
  variant = "default",
  className = "",
}: LogoProps) {
  const h = HEIGHT[size] ?? HEIGHT.md
  const w = Math.round(h * 2.625)

  const imgEl = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/redesign/myvote-logo.png"
      alt="MyVote"
      width={w}
      height={h}
      style={{
        display: "block",
        width: w,
        height: h,
        objectFit: "contain",
        userSelect: "none",
      }}
    />
  )

  if (variant === "white") {
    // On dark/gradient backgrounds: wrap in a frosted white pill so the
    // navy + red brand mark is legible against any dark surface.
    return (
      <div
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.93)",
          borderRadius: 10,
          padding: `${Math.round(h * 0.14)}px ${Math.round(h * 0.28)}px`,
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
          flexShrink: 0,
        }}
      >
        {imgEl}
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}
    >
      {imgEl}
    </div>
  )
}

/* Backward-compat alias */
export function LogoIcon({ size = "md", className = "" }: LogoProps) {
  return <Logo size={size} className={className} />
}
