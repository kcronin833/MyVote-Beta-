"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-context";
import { createClient } from "@/lib/supabase/client";
import { UserAvatar } from "@/components/user-avatar";
import { formatNewsTime } from "@/lib/news-service";

const C = {
  card: "#FDFCF9", rule: "#E4E0D3", ruleSoft: "#EDEAE0", ink900: "#1A2138",
  ink700: "#3D435A", ink500: "#6B7088", ink400: "#8B8FA3", teal: "#3D8073",
};

interface GPost {
  id: string;
  content: string;
  created_at: string;
  author: { display_name: string; username: string; avatar_url: string | null } | null;
}

export function GroupDiscussion({ groupId }: { groupId: string }) {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<GPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from("group_posts")
      .select("id, content, created_at, author:profiles(display_name, username, avatar_url)")
      .eq("group_id", groupId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(100);
    setPosts((data as unknown as GPost[]) || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [groupId]);

  async function submit() {
    if (posting) return;
    if (content.trim().length < 5) { setError("Write at least 5 characters."); return; }
    setPosting(true);
    setError(null);
    const supabase = createClient();
    const { data, error: postErr } = await supabase
      .from("group_posts")
      .insert({ group_id: groupId, user_id: user!.id, content: content.trim() })
      .select("id, content, created_at")
      .single();
    if (postErr) {
      setError(/jwt|expired|auth|permission|policy/i.test(postErr.message)
        ? "Your session may have expired — please sign in again."
        : `Couldn't post — ${postErr.message}`);
      setPosting(false);
      return;
    }
    if (data) {
      setPosts((prev) => [{ ...(data as GPost), author: { display_name: profile?.display_name ?? "You", username: profile?.username ?? "", avatar_url: profile?.avatar_url ?? null } }, ...prev]);
      setContent("");
    }
    setPosting(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: 0 }}>Discussion</h2>

      {user && profile ? (
        <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <textarea
            value={content}
            onChange={(e) => { setContent(e.target.value.slice(0, 1000)); if (error) setError(null); }}
            placeholder="Add to the conversation — what's happening, what should change?"
            rows={3}
            style={{ resize: "vertical", fontSize: 13.5, color: C.ink900, background: "transparent", outline: "none", border: "none", lineHeight: 1.55, minHeight: 60, fontFamily: "inherit" }}
          />
          {error && <p style={{ fontSize: 12.5, color: "#B33A2C", margin: 0 }}>{error}</p>}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={submit} disabled={posting} style={{ height: 32, padding: "0 16px", borderRadius: 999, border: "none", background: posting ? C.rule : C.teal, color: posting ? C.ink400 : "#fff", fontSize: 13, fontWeight: 700, cursor: posting ? "default" : "pointer" }}>
              {posting ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 12, padding: "12px 14px", fontSize: 13, color: C.ink500 }}>
          <a href="/auth/signin" style={{ color: C.teal, fontWeight: 700 }}>Sign in</a> to join the discussion.
        </div>
      )}

      {loading ? (
        <p style={{ fontSize: 13, color: C.ink400 }}>Loading…</p>
      ) : posts.length === 0 ? (
        <p style={{ fontSize: 13, color: C.ink500 }}>No posts yet — be the first to speak up.</p>
      ) : (
        posts.map((p) => (
          <div key={p.id} style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <UserAvatar avatarUrl={p.author?.avatar_url ?? null} displayName={p.author?.display_name ?? ""} size="sm" />
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 700, color: C.ink900, margin: 0 }}>{p.author?.display_name || "Member"}</p>
                <p style={{ fontSize: 10.5, color: C.ink400, margin: 0 }}>{formatNewsTime(p.created_at)}</p>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: C.ink700, margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{p.content}</p>
          </div>
        ))
      )}
    </div>
  );
}
