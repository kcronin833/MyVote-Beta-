/* Coming-soon merch catalog for the CITIZN.APP 2028 collection. No storefront
   or payments yet — each product just captures interest (see merch_interest).
   The demand signals worth measuring before printing: which WORDMARK people
   want (Undefined vs Undecided), and the color/size variant. */

export const MERCH_COLLECTION = "The 2028 Collection";
export const MERCH_BRAND = "CITIZN.APP";
export const MERCH_TAGLINE = "Less noise. More options.";
export const MERCH_SUBHEAD =
  "Informed citizens make a brighter tomorrow. Two wordmarks — Undefined and Undecided 2028, tagged CITIZN.APP — are on the way. Tell us what you'd wear, your color or size, and which wordmark, and we'll make it first.";

/* The full mockup sheet, shown as a lookbook at the top of /store.
   Drop the file at public/merch/lookbook.jpg; the hero hides itself until then. */
export const MERCH_LOOKBOOK = "/merch/lookbook.jpg";

/* Every product comes in two wordmarks — this is a primary demand signal. */
export const MERCH_WORDMARKS = ["Undefined 2028", "Undecided 2028"] as const;
export type MerchWordmark = (typeof MERCH_WORDMARKS)[number];

export type MerchCategory = "Hats" | "Drinkware" | "Apparel" | "Accessories";

export interface MerchProduct {
  slug: string;
  name: string;
  category: MerchCategory;
  blurb: string;
  emoji: string;
  variantLabel?: string;
  variants?: string[];
  /** Real product mockup sheets, one per wordmark. When present, the card
      shows these instead of the generated vector art. */
  sheets?: { wordmark: string; src: string }[];
  /** Display price, e.g. "$30". Coming-soon preview only — nothing sells yet. */
  price?: string;
  /** Feature this product at the top of the store with its full sheet(s). */
  featured?: boolean;
}

export const MERCH_PRODUCTS: MerchProduct[] = [
  // ── Hats ──
  { slug: "classic-cap", name: "Classic Cap", category: "Hats", emoji: "🧢",
    blurb: "A clean, timeless look for a more open tomorrow — premium cotton twill, classic unstructured fit, adjustable strap, and an embroidered front.",
    variantLabel: "Color", variants: ["Navy", "Black", "Charcoal", "Olive", "Khaki", "White", "Red"],
    sheets: [{ wordmark: "Undefined 2028", src: "/merch/classic-cap-sheet.webp" }],
    price: "$30", featured: true },
  { slug: "trucker-hat", name: "Trucker Hat", category: "Hats", emoji: "🧢",
    blurb: "Navy front, cream mesh back — classic trucker breathability." },
  { slug: "camo-cap", name: "Camo Cap", category: "Hats", emoji: "🧢",
    blurb: "Outdoor camo for the range, the trail, or the tailgate." },
  { slug: "washed-denim-cap", name: "Washed Denim Cap", category: "Hats", emoji: "🧢",
    blurb: "Vintage washed denim with a faded, broken-in look." },
  { slug: "corduroy-cap", name: "Corduroy Cap", category: "Hats", emoji: "🧢",
    blurb: "Premium corduroy for a heavier, textured look." },
  { slug: "rope-hat", name: "Rope Hat", category: "Hats", emoji: "🧢",
    blurb: "A clean, elevated look — modern rope detail, breathable premium performance fabric, and an adjustable snapback.",
    variantLabel: "Color", variants: ["Navy", "Black", "Charcoal", "Olive", "Khaki", "White", "Red"],
    sheets: [
      { wordmark: "Undefined 2028", src: "/merch/rope-hat-sheet.webp" },
      { wordmark: "Undecided 2028", src: "/merch/rope-hat-undecided-sheet.webp" },
    ],
    price: "$30", featured: true },
  { slug: "dad-hat", name: "Dad Hat (Low Profile)", category: "Hats", emoji: "🧢",
    blurb: "Soft, unstructured, broken-in-from-day-one low-profile cap.",
    variantLabel: "Color", variants: ["Navy", "Black", "White"] },

  // ── Drinkware ──
  { slug: "mug", name: "Ceramic Mug", category: "Drinkware", emoji: "☕",
    blurb: "11oz ceramic mug for your morning news read.",
    variantLabel: "Color", variants: ["Navy", "White", "Black", "Red", "Gray"] },
  { slug: "tumbler", name: "Tumbler (20oz)", category: "Drinkware", emoji: "🥤",
    blurb: "Insulated stainless 20oz — keeps it hot or cold all day." },
  { slug: "water-bottle", name: "Water Bottle (32oz)", category: "Drinkware", emoji: "💧",
    blurb: "32oz stainless bottle for the long haul." },

  // ── Apparel ──
  { slug: "tee", name: "T-Shirt", category: "Apparel", emoji: "👕",
    blurb: "Soft cotton tee (Navy, White, or Gray) with the script logo.",
    variantLabel: "Size", variants: ["S", "M", "L", "XL", "XXL"] },
  { slug: "hoodie", name: "Hoodie", category: "Apparel", emoji: "🧥",
    blurb: "Midweight navy pullover hoodie, embroidered front.",
    variantLabel: "Size", variants: ["S", "M", "L", "XL", "XXL"] },
  { slug: "crewneck", name: "Crewneck Sweatshirt", category: "Apparel", emoji: "🧥",
    blurb: "Classic gray crewneck for cooler days.",
    variantLabel: "Size", variants: ["S", "M", "L", "XL", "XXL"] },

  // ── Accessories ──
  { slug: "tote", name: "Tote Bag", category: "Accessories", emoji: "🛍️",
    blurb: "Heavy navy canvas tote — carry the message." },
  { slug: "sticker-pack", name: "Sticker Pack", category: "Accessories", emoji: "🏷️",
    blurb: "Weatherproof die-cut sticker set for the laptop, bottle, or bumper." },
];

export const MERCH_CATEGORIES: MerchCategory[] = ["Hats", "Drinkware", "Apparel", "Accessories"];

export function getMerchProduct(slug: string): MerchProduct | null {
  return MERCH_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function isMerchWordmark(value: string): value is MerchWordmark {
  return (MERCH_WORDMARKS as readonly string[]).includes(value);
}
