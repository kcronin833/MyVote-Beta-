"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, X, Send } from "lucide-react";
import {
  GREETING,
  STARTER_CHIPS,
  FALLBACK,
  matchIntent,
  type AssistantAction,
} from "@/lib/assistant-knowledge";

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
  page: "#F5F3EE",
};

interface Msg {
  from: "bot" | "user";
  text: string;
  actions?: AssistantAction[];
  chips?: string[];
}

export function SiteAssistant() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [nudge, setNudge] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const NUDGE_KEY = "mv_assistant_nudge_seen";

  // One-time proactive greeting: shows a gentle bubble ~6s into a new
  // visitor's first session to convert the assistant from furniture into an
  // activation prompt. Shown once per browser, ever — never nags.
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(NUDGE_KEY) === "1";
    } catch {
      /* localStorage blocked — just skip the nudge */
      seen = true;
    }
    if (seen) return;
    const t = setTimeout(() => setNudge(true), 6000);
    return () => clearTimeout(t);
  }, []);

  function dismissNudge() {
    setNudge(false);
    try {
      localStorage.setItem(NUDGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  // Seed the greeting the first time the panel opens.
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ from: "bot", text: GREETING, chips: STARTER_CHIPS }]);
    }
  }, [open, messages.length]);

  // Keep the latest message in view; focus the input when opening.
  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, open]);

  // Esc closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function respondTo(text: string) {
    const q = text.trim();
    if (!q) return;
    setMessages((prev) => [...prev, { from: "user", text: q }]);

    const intent = matchIntent(q);
    // Small delay so the reply feels conversational, not instant.
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        intent
          ? { from: "bot", text: intent.answer, actions: intent.actions, chips: intent.followups }
          : { from: "bot", text: FALLBACK.answer, actions: FALLBACK.actions, chips: FALLBACK.followups },
      ]);
    }, 280);
  }

  function send() {
    const q = input;
    setInput("");
    respondTo(q);
  }

  function handleAction(a: AssistantAction) {
    if (a.external) {
      window.open(a.href, "_blank", "noopener,noreferrer");
    } else {
      setOpen(false);
      router.push(a.href);
    }
  }

  return (
    <>
      {/* One-time proactive nudge bubble */}
      {!open && nudge && (
        <div
          style={{
            position: "fixed",
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 132px)",
            right: 16,
            zIndex: 60,
            maxWidth: 240,
            background: C.card,
            border: `1px solid ${C.rule}`,
            borderRadius: 14,
            padding: "12px 32px 12px 14px",
            boxShadow: "0 8px 28px rgba(20,24,40,0.22)",
          }}
        >
          <button
            onClick={dismissNudge}
            aria-label="Dismiss"
            style={{ position: "absolute", top: 6, right: 8, background: "none", border: "none", color: C.ink400, cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 2 }}
          >
            ×
          </button>
          <p style={{ fontSize: 13, color: C.ink700, margin: 0, lineHeight: 1.5 }}>
            👋 New here? I can show you around — tap to ask me anything.
          </p>
        </div>
      )}

      {/* Launcher */}
      {!open && (
        <button
          onClick={() => {
            setOpen(true);
            dismissNudge();
          }}
          aria-label="Open the MyVote guide"
          style={{
            position: "fixed",
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 72px)",
            right: 16,
            zIndex: 60,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            height: 50,
            padding: "0 18px 0 16px",
            borderRadius: 999,
            border: "none",
            background: C.teal,
            color: "#fff",
            fontSize: 14.5,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(61,128,115,0.4), 0 2px 6px rgba(20,24,40,0.15)",
            animation: nudge ? "mv-attn 1.8s ease-in-out infinite" : undefined,
          }}
        >
          <MessageCircle size={20} />
          Ask MyVote
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="MyVote guide chat"
          style={{
            position: "fixed",
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
            right: 16,
            left: 16,
            zIndex: 60,
            maxWidth: 380,
            marginLeft: "auto",
            height: "min(560px, calc(100dvh - 96px))",
            display: "flex",
            flexDirection: "column",
            background: C.page,
            border: `1px solid ${C.rule}`,
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 16px 50px rgba(20,24,40,0.28), 0 4px 12px rgba(20,24,40,0.12)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              background: `linear-gradient(135deg, ${C.ink900} 0%, ${C.tealDk} 100%)`,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MessageCircle size={16} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, margin: 0, lineHeight: 1.1 }}>MyVote Guide</p>
                <p style={{ fontSize: 11, margin: 0, color: "rgba(255,255,255,0.7)" }}>
                  Non-partisan · here to help
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4, lineHeight: 0 }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}
          >
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div
                  style={{
                    alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                    maxWidth: "85%",
                    background: m.from === "user" ? C.teal : C.card,
                    color: m.from === "user" ? "#fff" : C.ink700,
                    border: m.from === "user" ? "none" : `1px solid ${C.rule}`,
                    borderRadius: m.from === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    padding: "10px 13px",
                    fontSize: 13.5,
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                    boxShadow: m.from === "user" ? "none" : "0 1px 4px rgba(20,24,40,0.05)",
                  }}
                >
                  {m.text}
                </div>

                {/* Action buttons */}
                {m.actions && m.actions.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignSelf: "flex-start", maxWidth: "92%" }}>
                    {m.actions.map((a) => (
                      <button
                        key={a.href + a.label}
                        onClick={() => handleAction(a)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "7px 13px",
                          borderRadius: 999,
                          border: "none",
                          background: C.teal,
                          color: "#fff",
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: "pointer",
                          boxShadow: "0 1px 6px rgba(61,128,115,0.25)",
                        }}
                      >
                        {a.label}
                        {a.external ? " ↗" : " →"}
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggestion chips */}
                {m.chips && m.chips.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignSelf: "flex-start", maxWidth: "92%" }}>
                    {m.chips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => respondTo(chip)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 999,
                          border: `1px solid ${C.rule}`,
                          background: C.card,
                          color: C.tealDk,
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            style={{ display: "flex", gap: 8, padding: "10px 12px", borderTop: `1px solid ${C.rule}`, background: C.card, flexShrink: 0 }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about MyVote…"
              aria-label="Ask the MyVote guide a question"
              style={{
                flex: 1,
                minWidth: 0,
                height: 40,
                borderRadius: 999,
                border: `1px solid ${C.rule}`,
                background: C.page,
                color: C.ink900,
                fontSize: 13.5,
                padding: "0 14px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={!input.trim()}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "none",
                background: input.trim() ? C.teal : C.rule,
                color: input.trim() ? "#fff" : C.ink400,
                cursor: input.trim() ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
