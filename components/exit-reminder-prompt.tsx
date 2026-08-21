"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ReminderSignup } from "@/components/reminder-signup";
import { ExploreFeatures } from "@/components/explore-features";

/* One-time exit-intent / scroll-depth reminder prompt.
 *
 * Conversion move #3: catch a visitor who's about to leave a deep page
 * without converting, and offer the email reminder one last time. Shown at
 * most ONCE per browser, ever, and never to someone who already signed up.
 *
 * Triggers: desktop exit-intent (cursor leaves toward the top) OR scrolling
 * past ~55% of the page (covers mobile, which has no mouseleave). */

const SEEN_KEY = "mv_exit_prompt_seen";
const SIGNED_KEY = "mv_reminder_signed";

// Pages where a separate capture would be redundant or unwelcome.
const SKIP = ["/", "/quiz", "/welcome", "/contact"];
const SKIP_PREFIX = ["/auth/"];

export function ExitReminderPrompt() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  const eligible =
    !SKIP.includes(pathname) && !SKIP_PREFIX.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (!eligible) return;

    let seen = false;
    try {
      seen =
        localStorage.getItem(SEEN_KEY) === "1" ||
        localStorage.getItem(SIGNED_KEY) === "1";
    } catch {
      seen = true; // storage blocked → don't risk nagging
    }
    if (seen) return;

    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      try {
        localStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* ignore */
      }
      setShow(true);
      cleanup();
    };

    const onMouseOut = (e: MouseEvent) => {
      // Exit intent: cursor leaves the viewport from the top (toward tabs/URL).
      if (e.clientY <= 0) fire();
    };
    const onScroll = () => {
      const scrolled =
        window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
      if (scrolled > 0.55) fire();
    };

    function cleanup() {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
    }

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, [eligible, pathname]);

  function dismiss() {
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      onClick={dismiss}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 70,
        background: "rgba(20,24,40,0.45)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "0 0 env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 460,
          margin: "0 12px 12px",
          background: "#F5F3EE",
          borderRadius: 18,
          padding: "16px 14px 14px",
          boxShadow: "0 16px 50px rgba(20,24,40,0.3)",
          maxHeight: "88vh",
          overflowY: "auto",
        }}
      >
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          style={{
            position: "absolute",
            top: 8,
            right: 12,
            background: "none",
            border: "none",
            color: "#8B8FA3",
            fontSize: 22,
            lineHeight: 1,
            cursor: "pointer",
            padding: 4,
            zIndex: 1,
          }}
        >
          ×
        </button>
        <ReminderSignup
          source="exit-prompt"
          title="Before you go — get a reminder?"
          blurb="One email before each 2026 Georgia election — registration deadline, early voting, and election day. No spam, never sold."
        />

        {/* Feature discovery: many visitors never find the rest of the product. */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 2px 12px" }}>
          <span style={{ flex: 1, height: 1, background: "#E4E0D3" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#8B8FA3", letterSpacing: 0.4 }}>OR EXPLORE MYVOTE</span>
          <span style={{ flex: 1, height: 1, background: "#E4E0D3" }} />
        </div>
        <ExploreFeatures
          bare
          heading="There's more here than you think"
          note="Free, nonpartisan tools for Georgia voters — take a look before you go."
        />
      </div>
    </div>
  );
}
