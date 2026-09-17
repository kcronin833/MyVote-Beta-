"use client";

import { useState } from "react";
import type { MerchProduct } from "@/lib/merch";

const C = {
  ink900: "#030213", ink700: "#3D3D4A", ink500: "#717182", ink400: "#8B8B99",
  rule: "#E9EBEF", card: "#FFFFFF", soft: "#F0F0F3", red: "#D4183D",
};

const inp: React.CSSProperties = {
  height: 38, width: "100%", borderRadius: 8, border: `1px solid ${C.rule}`,
  background: "#fff", color: C.ink900, fontSize: 13, padding: "0 11px", outline: "none",
};

export function InterestButton({ product }: { product: MerchProduct }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [variant, setVariant] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!email.trim()) { setErr("Enter your email."); return; }
    setBusy(true); setErr(null);
    try {
      const res = await fetch("/api/merch/interest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, productSlug: product.slug, variant: variant || null }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || "Something went wrong."); setBusy(false); return; }
      setDone(true);
    } catch {
      setErr("Network error — try again.");
    }
    setBusy(false);
  }

  if (done) {
    return (
      <div style={{ background: C.soft, border: `1px solid ${C.rule}`, borderRadius: 8, padding: "9px 11px", fontSize: 12.5, color: C.ink700, lineHeight: 1.45 }}>
        ✓ You&rsquo;re on the list{variant ? ` (${variant})` : ""} — we&rsquo;ll email you the moment the {product.name.toLowerCase()} drops.
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{ width: "100%", height: 38, borderRadius: 999, border: `1.5px solid ${C.ink900}`, background: "transparent", color: C.ink900, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
      >
        Notify me →
      </button>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {product.variants && product.variantLabel && (
        <select
          value={variant}
          onChange={(e) => setVariant(e.target.value)}
          aria-label={`${product.variantLabel} for ${product.name}`}
          style={{ ...inp, cursor: "pointer" }}
        >
          <option value="">{product.variantLabel} (optional)</option>
          {product.variants.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      )}
      <input
        type="email" required value={email} onChange={(e) => { setEmail(e.target.value); if (err) setErr(null); }}
        placeholder="your@email.com" aria-label={`Email for ${product.name}`} style={inp} autoFocus
      />
      {err && <p style={{ fontSize: 11.5, color: C.red, margin: 0 }}>{err}</p>}
      <button
        type="submit" disabled={busy}
        style={{ height: 38, borderRadius: 999, border: "none", background: busy ? C.rule : C.ink900, color: busy ? C.ink400 : "#fff", fontSize: 13, fontWeight: 700, cursor: busy ? "default" : "pointer" }}
      >
        {busy ? "Adding you…" : "Notify me when it drops"}
      </button>
    </form>
  );
}
