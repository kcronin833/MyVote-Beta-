"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";
import { getAllCountyNames, resolveCountySlug, countySlug } from "@/lib/county-utils";

const selectStyle: React.CSSProperties = {
  width: "100%",
  height: 40,
  borderRadius: 8,
  border: "1px solid #E4E0D3",
  background: "#FDFCF9",
  color: "#1A2138",
  fontSize: 13.5,
  padding: "0 12px",
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238B8FA3' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
}

/* Lets a signed-in voter set their Georgia county. Persists into
   profiles.location as "<County> County" so resolveCountySlug() works. */
export function CountyPicker() {
  const { profile, updateProfile } = useAuth();
  const counties = useMemo(() => getAllCountyNames(), []);

  const savedSlug = resolveCountySlug(profile?.location);
  const savedName = useMemo(
    () => (savedSlug ? counties.find((n) => countySlug(n) === savedSlug) ?? "" : ""),
    [savedSlug, counties]
  );

  const [selected, setSelected] = useState(savedName);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  if (!profile) return null;

  async function save(name: string) {
    setSelected(name);
    setStatus("idle");
    if (!name) return;
    setSaving(true);
    const { error } = await updateProfile({ location: `${name} County` } as any);
    setSaving(false);
    setStatus(error ? "error" : "saved");
  }

  const selectedSlug = selected ? countySlug(selected) : null;

  return (
    <div style={{ background: "#FDFCF9", border: "1px solid #E4E0D3", borderRadius: 12, boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1A2138", margin: "0 0 2px" }}>Your county</h3>
        <p style={{ fontSize: 13, color: "#6B7088", margin: 0 }}>
          Set your county to see your local 2026 ballot.
        </p>
      </div>

      <select
        value={selected}
        onChange={(e) => save(e.target.value)}
        disabled={saving}
        style={{ ...selectStyle, opacity: saving ? 0.6 : 1 }}
      >
        <option value="">Select a county…</option>
        {counties.map((name) => (
          <option key={name} value={name}>
            {name} County
          </option>
        ))}
      </select>

      <div style={{ minHeight: 18, fontSize: 12.5 }}>
        {saving && <span style={{ color: "#8B8FA3" }}>Saving…</span>}
        {!saving && status === "saved" && <span style={{ color: "#3D8073", fontWeight: 600 }}>✓ Saved</span>}
        {!saving && status === "error" && <span style={{ color: "#B33A2C" }}>Could not save. Try again.</span>}
      </div>

      {selectedSlug && (
        <Link
          href={`/g/${selectedSlug}`}
          style={{ fontSize: 13, fontWeight: 700, color: "#3D8073", textDecoration: "none" }}
        >
          View your county ballot →
        </Link>
      )}
    </div>
  );
}
