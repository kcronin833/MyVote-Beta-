"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";
import { createClient } from "@/lib/supabase/client";
import {
  PETITION_TARGET_TYPES, PETITION_CATEGORIES, GEORGIA_COUNTY_NAMES,
  petitionSlugify,
} from "@/lib/petitions";
import { countySlug } from "@/lib/county-utils";

const C = {
  page: "#F5F3EE", card: "#FDFCF9", rule: "#E4E0D3", ink900: "#1A2138", ink700: "#3D435A",
  ink500: "#6B7088", ink400: "#8B8FA3", teal: "#3D8073", tealDk: "#2F6358",
};

export default function CreatePetitionPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetType, setTargetType] = useState("");
  const [targetName, setTargetName] = useState("");
  const [countyName, setCountyName] = useState("");
  const [category, setCategory] = useState("");
  const [goal, setGoal] = useState("100");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    if (busy) return;
    if (!user) { router.push("/auth/signin?redirect=/petitions/create"); return; }
    const t = title.trim();
    const d = description.trim();
    if (t.length < 10) { setErr("Title must be at least 10 characters."); return; }
    if (d.length < 50) { setErr("Description must be at least 50 characters — explain why this matters."); return; }
    const goalNum = Math.max(10, Math.min(100000, parseInt(goal, 10) || 100));

    setBusy(true); setErr(null);
    const supabase = createClient();
    const base = petitionSlugify(t);

    for (let attempt = 0; attempt < 4; attempt++) {
      const slug = attempt === 0 ? base : `${base}-${Math.random().toString(36).slice(2, 6)}`;
      const { data, error } = await supabase
        .from("group_petitions")
        .insert({
          group_id: null,
          title: t,
          description: d,
          summary: d.slice(0, 280),
          target: targetName.trim() || null,
          target_type: targetType || null,
          county_slug: countyName ? countySlug(countyName) : null,
          category: category || null,
          goal: goalNum,
          share_slug: slug,
          creator_name: user.user_metadata?.display_name || user.user_metadata?.username || null,
          created_by: user.id,
        })
        .select("share_slug")
        .single();

      if (!error && data) { router.push(`/petitions/${data.share_slug}`); return; }
      if (error && (error.code === "23505" || /share_slug|duplicate|unique/i.test(error.message))) {
        continue; // slug taken — retry with suffix
      }
      setErr(
        error && /jwt|expired|auth|permission|row-level|policy/i.test(error.message)
          ? "Your session may have expired. Refresh or sign in again, then retry."
          : `Couldn't create the petition — ${error?.message ?? "unknown error"}.`
      );
      setBusy(false);
      return;
    }
    setErr("Couldn't generate a unique link — tweak the title and try again.");
    setBusy(false);
  }

  if (!loading && !user) {
    return (
      <div style={{ background: C.page, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 14, padding: "28px 24px", textAlign: "center", maxWidth: 380 }}>
          <h1 style={{ fontSize: 19, fontWeight: 700, color: C.ink900, margin: "0 0 8px" }}>Sign in to start a petition</h1>
          <p style={{ fontSize: 13.5, color: C.ink500, lineHeight: 1.6, margin: "0 0 18px" }}>A free MyVote account lets you create petitions and keeps signatures trustworthy.</p>
          <Link href="/auth/signin?redirect=/petitions/create" style={{ background: C.teal, color: "#fff", fontSize: 14, fontWeight: 700, padding: "11px 24px", borderRadius: 999, textDecoration: "none" }}>Sign in / Sign up free</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: C.page, minHeight: "100vh" }}>
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "28px 16px 56px" }}>
        <nav style={{ fontSize: 12.5, color: C.ink400, marginBottom: 14 }}>
          <Link href="/petitions" style={{ color: C.teal, textDecoration: "none", fontWeight: 600 }}>← All petitions</Link>
        </nav>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.6rem, 4vw, 2.1rem)", fontWeight: 600, color: C.ink900, margin: "0 0 6px", letterSpacing: -0.3 }}>
          Start a Georgia petition
        </h1>
        <p style={{ fontSize: 14, color: C.ink500, lineHeight: 1.6, margin: "0 0 22px" }}>
          Free, nonpartisan, and live in minutes. You'll get a shareable link to collect signatures.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Petition title" hint="10–150 characters — make the ask clear.">
            <input value={title} onChange={(e) => { setTitle(e.target.value.slice(0, 150)); if (err) setErr(null); }} placeholder="e.g. Reopen Spalding Drive Elementary" style={inp} />
          </Field>

          <Field label="Why this matters" hint="At least 50 characters. Explain the change you want and why.">
            <textarea value={description} onChange={(e) => { setDescription(e.target.value.slice(0, 5000)); if (err) setErr(null); }} rows={6} placeholder="Describe the issue, who it affects, and exactly what you're asking the official to do." style={{ ...inp, height: "auto", padding: "10px 12px", resize: "vertical", lineHeight: 1.55, fontFamily: "inherit" }} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Who are you petitioning?">
              <select value={targetType} onChange={(e) => setTargetType(e.target.value)} style={sel}>
                <option value="">Select type…</option>
                {PETITION_TARGET_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Category">
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={sel}>
                <option value="">Select…</option>
                {PETITION_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Official or body" hint="e.g. Fulton County Board of Education">
            <input value={targetName} onChange={(e) => setTargetName(e.target.value.slice(0, 140))} placeholder="Name of the official or body" style={inp} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 12 }}>
            <Field label="County">
              <select value={countyName} onChange={(e) => setCountyName(e.target.value)} style={sel}>
                <option value="">Statewide / N/A</option>
                {GEORGIA_COUNTY_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>
            <Field label="Signature goal">
              <input value={goal} onChange={(e) => setGoal(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))} inputMode="numeric" style={inp} />
            </Field>
          </div>

          {err && <div style={{ fontSize: 13, color: "#B33A2C", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "9px 12px", lineHeight: 1.45 }}>{err}</div>}

          <button onClick={submit} disabled={busy} style={{ height: 48, borderRadius: 999, border: "none", background: busy ? "#E4E0D3" : "#3D8073", color: busy ? "#8B8FA3" : "#fff", fontSize: 15, fontWeight: 700, cursor: busy ? "default" : "pointer", boxShadow: busy ? "none" : "0 2px 12px rgba(61,128,115,0.3)" }}>
            {busy ? "Publishing…" : "Publish petition"}
          </button>
          <p style={{ fontSize: 11.5, color: C.ink400, lineHeight: 1.5, margin: 0, textAlign: "center" }}>
            Petitions are public and nonpartisan. MyVote may remove petitions that violate its guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: C.ink700, marginBottom: 5 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 11.5, color: C.ink400, margin: "4px 0 0", lineHeight: 1.4 }}>{hint}</p>}
    </div>
  );
}

const inp: React.CSSProperties = { width: "100%", height: 44, padding: "0 12px", borderRadius: 8, border: "1px solid #E4E0D3", fontSize: 14, color: "#1A2138", outline: "none", background: "#fff" };
const sel: React.CSSProperties = { ...inp, appearance: "none", WebkitAppearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238B8FA3' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" };
