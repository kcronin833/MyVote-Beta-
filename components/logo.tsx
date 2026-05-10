import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeMap = {
  sm: { w: 90,  h: 36  },
  md: { w: 130, h: 52  },
  lg: { w: 160, h: 64  },
  xl: { w: 260, h: 104 },
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
  const iconMap = {
    sm: { w: 32, h: 32 },
    md: { w: 40, h: 40 },
    lg: { w: 48, h: 48 },
    xl: { w: 64, h: 64 },
  }
  const { w, h } = iconMap[size]
  return (
    <Image
      src="/logo-icon.png"
      alt="MyVote"
      width={w}
      height={h}
      className={className}
      priority
    />
  )
}
