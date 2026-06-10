"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, MapPin, Users } from "lucide-react"
import { NewsNavigation } from "@/components/news-nav"
import { useAuth } from "@/components/auth-context"
import { getSuggestedUsers, type SuggestedUser } from "@/lib/suggestions-service"
import { UserAvatar } from "@/components/user-avatar"
import { FollowButton } from "@/components/follow-button"

const FILTERS = ["All", "Same City", "Similar Views", "Recently Joined"] as const
type Filter = (typeof FILTERS)[number]

export default function DiscoverPage() {
  const { user } = useAuth()
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>("All")
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!user) { setLoading(false); return }
    getSuggestedUsers(user.id, 40)
      .then(setSuggestions)
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false))
  }, [user])

  const displayed = suggestions.filter((u) => {
    if (search && !u.display_name.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === "Same City") return u.reason.startsWith("Same city")
    if (filter === "Similar Views") return u.sharedIssues.length > 0
    if (filter === "Recently Joined") return true
    return true
  })

  return (
    <div className="min-h-screen bg-paper-100">
      <div className="container mx-auto px-4 pt-4 pb-8">
        <NewsNavigation />

        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Find your neighbors.</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Connect with Georgia voters in your community.
            </p>
          </div>

          {/* Search + filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#6B7088" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name…"
                className="w-full pl-9 pr-4 focus:outline-none"
                style={{ height: 40, background: "#FDFCF9", border: "1.5px solid #E4E0D3", borderRadius: 999, fontSize: 13.5, color: "#1A2138", paddingRight: 16 }}
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {FILTERS.map((f) => {
                const active = filter === f
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 999,
                      fontSize: 12.5,
                      fontWeight: active ? 700 : 500,
                      color: active ? "#fff" : "#6B7088",
                      background: active ? "#2F6358" : "transparent",
                      border: `1.5px solid ${active ? "#2F6358" : "#E4E0D3"}`,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {f}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl border border-border p-4 animate-pulse space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-muted rounded w-28" />
                      <div className="h-2.5 bg-muted rounded w-20" />
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-5 w-16 bg-muted rounded-full" />
                    <div className="h-5 w-20 bg-muted rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : !user ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Sign in to discover neighbors
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create an account to connect with Georgia voters near you.
              </p>
              <Link href="/auth/signup">
                <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2 rounded-xl transition-colors">
                  Sign Up Free
                </button>
              </Link>
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No matches found</h3>
              <p className="text-sm text-muted-foreground">
                {filter !== "All"
                  ? "Try 'All' to see everyone, or clear your search."
                  : "More neighbors will appear as MyVote grows."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayed.map((suggested) => (
                <div
                  key={suggested.id}
                  className="mv-lift"
                  style={{ background: "#FDFCF9", border: "1px solid #E4E0D3", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12, boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)" }}
                >
                  <div className="flex items-start gap-3">
                    <Link href={`/profile/${suggested.username}`} className="flex-shrink-0">
                      <UserAvatar
                        avatarUrl={suggested.avatar_url}
                        displayName={suggested.display_name}
                        size="md"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/profile/${suggested.username}`}>
                        <p className="font-semibold text-foreground hover:underline truncate leading-tight">
                          {suggested.display_name}
                        </p>
                      </Link>
                      {suggested.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          {suggested.location}, GA
                        </p>
                      )}
                    </div>
                    <FollowButton targetUserId={suggested.id} size="sm" />
                  </div>

                  {suggested.sharedIssues.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {suggested.sharedIssues.map((issue) => (
                        <span
                          key={issue}
                          className="px-2 py-0.5 bg-teal-100 text-teal-700 text-[10px] font-semibold rounded-full"
                        >
                          {issue}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">{suggested.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
