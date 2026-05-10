import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

// All sizes maintain the 3:2 aspect ratio of the actual logo PNG (1536×1024)
const sizeMap = {
  sm: { w: 96,  h: 64  },
  md: { w: 135, h: 90  },
  lg: { w: 165, h: 110 },
  xl: { w: 390, h: 260 },
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const { w, h } = sizeMap[size]
  return (
    <Image
      src="/logo.png"
      alt="MyVote"
      width={w}
      height={h}
      className={className}
      priority
    />
  )
}

export function LogoIcon({ size = "md", className = "" }: LogoProps) {
  const { w, h } = sizeMap[size]
  return (
    <Image
      src="/logo.png"
      alt="MyVote"
      width={w}
      height={h}
      className={className}
      priority
    />
  )
}
