import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const alt = "MyVote — a story across the political spectrum";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function ascii(s: string): string {
  return s.replace(/[–—]/g, "-").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[^\x00-\x7F]/g, "");
}

export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let headline = "Georgia & national news, across the spectrum";
  let sources = 0;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder"
    );
    const { data } = await supabase
      .from("clustered_stories")
      .select("headline, article_data")
      .eq("id", id)
      .single();
    if (data) {
      headline = ascii((data.headline as string) || headline);
      sources = Array.isArray(data.article_data) ? data.article_data.length : 0;
    }
  } catch {
    /* defaults */
  }
  if (headline.length > 130) headline = headline.slice(0, 127) + "...";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#FFFFFF", padding: "64px 72px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 800, color: "#030213" }}>
            My
            <svg width="30" height="30" viewBox="0 0 24 24" style={{ margin: "0 1px" }}>
              <path d="M5 13l4 4L19 7" stroke="#D4183D" strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            ote
          </div>
          {/* Left / Center / Right spectrum marker */}
          <div style={{ display: "flex" }}>
            <span style={{ display: "flex", width: 48, height: 12, background: "#1E88E5" }} />
            <span style={{ display: "flex", width: 48, height: 12, background: "#78909C" }} />
            <span style={{ display: "flex", width: 48, height: 12, background: "#D4183D" }} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 22, fontWeight: 700, letterSpacing: 2, color: "#717182", marginBottom: 18 }}>
            ACROSS THE SPECTRUM
            {sources > 0 ? (
              <>
                <span style={{ display: "flex", width: 7, height: 7, borderRadius: 7, background: "#D4183D", margin: "0 14px" }} />
                {sources} SOURCES, LEFT TO RIGHT
              </>
            ) : null}
          </div>
          <div style={{ fontSize: 58, fontWeight: 800, color: "#030213", lineHeight: 1.12, maxWidth: 1060 }}>
            {headline}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 26, color: "#3D435A" }}>The facts first, then every side</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#030213" }}>myvotega.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
