import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

// The logo PNG is 1536×1024 (3:2). The wordmark "My[✓]ote" occupies the top ~42%.
// Nav sizes crop to wordmark only via object-fit cover + top position.
// xl shows the full brand guide image, responsive.
const navSizes = {
  sm: { w: 100, h: 28 },
  md: { w: 140, h: 39 },
  lg: { w: 180, h: 50 },
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  if (size === "xl") {
    // Responsive full brand guide — fills container width up to 480px
    return (
      <div className={`w-full max-w-[480px] mx-auto ${className}`} style={{ aspectRatio: "3/2", position: "relative" }}>
        <Image
          src="/logo.png"
          alt="MyVote"
          fill
          style={{ objectFit: "contain", objectPosition: "center" }}
          priority
        />
      </div>
    )
  }

  const { w, h } = navSizes[size]
  return (
    <div style={{ width: w, height: h, position: "relative", flexShrink: 0 }} className={className}>
      <Image
        src="/logo.png"
        alt="MyVote"
        fill
        style={{ objectFit: "cover", objectPosition: "top center" }}
        priority
      />
    </div>
  )
}

export function LogoIcon({ size = "md", className = "" }: LogoProps) {
  return <Logo size={size} className={className} />
}
