"use client";

import { useEffect, useRef, useState } from "react";
import { MERCH_LOOKBOOK, MERCH_COLLECTION, MERCH_BRAND } from "@/lib/merch";

/* The full mockup sheet, shown as a lookbook on /store. It hides itself
   entirely until the image file exists at public/merch/lookbook.jpg, so the
   page looks intentional before the asset is dropped in. onError covers a
   failure after hydration; the mount check covers one that fired before the
   handler attached (a broken image already `complete` with 0 natural width). */
export function Lookbook() {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return null;
  return (
    <figure style={{ maxWidth: 940, margin: "34px auto 0", padding: 0 }}>
      <img
        ref={ref}
        src={MERCH_LOOKBOOK}
        alt={`${MERCH_COLLECTION} — Undefined & Undecided 2028 hats, drinkware, apparel and accessories, ${MERCH_BRAND}`}
        onError={() => setFailed(true)}
        style={{ width: "100%", height: "auto", borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)", display: "block" }}
      />
    </figure>
  );
}
