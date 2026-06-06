"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PALETTE as C } from "./atoms";
import { Icons } from "./icons";
import { UserNav } from "@/components/user-nav";

type NavId = "home" | "national" | "local" | "ballot";

export function TopNav({ active = "home" }: { active?: NavId }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  const items: { id: NavId; label: string; icon: React.ReactNode; href: string; badge?: string | number }[] = [
    { id: "home",     label: "Home",          icon: Icons.home(),    href: "/" },
    { id: "national", label: "National news", icon: Icons.earth(),   href: "/news" },
    { id: "local",    label: "Local news",    icon: Icons.pin(),     href: "/news/local" },
    { id: "ballot",   label: "My Ballot",     icon: Icons.vote(),    href: "/elections" },
  ];

  return (
    <div
      style={{
        background: C.card,
        borderBottom: `1px solid ${C.rule}`,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        className="max-w-[1240px] mx-auto h-14 flex items-center gap-3 sm:gap-4 lg:gap-[18px] px-3 lg:px-6"
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: C.ink900,
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: -0.4,
            }}
          >
            m<span style={{ color: C.teal }}>v</span>
          </div>
        </Link>

        {/* Search — hidden on small screens */}
        <form
          onSubmit={onSearch}
          className="hidden md:flex"
          style={{
            flex: "0 1 320px",
            height: 36,
            background: C.shade,
            border: `1px solid ${C.ruleSoft}`,
            borderRadius: 6,
            alignItems: "center",
            padding: "0 12px",
            gap: 8,
          }}
        >
          <button
            type="submit"
            aria-label="Search"
            style={{
              color: C.ink500,
              display: "flex",
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            {Icons.search(16)}
          </button>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search candidates, issues, neighbors…"
            aria-label="Search candidates, issues, neighbors"
            style={{
              flex: 1,
              minWidth: 0,
              height: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: C.ink900,
              fontSize: 13,
            }}
          />
        </form>

        {/* Right cluster: nav + avatar */}
        <div style={{ display: "flex", marginLeft: "auto", alignItems: "center" }}>
          {items.map((it) => {
            const isActive = active === it.id;
            return (
              <Link
                key={it.id}
                href={it.href}
                aria-label={it.label}
                className="px-2 sm:px-3 lg:px-[14px]"
                style={{
                  paddingTop: 8,
                  paddingBottom: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  color: isActive ? C.ink900 : C.ink500,
                  borderBottom: isActive ? `2px solid ${C.ink900}` : "2px solid transparent",
                  fontSize: 11,
                  fontWeight: 500,
                  textDecoration: "none",
                  position: "relative",
                }}
              >
                <span style={{ position: "relative" }}>
                  {it.icon}
                  {it.badge ? (
                    <span
                      style={{
                        position: "absolute",
                        top: -3,
                        right: -7,
                        background: C.red,
                        color: "#fff",
                        fontSize: 9,
                        fontWeight: 700,
                        borderRadius: 999,
                        padding: "1px 5px",
                      }}
                    >
                      {it.badge}
                    </span>
                  ) : null}
                </span>
                <span className="hidden sm:inline">{it.label}</span>
              </Link>
            );
          })}

          <div className="hidden sm:block" style={{ width: 1, height: 28, background: C.rule, margin: "0 12px" }} />

          {/* Real user dropdown — surfaces "My Profile", "Political Profile",
              "Admin Panel" (for admins), and "Sign Out". */}
          <UserNav />
        </div>
      </div>
    </div>
  );
}
