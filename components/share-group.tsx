"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

const C = {
  card: "#FDFCF9", rule: "#E4E0D3", ink900: "#1A2138", ink700: "#3D435A",
  ink400: "#8B8FA3", teal: "#3D8073", tealDk: "#2F6358", tealSoft: "#E6F0ED",
};

/* Make a local-issue group spread. The whole strategy rests on issues being
   shareable so neighbors rally around them — this is the viral loop. */
export function ShareGroup({ groupName, slug }: { groupName: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://www.myvotega.com/groups/${slug}`;
  const text = `Neighbors are organizing around "${groupName}" on MyVote. See who's responsible and add your voice:`;

  async function nativeShare() {
    try { await navigator.share({ title: groupName, text, url }); } catch {}
  }
  async function copyLink() {
    try { await navigator.clipboard.writeText(`${text} ${url}`); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  }

  const pill: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px",
    borderRadius: 999, border: `1px solid ${C.rule}`, background: C.card,
    color: C.ink700, fontSize: 12.5, fontWeight: 700, cursor: "pointer", textDecoration: "none",
  };
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div style={{ background: C.tealSoft, border: "1px solid #C0DAD4", borderRadius: 12, padding: "14px 16px", marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <Share2 size={15} color={C.teal} style={{ flexShrink: 0 }} />
        <p style={{ fontSize: 13.5, fontWeight: 700, color: C.ink900, margin: 0 }}>Rally your neighbors</p>
      </div>
      <p style={{ fontSize: 12.5, color: C.ink700, margin: "0 0 12px", lineHeight: 1.5 }}>
        Issues gain power when people show up together. Share this so more of your community joins in.
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {canNativeShare && (
          <button onClick={nativeShare} style={{ ...pill, background: C.teal, color: "#fff", border: "none" }}>Share</button>
        )}
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" style={pill}>Post on X</a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" style={pill}>Facebook</a>
        <button onClick={copyLink} style={{ ...pill, ...(copied ? { background: C.tealSoft, color: C.tealDk, borderColor: "#C0DAD4" } : {}) }}>
          {copied ? "Copied ✓" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
