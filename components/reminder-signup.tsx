"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

const C = {
  card: "#FDFCF9",
  rule: "#E4E0D3",
  ink900: "#1A2138",
  ink700: "#3D435A",
  ink500: "#6B7088",
  ink400: "#8B8FA3",
  teal: "#3D8073",
  tealDk: "#2F6358",
  tealSoft: "#E6F0ED",
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
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

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
          border: "1px solid #C0DAD4",
          borderRadius: 12,
          padding: "16px 18px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 14, fontWeight: 700, color: C.tealDk, margin: "0 0 2px" }}>
          ✓ You&rsquo;re on the list
        </p>
        <p style={{ fontSize: 12.5, color: C.ink700, margin: 0, lineHeight: 1.5 }}>
          We&rsquo;ll remind you before every 2026 Georgia election. No spam, ever.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: highlight ? C.tealSoft : C.card,
        border: highlight ? "1px solid #C0DAD4" : `1px solid ${C.rule}`,
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
            boxShadow: state === "saving" ? "none" : "0 1px 8px rgba(61,128,115,0.25)",
          }}
        >
          {state === "saving" ? "Saving…" : "Remind me"}
        </button>
      </form>

      {message && (
        <p style={{ fontSize: 12, color: "#B33A2C", margin: "8px 0 0" }}>{message}</p>
      )}
      <p style={{ fontSize: 10.5, color: C.ink400, margin: "8px 0 0" }}>
        Only election reminders — never shared, never sold. Unsubscribe anytime.
      </p>
    </div>
  );
}
