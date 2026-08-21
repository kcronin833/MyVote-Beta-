"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-context";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
  /** Prefill the email (e.g. carried over from a reminder signup) and
      suggest a username + display name so account creation is near one-tap. */
  defaultEmail?: string;
}

export function AuthModal({ open, onClose, defaultTab = "login", defaultEmail = "" }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login fields
  const [loginEmail, setLoginEmail] = useState(defaultEmail);
  const [loginPassword, setLoginPassword] = useState("");

  // Signup fields
  const [signupEmail, setSignupEmail] = useState(defaultEmail);
  const [signupPassword, setSignupPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupDisplayName, setSignupDisplayName] = useState("");

  // When opened with a carried-over email, seed the fields and suggest a
  // username / display name from the local part so there's little left to type.
  useEffect(() => {
    if (!open) return;
    setTab(defaultTab);
    if (defaultEmail) {
      setLoginEmail(defaultEmail);
      setSignupEmail(defaultEmail);
      const local = defaultEmail.split("@")[0] || "";
      const uname = local.toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "").slice(0, 20);
      if (uname.length >= 3) setSignupUsername((u) => u || uname);
      const disp = local.replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();
      setSignupDisplayName((d) => d || disp);
    }
  }, [open, defaultEmail, defaultTab]);

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

        {/* Tab switcher */}
        <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", border: "1px solid #E4E0D3", marginBottom: 16 }}>
          {(["login", "signup"] as const).map((t) => (
            <button
              key={t}
              style={{
                flex: 1, padding: "9px 0", fontSize: 13.5, fontWeight: 600, cursor: "pointer", border: "none", transition: "all 0.15s",
                background: tab === t ? "#2F6358" : "#FDFCF9",
                color: tab === t ? "#fff" : "#6B7088",
              }}
              onClick={() => { setTab(t); setError(null); }}
            >
              {t === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#B33A2C", padding: "10px 14px", borderRadius: 8, fontSize: 13.5, lineHeight: 1.5 }}>
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
            <button
              style={{ width: "100%", height: 42, borderRadius: 999, border: "none", background: loading ? "#E4E0D3" : "#3D8073", color: loading ? "#8B8FA3" : "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "default" : "pointer", transition: "background 0.15s" }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
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
            <button
              style={{ width: "100%", height: 42, borderRadius: 999, border: "none", background: loading ? "#E4E0D3" : "#3D8073", color: loading ? "#8B8FA3" : "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "default" : "pointer", transition: "background 0.15s" }}
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
            <p className="text-xs text-muted-foreground text-center">
              By signing up, you agree to discuss politics civilly 🇺🇸
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
