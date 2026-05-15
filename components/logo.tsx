import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizes = {
  sm: { mark: 30, text: 18, tagline: 9 },
  md: { mark: 38, text: 22, tagline: 10 },
  lg: { mark: 48, text: 28, tagline: 11 },
  xl: { mark: 74, text: 46, tagline: 13 },
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const s = sizes[size]
  const isXL = size === "xl"

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: isXL ? 14 : 9,
        flexShrink: 0,
      }}
      aria-label="MyVote"
    >
      <div
        style={{
          width: s.mark,
          height: s.mark,
          borderRadius: isXL ? 20 : 12,
          background: "var(--paper-50)",
          border: "1px solid var(--rule)",
          boxShadow: "0 10px 26px rgba(26, 33, 56, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Image
          src="/logo.png"
          alt=""
          width={s.mark * 1.5}
          height={s.mark}
          style={{
            width: "118%",
            height: "auto",
            objectFit: "contain",
            transform: "scale(1.12)",
          }}
          priority
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: s.text,
            fontWeight: 600,
            letterSpacing: "-0.045em",
            color: "var(--ink-900)",
          }}
        >
          MyVote
        </span>
        {size !== "sm" && (
          <span
            style={{
              marginTop: 4,
              fontFamily: "var(--font-sans)",
              fontSize: s.tagline,
              fontWeight: 700,
              letterSpacing: "0.11em",
              textTransform: "uppercase",
              color: "var(--ink-500)",
            }}
          >
            Facts first
          </span>
        )}
      </div>
    </div>
  )
}

export function LogoIcon({ size = "md", className = "" }: LogoProps) {
  const s = sizes[size]
  return (
    <div
      className={className}
      style={{
        width: s.mark,
        height: s.mark,
        borderRadius: size === "xl" ? 20 : 12,
        background: "var(--paper-50)",
        border: "1px solid var(--rule)",
        boxShadow: "0 10px 26px rgba(26, 33, 56, 0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
      }}
      aria-label="MyVote"
    >
      <Image
        src="/logo.png"
        alt=""
        width={s.mark * 1.5}
        height={s.mark}
        style={{ width: "118%", height: "auto", objectFit: "contain", transform: "scale(1.12)" }}
        priority
      />
    </div>
  )
}