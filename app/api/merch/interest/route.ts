import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMerchProduct, isMerchWordmark } from "@/lib/merch";

/* POST /api/merch/interest — register interest in a coming-soon product.
   Insert-only under RLS; duplicates (same email+product+variant) are treated
   as success so we never leak whether someone already signed up. */
export async function POST(request: Request) {
  let body: { email?: string; productSlug?: string; variant?: string; wordmark?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const productSlug = (body.productSlug || "").trim();
  const variant = (body.variant || "").trim() || null;
  const wordmark = (body.wordmark || "").trim() || null;

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  const product = getMerchProduct(productSlug);
  if (!product) {
    return NextResponse.json({ error: "Unknown product." }, { status: 400 });
  }
  // Only accept a variant the product actually offers.
  const cleanVariant = variant && product.variants?.includes(variant) ? variant : null;
  // Only accept a known wordmark (Undefined 2028 / Undecided 2028).
  const cleanWordmark = wordmark && isMerchWordmark(wordmark) ? wordmark : null;

  const supabase = await createClient();
  const { error } = await supabase.from("merch_interest").insert({
    product_slug: product.slug,
    product_name: product.name,
    variant: cleanVariant,
    wordmark: cleanWordmark,
    email,
    source: "store",
  });

  // 23505 = unique violation → already registered → still a success
  if (error && !error.message.includes("duplicate") && error.code !== "23505") {
    return NextResponse.json({ error: "Could not save right now. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
