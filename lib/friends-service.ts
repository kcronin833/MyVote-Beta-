import { createClient } from "@/lib/supabase/client"

export interface FriendComment {
  id: string
  content: string
  article_url: string
  article_title: string
  created_at: string
  user_id: string
  profile: {
    username: string
    display_name: string
    avatar_url: string | null
    political_lean: string
  }
}

/** Get IDs of users the current user follows */
export async function getFollowingIds(userId: string): Promise<string[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("user_follows")
    .select("following_id")
    .eq("follower_id", userId)

  if (error || !data) return []
  return data.map((row) => row.following_id)
}

/** Get recent comments from users the current user follows */
export async function getFriendsComments(userId: string): Promise<FriendComment[]> {
  const followingIds = await getFollowingIds(userId)
  if (followingIds.length === 0) return []

  const supabase = createClient()
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      id,
      content,
      article_url,
      article_title,
      created_at,
      user_id,
      profile:profiles(username, display_name, avatar_url, political_lean)
    `
    )
    .in("user_id", followingIds)
    .order("created_at", { ascending: false })
    .limit(15)

  if (error || !data) return []
  return data as unknown as FriendComment[]
}

/** Follow a user */
export async function followUser(
  followerId: string,
  followingId: string
): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { error } = await supabase
    .from("user_follows")
    .insert({ follower_id: followerId, following_id: followingId })

  return { error: error?.message ?? null }
}

/** Unfollow a user */
export async function unfollowUser(
  followerId: string,
  followingId: string
): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { error } = await supabase
    .from("user_follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId)

  return { error: error?.message ?? null }
}

/** Check if current user follows another user */
export async function isFollowing(
  followerId: string,
  followingId: string
): Promise<boolean> {
  const supabase = createClient()
  const { data } = await supabase
    .from("user_follows")
    .select("id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle()

  return !!data
}
