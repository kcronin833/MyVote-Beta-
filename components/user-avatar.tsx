"use client"

interface UserAvatarProps {
  avatarUrl?: string | null
  displayName?: string | null
  size?: "xs" | "sm" | "md" | "lg"
  className?: string
}

const SIZE_MAP = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-lg",
}

function getInitials(name?: string | null) {
  if (!name) return "MV"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function UserAvatar({ avatarUrl, displayName, size = "md", className = "" }: UserAvatarProps) {
  const sizeClass = SIZE_MAP[size]

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={displayName || "Avatar"}
        loading="lazy"
        decoding="async"
        className={`${sizeClass} rounded-full object-cover flex-shrink-0 ${className}`}
      />
    )
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-ink-900 flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}
    >
      {getInitials(displayName)}
    </div>
  )
}
