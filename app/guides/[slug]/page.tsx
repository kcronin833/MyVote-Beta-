import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, getGuide } from "@/lib/guides-data";
import { ReminderSignup } from "@/components/reminder-signup";
import { QuizPromo } from "@/components/quiz-promo";

const C = {
  card: "#FDFCF9",
  rule: "#E4E0D3",
  ruleSoft: "#EDEAE0",
  ink900: "#1A2138",
  ink700: "#3D435A",
  ink500: "#6B7088",
  ink400: "#8B8FA3",
  teal: "#3D8073",
  tealDk: "#2F6358",
  tealSoft: "#E6F0ED",
};

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.metaTitle,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.sections.map((s) => ({
      "@type": "Question",
      name: s.heading,
      acceptedAnswer: { "@type": "Answer", text: s.body },
    })),
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 16px 56px" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 12.5, marginBottom: 14 }}>
        <Link href="/" style={{ color: C.teal, fontWeight: 600, textDecoration: "none" }}>
          Home
        </Link>
        <span style={{ color: C.ink400 }}> · Voter Guides</span>
      </div>

      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.6rem, 4vw, 2.1rem)",
          fontWeight: 600,
          color: C.ink900,
          lineHeight: 1.2,
          margin: "0 0 8px",
          letterSpacing: -0.4,
        }}
      >
        {guide.title}
      </h1>
      <p style={{ fontSize: 12.5, color: C.ink400, margin: "0 0 22px" }}>
        Non-partisan · Updated {guide.updated}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {guide.sections.map((s) => (
          <div
            key={s.heading}
            style={{
              background: C.card,
              border: `1px solid ${C.rule}`,
              borderRadius: 12,
              boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
              padding: "18px 20px",
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 700, color: C.ink900, margin: "0 0 8px" }}>
              {s.heading}
            </h2>
            <p style={{ fontSize: 14, color: C.ink700, lineHeight: 1.7, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>

      {/* Authority pointer */}
      <p style={{ fontSize: 12.5, color: C.ink500, lineHeight: 1.6, margin: "18px 2px 22px" }}>
        Always confirm details for your situation with the{" "}
        <a
          href="https://mvp.sos.ga.gov"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: C.teal, fontWeight: 600 }}
        >
          Georgia Secretary of State&rsquo;s My Voter Page ↗
        </a>{" "}
        or your county election office.
      </p>

      {/* Reminder capture — guide readers are high-intent voters */}
      <div style={{ marginBottom: 22 }}>
        <ReminderSignup source={`guide-${guide.slug}`} />
      </div>

      {/* Quiz funnel */}
      <div style={{ marginBottom: 22 }}>
        <QuizPromo source={`guide-${guide.slug}`} />
      </div>

      {/* Related */}
      <div
        style={{
          background: C.tealSoft,
          border: "1px solid #C0DAD4",
          borderRadius: 12,
          padding: "16px 18px",
        }}
      >
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: C.tealDk, margin: "0 0 10px" }}>
          Keep going
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {guide.related.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              style={{ fontSize: 13.5, fontWeight: 700, color: C.tealDk, textDecoration: "none" }}
            >
              {r.label} →
            </Link>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  );
}
