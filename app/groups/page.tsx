import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CreateGroup } from "@/components/groups/create-group";

export const dynamic = "force-dynamic";

const C = {
  card: "#FDFCF9", rule: "#E4E0D3", ink900: "#1A2138", ink700: "#3D435A",
  ink500: "#6B7088", ink400: "#8B8FA3", teal: "#3D8073", tealDk: "#2F6358", tealSoft: "#E6F0ED",
};

export const metadata: Metadata = {
  title: "Community Groups — Organize Around Local Issues · MyVote",
  description:
    "Start or join a group around a local Georgia issue — a school closing, a development fight, a safety concern — rally your neighbors, and connect with the officials responsible.",
  alternates: { canonical: "/groups" },
};

interface GroupRow {
  id: string; slug: string; name: string; description: string | null;
  category: string | null; created_at: string;
}

export default async function GroupsPage() {
  const supabase = await createClient();
  const { data: groups } = await supabase
    .from("groups")
    .select("id, slug, name, description, category, created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(100);

  const list = (groups as GroupRow[]) || [];

  // Member counts (tallied client-side; fine at current scale).
  const { data: members } = await supabase.from("group_members").select("group_id");
  const counts = new Map<string, number>();
  for (const m of (members as { group_id: string }[]) || []) {
    counts.set(m.group_id, (counts.get(m.group_id) ?? 0) + 1);
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 16px 56px" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.7rem, 4vw, 2.2rem)", fontWeight: 600, color: C.ink900, lineHeight: 1.15, margin: "0 0 8px", letterSpacing: -0.4 }}>
        Community Groups
      </h1>
      <p style={{ fontSize: 14.5, color: C.ink700, lineHeight: 1.6, margin: "0 0 20px" }}>
        Something happening in your community — a school closing, a development fight, a safety concern? Start a group, rally your neighbors, and hold the officials responsible accountable.
      </p>

      <div style={{ marginBottom: 24 }}>
        <CreateGroup />
      </div>

      {list.length === 0 ? (
        <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 12, padding: "32px 20px", textAlign: "center" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.ink900, margin: "0 0 4px" }}>No groups yet</p>
          <p style={{ fontSize: 13, color: C.ink500, margin: 0 }}>Be the first — start one above.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map((g) => (
            <Link key={g.id} href={`/groups/${g.slug}`} style={{ display: "block", background: C.card, border: `1px solid ${C.rule}`, borderRadius: 12, boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)", padding: "16px 18px", textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                {g.category && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.tealDk, background: C.tealSoft, border: "1px solid #C0DAD4", borderRadius: 999, padding: "1px 9px" }}>{g.category}</span>
                )}
                <span style={{ marginLeft: "auto", fontSize: 11.5, color: C.ink400 }}>
                  {counts.get(g.id) ?? 0} {(counts.get(g.id) ?? 0) === 1 ? "member" : "members"}
                </span>
              </div>
              <p style={{ fontSize: 15.5, fontWeight: 700, color: C.ink900, margin: "0 0 3px", lineHeight: 1.3 }}>{g.name}</p>
              {g.description && (
                <p style={{ fontSize: 13, color: C.ink500, margin: 0, lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{g.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
