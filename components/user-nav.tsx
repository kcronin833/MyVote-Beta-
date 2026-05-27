"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { LogOut, User, Settings, ShieldCheck } from "lucide-react";

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
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setAuthTab("login"); setAuthOpen(true); }}
          >
            Sign In
          </Button>
          <Button
            size="sm"
            className="bg-ink-900 hover:bg-ink-900/90"
            onClick={() => { setAuthTab("signup"); setAuthOpen(true); }}
          >
            Sign Up
          </Button>
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
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          <Avatar className="h-8 w-8">
            {profile.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
            ) : null}
            <AvatarFallback className="bg-ink-900 text-white text-xs font-bold">
              {profile.display_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Button>
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
          <Link href={`/profile/${profile.username}`}>
            <User className="mr-2 h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <Settings className="mr-2 h-4 w-4" />
            Political Profile
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
