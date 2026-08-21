"use client";

import { useRef, useState, useCallback } from "react";
import { ExternalLink } from "lucide-react";
import { formatNewsTime, type NewsArticle } from "@/lib/news-service";

/* Interactive spectrum "wheel".
 *
 * The sources for a story are laid out left → right by political lean. Dragging
 * (pulling) the wheel scrubs across the spectrum: whichever source the handle
 * lands nearest becomes the FEATURED article shown in the middle. So you can
 * literally pull the wheel from left to right and watch the coverage change
 * from left-leaning outlets to right-leaning ones.
 *
 * Works with mouse, touch, and pen (pointer events) plus keyboard arrows.
 */

export type ScrubSource = NewsArticle & {
  side: "left" | "right";
  leanLabel: string;
};

const C = {
  card: "#FFFFFF", rule: "#E9EBEF", ink900: "#030213", ink700: "#3D435A",
  ink500: "#717182", ink400: "#8B8FA3", left: "#2563EB", right: "#D4183D",
};

export function SpectrumScrubber({ sources }: { sources: ScrubSource[] }) {
  const n = sources.length;
  // Start on the most central source (boundary between left and right coverage).
  const leftCount = sources.filter((s) => s.side === "left").length;
  const startIdx = n <= 1 ? 0 : Math.max(0, Math.min(n - 1, leftCount === 0 ? 0 : leftCount - 1));
  const [idx, setIdx] = useState(startIdx);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el || n <= 1) return;
    const r = el.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    setIdx(Math.round(pct * (n - 1)));
  }, [n]);

  if (n === 0) return null;

  const active = sources[idx];
  const isLeft = active.side === "left";
  const accent = isLeft ? C.left : C.right;
  const pct = n > 1 ? (idx / (n - 1)) * 100 : 50;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* ── Featured (middle) article — updates as you pull the wheel ── */}
      <a
        href={active.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          gap: 12,
          alignItems: "stretch",
          border: `1px solid ${C.rule}`,
          borderRadius: 12,
          borderTop: `3px solid ${accent}`,
          overflow: "hidden",
          textDecoration: "none",
          background: C.card,
          minHeight: 84,
        }}
      >
        {active.urlToImage ? (
          <div style={{ width: 108, flexShrink: 0, overflow: "hidden", background: isLeft ? "#EFF6FF" : "#FFF5F5" }}>
            <img
              src={active.urlToImage}
              alt=""
              loading="lazy"
              decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = "none"; }}
            />
          </div>
        ) : (
          <div style={{ width: 108, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isLeft ? "#EFF6FF" : "#FFF5F5", padding: "0 8px" }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: accent, textAlign: "center", lineHeight: 1.3 }}>{active.source}</span>
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0, padding: "10px 12px 10px 2px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: C.ink900 }}>{active.source}</span>
            <span style={{ fontSize: 9.5, padding: "2px 7px", borderRadius: 999, fontWeight: 700, background: isLeft ? "#EFF6FF" : "#FFF5F5", color: accent }}>{active.leanLabel}</span>
          </div>
          <p style={{ fontSize: 13, color: C.ink700, lineHeight: 1.4, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{active.title}</p>
          <span style={{ fontSize: 10.5, color: C.ink400, display: "inline-flex", alignItems: "center", gap: 4 }}>
            {formatNewsTime(active.publishedAt)} <ExternalLink style={{ width: 11, height: 11 }} /> Read
          </span>
        </div>
      </a>

      {/* ── The wheel — drag to change the middle article ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: C.left, flexShrink: 0 }}>Left</span>
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label="Drag across the political spectrum to change the featured article"
          aria-valuemin={0}
          aria-valuemax={n - 1}
          aria-valuenow={idx}
          aria-valuetext={`${active.source}, ${active.leanLabel}`}
          onPointerDown={(e) => { dragging.current = true; (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); setFromClientX(e.clientX); }}
          onPointerMove={(e) => { if (dragging.current) setFromClientX(e.clientX); }}
          onPointerUp={() => { dragging.current = false; }}
          onPointerCancel={() => { dragging.current = false; }}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") { e.preventDefault(); setIdx((v) => Math.max(0, v - 1)); }
            if (e.key === "ArrowRight") { e.preventDefault(); setIdx((v) => Math.min(n - 1, v + 1)); }
          }}
          style={{
            flex: 1,
            position: "relative",
            height: 26,
            display: "flex",
            alignItems: "center",
            cursor: "grab",
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
        >
          {/* gradient rail */}
          <div style={{ position: "absolute", left: 0, right: 0, height: 6, borderRadius: 999, background: "linear-gradient(to right, #3b82f6, #9ca3af, #ef4444)" }} />
          {/* per-source ticks */}
          {sources.map((s, i) => {
            const tPct = n > 1 ? (i / (n - 1)) * 100 : 50;
            const activeTick = i === idx;
            return (
              <span
                key={i}
                onClick={() => setIdx(i)}
                style={{
                  position: "absolute",
                  left: `${tPct}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: activeTick ? 0 : 6,
                  height: activeTick ? 0 : 6,
                  borderRadius: "50%",
                  background: s.side === "left" ? "#1D4ED8" : "#991B1B",
                  opacity: activeTick ? 0 : 0.65,
                }}
              />
            );
          })}
          {/* draggable handle */}
          <div
            style={{
              position: "absolute",
              left: `${pct}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: accent,
              border: "3px solid #fff",
              boxShadow: "0 1px 5px rgba(0,0,0,0.35)",
              transition: dragging.current ? "none" : "left 0.15s ease, background 0.15s ease",
              pointerEvents: "none",
            }}
          />
        </div>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: C.right, flexShrink: 0 }}>Right</span>
      </div>

      <p style={{ fontSize: 10.5, color: C.ink400, textAlign: "center", margin: 0 }}>
        Pull the wheel to see how each side covers it · {idx + 1} of {n}
      </p>
    </div>
  );
}
