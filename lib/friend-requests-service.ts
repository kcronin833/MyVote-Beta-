import { createClient } from "@/lib/supabase/client"

/* Mutual friend system (request -> accept), distinct from the one-way
   follow system in lib/friends-service.ts. All reads/writes go through the
   friendships table, which is RLS-protected so a user can only see and act on
   relationships they are part of. Profiles are fetched in a second query and
   limited to PUBLIC columns only — never email / full_name. */

export type FriendState = "none" | "outgoing" | "incoming" | "friends" | "self"

export interface PublicPerson {
  id: string
  username: string
  display_name: string
  avatar_url: string | null
  bio: string | null
  location: string | null
  political_lean: string | null
  verified: boolean | null
}

const PUBLIC_COLS = "id, username, display_name, avatar_url, bio, location, political_lean, verified"

interface FriendshipRow {
  id: string
  requester_id: string
  addressee_id: string
  status: "pending" | "accepted"
}

async function fetchPeople(ids: string[]): Promise<Record<string, PublicPerson>> {
  if (ids.length === 0) return {}
  const supabase = createClient()
  const { data } = await supabase.from("profiles").select(PUBLIC_COLS).in("id", ids)
  const map: Record<string, PublicPerson> = {}
  for (const p of (data as PublicPerson[]) || []) map[p.id] = p
  return map
}

/** Current friendship state between me and another user. */
export async function getFriendState(meId: string, otherId: string): Promise<FriendState> {
  if (meId === otherId) return "self"
  const supabase = createClient()
  const { data } = await supabase
    .from("friendships")
    .select("requester_id, addressee_id, status")
    .or(
      `and(requester_id.eq.${meId},addressee_id.eq.${otherId}),and(requester_id.eq.${otherId},addressee_id.eq.${meId})`
    )
    .limit(1)
  const row = (data as FriendshipRow[] | null)?.[0]
  if (!row) return "none"
  if (row.status === "accepted") return "friends"
  return row.requester_id === meId ? "outgoing" : "incoming"
}

/** Send a friend request (me -> other). Guards against an existing relationship. */
export async function sendFriendRequest(meId: string, otherId: string): Promise<{ error: string | null }> {
  if (meId === otherId) return { error: "You can't friend yourself." }
  const state = await getFriendState(meId, otherId)
  if (state !== "none") return { error: null } // already connected / pending
  const supabase = createClient()
  const { error } = await supabase
    .from("friendships")
    .insert({ requester_id: meId, addressee_id: otherId, status: "pending" })
  return { error: error?.message ?? null }
}

/** Accept a request that other -> me. */
export async function acceptFriendRequest(meId: string, otherId: string): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { error } = await supabase
    .from("friendships")
    .update({ status: "accepted", updated_at: new Date().toISOString() })
    .eq("requester_id", otherId)
    .eq("addressee_id", meId)
    .eq("status", "pending")
  return { error: error?.message ?? null }
}

/** Remove any relationship in either direction: cancel, decline, or unfriend. */
export async function removeFriend(meId: string, otherId: string): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { error } = await supabase
    .from("friendships")
    .delete()
    .or(
      `and(requester_id.eq.${meId},addressee_id.eq.${otherId}),and(requester_id.eq.${otherId},addressee_id.eq.${meId})`
    )
  return { error: error?.message ?? null }
}

/** Accepted friends of a user (public profiles). */
export async function listFriends(userId: string): Promise<PublicPerson[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from("friendships")
    .select("requester_id, addressee_id")
    .eq("status", "accepted")
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
  const rows = (data as FriendshipRow[]) || []
  const otherIds = rows.map((r) => (r.requester_id === userId ? r.addressee_id : r.requester_id))
  const people = await fetchPeople(otherIds)
  return otherIds.map((id) => people[id]).filter(Boolean)
}

/** Pending requests sent TO me (I can accept/decline). */
export async function listIncomingRequests(meId: string): Promise<PublicPerson[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from("friendships")
    .select("requester_id")
    .eq("addressee_id", meId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
  const ids = ((data as { requester_id: string }[]) || []).map((r) => r.requester_id)
  const people = await fetchPeople(ids)
  return ids.map((id) => people[id]).filter(Boolean)
}

/** Pending requests I sent (awaiting their response). */
export async function listOutgoingRequests(meId: string): Promise<PublicPerson[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from("friendships")
    .select("addressee_id")
    .eq("requester_id", meId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
  const ids = ((data as { addressee_id: string }[]) || []).map((r) => r.addressee_id)
  const people = await fetchPeople(ids)
  return ids.map((id) => people[id]).filter(Boolean)
}

/** Public count of accepted friends for any user. Uses a SECURITY DEFINER
    function so the count is visible on anyone's profile — the friendship rows
    themselves stay private to the two parties via RLS. */
export async function getFriendCount(userId: string): Promise<number> {
  const supabase = createClient()
  const { data } = await supabase.rpc("friend_count", { uid: userId })
  return typeof data === "number" ? data : 0
}

/** How many pending requests are waiting for me to act on (for a nav badge). */
export async function getIncomingRequestCount(meId: string): Promise<number> {
  const supabase = createClient()
  const { count } = await supabase
    .from("friendships")
    .select("id", { count: "exact", head: true })
    .eq("addressee_id", meId)
    .eq("status", "pending")
  return count ?? 0
}
