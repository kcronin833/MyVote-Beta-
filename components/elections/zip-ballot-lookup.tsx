"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const C = {
  card: "#FFFFFF",
  rule: "#E4E0D3",
  ruleSoft: "#EFEBE0",
  shade: "#F7F5EF",
  ink900: "#1A2138",
  ink500: "#6B7088",
  ink400: "#8B8FA3",
  teal: "#3D8073",
  tealDk: "#2F6358",
  red: "#B33A2C",
};

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
      <form
        onSubmit={submit}
        style={{ display: "flex", gap: 8, alignItems: "stretch" }}
      >
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
            height: 42,
            borderRadius: 8,
            border: `1px solid ${onDark ? "rgba(255,255,255,0.35)" : C.rule}`,
            background: onDark ? "rgba(255,255,255,0.12)" : C.card,
            color: onDark ? "#fff" : C.ink900,
            padding: "0 14px",
            fontSize: 15,
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            height: 42,
            padding: "0 18px",
            borderRadius: 8,
            border: "none",
            background: C.teal,
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.75 : 1,
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "Finding…" : "Find my ballot"}
        </button>
      </form>
      {error && (
        <p
          style={{
            margin: "8px 2px 0",
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
          margin: "8px 2px 0",
          fontSize: 11.5,
          color: onDark ? "rgba(255,255,255,0.7)" : C.ink400,
        }}
      >
        Georgia ZIP codes only.{" "}
        <Link
          href="/g"
          style={{ color: onDark ? "#fff" : C.teal, fontWeight: 600 }}
        >
          Or browse all 156 counties
        </Link>
      </p>
    </div>
  );
}
