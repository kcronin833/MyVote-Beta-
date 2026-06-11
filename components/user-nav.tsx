"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth-context";
import { AuthModal } from "@/components/auth-modal";
import Link from "next/link";
import { LogOut, User, Vote, Compass, ShieldCheck } from "lucide-react";

export function UserNav() {
  const { user, profile, signOut, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-paper-100 animate-pulse" />;
  }

  if (!user || !profile) {
    return (
      <>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => { setAuthTab("login"); setAuthOpen(true); }}
            style={{ height: 32, padding: "0 12px", borderRadius: 999, background: "transparent", border: "none", color: "#2F6358", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setAuthTab("signup"); setAuthOpen(true); }}
            style={{ height: 32, padding: "0 14px", borderRadius: 999, background: "#3D8073", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", border: "none", boxShadow: "0 1px 8px rgba(61,128,115,0.28)" }}
          >
            Sign Up
          </button>
        </div>
        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          defaultTab={authTab}
        />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button style={{ width: 32, height: 32, borderRadius: "50%", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Avatar className="h-8 w-8">
            {profile.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
            ) : null}
            <AvatarFallback style={{ background: "#2F6358", color: "#fff", fontSize: 11, fontWeight: 700 }}>
              {profile.display_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium leading-none">{profile.display_name}</p>
            {profile.is_admin && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
                <ShieldCheck className="w-2.5 h-2.5" />
                Admin
              </span>
            )}
          </div>
          <p className="text-xs leading-none text-muted-foreground">
            @{profile.username}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <Vote className="mr-2 h-4 w-4" />
            My Ballot &amp; Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/profile/${profile.username}`}>
            <User className="mr-2 h-4 w-4" />
            Public Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profiles">
            <Compass className="mr-2 h-4 w-4" />
            Civic Profile Types
          </Link>
        </DropdownMenuItem>
        {profile.is_admin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin" className="text-amber-700 font-medium">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
