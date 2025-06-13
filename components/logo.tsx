import { Check } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-5xl",
  }

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  }

  return (
    <div className={`flex items-center font-bold ${sizeClasses[size]} ${className}`}>
      <span className="text-red-600">My</span>
      <div className="relative inline-flex items-center">
        <Check className={`${iconSizes[size]} text-white bg-blue-600 rounded-sm p-0.5 mx-0.5`} />
      </div>
      <span className="text-blue-800">ote</span>
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

  const checkSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  }

  return (
    <div
      className={`${iconSizes[size]} bg-gradient-to-br from-red-500 via-white to-blue-600 rounded-full flex items-center justify-center border-2 border-gray-200 shadow-lg ${className}`}
    >
      <Check className={`${checkSizes[size]} text-blue-700 font-bold`} strokeWidth={3} />
    </div>
  )
}
