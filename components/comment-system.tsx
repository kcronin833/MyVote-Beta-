"use client";

import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Trash2, Edit2, Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/components/auth-context";
import {
  getComments,
  postComment,
  toggleLike,
  deleteComment,
  editComment,
  Comment,
} from "@/lib/comments-service";
import { AuthModal } from "@/components/auth-modal";
import { createClient } from "@/lib/supabase/client";

interface CommentSystemProps {
  articleUrl: string;
  articleTitle: string;
}

export function CommentSystem({ articleUrl, articleTitle }: CommentSystemProps) {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadComments();
  }, [articleUrl]);

  async function loadComments() {
    setLoading(true);
    const data = await getComments(articleUrl, user?.id);
    setComments(data);
    setLoading(false);
  }

  async function handleSubmit(parentId?: string) {
    setErrorMsg(null);
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (!profile) {
      // Signed in but the profiles row never got created — the DB FK on
      // comments.user_id -> profiles.id will reject the insert.
      setErrorMsg(
        "Your profile isn't set up yet. Go to /profile and add a display name + username, then try again."
      );
      return;
    }
    const content = parentId ? replyContent : newComment;
    if (!content.trim()) return;

    setSubmitting(true);
    const { comment, error } = await postComment({
      articleUrl,
      articleTitle,
      content,
      userId: user.id,
      parentId,
    });

    if (comment) {
      if (parentId) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: [...(c.replies || []), comment] }
              : c
          )
        );
        setReplyingTo(null);
        setReplyContent("");
      } else {
        setComments((prev) => [comment, ...prev]);
        setNewComment("");
      }
    } else if (error) {
      // Surface the real DB error so the user (and we) can see what's wrong.
      console.error("[comment insert failed]", error);
      setErrorMsg(`Couldn't save comment: ${error}`);
    } else {
      setErrorMsg("Couldn't save comment — unknown error. Check the browser console.");
    }
    setSubmitting(false);
  }

  async function handleLike(commentId: string) {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    const isNowLiked = await toggleLike(commentId, user.id);
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            likes_count: c.likes_count + (isNowLiked ? 1 : -1),
            user_has_liked: isNowLiked,
          };
        }
        return {
          ...c,
          replies: c.replies?.map((r) =>
            r.id === commentId
              ? {
                  ...r,
                  likes_count: r.likes_count + (isNowLiked ? 1 : -1),
                  user_has_liked: isNowLiked,
                }
              : r
          ),
        };
      })
    );
  }

  async function handleDelete(commentId: string) {
    if (!user) return;
    const ok = await deleteComment(commentId, user.id);
    if (ok) {
      setComments((prev) =>
        prev
          .filter((c) => c.id !== commentId)
          .map((c) => ({
            ...c,
            replies: c.replies?.filter((r) => r.id !== commentId),
          }))
      );
    }
  }

  async function handleEdit(commentId: string) {
    if (!user) return;
    const ok = await editComment(commentId, user.id, editContent);
    if (ok) {
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) return { ...c, content: editContent, edited: true };
          return {
            ...c,
            replies: c.replies?.map((r) =>
              r.id === commentId ? { ...r, content: editContent, edited: true } : r
            ),
          };
        })
      );
      setEditingId(null);
    }
  }

  // Autocomplete @mentions
  async function handleCommentChange(value: string, setter: (v: string) => void) {
    setter(value);
    const lastAt = value.lastIndexOf("@");
    if (lastAt !== -1) {
      const term = value.slice(lastAt + 1).split(" ")[0];
      if (term.length > 0) {
        const { data } = await supabase
          .from("profiles")
          .select("username, display_name")
          .ilike("username", `${term}%`)
          .limit(5);
        setSuggestions(data || []);
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  }

  function insertMention(username: string, current: string, setter: (v: string) => void) {
    const lastAt = current.lastIndexOf("@");
    const before = current.slice(0, lastAt);
    setter(`${before}@${username} `);
    setSuggestions([]);
  }

  function getPoliticalStyle(lean?: string): React.CSSProperties {
    if (lean === "left")  return { background: "#EEF2FF", color: "#3730A3", border: "1px solid #C7D2FE" };
    if (lean === "right") return { background: "#FEF2F2", color: "#B33A2C", border: "1px solid #FECACA" };
    return { background: "#F0EDE6", color: "#6B7088", border: "1px solid #E4E0D3" };
  }

  function renderContent(content: string) {
    return content.split(/(@\w+)/g).map((part, i) =>
      part.startsWith("@") ? (
        <span key={i} className="text-blue-600 font-medium">
          {part}
        </span>
      ) : (
        part
      )
    );
  }

  const CommentCard = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? "ml-8 mt-3" : ""}`}>
      <div className="flex gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={comment.profile?.avatar_url || "/placeholder.svg"} />
          <AvatarFallback>
            {(comment.profile?.display_name || "U")[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.profile?.display_name}</span>
            <span className="text-muted-foreground text-xs">@{comment.profile?.username}</span>
            <span style={{ fontSize: 10.5, fontWeight: 600, borderRadius: 999, padding: "2px 7px", ...getPoliticalStyle(comment.profile?.political_lean) }}>
              {comment.profile?.political_lean === "left" ? "Liberal" : comment.profile?.political_lean === "right" ? "Conservative" : "Moderate"}
            </span>
            <span className="text-xs text-ink-400">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
            {comment.edited && (
              <span className="text-xs text-ink-400 italic">(edited)</span>
            )}
          </div>

          {editingId === comment.id ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="text-sm"
                rows={2}
              />
              <div className="flex gap-2">
                <button onClick={() => handleEdit(comment.id)} style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 28, padding: "0 10px", borderRadius: 999, background: "#3D8073", color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  <Check size={11} /> Save
                </button>
                <button onClick={() => setEditingId(null)} style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 28, padding: "0 10px", borderRadius: 999, background: "transparent", border: "1px solid #E4E0D3", color: "#6B7088", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                  <X size={11} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-foreground">{renderContent(comment.content)}</p>
          )}

          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => handleLike(comment.id)}
              className={`flex items-center gap-1 text-xs transition-colors ${
                comment.user_has_liked
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-red-500"
              }`}
            >
              <Heart
                className="w-3 h-3"
                fill={comment.user_has_liked ? "currentColor" : "none"}
              />
              {comment.likes_count}
            </button>
            {!isReply && (
              <button
                onClick={() => {
                  setReplyingTo(replyingTo === comment.id ? null : comment.id);
                  setReplyContent("");
                }}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-blue-600 transition-colors"
              >
                <MessageCircle className="w-3 h-3" />
                Reply
              </button>
            )}
            {user?.id === comment.user_id && (
              <>
                <button
                  onClick={() => {
                    setEditingId(comment.id);
                    setEditContent(comment.content);
                  }}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </>
            )}
          </div>

          {/* Reply box */}
          {replyingTo === comment.id && (
            <div className="mt-3 relative">
              <Textarea
                placeholder={`Reply to @${comment.profile?.username}...`}
                value={replyContent}
                onChange={(e) => handleCommentChange(e.target.value, setReplyContent)}
                rows={2}
                className="text-sm"
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 bg-card border rounded shadow-lg w-48 mt-1">
                  {suggestions.map((s) => (
                    <button
                      key={s.username}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-paper-50"
                      onClick={() => insertMention(s.username, replyContent, setReplyContent)}
                    >
                      @{s.username}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleSubmit(comment.id)} disabled={submitting} style={{ height: 28, padding: "0 12px", borderRadius: 999, background: submitting ? "#E4E0D3" : "#3D8073", color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: submitting ? "default" : "pointer" }}>
                  {submitting ? "Posting…" : "Reply"}
                </button>
                <button onClick={() => setReplyingTo(null)} style={{ height: 28, padding: "0 10px", borderRadius: 999, background: "transparent", border: "1px solid #E4E0D3", color: "#6B7088", fontSize: 12, cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies?.map((reply) => (
        <CommentCard key={reply.id} comment={reply} isReply />
      ))}
    </div>
  );

  return (
    <>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <div className="space-y-6">
        {/* New comment box */}
        <div className="relative">
          <Textarea
            placeholder={
              user
                ? "Share your thoughts on this article... Use @username to mention someone"
                : "Sign in to join the discussion..."
            }
            value={newComment}
            onChange={(e) => handleCommentChange(e.target.value, setNewComment)}
            rows={3}
            onClick={() => !user && setAuthOpen(true)}
            readOnly={!user}
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 bg-card border rounded shadow-lg w-48 mt-1">
              {suggestions.map((s) => (
                <button
                  key={s.username}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-paper-50"
                  onClick={() => insertMention(s.username, newComment, setNewComment)}
                >
                  @{s.username}
                </button>
              ))}
            </div>
          )}
          {errorMsg && (
            <div className="mt-2 text-xs bg-red-soft border border-civic-red/30 text-civic-red rounded-md px-3 py-2">
              {errorMsg}
            </div>
          )}
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-ink-400">{newComment.length}/500</span>
            <button
              onClick={() => handleSubmit()}
              disabled={!newComment.trim() || submitting}
              style={{ height: 32, padding: "0 14px", borderRadius: 999, background: !newComment.trim() || submitting ? "#E4E0D3" : "#3D8073", color: !newComment.trim() || submitting ? "#8B8FA3" : "#fff", border: "none", fontSize: 12.5, fontWeight: 700, cursor: !newComment.trim() || submitting ? "default" : "pointer", transition: "background 0.15s" }}
            >
              {submitting ? "Posting…" : user ? "Post Comment" : "Sign In to Comment"}
            </button>
          </div>
        </div>

        {/* Comments list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-paper-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-paper-200 rounded w-1/3" />
                  <div className="h-4 bg-paper-200 rounded" />
                  <div className="h-4 bg-paper-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="w-10 h-10 mx-auto mb-2 text-ink-100" />
            <p>No comments yet. Be the first to discuss this article!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
