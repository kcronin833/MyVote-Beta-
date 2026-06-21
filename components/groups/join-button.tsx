"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-context";
import { createClient } from "@/lib/supabase/client";

const C = { rule: "#E4E0D3", ink400: "#8B8FA3", ink700: "#3D435A", teal: "#3D8073", tealDk: "#2F6358", tealSoft: "#E6F0ED" };

export function JoinButton({
  groupId,
  initialJoined,
  initialCount,
}: {
  groupId: string;
  initialJoined: boolean;
  initialCount: number;
}) {
  const { user } = useAuth();
  const [joined, setJoined] = useState(initialJoined);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    if (!user) { window.location.href = "/auth/signin"; return; }
    setBusy(true);
    const supabase = createClient();
    if (joined) {
      const { error } = await supabase.from("group_members").delete().eq("group_id", groupId).eq("user_id", user.id);
      if (!error) { setJoined(false); setCount((c) => Math.max(0, c - 1)); }
    } else {
      const { error } = await supabase.from("group_members").insert({ group_id: groupId, user_id: user.id });
      if (!error) { setJoined(true); setCount((c) => c + 1); }
    }
    setBusy(false);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <button
        onClick={toggle}
        disabled={busy}
        style={{
          height: 38, padding: "0 20px", borderRadius: 999,
          border: joined ? `1.5px solid ${C.rule}` : "none",
          background: joined ? "transparent" : C.teal,
          color: joined ? C.ink700 : "#fff",
          fontSize: 13.5, fontWeight: 700, cursor: busy ? "default" : "pointer",
        }}
      >
        {joined ? "✓ Joined" : "Join this group"}
      </button>
      <span style={{ fontSize: 13, color: C.ink400 }}>
        {count} {count === 1 ? "member" : "members"}
      </span>
    </div>
  );
}
