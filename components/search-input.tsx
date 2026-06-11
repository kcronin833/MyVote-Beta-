"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { SearchService } from "@/lib/search-service"

const C = {
  card:   "#FDFCF9",
  rule:   "#E4E0D3",
  ink900: "#1A2138",
  ink500: "#6B7088",
  ink400: "#8B8FA3",
  shade:  "#F0EDE6",
  page:   "#F5F3EE",
}

export function SearchInput() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (query.trim()) {
      setSuggestions(SearchService.getSearchSuggestions(query))
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [query])

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query
    if (finalQuery.trim()) {
      setShowSuggestions(false)
      router.push(`/search?q=${encodeURIComponent(finalQuery.trim())}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
    else if (e.key === "Escape") { setShowSuggestions(false); inputRef.current?.blur() }
  }

  const clearSearch = () => {
    setQuery("")
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
      {/* Input pill */}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <Search size={15} color={C.ink400} style={{ position: "absolute", left: 12, pointerEvents: "none" }} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search candidates, issues, neighbors…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          style={{
            width: "100%",
            height: 38,
            paddingLeft: 34,
            paddingRight: query ? 30 : 12,
            borderRadius: 999,
            border: `1.5px solid ${C.rule}`,
            background: C.card,
            color: C.ink900,
            fontSize: 13.5,
            outline: "none",
          }}
        />
        {query && (
          <button
            onClick={clearSearch}
            style={{ position: "absolute", right: 10, background: "none", border: "none", cursor: "pointer", color: C.ink400, padding: 2, lineHeight: 0 }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
          background: C.card, border: `1px solid ${C.rule}`, borderRadius: 12,
          boxShadow: "0 8px 32px rgba(20,24,40,0.14)", overflow: "hidden", maxHeight: 240, overflowY: "auto",
        }}>
          {suggestions.map((s, i) => (
            <div
              key={i}
              onClick={() => { setQuery(s); handleSearch(s) }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 14px", cursor: "pointer", fontSize: 13.5, color: C.ink900,
                borderBottom: i < suggestions.length - 1 ? `1px solid ${C.rule}` : "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.shade)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Search size={12} color={C.ink400} style={{ flexShrink: 0 }} />
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
