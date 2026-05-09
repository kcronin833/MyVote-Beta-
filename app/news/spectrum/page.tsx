"use client"

import { NewsNavigation } from "@/components/news-nav"
import { SpectrumWheel } from "@/components/spectrum-wheel"

export default function SpectrumPage() {
  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <div className="container mx-auto px-4 pt-4 pb-8">
        <NewsNavigation />
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Political Spectrum</h1>
            <p className="text-sm text-muted-foreground mt-1">
              The same story, across every perspective. Drag the spectrum to filter by political lean.
            </p>
          </div>
          <SpectrumWheel />
        </div>
      </div>
    </div>
  )
}
