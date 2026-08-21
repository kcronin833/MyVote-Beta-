"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Users, UserPlus, Search as SearchIcon, Share2 } from "lucide-react"
import { C } from "@/lib/design-tokens"
import { useAuth } from "@/components/auth-context"
import { UserAvatar } from "@/components/user-avatar"
import { FriendButton } from "@/components/friend-button"
import {
  listFriends,
  listIncomingRequests,
  listOutgoingRequests,
  acceptFriendRequest,
  removeFriend,
  type PublicPerson,
} from "@/lib/friend-requests-service"

const cardBase: React.CSSProperties = {
  background: C.card,
  border: `1px solid ${C.rule}`,
  borderRadius: 12,
  boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
}

function PersonRow({ p, right }: { p: PublicPerson; right?: React.ReactNode }) {
  return (
    <div style={{ ...cardBase, padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
      <Link href={`/profile/${p.username}`} style={{ flexShrink: 0 }}>
        <UserAvatar avatarUrl={p.avatar_url} displayName={p.display_name} size="lg" />
      </Link>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link href={`/profile/${p.username}`} style={{ fontSize: 14.5, fontWeight: 700, color: C.ink900, textDecoration: "none" }}>
          {p.display_name}
        </Link>
        <p style={{ fontSize: 12, color: C.ink400, margin: "1px 0 0" }}>@{p.username}</p>
        {(p.bio || p.location) && (
          <p style={{ fontSize: 12.5, color: C.ink500, margin: "3px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {p.bio || `${p.location}, GA`}
          </p>
        )}
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  )
}

function Section({ icon, title, count, children }: { icon: React.ReactNode; title: string; count: number; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        {icon}
        <h2 style={{ fontSize: 15, fontWeight: 800, color: C.ink900, margin: 0 }}>{title}</h2>
        {count > 0 && (
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.tealDk, background: C.tealSoft, borderRadius: 999, padding: "1px 9px" }}>{count}</span>
        )}
      </div>
      {children}
    </div>
  )
}

const btn = (variant: "accept" | "decline"): React.CSSProperties => ({
  height: 32, padding: "0 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: "pointer", flexShrink: 0,
  border: variant === "decline" ? `1.5px solid ${C.rule}` : "none",
  background: variant === "accept" ? C.teal : "transparent",
  color: variant === "accept" ? "#fff" : C.ink500,
})

export default function FriendsPage() {
  const { user, loading: authLoading } = useAuth()
  const [friends, setFriends] = useState<PublicPerson[]>([])
  const [incoming, setIncoming] = useState<PublicPerson[]>([])
  const [outgoing, setOutgoing] = useState<PublicPerson[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [invited, setInvited] = useState(false)

  async function invite() {
    const text = "Join me on MyVote — Georgia's free, nonpartisan voter guide. See your ballot, follow local issues, and connect with neighbors:"
    const url = "https://www.myvotega.com"
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "MyVote", text, url })
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        setInvited(true)
        setTimeout(() => setInvited(false), 2000)
      }
    } catch { /* dismissed */ }
  }

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const [f, inc, out] = await Promise.all([
      listFriends(user.id),
      listIncomingRequests(user.id),
      listOutgoingRequests(user.id),
    ])
    setFriends(f); setIncoming(inc); setOutgoing(out)
    setLoading(false)
  }, [user])

  useEffect(() => { if (user) load() }, [user, load])

  async function accept(p: PublicPerson) {
    if (busy) return
    setBusy(p.id)
    const { error } = await acceptFriendRequest(user!.id, p.id)
    if (!error) {
      setIncoming((xs) => xs.filter((x) => x.id !== p.id))
      setFriends((xs) => [p, ...xs])
    }
    setBusy(null)
  }

  async function decline(p: PublicPerson, from: "incoming" | "outgoing") {
    if (busy) return
    setBusy(p.id)
    const { error } = await removeFriend(user!.id, p.id)
    if (!error) {
      if (from === "incoming") setIncoming((xs) => xs.filter((x) => x.id !== p.id))
      else setOutgoing((xs) => xs.filter((x) => x.id !== p.id))
    }
    setBusy(null)
  }

  if (!authLoading && !user) {
    return (
      <div style={{ background: C.page, minHeight: "100vh" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 16px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: C.shade, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Users size={24} color={C.ink400} />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: C.ink900, margin: "0 0 6px" }}>Your friends on MyVote</h1>
          <p style={{ fontSize: 13.5, color: C.ink500, margin: "0 0 20px" }}>Sign in to connect with neighbors and see your friend requests.</p>
          <Link href="/auth/signin" style={{ display: "inline-block", background: C.teal, color: "#fff", fontWeight: 700, fontSize: 14, padding: "10px 22px", borderRadius: 999, textDecoration: "none" }}>
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: C.page, minHeight: "100vh" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 16px 48px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: C.ink500, textDecoration: "none", marginBottom: 14 }}>
          <ArrowLeft size={14} /> Home
        </Link>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.ink900, margin: 0 }}>Friends</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={invite} style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", borderRadius: 999, background: "transparent", border: `1.5px solid ${C.rule}`, color: C.tealDk, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
              <Share2 size={14} /> {invited ? "Copied ✓" : "Invite"}
            </button>
            <Link href="/search" style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", borderRadius: 999, background: C.teal, color: "#fff", fontSize: 12.5, fontWeight: 700, textDecoration: "none" }}>
              <SearchIcon size={14} /> Find people
            </Link>
          </div>
        </div>

        {loading ? (
          <p style={{ fontSize: 13.5, color: C.ink500 }}>Loading…</p>
        ) : (
          <>
            {incoming.length > 0 && (
              <Section icon={<UserPlus size={16} color={C.tealDk} />} title="Friend requests" count={incoming.length}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {incoming.map((p) => (
                    <PersonRow key={p.id} p={p} right={
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => accept(p)} disabled={busy === p.id} style={btn("accept")}>Accept</button>
                        <button onClick={() => decline(p, "incoming")} disabled={busy === p.id} style={btn("decline")}>Decline</button>
                      </div>
                    } />
                  ))}
                </div>
              </Section>
            )}

            <Section icon={<Users size={16} color={C.tealDk} />} title="Your friends" count={friends.length}>
              {friends.length === 0 ? (
                <div style={{ ...cardBase, padding: "20px 16px", textAlign: "center" }}>
                  <p style={{ fontSize: 13.5, color: C.ink500, margin: "0 0 4px", fontWeight: 600 }}>No friends yet</p>
                  <p style={{ fontSize: 12.5, color: C.ink400, margin: 0 }}>
                    Use <Link href="/search" style={{ color: C.teal, fontWeight: 600 }}>Find people</Link> to search members and send a request.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {friends.map((p) => (
                    <PersonRow key={p.id} p={p} right={
                      <FriendButton targetUserId={p.id} initialState="friends" size="default"
                        onChange={(s) => { if (s === "none") setFriends((xs) => xs.filter((x) => x.id !== p.id)) }} />
                    } />
                  ))}
                </div>
              )}
            </Section>

            {outgoing.length > 0 && (
              <Section icon={<UserPlus size={16} color={C.ink400} />} title="Requests you sent" count={outgoing.length}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {outgoing.map((p) => (
                    <PersonRow key={p.id} p={p} right={
                      <button onClick={() => decline(p, "outgoing")} disabled={busy === p.id} style={btn("decline")}>Cancel</button>
                    } />
                  ))}
                </div>
              </Section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
