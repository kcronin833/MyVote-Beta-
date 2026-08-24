import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
};

export default function DesktopPreviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
