import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const alt = "MyVote local issue";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Auto-generated share card for a group, so issue links unfurl with the
   issue name + supporter count + brand — the thing that makes them spread. */
export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let name = "Local Issue";
  let county: string | null = null;
  let supporters = 0;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder"
    );
    const { data: g } = await supabase
      .from("groups")
      .select("id, name, county_slug")
      .eq("slug", slug)
      .eq("status", "active")
      .single();
    if (g) {
      name = g.name as string;
      county = (g.county_slug as string) || null;
      const { count } = await supabase
        .from("group_members")
        .select("*", { count: "exact", head: true })
        .eq("group_id", g.id);
      supporters = count ?? 0;
    }
  } catch {
    /* fall back to defaults */
  }

  const place = county
    ? `${county.charAt(0).toUpperCase()}${county.slice(1)} County, GA`
    : "Georgia";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FDFCF9",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 800, color: "#1A2138" }}>
          My
          <svg width="30" height="30" viewBox="0 0 24 24" style={{ margin: "0 1px" }}>
            <path d="M5 13l4 4L19 7" stroke="#B33A2C" strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          ote
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 24, fontWeight: 700, letterSpacing: 2, color: "#3D8073", marginBottom: 18 }}>
            LOCAL ISSUE
            <span style={{ display: "flex", width: 7, height: 7, borderRadius: 7, background: "#3D8073", margin: "0 14px" }} />
            {place}
          </div>
          <div style={{ fontSize: 60, fontWeight: 800, color: "#1A2138", lineHeight: 1.1, maxWidth: 1000 }}>
            {name}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 26, color: "#3D435A" }}>
            {supporters > 0 ? (
              <>
                {supporters} resident{supporters === 1 ? "" : "s"} following
                <span style={{ display: "flex", width: 6, height: 6, borderRadius: 6, background: "#8B8FA3", margin: "0 12px" }} />
              </>
            ) : null}
            Add your voice
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#2F6358" }}>myvotega.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
