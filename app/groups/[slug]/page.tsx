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
  id: string; slug: string; name: string; description: string | null; category: string | null; created_at: string;
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
    .select("id, slug, name, description, category, created_at")
    .eq("slug", slug)
    .eq("status", "active")
    .single();
  if (!group) notFound();
  const g = group as Group;

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

      {/* Discussion */}
      <GroupDiscussion groupId={g.id} />

      {/* UGC disclaimer + report */}
      <div style={{ marginTop: 24, paddingTop: 14, borderTop: `1px solid ${C.rule}` }}>
        <p style={{ fontSize: 11.5, color: C.ink400, lineHeight: 1.5, margin: "0 0 6px" }}>
          Community groups are created and run by users. Posts reflect their authors&rsquo; views, not MyVote&rsquo;s, and are not verified by us.
        </p>
        <ReportErrorLink refPath={`/groups/${g.slug}`} />
      </div>
    </div>
  );
}
