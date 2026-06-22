"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-context";
import { createClient } from "@/lib/supabase/client";

const C = {
  card: "#FDFCF9", rule: "#E4E0D3", ink900: "#1A2138", ink700: "#3D435A",
  ink500: "#6B7088", ink400: "#8B8FA3", teal: "#3D8073", tealDk: "#2F6358", tealSoft: "#E6F0ED",
};

export interface GroupArticle {
  id: string;
  title: string;
  url: string;
  source: string | null;
  created_at: string;
}

function domainOf(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; }
}

export function GroupArticles({ groupId, initialArticles }: { groupId: string; initialArticles: GroupArticle[] }) {
  const { user } = useAuth();
  const [articles, setArticles] = useState<GroupArticle[]>(initialArticles);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add() {
    if (busy) return;
    if (!user) { window.location.href = "/auth/signin"; return; }
    const u = url.trim();
    const t = title.trim();
    if (!/^https?:\/\/.+\..+/.test(u)) { setError("Enter a full link starting with http:// or https://"); return; }
    if (t.length < 4) { setError("Add a short headline so people know what the link is."); return; }
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const source = domainOf(u);
    const { data, error: insErr } = await supabase
      .from("group_articles")
      .insert({ group_id: groupId, title: t, url: u, source, added_by: user.id })
      .select("id, title, url, source, created_at")
      .single();
    if (insErr) {
      setError(
        /jwt|expired|auth|permission|row-level|policy/i.test(insErr.message)
          ? "Your session may have expired. Refresh or sign in again, then retry."
          : `Couldn't add the article — ${insErr.message}.`
      );
      setBusy(false);
      return;
    }
    if (data) {
      setArticles((a) => [data as GroupArticle, ...a]);
      setUrl(""); setTitle(""); setOpen(false);
    }
    setBusy(false);
  }

  return (
    <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 14, boxShadow: "0 2px 10px rgba(20,24,40,0.07)", padding: "16px 18px", marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: 0 }}>In the news</h2>
        <button
          onClick={() => { if (!user) { window.location.href = "/auth/signin"; return; } setOpen((o) => !o); setError(null); }}
          style={{ height: 30, padding: "0 12px", borderRadius: 999, border: `1.5px solid ${C.rule}`, background: "transparent", color: C.tealDk, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
        >
          {open ? "Cancel" : "+ Add article"}
        </button>
      </div>
      <p style={{ fontSize: 12, color: C.ink500, margin: "0 0 12px", lineHeight: 1.5 }}>
        Reporting and coverage about this issue. Add a link so neighbors can read the facts for themselves.
      </p>

      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14, padding: "12px", background: "#fff", border: `1px solid ${C.rule}`, borderRadius: 10 }}>
          <input
            value={url}
            onChange={(e) => { setUrl(e.target.value); if (error) setError(null); }}
            placeholder="Paste the article link (https://...)"
            style={{ height: 36, padding: "0 12px", borderRadius: 8, border: `1px solid ${C.rule}`, fontSize: 13, color: C.ink900, outline: "none" }}
          />
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value.slice(0, 160)); if (error) setError(null); }}
            placeholder="Headline / what it's about"
            style={{ height: 36, padding: "0 12px", borderRadius: 8, border: `1px solid ${C.rule}`, fontSize: 13, color: C.ink900, outline: "none" }}
          />
          {error && (
            <div style={{ fontSize: 12, color: "#B33A2C", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "7px 10px", lineHeight: 1.4 }}>{error}</div>
          )}
          <button
            onClick={add}
            disabled={busy}
            style={{ alignSelf: "flex-start", height: 34, padding: "0 16px", borderRadius: 999, border: "none", background: busy ? "#E4E0D3" : C.teal, color: busy ? C.ink400 : "#fff", fontSize: 13, fontWeight: 700, cursor: busy ? "default" : "pointer" }}
          >
            {busy ? "Adding…" : "Add article"}
          </button>
        </div>
      )}

      {articles.length === 0 ? (
        <p style={{ fontSize: 12.5, color: C.ink400, margin: 0, fontStyle: "italic" }}>No articles linked yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {articles.map((a) => (
            <a
              key={a.id}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", flexDirection: "column", gap: 2, padding: "10px 0", borderBottom: `1px solid ${C.rule}`, textDecoration: "none" }}
            >
              <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink900, lineHeight: 1.4 }}>{a.title}</span>
              <span style={{ fontSize: 11.5, color: C.teal, fontWeight: 600 }}>{a.source || domainOf(a.url)} ↗</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
