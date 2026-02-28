"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
}

export function AuthModal({ open, onClose, defaultTab = "login" }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupDisplayName, setSignupDisplayName] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError(null);
    const { error } = await signIn(loginEmail, loginPassword);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      onClose();
    }
  }

  async function handleSignup() {
    if (!signupUsername.match(/^[a-z0-9_]{3,20}$/)) {
      setError("Username must be 3-20 characters, lowercase letters, numbers, or underscores");
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await signUp(
      signupEmail,
      signupPassword,
      signupUsername,
      signupDisplayName
    );
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {tab === "login" ? "Sign in to MyVote" : "Join MyVote"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex rounded-lg overflow-hidden border border-border mb-4">
          <button
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              tab === "login"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            }`}
            onClick={() => { setTab("login"); setError(null); }}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              tab === "signup"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            }`}
            onClick={() => { setTab("signup"); setError(null); }}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        {tab === "login" ? (
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <Input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <Button
              className="w-full"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Display Name"
              value={signupDisplayName}
              onChange={(e) => setSignupDisplayName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Username (e.g. john_voter)"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value.toLowerCase())}
            />
            <Input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password (min. 6 characters)"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            />
            <Button
              className="w-full"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              By signing up, you agree to discuss politics civilly
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
