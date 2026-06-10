"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { C } from "@/lib/design-tokens";

/* ZIP → /g/[county] router. Lives on the elections hub so a voter can
   jump straight from "what's my ballot?" to their county's race list. */
export function ZipBallotLookup({ variant = "light" }: { variant?: "light" | "onDark" }) {
  const router = useRouter();
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const cleaned = zip.trim();
    if (!/^\d{5}$/.test(cleaned)) {
      setError("Enter a 5-digit ZIP code.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/ballot-lookup?zip=${cleaned}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.found && data.href) {
        router.push(data.href);
        return; // keep spinner up through navigation
      }
      setError(data.error || "We couldn't find that ZIP.");
    } catch {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  }

  const onDark = variant === "onDark";

  return (
    <div>
      <form onSubmit={submit}>
        {/* Unified pill container */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: onDark ? "rgba(255,255,255,0.13)" : "#fff",
            backdropFilter: onDark ? "blur(8px)" : undefined,
            borderRadius: 999,
            border: onDark
              ? "1.5px solid rgba(255,255,255,0.28)"
              : `1.5px solid ${C.rule}`,
            overflow: "hidden",
            boxShadow: onDark
              ? "0 4px 24px rgba(0,0,0,0.22)"
              : "0 2px 10px rgba(20,24,40,0.07)",
          }}
        >
          <MapPin
            size={16}
            style={{ marginLeft: 16, flexShrink: 0, opacity: 0.65, color: onDark ? "#fff" : C.ink500 }}
          />
          <input
            inputMode="numeric"
            maxLength={5}
            placeholder="Enter your ZIP code"
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/[^\d]/g, ""))}
            aria-label="ZIP code"
            style={{
              flex: 1,
              minWidth: 0,
              height: 46,
              border: "none",
              outline: "none",
              background: "transparent",
              color: onDark ? "#fff" : C.ink900,
              padding: "0 10px",
              fontSize: 15,
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              height: 46,
              padding: "0 22px",
              border: "none",
              borderRadius: "0 999px 999px 0",
              background: C.red,
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.75 : 1,
              whiteSpace: "nowrap",
              letterSpacing: 0.1,
            }}
          >
            {loading ? "Finding…" : "Find my ballot"}
          </button>
        </div>
      </form>
      {error && (
        <p
          style={{
            margin: "8px 4px 0",
            fontSize: 12.5,
            color: onDark ? "#FBD9D2" : C.red,
            lineHeight: 1.45,
          }}
        >
          {error}{" "}
          <Link
            href="/g"
            style={{
              color: onDark ? "#fff" : C.teal,
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            Browse by county →
          </Link>
        </p>
      )}
      <p
        style={{
          margin: "8px 4px 0",
          fontSize: 11.5,
          color: onDark ? "rgba(255,255,255,0.65)" : C.ink400,
        }}
      >
        Georgia ZIP codes only.{" "}
        <Link
          href="/g"
          style={{ color: onDark ? "rgba(255,255,255,0.85)" : C.teal, fontWeight: 600 }}
        >
          Or browse all 159 counties
        </Link>
      </p>
    </div>
  );
}
