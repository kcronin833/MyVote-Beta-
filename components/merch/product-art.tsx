/* Vector product art for the store tiles — recreated from the CITIZN.APP
   mockup sheet (hats, drinkware, apparel, accessories) so every card shows a
   real, on-brand product image without needing photo files. Each product is
   drawn in a representative color with the "— 2028 —" embroidered wordmark.
   Swap for real photos later by replacing this in the store tile. */

type Shape = "cap" | "mug" | "tumbler" | "bottle" | "tee" | "hoodie" | "crew" | "tote" | "sticker";

const PALETTE: Record<string, { hex: string; light: boolean }> = {
  navy:     { hex: "#26324F", light: false },
  black:    { hex: "#17181C", light: false },
  charcoal: { hex: "#3B4046", light: false },
  olive:    { hex: "#46512A", light: false },
  khaki:    { hex: "#CBBB90", light: true },
  white:    { hex: "#E9E9EC", light: true },
  red:      { hex: "#B32A34", light: false },
  denim:    { hex: "#3F5B78", light: false },
  gray:     { hex: "#A2A7AD", light: true },
};

const BY_SLUG: Record<string, { shape: Shape; color: keyof typeof PALETTE }> = {
  "classic-cap":      { shape: "cap", color: "navy" },
  "trucker-hat":      { shape: "cap", color: "navy" },
  "camo-cap":         { shape: "cap", color: "olive" },
  "washed-denim-cap": { shape: "cap", color: "denim" },
  "corduroy-cap":     { shape: "cap", color: "navy" },
  "rope-hat":         { shape: "cap", color: "white" },
  "dad-hat":          { shape: "cap", color: "black" },
  "mug":              { shape: "mug", color: "navy" },
  "tumbler":          { shape: "tumbler", color: "navy" },
  "water-bottle":     { shape: "bottle", color: "white" },
  "tee":              { shape: "tee", color: "navy" },
  "hoodie":           { shape: "hoodie", color: "navy" },
  "crewneck":         { shape: "crew", color: "gray" },
  "tote":             { shape: "tote", color: "navy" },
  "sticker-pack":     { shape: "sticker", color: "navy" },
};

const SHADOW = "rgba(0,0,0,0.18)";

function Wordmark({ x, y, wm, scale = 1 }: { x: number; y: number; wm: string; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <text textAnchor="middle" fontFamily="var(--font-serif)" fontStyle="italic" fontWeight={700} fontSize={15} fill={wm}>
        2028
      </text>
      <line x1={-15} x2={-6} y1={6} y2={6} stroke={wm} strokeWidth={1.2} opacity={0.85} />
      <line x1={6} x2={15} y1={6} y2={6} stroke={wm} strokeWidth={1.2} opacity={0.85} />
    </g>
  );
}

function Art({ shape, c, wm }: { shape: Shape; c: string; wm: string }) {
  switch (shape) {
    case "cap":
      return (
        <>
          <path d="M58 99 Q38 103 43 116 Q112 108 152 108 Q178 108 182 99 Q120 91 58 99 Z" fill={c} />
          <path d="M58 99 Q58 44 120 44 Q182 44 182 99 Q120 82 58 99 Z" fill={c} />
          <circle cx={120} cy={46} r={4.5} fill={c} />
          <path d="M58 99 Q38 103 43 116 Q112 108 152 108 Q178 108 182 99 Q120 95 58 99 Z" fill={SHADOW} />
          <path d="M58 99 Q120 84 182 99 Q120 90 58 99 Z" fill="rgba(0,0,0,0.10)" />
          <Wordmark x={120} y={76} wm={wm} />
        </>
      );
    case "mug":
      return (
        <>
          <path d="M150 60 h13 a18 18 0 0 1 0 34 h-13" fill="none" stroke={c} strokeWidth={11} />
          <rect x={70} y={48} width={82} height={66} rx={11} fill={c} />
          <rect x={70} y={48} width={20} height={66} rx={10} fill="rgba(255,255,255,0.08)" />
          <Wordmark x={110} y={86} wm={wm} />
        </>
      );
    case "tumbler":
      return (
        <>
          <path d="M84 52 L156 52 L148 120 L92 120 Z" fill={c} />
          <rect x={80} y={44} width={80} height={10} rx={5} fill={c} />
          <rect x={80} y={44} width={80} height={10} rx={5} fill={SHADOW} />
          <Wordmark x={120} y={88} wm={wm} />
        </>
      );
    case "bottle":
      return (
        <>
          <rect x={97} y={60} width={46} height={68} rx={13} fill={c} />
          <rect x={106} y={40} width={28} height={24} rx={4} fill={c} />
          <rect x={106} y={40} width={28} height={24} rx={4} fill={SHADOW} />
          <Wordmark x={120} y={98} wm={wm} scale={0.8} />
        </>
      );
    case "tee":
      return (
        <>
          <path d="M92 50 L74 58 L56 78 L72 92 L84 84 L84 128 L156 128 L156 84 L168 92 L184 78 L166 58 L148 50 C140 64 100 64 92 50 Z" fill={c} />
          <path d="M92 50 C100 64 140 64 148 50 L142 52 C134 62 106 62 98 52 Z" fill={SHADOW} />
          <Wordmark x={120} y={94} wm={wm} />
        </>
      );
    case "hoodie":
      return (
        <>
          <path d="M92 52 L74 60 L56 80 L72 94 L84 86 L84 130 L156 130 L156 86 L168 94 L184 80 L166 60 L148 52 Z" fill={c} />
          <path d="M92 52 Q120 70 148 52 Q150 40 120 39 Q90 40 92 52 Z" fill={c} />
          <path d="M92 52 Q120 70 148 52 Q150 44 120 43 Q90 44 92 52 Z" fill={SHADOW} />
          <path d="M100 104 h40 v12 q-20 9 -40 0 Z" fill={SHADOW} />
          <line x1={112} y1={58} x2={110} y2={78} stroke={wm} strokeWidth={2} opacity={0.7} />
          <line x1={128} y1={58} x2={130} y2={78} stroke={wm} strokeWidth={2} opacity={0.7} />
          <Wordmark x={120} y={98} wm={wm} scale={0.85} />
        </>
      );
    case "crew":
      return (
        <>
          <path d="M92 50 L74 58 L56 78 L72 92 L84 84 L84 128 L156 128 L156 84 L168 92 L184 78 L166 58 L148 50 C140 62 100 62 92 50 Z" fill={c} />
          <path d="M96 50 Q120 60 144 50 Q140 56 120 56 Q100 56 96 50 Z" fill={SHADOW} />
          <Wordmark x={120} y={94} wm={wm} />
        </>
      );
    case "tote":
      return (
        <>
          <path d="M96 60 C96 40 144 40 144 60" fill="none" stroke={c} strokeWidth={8} />
          <rect x={76} y={58} width={88} height={74} rx={6} fill={c} />
          <Wordmark x={120} y={100} wm={wm} />
        </>
      );
    case "sticker":
      return (
        <>
          <circle cx={120} cy={82} r={46} fill={c} />
          <circle cx={120} cy={82} r={46} fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={2} />
          <Wordmark x={120} y={88} wm={wm} />
        </>
      );
  }
}

export function ProductArt({ slug }: { slug: string }) {
  const spec = BY_SLUG[slug] ?? { shape: "sticker" as Shape, color: "navy" as const };
  const { hex, light } = PALETTE[spec.color];
  const wm = light ? "#26324F" : "#F3F3F5";
  return (
    <svg viewBox="0 0 240 150" width="100%" height="100%" role="img" aria-label={`${slug} product art`} style={{ display: "block" }}>
      <Art shape={spec.shape} c={hex} wm={wm} />
    </svg>
  );
}
