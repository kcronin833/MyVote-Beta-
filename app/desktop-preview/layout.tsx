import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview · MyVote",
  robots: { index: false, follow: false },
};

export default function DesktopPreviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
