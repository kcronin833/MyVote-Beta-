import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

// logo.png is 1536×1024 (3:2 ratio).
// The wordmark ("My" script + "Vote" serif) occupies the top ~44% of the image.
// Below it: tagline + four brand icons — hidden in nav contexts via overflow:hidden.

const IMG_ASPECT = 1536 / 1024  // 1.5  (width ÷ height)
const WORDMARK_FRAC = 0.44       // wordmark = top 44% of image height (slight buffer)

// Width of the logo container in each nav size
const NAV_WIDTHS: Record<"sm" | "md" | "lg", number> = {
  sm: 110,  // desktop top-nav (h-14 bar)
  md: 130,  // medium contexts
  lg: 160,  // news-nav / wider bars
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  // Full-size hero: show entire image (wordmark + tagline + icons)
  if (size === "xl") {
    return (
      <div className={`mx-auto ${className}`} style={{ maxWidth: 480 }}>
        <Image
          src="/logo.png"
          alt="MyVote"
          width={480}
          height={320}
          style={{ width: "100%", height: "auto" }}
          priority
        />
      </div>
    )
  }

  // Nav sizes: overflow:hidden clips tagline + icons, showing only the wordmark
  const displayWidth = NAV_WIDTHS[size]
  const fullImageHeight = displayWidth / IMG_ASPECT              // rendered height of full image
  const containerHeight = Math.round(fullImageHeight * WORDMARK_FRAC)  // clip to wordmark area

  return (
    <div
      className={className}
      style={{
        width: displayWidth,
        height: containerHeight,
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
        lineHeight: 0,   // prevent baseline gap below the img
      }}
    >
      <Image
        src="/logo.png"
        alt="MyVote"
        width={1536}
        height={1024}
        style={{ width: displayWidth, height: "auto", display: "block" }}
        priority
      />
    </div>
  )
}

export function LogoIcon({ size = "md", className = "" }: LogoProps) {
  return <Logo size={size} className={className} />
}
