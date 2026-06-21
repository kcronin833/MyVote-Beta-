"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import { createClient } from "@/lib/supabase/client";

const C = {
  card: "#FDFCF9", rule: "#E4E0D3", ink900: "#1A2138", ink700: "#3D435A",
  ink500: "#6B7088", ink400: "#8B8FA3", teal: "#3D8073", tealDk: "#2F6358", tealSoft: "#E6F0ED",
};

const CATEGORIES = ["Schools", "Public Safety", "Local Development", "Environment", "Transportation", "Other"];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50);
}

export function CreateGroup() {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div style={{ background: C.tealSoft, border: "1px solid #C0DAD4", borderRadius: 12, padding: "14px 18px", fontSize: 13.5, color: C.ink700 }}>
        <a href="/auth/signin" style={{ color: C.tealDk, fontWeight: 700 }}>Sign in</a> to start a group around a local issue.
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{ height: 42, padding: "0 22px", borderRadius: 999, border: "none", background: C.teal, color: "#fff", fontSize: 14.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 12px rgba(61,128,115,0.3)" }}
      >
        + Start a group
      </button>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (name.trim().length < 4) { setError("Give your group a name (at least 4 characters)."); return; }
    setSaving(true);
    setError(null);
    const slug = `${slugify(name) || "group"}-${Math.random().toString(36).slice(2, 6)}`;
    const supabase = createClient();
    const { error: insErr } = await supabase.from("groups").insert({
      slug, name: name.trim(), description: description.trim() || null, category, creator_id: user!.id,
    });
    if (insErr) {
      setError(/jwt|expired|auth|permission|policy/i.test(insErr.message)
        ? "Your session may have expired — please sign in again."
        : `Couldn't create the group — ${insErr.message}`);
      setSaving(false);
      return;
    }
    // Creator auto-joins (best-effort).
    const { data: g } = await supabase.from("groups").select("id").eq("slug", slug).single();
    if (g?.id) await supabase.from("group_members").insert({ group_id: g.id, user_id: user!.id });
    router.push(`/groups/${slug}`);
  }

  const input: React.CSSProperties = {
    width: "100%", borderRadius: 8, border: `1px solid ${C.rule}`, background: "#fff",
    color: C.ink900, fontSize: 13.5, padding: "10px 12px", outline: "none", fontFamily: "inherit",
  };

  return (
    <form onSubmit={submit} style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 14, boxShadow: "0 2px 10px rgba(20,24,40,0.07)", padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: 0 }}>Start a group</p>
      <input style={input} value={name} onChange={(e) => { setName(e.target.value); if (error) setError(null); }} placeholder="What's the issue? e.g. Save Fulton's Riverside Elementary" maxLength={80} />
      <textarea style={{ ...input, minHeight: 80, resize: "vertical" }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what's happening and what you want to see change…" maxLength={600} />
      <select style={input} value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      {error && <p style={{ fontSize: 12.5, color: "#B33A2C", margin: 0 }}>{error}</p>}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button type="button" onClick={() => setOpen(false)} style={{ height: 38, padding: "0 16px", borderRadius: 999, border: `1px solid ${C.rule}`, background: "transparent", color: C.ink700, fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
        <button type="submit" disabled={saving} style={{ height: 38, padding: "0 20px", borderRadius: 999, border: "none", background: saving ? C.rule : C.teal, color: saving ? C.ink400 : "#fff", fontSize: 13.5, fontWeight: 700, cursor: saving ? "default" : "pointer" }}>{saving ? "Creating…" : "Create group"}</button>
      </div>
    </form>
  );
}
