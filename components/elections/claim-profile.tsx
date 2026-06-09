"use client";

import { useState } from "react";
import { C } from "@/lib/design-tokens";

const ROLES = [
  { id: "candidate", label: "I'm the candidate" },
  { id: "campaign", label: "Campaign / staff" },
  { id: "other", label: "Other" },
];

export function ClaimProfile({
  candidateName,
  raceOffice,
  slug,
}: {
  candidateName: string;
  raceOffice: string;
  slug: string;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [claimantName, setClaimantName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!claimantName.trim() || !email.trim() || !role) {
      setError("Please add your name, email, and relationship to the candidate.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/candidate/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          candidateName,
          raceOffice,
          slug,
          claimantName,
          email,
          role,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Try again.");
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        background: C.amberSoft,
        border: `1px solid ${C.amberBorder}`,
        borderRadius: 10,
        padding: 14,
        boxShadow: "0 1px 0 rgba(20,24,40,0.03)",
      }}
    >
      {/* Disclosure */}
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span
          style={{
            flexShrink: 0,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 0.4,
            color: "#fff",
            background: C.amber,
            borderRadius: 5,
            padding: "3px 7px",
            marginTop: 1,
          }}
        >
          AI
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink900 }}>
            AI-generated profile
          </div>
          <p style={{ fontSize: 12.5, color: C.ink700, margin: "2px 0 0", lineHeight: 1.5 }}>
            This profile was compiled by AI from public information and may
            contain errors. Are you {candidateName} or part of the campaign? Claim
            this profile to request corrections and verified control.
          </p>
        </div>
      </div>

      {done ? (
        <div
          style={{
            marginTop: 12,
            background: C.tealSoft,
            border: `1px solid ${C.teal}`,
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 12.5,
            color: C.tealDk,
            lineHeight: 1.5,
          }}
        >
          ✓ Thanks — your claim request was sent to the MyVote team. We'll verify
          and reach out at the email you provided.
        </div>
      ) : !open ? (
        <button
          onClick={() => setOpen(true)}
          style={{
            marginTop: 12,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: C.ink900,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "9px 16px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Claim this profile
        </button>
      ) : (
        <form onSubmit={submit} style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              placeholder="Your name"
              value={claimantName}
              onChange={(e) => setClaimantName(e.target.value)}
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="Email for verification"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {ROLES.map((r) => {
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "6px 12px",
                    borderRadius: 999,
                    cursor: "pointer",
                    border: `1px solid ${active ? C.teal : C.rule}`,
                    background: active ? C.tealSoft : C.card,
                    color: active ? C.tealDk : C.ink700,
                  }}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
          <textarea
            placeholder="Anything to add? (corrections, campaign site, how to verify you)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            style={{ ...inputStyle, width: "100%", resize: "vertical", height: "auto", padding: "8px 12px" }}
          />
          {error && (
            <p style={{ fontSize: 12, color: C.red, margin: 0 }}>{error}</p>
          )}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: C.teal,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "9px 18px",
                fontSize: 13,
                fontWeight: 700,
                cursor: submitting ? "default" : "pointer",
                opacity: submitting ? 0.75 : 1,
              }}
            >
              {submitting ? "Sending…" : "Send claim request"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                color: C.ink500,
                border: "none",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
          <p style={{ fontSize: 11, color: C.ink400, margin: 0, lineHeight: 1.4 }}>
            We verify identity before granting any edit access.
          </p>
        </form>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 160,
  height: 38,
  borderRadius: 8,
  border: `1px solid ${C.rule}`,
  background: C.card,
  color: C.ink900,
  padding: "0 12px",
  fontSize: 13.5,
  outline: "none",
};
