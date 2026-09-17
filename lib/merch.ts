/* Coming-soon merch catalog for the "Undecided 2028" collection. No storefront
   or payments yet — each product just captures interest (see merch_interest).
   Variants (color/size) are the demand signal worth measuring before printing. */

export const MERCH_COLLECTION = "Undecided 2028";
export const MERCH_TAGLINE = "Less noise. More options.";
export const MERCH_SUBHEAD =
  "Informed citizens make a brighter tomorrow. The Undecided 2028 collection is on the way — tell us what you'd wear and we'll make it first.";

export type MerchCategory = "Hats" | "Drinkware" | "Apparel" | "Accessories";

export interface MerchProduct {
  slug: string;
  name: string;
  category: MerchCategory;
  blurb: string;
  emoji: string;
  variantLabel?: string;
  variants?: string[];
}

export const MERCH_PRODUCTS: MerchProduct[] = [
  // ── Hats ──
  { slug: "classic-cap", name: "Classic Cap", category: "Hats", emoji: "🧢",
    blurb: "The staple — structured cotton with the embroidered Undecided 2028 script.",
    variantLabel: "Color", variants: ["Navy", "Black", "Charcoal", "Olive", "Khaki", "White", "Red"] },
  { slug: "dad-hat", name: "Dad Hat (Low Profile)", category: "Hats", emoji: "🧢",
    blurb: "Soft, unstructured, broken-in-from-day-one low-profile cap.",
    variantLabel: "Color", variants: ["Navy", "Black", "White"] },
  { slug: "trucker-hat", name: "Trucker Hat", category: "Hats", emoji: "🧢",
    blurb: "Navy front, cream mesh back — classic trucker breathability." },
  { slug: "rope-hat", name: "Rope Hat", category: "Hats", emoji: "🧢",
    blurb: "White crown, navy brim, rope detail across the front." },
  { slug: "corduroy-cap", name: "Corduroy Cap", category: "Hats", emoji: "🧢",
    blurb: "Premium corduroy for a heavier, textured look." },
  { slug: "camo-cap", name: "Camo Cap", category: "Hats", emoji: "🧢",
    blurb: "Outdoor camo for the range, the trail, or the tailgate." },

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
