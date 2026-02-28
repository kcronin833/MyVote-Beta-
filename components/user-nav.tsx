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
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth-modal";
import Link from "next/link";
import { LogOut, User, Settings } from "lucide-react";

export function UserNav() {
  const { user, profile, signOut, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
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
            className="bg-blue-600 hover:bg-blue-700"
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

  const initials = profile.display_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">{profile.display_name}</p>
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
