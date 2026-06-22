"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-context";
import { createClient } from "@/lib/supabase/client";

const C = {
  card: "#FDFCF9", rule: "#E4E0D3", ink900: "#1A2138", ink700: "#3D435A",
  ink500: "#6B7088", ink400: "#8B8FA3", teal: "#3D8073", tealDk: "#2F6358", tealSoft: "#E6F0ED",
};

export interface Petition {
  id: string;
  title: string;
  summary: string | null;
  target: string | null;
  goal: number;
  signature_count: number;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const signedKey = (id: string) => `mv_petition_signed_${id}`;

export function GroupPetitions({
  groupId,
  initialPetitions,
  signedIds,
}: {
  groupId: string;
  initialPetitions: Petition[];
  signedIds: string[];
}) {
  const { user } = useAuth();
  const [petitions, setPetitions] = useState<Petition[]>(initialPetitions);
  const [signed, setSigned] = useState<Set<string>>(new Set(signedIds));

  // Anonymous signers are remembered via localStorage.
  useEffect(() => {
    setSigned((prev) => {
      const next = new Set(prev);
      for (const p of initialPetitions) {
        if (typeof window !== "undefined" && window.localStorage.getItem(signedKey(p.id))) next.add(p.id);
      }
      return next;
    });
  }, [initialPetitions]);

  // ── Sign form state (one open at a time) ──
  const [openSign, setOpenSign] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [signBusy, setSignBusy] = useState(false);
  const [signErr, setSignErr] = useState<string | null>(null);

  // ── Create form state ──
  const [creating, setCreating] = useState(false);
  const [cTitle, setCTitle] = useState("");
  const [cTarget, setCTarget] = useState("");
  const [cSummary, setCSummary] = useState("");
  const [cGoal, setCGoal] = useState("100");
  const [createBusy, setCreateBusy] = useState(false);
  const [createErr, setCreateErr] = useState<string | null>(null);

  function markSigned(id: string) {
    setSigned((s) => new Set(s).add(id));
    try { window.localStorage.setItem(signedKey(id), "1"); } catch { /* ignore */ }
  }

  async function sign(petitionId: string) {
    if (signBusy) return;
    const n = name.trim();
    const em = email.trim().toLowerCase();
    if (n.length < 2) { setSignErr("Please enter your name."); return; }
    if (!EMAIL_RE.test(em)) { setSignErr("Please enter a valid email."); return; }
    setSignBusy(true);
    setSignErr(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("petition_signatures")
      .insert({ petition_id: petitionId, name: n, email: em, user_id: user?.id ?? null });
    if (error) {
      if (error.code === "23505" || /duplicate|unique/i.test(error.message)) {
        markSigned(petitionId);
        setOpenSign(null);
        setSignBusy(false);
        return; // already signed — treat as success
      }
      setSignErr(`Couldn't record your signature — ${error.message}.`);
      setSignBusy(false);
      return;
    }
    markSigned(petitionId);
    setPetitions((ps) => ps.map((p) => (p.id === petitionId ? { ...p, signature_count: p.signature_count + 1 } : p)));
    setOpenSign(null);
    setName(""); setEmail("");
    setSignBusy(false);
  }

  async function create() {
    if (createBusy) return;
    if (!user) { window.location.href = "/auth/signin"; return; }
    const t = cTitle.trim();
    if (t.length < 6) { setCreateErr("Give the petition a clear title."); return; }
    const goalNum = Math.max(10, Math.min(100000, parseInt(cGoal, 10) || 100));
    setCreateBusy(true);
    setCreateErr(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("group_petitions")
      .insert({
        group_id: groupId,
        title: t,
        target: cTarget.trim() || null,
        summary: cSummary.trim() || null,
        goal: goalNum,
        created_by: user.id,
      })
      .select("id, title, summary, target, goal, signature_count")
      .single();
    if (error) {
      setCreateErr(
        /jwt|expired|auth|permission|row-level|policy/i.test(error.message)
          ? "Your session may have expired. Refresh or sign in again, then retry."
          : `Couldn't create the petition — ${error.message}.`
      );
      setCreateBusy(false);
      return;
    }
    if (data) {
      setPetitions((ps) => [data as Petition, ...ps]);
      setCTitle(""); setCTarget(""); setCSummary(""); setCGoal("100");
      setCreating(false);
    }
    setCreateBusy(false);
  }

  return (
    <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 14, boxShadow: "0 2px 10px rgba(20,24,40,0.07)", padding: "16px 18px", marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: 0 }}>Petitions</h2>
        <button
          onClick={() => { if (!user) { window.location.href = "/auth/signin"; return; } setCreating((c) => !c); setCreateErr(null); }}
          style={{ height: 30, padding: "0 12px", borderRadius: 999, border: `1.5px solid ${C.rule}`, background: "transparent", color: C.tealDk, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
        >
          {creating ? "Cancel" : "+ Start a petition"}
        </button>
      </div>
      <p style={{ fontSize: 12, color: C.ink500, margin: "0 0 12px", lineHeight: 1.5 }}>
        Turn shared frustration into a concrete demand. Anyone can sign with their name and email.
      </p>

      {creating && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14, padding: "12px", background: "#fff", border: `1px solid ${C.rule}`, borderRadius: 10 }}>
          <input value={cTitle} onChange={(e) => { setCTitle(e.target.value.slice(0, 140)); if (createErr) setCreateErr(null); }} placeholder="Petition title — e.g. Reopen Spalding Drive Elementary" style={inp} />
          <input value={cTarget} onChange={(e) => setCTarget(e.target.value.slice(0, 140))} placeholder="Directed to (optional) — e.g. Fulton County Board of Education" style={inp} />
          <textarea value={cSummary} onChange={(e) => setCSummary(e.target.value.slice(0, 600))} placeholder="What are you asking for? (optional)" rows={3} style={{ ...inp, height: "auto", padding: "8px 12px", resize: "vertical", lineHeight: 1.5, fontFamily: "inherit" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12.5, color: C.ink500 }}>Signature goal</span>
            <input value={cGoal} onChange={(e) => setCGoal(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))} inputMode="numeric" style={{ ...inp, width: 110 }} />
          </div>
          {createErr && <div style={errBox}>{createErr}</div>}
          <button onClick={create} disabled={createBusy} style={{ alignSelf: "flex-start", ...primaryBtn(createBusy) }}>
            {createBusy ? "Creating…" : "Create petition"}
          </button>
        </div>
      )}

      {petitions.length === 0 ? (
        <p style={{ fontSize: 12.5, color: C.ink400, margin: 0, fontStyle: "italic" }}>No petitions yet — start the first one.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {petitions.map((p) => {
            const hasSigned = signed.has(p.id);
            const pct = Math.min(100, Math.round((p.signature_count / Math.max(1, p.goal)) * 100));
            return (
              <div key={p.id} style={{ border: `1px solid ${C.rule}`, borderRadius: 12, padding: "14px 16px", background: "#fff" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: "0 0 4px", lineHeight: 1.3 }}>{p.title}</h3>
                {p.target && <p style={{ fontSize: 12, color: C.tealDk, fontWeight: 600, margin: "0 0 6px" }}>Directed to: {p.target}</p>}
                {p.summary && <p style={{ fontSize: 13, color: C.ink700, margin: "0 0 10px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{p.summary}</p>}

                {/* progress */}
                <div style={{ height: 8, background: C.tealSoft, borderRadius: 999, overflow: "hidden", marginBottom: 6 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: C.teal, borderRadius: 999, transition: "width 0.3s" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink700 }}>
                    {p.signature_count.toLocaleString()} signed
                  </span>
                  <span style={{ fontSize: 12, color: C.ink400 }}>Goal: {p.goal.toLocaleString()}</span>
                </div>

                {hasSigned ? (
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.tealDk, background: C.tealSoft, borderRadius: 999, padding: "8px 16px", textAlign: "center" }}>
                    ✓ You signed this petition
                  </div>
                ) : openSign === p.id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <input value={name} onChange={(e) => { setName(e.target.value.slice(0, 80)); if (signErr) setSignErr(null); }} placeholder="Your name" style={inp} />
                    <input value={email} onChange={(e) => { setEmail(e.target.value.slice(0, 160)); if (signErr) setSignErr(null); }} placeholder="Your email" inputMode="email" style={inp} />
                    {signErr && <div style={errBox}>{signErr}</div>}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => sign(p.id)} disabled={signBusy} style={primaryBtn(signBusy)}>
                        {signBusy ? "Signing…" : "Add my signature"}
                      </button>
                      <button onClick={() => { setOpenSign(null); setSignErr(null); }} style={{ height: 36, padding: "0 16px", borderRadius: 999, border: `1.5px solid ${C.rule}`, background: "transparent", color: C.ink500, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        Cancel
                      </button>
                    </div>
                    <p style={{ fontSize: 11, color: C.ink400, margin: 0, lineHeight: 1.4 }}>
                      Your email is kept private — it is never shown publicly, only used to verify the signature.
                    </p>
                  </div>
                ) : (
                  <button onClick={() => { setOpenSign(p.id); setSignErr(null); }} style={{ width: "100%", height: 40, borderRadius: 999, border: "none", background: C.teal, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(61,128,115,0.28)" }}>
                    Sign this petition
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const inp: React.CSSProperties = { height: 36, padding: "0 12px", borderRadius: 8, border: "1px solid #E4E0D3", fontSize: 13, color: "#1A2138", outline: "none", background: "#fff" };
const errBox: React.CSSProperties = { fontSize: 12, color: "#B33A2C", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "7px 10px", lineHeight: 1.4 };
function primaryBtn(busy: boolean): React.CSSProperties {
  return { height: 36, padding: "0 18px", borderRadius: 999, border: "none", background: busy ? "#E4E0D3" : "#3D8073", color: busy ? "#8B8FA3" : "#fff", fontSize: 13, fontWeight: 700, cursor: busy ? "default" : "pointer" };
}
