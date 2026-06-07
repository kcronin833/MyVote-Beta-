import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up · MyVote",
  robots: { index: false, follow: false },
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
