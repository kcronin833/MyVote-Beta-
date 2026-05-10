import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

// Logo PNG is 1536×1024 (3:2). All sizes maintain that ratio and show the full image.
const navSizes = {
  sm: { w: 66, h: 44 },
  md: { w: 90, h: 60 },
  lg: { w: 120, h: 80 },
}

export function Logo({ size = "md", className = "" }: LogoProps) {
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

  const { w, h } = navSizes[size]
  return (
    <Image
      src="/logo.png"
      alt="MyVote"
      width={w}
      height={h}
      className={className}
      style={{ flexShrink: 0 }}
      priority
    />
  )
}

export function LogoIcon({ size = "md", className = "" }: LogoProps) {
  return <Logo size={size} className={className} />
}
