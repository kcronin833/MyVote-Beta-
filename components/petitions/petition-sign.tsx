"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-context";
import { createClient } from "@/lib/supabase/client";

/* Sign box for a standalone petition. Progress + signature count render
   server-side on the page; this handles the name/email form, the optimistic
   count bump, and remembering the signer (localStorage) so they don't re-sign.
   Mirrors the group-petition signing flow (one signatures table). */

const C = {
  card: "#FDFCF9", rule: "#E4E0D3", ink900: "#1A2138", ink700: "#3D435A",
  ink500: "#6B7088", ink400: "#8B8FA3", teal: "#3D8073", tealDk: "#2F6358", tealSoft: "#E6F0ED",
};
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const signedKey = (id: string) => `mv_petition_signed_${id}`;

export function PetitionSign({ petitionId, goal, initialCount }: { petitionId: string; goal: number; initialCount: number }) {
  const { user } = useAuth();
  const [count, setCount] = useState(initialCount);
  const [signed, setSigned] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    try { if (window.localStorage.getItem(signedKey(petitionId))) setSigned(true); } catch { /* ignore */ }
  }, [petitionId]);

  function markSigned() {
    setSigned(true);
    try { window.localStorage.setItem(signedKey(petitionId), "1"); } catch { /* ignore */ }
  }

  async function sign() {
    if (busy) return;
    const n = name.trim();
    const em = email.trim().toLowerCase();
    if (n.length < 2) { setErr("Please enter your name."); return; }
    if (!EMAIL_RE.test(em)) { setErr("Please enter a valid email."); return; }
    setBusy(true); setErr(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("petition_signatures")
      .insert({ petition_id: petitionId, name: n, email: em, user_id: user?.id ?? null });
    if (error) {
      if (error.code === "23505" || /duplicate|unique/i.test(error.message)) { markSigned(); setOpen(false); setBusy(false); return; }
      setErr(`Couldn't record your signature — ${error.message}.`);
      setBusy(false);
      return;
    }
    setCount((c) => c + 1);
    markSigned();
    setOpen(false); setName(""); setEmail(""); setBusy(false);
  }

  const pct = Math.min(100, Math.round((count / Math.max(1, goal)) * 100));

  return (
    <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 14, boxShadow: "0 2px 10px rgba(20,24,40,0.07)", padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: C.ink900 }}>{count.toLocaleString()}</span>
        <span style={{ fontSize: 12.5, color: C.ink400 }}>of {goal.toLocaleString()} goal</span>
      </div>
      <div style={{ height: 10, background: C.tealSoft, borderRadius: 999, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: C.teal, borderRadius: 999, transition: "width 0.3s" }} />
      </div>

      {signed ? (
        <div style={{ fontSize: 14, fontWeight: 700, color: C.tealDk, background: C.tealSoft, borderRadius: 999, padding: "11px 16px", textAlign: "center" }}>
          ✓ You signed this petition — thank you
        </div>
      ) : open ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input value={name} onChange={(e) => { setName(e.target.value.slice(0, 80)); if (err) setErr(null); }} placeholder="Your name" style={inp} />
          <input value={email} onChange={(e) => { setEmail(e.target.value.slice(0, 160)); if (err) setErr(null); }} placeholder="Your email" inputMode="email" style={inp} />
          {err && <div style={errBox}>{err}</div>}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={sign} disabled={busy} style={primaryBtn(busy)}>{busy ? "Signing…" : "Add my signature"}</button>
            <button onClick={() => { setOpen(false); setErr(null); }} style={{ height: 44, padding: "0 18px", borderRadius: 999, border: `1.5px solid ${C.rule}`, background: "transparent", color: C.ink500, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          </div>
          <p style={{ fontSize: 11.5, color: C.ink400, margin: 0, lineHeight: 1.45 }}>
            Your email is kept private — never shown publicly, only used to verify the signature.
          </p>
        </div>
      ) : (
        <button onClick={() => { setOpen(true); setErr(null); }} style={{ width: "100%", height: 48, borderRadius: 999, border: "none", background: C.teal, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 12px rgba(61,128,115,0.3)" }}>
          Sign this petition
        </button>
      )}
    </div>
  );
}

const inp: React.CSSProperties = { height: 44, padding: "0 14px", borderRadius: 8, border: "1px solid #E4E0D3", fontSize: 14, color: "#1A2138", outline: "none", background: "#fff" };
const errBox: React.CSSProperties = { fontSize: 12.5, color: "#B33A2C", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "8px 11px", lineHeight: 1.4 };
function primaryBtn(busy: boolean): React.CSSProperties {
  return { flex: 1, height: 44, padding: "0 18px", borderRadius: 999, border: "none", background: busy ? "#E4E0D3" : "#3D8073", color: busy ? "#8B8FA3" : "#fff", fontSize: 14, fontWeight: 700, cursor: busy ? "default" : "pointer" };
}
