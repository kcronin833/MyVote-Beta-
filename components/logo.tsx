"use client"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const NAVY = "#1B2B5E"
const RED = "#CC2020"

export function Logo({ size = "md", className = "" }: LogoProps) {
  const config = {
    sm: { textSize: "text-xl",   box: 24, stroke: 2.5, checkScale: 1.15 },
    md: { textSize: "text-3xl",  box: 34, stroke: 3,   checkScale: 1.2  },
    lg: { textSize: "text-4xl",  box: 42, stroke: 3.5, checkScale: 1.2  },
    xl: { textSize: "text-6xl",  box: 58, stroke: 4.5, checkScale: 1.2  },
  }

  const { textSize, box, stroke, checkScale } = config[size]
  const checkSize = box * checkScale

  return (
    <div className={`flex items-center leading-none select-none ${textSize} ${className}`}>
      <span
        style={{ fontFamily: "Georgia, 'Palatino Linotype', serif", fontStyle: "italic", fontWeight: 700, color: NAVY }}
      >
        My
      </span>

      {/* Ballot box with red checkmark */}
      <span className="relative inline-flex items-center justify-center mx-1 flex-shrink-0" style={{ width: box, height: box }}>
        {/* Box border */}
        <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`} fill="none" style={{ position: "absolute", inset: 0 }}>
          <rect x={stroke / 2} y={stroke / 2} width={box - stroke} height={box - stroke} rx={2} stroke={NAVY} strokeWidth={stroke} />
        </svg>
        {/* Red checkmark — extends above box */}
        <svg
          width={checkSize}
          height={checkSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke={RED}
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ position: "absolute", top: -box * 0.28, left: -box * 0.08 }}
        >
          <polyline points="4 13 9 18 20 5" />
        </svg>
      </span>

      <span
        style={{ fontFamily: "Georgia, 'Palatino Linotype', serif", fontStyle: "italic", fontWeight: 700, color: NAVY }}
      >
        ote
      </span>
    </div>
  )
}

export function LogoIcon({ size = "md", className = "" }: LogoProps) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  return (
    <div
      className={`${iconSizes[size]} bg-white rounded-md flex items-center justify-center border-2 shadow-sm ${className}`}
      style={{ borderColor: NAVY }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" className="w-3/5 h-3/5">
        <polyline points="4 13 9 18 20 5" />
      </svg>
    </div>
  )
}
