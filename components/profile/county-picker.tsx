"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";
import { getAllCountyNames, resolveCountySlug, countySlug } from "@/lib/county-utils";

/* Lets a signed-in voter set their Georgia county. We persist it into the
   existing profiles.location text column (as "<County> County") so the home
   feed's resolveCountySlug() can deep-link them to /g/[county]. No schema
   change required. */
export function CountyPicker() {
  const { profile, updateProfile } = useAuth();
  const counties = useMemo(() => getAllCountyNames(), []);

  // Current county name derived from the saved free-text location, if any.
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
    <div className="p-4 bg-paper-50 rounded-2xl border border-border space-y-3">
      <div>
        <h3 className="font-semibold text-foreground">Your county</h3>
        <p className="text-sm text-muted-foreground">
          Set your county to see your local 2026 ballot.
        </p>
      </div>

      <select
        value={selected}
        onChange={(e) => save(e.target.value)}
        disabled={saving}
        className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm text-foreground"
      >
        <option value="">Select a county…</option>
        {counties.map((name) => (
          <option key={name} value={name}>
            {name} County
          </option>
        ))}
      </select>

      <div className="min-h-[20px] text-sm">
        {saving && <span className="text-muted-foreground">Saving…</span>}
        {!saving && status === "saved" && (
          <span className="text-teal-600">Saved.</span>
        )}
        {!saving && status === "error" && (
          <span className="text-red-600">Could not save. Try again.</span>
        )}
      </div>

      {selectedSlug && (
        <Link
          href={`/g/${selectedSlug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:underline"
        >
          View your county ballot →
        </Link>
      )}
    </div>
  );
}
