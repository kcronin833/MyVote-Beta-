"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { PALETTE as C } from "./atoms";
import { Icons } from "./icons";
import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/logo";

type NavId = "home" | "national" | "local" | "ballot" | "register" | "";

/** Auto-detect the active tab from pathname, unless an explicit override is passed. */
function useActiveTab(override?: NavId): NavId {
  const pathname = usePathname();
  if (override !== undefined) return override;
  if (pathname === "/") return "home";
  if (pathname.startsWith("/news/local")) return "local";
  if (pathname.startsWith("/news")) return "national";
  if (
    pathname.startsWith("/elections") ||
    pathname.startsWith("/g")
  ) return "ballot";
  if (pathname.startsWith("/register")) return "register";
  return "";
}

export function TopNav({ active: activeProp }: { active?: NavId } = {}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const active = useActiveTab(activeProp);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  const items: { id: NavId; label: string; icon: React.ReactNode; href: string; badge?: string | number }[] = [
    { id: "home",     label: "Home",       icon: Icons.home(),   href: "/" },
    { id: "national", label: "National",   icon: Icons.earth(),  href: "/news" },
    { id: "local",    label: "Local",      icon: Icons.pin(),    href: "/news/local" },
    { id: "ballot",   label: "Elections",  icon: Icons.vote(),   href: "/elections" },
    { id: "register", label: "Register",   icon: Icons.check(),  href: "/register" },
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
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Logo size="sm" />
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
        <nav aria-label="Main navigation" style={{ display: "flex", marginLeft: "auto", alignItems: "center" }}>
          {items.map((it) => {
            const isActive = active === it.id;
            return (
              <Link
                key={it.id}
                href={it.href}
                aria-label={it.label}
                aria-current={isActive ? "page" : undefined}
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

          <div className="hidden sm:block" aria-hidden="true" style={{ width: 1, height: 28, background: C.rule, margin: "0 12px" }} />

          {/* Real user dropdown — surfaces "My Profile", "Political Profile",
              "Admin Panel" (for admins), and "Sign Out". */}
          <UserNav />
        </nav>
      </div>
    </div>
  );
}
