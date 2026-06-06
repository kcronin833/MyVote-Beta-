import { createClient } from "@/lib/supabase/client";

export interface Comment {
  id: string;
  user_id: string;
  article_url: string;
  article_title: string;
  content: string;
  mentions: string[];
  parent_id: string | null;
  likes_count: number;
  edited: boolean;
  created_at: string;
  updated_at: string;
  // Joined from profiles
  profile?: {
    username: string;
    display_name: string;
    avatar_url: string | null;
    political_lean: string;
    verified: boolean;
  };
  replies?: Comment[];
  user_has_liked?: boolean;
}

export async function getComments(articleUrl: string, userId?: string): Promise<Comment[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      profile:profiles(username, display_name, avatar_url, political_lean, verified)
    `)
    .eq("article_url", articleUrl)
    .is("parent_id", null)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  // Fetch replies for each top-level comment
  const commentsWithReplies = await Promise.all(
    data.map(async (comment) => {
      const { data: replies } = await supabase
        .from("comments")
        .select(`
          *,
          profile:profiles(username, display_name, avatar_url, political_lean, verified)
        `)
        .eq("parent_id", comment.id)
        .order("created_at", { ascending: true });

      // Check if user has liked
      let userHasLiked = false;
      if (userId) {
        const { data: like } = await supabase
          .from("comment_likes")
          .select("id")
          .eq("comment_id", comment.id)
          .eq("user_id", userId)
          .single();
        userHasLiked = !!like;
      }

      return {
        ...comment,
        replies: replies || [],
        user_has_liked: userHasLiked,
      };
    })
  );

  return commentsWithReplies as Comment[];
}

export async function postComment(params: {
  articleUrl: string;
  articleTitle: string;
  content: string;
  userId: string;
  parentId?: string;
}): Promise<{ comment: Comment | null; error: string | null }> {
  const supabase = createClient();

  // Extract @mentions
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  while ((match = mentionRegex.exec(params.content)) !== null) {
    mentions.push(match[1]);
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      user_id: params.userId,
      // `article_id` is NOT NULL in the schema (scripts/003_full_schema.sql).
      // Use the URL as the stable identifier — it's how getComments() filters too.
      article_id: params.articleUrl,
      article_url: params.articleUrl,
      article_title: params.articleTitle,
      content: params.content,
      mentions,
      parent_id: params.parentId || null,
    })
    .select(`
      *,
      profile:profiles(username, display_name, avatar_url, political_lean, verified)
    `)
    .single();

  if (error) return { comment: null, error: error.message };

  // Best-effort: notify the parent comment's author of a reply. Never blocks
  // the post, never self-notifies.
  if (params.parentId) {
    try {
      const { data: parent } = await supabase
        .from("comments")
        .select("user_id")
        .eq("id", params.parentId)
        .single();
      if (parent?.user_id && parent.user_id !== params.userId) {
        await supabase.from("notifications").insert({
          user_id: parent.user_id,
          type: "comment",
          from_user_id: params.userId,
        });
      }
    } catch {
      /* notification is non-critical */
    }
  }

  return { comment: data as Comment, error: null };
}

export async function toggleLike(commentId: string, userId: string): Promise<boolean> {
  const supabase = createClient();

  // Check if already liked
  const { data: existing } = await supabase
    .from("comment_likes")
    .select("id")
    .eq("comment_id", commentId)
    .eq("user_id", userId)
    .single();

  if (existing) {
    // Unlike
    await supabase
      .from("comment_likes")
      .delete()
      .eq("comment_id", commentId)
      .eq("user_id", userId);
    return false;
  } else {
    // Like
    await supabase
      .from("comment_likes")
      .insert({ comment_id: commentId, user_id: userId });

    // Best-effort: notify the comment's author. Never self-notifies.
    try {
      const { data: comment } = await supabase
        .from("comments")
        .select("user_id")
        .eq("id", commentId)
        .single();
      if (comment?.user_id && comment.user_id !== userId) {
        await supabase.from("notifications").insert({
          user_id: comment.user_id,
          type: "like",
          from_user_id: userId,
        });
      }
    } catch {
      /* notification is non-critical */
    }

    return true;
  }
}

export async function deleteComment(commentId: string, userId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", userId);
  return !error;
}

export async function editComment(
  commentId: string,
  userId: string,
  content: string
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("comments")
    .update({ content, edited: true, updated_at: new Date().toISOString() })
    .eq("id", commentId)
    .eq("user_id", userId);
  return !error;
}

export async function getUserActivity(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  return error ? [] : data;
}
