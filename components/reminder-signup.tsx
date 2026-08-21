"use client";

import { useState } from "react";
import { Bell, Share2, UserPlus } from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { AuthModal } from "@/components/auth-modal";

const C = {
  card: "#FFFFFF",
  rule: "#E9EBEF",
  ink900: "#030213",
  ink700: "#3D435A",
  ink500: "#717182",
  ink400: "#8B8FA3",
  teal: "#030213",
  tealDk: "#030213",
  tealSoft: "#EFEFF3",
};

/* Election reminder email capture — the retention asset. Renders as a
   design-system card; pass countySlug/source so we know where signups
   come from and can localize future sends. */
export function ReminderSignup({
  countySlug,
  source = "site",
  compact = false,
  title = "Never miss an election",
  blurb = "Get one reminder before each 2026 Georgia election day — registration deadlines, early voting, and what’s on your ballot.",
  highlight = false,
}: {
  countySlug?: string;
  source?: string;
  compact?: boolean;
  /** Custom heading — lets callers use high-intent framing. */
  title?: string;
  /** Custom one-line value prop under the heading. */
  blurb?: string;
  /** Teal-tinted emphasis treatment for high-intent placements. */
  highlight?: boolean;
}) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = "https://www.myvotega.com";
  const shareText =
    "I just signed up to stay ready for Georgia's 2026 elections with MyVote — see your ballot, who's running, and key dates:";

  async function share() {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "MyVote", text: shareText, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* dismissed — not an error */
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "saving") return;
    setState("saving");
    setMessage(null);
    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, countySlug, source }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState("error");
        setMessage(data.error || "Something went wrong. Try again.");
        return;
      }
      setState("done");
      // Mark so the exit-intent prompt never nags someone already subscribed.
      try {
        localStorage.setItem("mv_reminder_signed", "1");
      } catch {
        /* ignore */
      }
    } catch {
      setState("error");
      setMessage("Something went wrong. Try again.");
    }
  }

  if (state === "done") {
    return (
      <div
        style={{
          background: C.tealSoft,
          border: "1px solid #D9DCE3",
          borderRadius: 12,
          padding: "16px 18px",
        }}
      >
        <p style={{ fontSize: 14, fontWeight: 700, color: C.tealDk, margin: "0 0 2px", textAlign: "center" }}>
          ✓ You&rsquo;re on the list
        </p>
        <p style={{ fontSize: 12.5, color: C.ink700, margin: "0 0 12px", lineHeight: 1.5, textAlign: "center" }}>
          We&rsquo;ll remind you before every 2026 Georgia election. No spam, ever.
        </p>

        {/* Convert the email you already gave into a free account. */}
        {!user && (
          <div style={{ background: "#fff", border: `1px solid ${C.rule}`, borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
            <p style={{ fontSize: 12.5, fontWeight: 700, color: C.ink900, margin: "0 0 3px" }}>
              Do more than get reminded
            </p>
            <p style={{ fontSize: 12, color: C.ink500, margin: "0 0 10px", lineHeight: 1.5 }}>
              Create a free profile to save your ballot, connect with neighbors, and follow your local issues — we&rsquo;ll use{" "}
              <strong style={{ color: C.ink700 }}>{email}</strong>.
            </p>
            <button
              onClick={() => setAuthOpen(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 36, padding: "0 16px", borderRadius: 999, border: "none", background: C.teal, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 1px 8px rgba(3,2,19,0.25)" }}
            >
              <UserPlus size={14} /> Create your free profile
            </button>
          </div>
        )}

        {/* Turn every signup into a referral. */}
        <button
          onClick={share}
          style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, height: 34, padding: "0 14px", borderRadius: 999, border: `1px solid #D9DCE3`, background: "transparent", color: C.tealDk, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
        >
          <Share2 size={14} /> {copied ? "Copied ✓" : "Share MyVote with a neighbor"}
        </button>

        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab="signup" defaultEmail={email} />
      </div>
    );
  }

  return (
    <div
      style={{
        background: highlight ? C.tealSoft : C.card,
        border: highlight ? "1px solid #D9DCE3" : `1px solid ${C.rule}`,
        borderRadius: 12,
        boxShadow: highlight ? "none" : "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
        padding: compact ? "14px 16px" : "18px 20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <Bell size={15} color={C.teal} style={{ flexShrink: 0 }} />
        <p style={{ fontSize: 13.5, fontWeight: 700, color: C.ink900, margin: 0 }}>
          {title}
        </p>
      </div>
      <p style={{ fontSize: 12.5, color: C.ink500, margin: "0 0 12px", lineHeight: 1.5 }}>
        {blurb}
      </p>

      <form onSubmit={submit} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          aria-label="Email address for election reminders"
          style={{
            flex: "1 1 180px",
            minWidth: 0,
            height: 40,
            borderRadius: 8,
            border: `1px solid ${C.rule}`,
            background: "#fff",
            color: C.ink900,
            fontSize: 13.5,
            padding: "0 12px",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={state === "saving"}
          style={{
            height: 40,
            padding: "0 18px",
            borderRadius: 999,
            border: "none",
            background: state === "saving" ? C.rule : C.teal,
            color: state === "saving" ? C.ink400 : "#fff",
            fontSize: 13.5,
            fontWeight: 700,
            cursor: state === "saving" ? "default" : "pointer",
            whiteSpace: "nowrap",
            boxShadow: state === "saving" ? "none" : "0 1px 8px rgba(3,2,19,0.25)",
          }}
        >
          {state === "saving" ? "Saving…" : "Remind me"}
        </button>
      </form>

      {message && (
        <p style={{ fontSize: 12, color: "#D4183D", margin: "8px 0 0" }}>{message}</p>
      )}
      <p style={{ fontSize: 10.5, color: C.ink400, margin: "8px 0 0" }}>
        Only election reminders — never shared, never sold. Unsubscribe anytime.
      </p>
    </div>
  );
}
