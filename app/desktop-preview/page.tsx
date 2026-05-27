"use client";

/* Preview of the Claude Design "Desktop Redesign" prototype.
   Uses mock data from lib/mv-data.ts — purely visual reference.
   The production home (`/`) uses the real functional components. */

import { DesktopHome } from "@/components/desktop/home";

export default function DesktopPreviewPage() {
  return (
    <>
      <div
        style={{
          background: "#1A2138",
          color: "#fff",
          padding: "8px 16px",
          fontSize: 12,
          textAlign: "center",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        Design preview · mock data · the real home with your data is at{" "}
        <a href="/" style={{ color: "#80c4b8", textDecoration: "underline" }}>
          /
        </a>
      </div>
      <DesktopHome />
    </>
  );
}
