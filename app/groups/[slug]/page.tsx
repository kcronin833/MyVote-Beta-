import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { JoinButton } from "@/components/groups/join-button";
import { GroupDiscussion } from "@/components/groups/group-discussion";
import { ReportErrorLink } from "@/components/report-error-link";

export const dynamic = "force-dynamic";

const C = {
  card: "#FDFCF9", rule: "#E4E0D3", ink900: "#1A2138", ink700: "#3D435A",
  ink500: "#6B7088", ink400: "#8B8FA3", teal: "#3D8073", tealDk: "#2F6358", tealSoft: "#E6F0ED",
};

interface Group {
  id: string; slug: string; name: string; description: string | null; category: string | null; created_at: string; verified: boolean;
}
interface Official {
  id: string; official_name: string | null; official_role: string | null; vote_position: string | null; source_url: string | null; candidate_slug: string | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("groups").select("name, description").eq("slug", slug).eq("status", "active").single();
  if (!data) return { title: "Group not found" };
  return {
    title: `${data.name} · MyVote Community`,
    description: (data.description || `A MyVote community group organizing around a local Georgia issue.`).slice(0, 200),
    alternates: { canonical: `/groups/${slug}` },
  };
}

export default async function GroupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: group } = await supabase
    .from("groups")
    .select("id, slug, name, description, category, created_at, verified")
    .eq("slug", slug)
    .eq("status", "active")
    .single();
  if (!group) notFound();
  const g = group as Group;

  const { data: officialRows } = await supabase
    .from("group_officials")
    .select("id, official_name, official_role, vote_position, source_url, candidate_slug")
    .eq("group_id", g.id)
    .eq("status", "active")
    .order("vote_position", { ascending: true });
  const officials = (officialRows as Official[]) ?? [];

  const { count: memberCount } = await supabase
    .from("group_members")
    .select("*", { count: "exact", head: true })
    .eq("group_id", g.id);

  const { data: { user } } = await supabase.auth.getUser();
  let joined = false;
  if (user) {
    const { data: mem } = await supabase
      .from("group_members")
      .select("id")
      .eq("group_id", g.id)
      .eq("user_id", user.id)
      .maybeSingle();
    joined = !!mem;
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 56px" }}>
      <Link href="/groups" style={{ fontSize: 12.5, color: C.teal, fontWeight: 600, textDecoration: "none" }}>← All groups</Link>

      <div style={{ marginTop: 12, marginBottom: 18 }}>
        {g.category && (
          <span style={{ fontSize: 11, fontWeight: 700, color: C.tealDk, background: C.tealSoft, border: "1px solid #C0DAD4", borderRadius: 999, padding: "2px 10px" }}>{g.category}</span>
        )}
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 600, color: C.ink900, lineHeight: 1.2, margin: "8px 0 10px", letterSpacing: -0.3 }}>
          {g.name}
        </h1>
        {g.description && (
          <p style={{ fontSize: 14.5, color: C.ink700, lineHeight: 1.65, margin: "0 0 14px", whiteSpace: "pre-wrap" }}>{g.description}</p>
        )}
        <JoinButton groupId={g.id} initialJoined={joined} initialCount={memberCount ?? 0} />
      </div>

      {/* Who made this decision — factual, sourced accountability (not blame) */}
      {officials.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 14, boxShadow: "0 2px 10px rgba(20,24,40,0.07)", padding: "16px 18px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: 0 }}>Who made this decision</h2>
            {g.verified && (
              <span style={{ fontSize: 10.5, fontWeight: 700, color: C.tealDk, background: C.tealSoft, border: "1px solid #C0DAD4", borderRadius: 999, padding: "1px 8px" }}>
                ✓ Sourced
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, color: C.ink500, margin: "0 0 12px", lineHeight: 1.5 }}>
            Public record of the officials and how they voted. Click a source to verify, and contact your representatives directly.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {officials.map((o) => {
              const closing = /close|against|cut|remov/i.test(o.vote_position || "");
              const chipBg = closing ? "#FEF2F2" : C.tealSoft;
              const chipColor = closing ? "#B33A2C" : C.tealDk;
              const chipBorder = closing ? "#FECACA" : "#C0DAD4";
              const inner = (
                <>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: C.ink900, margin: 0 }}>{o.official_name}</p>
                    {o.official_role && <p style={{ fontSize: 11.5, color: C.ink500, margin: "1px 0 0" }}>{o.official_role}</p>}
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    {o.vote_position && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: chipColor, background: chipBg, border: `1px solid ${chipBorder}`, borderRadius: 999, padding: "2px 9px", whiteSpace: "nowrap" }}>
                        {o.vote_position}
                      </span>
                    )}
                    {o.source_url && (
                      <a href={o.source_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11.5, fontWeight: 600, color: C.teal, textDecoration: "none", whiteSpace: "nowrap" }}>
                        Source ↗
                      </a>
                    )}
                  </div>
                </>
              );
              return o.candidate_slug ? (
                <Link key={o.id} href={`/elections/candidate/${o.candidate_slug}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.rule}`, textDecoration: "none" }}>
                  {inner}
                </Link>
              ) : (
                <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.rule}` }}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Discussion */}
      <GroupDiscussion groupId={g.id} />

      {/* Provenance + report */}
      <div style={{ marginTop: 24, paddingTop: 14, borderTop: `1px solid ${C.rule}` }}>
        <p style={{ fontSize: 11.5, color: C.ink400, lineHeight: 1.5, margin: "0 0 6px" }}>
          {g.verified
            ? "The vote record above is compiled from public reporting — follow the source links to verify. Discussion below is from community members and reflects their own views."
            : "This group is created and run by community members. Posts reflect their authors’ views, not MyVote’s, and are not verified by us."}
        </p>
        <ReportErrorLink refPath={`/groups/${g.slug}`} />
      </div>
    </div>
  );
}
