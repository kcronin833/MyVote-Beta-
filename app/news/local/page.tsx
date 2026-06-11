"use client";

import React, { useState, useEffect } from "react";
import { MapPin, RefreshCw, ExternalLink, MessageCircle } from "lucide-react";
import { NewsNavigation } from "@/components/news-nav";
import { CommentSystem } from "@/components/comment-system";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatNewsTime } from "@/lib/news-service";
import { useAuth } from "@/components/auth-context";
import { NewsFeedAd } from "@/components/ads/ad-unit";
import { C } from "@/lib/design-tokens";

const GEORGIA_CITIES = [
  "Atlanta",
  "Savannah",
  "Augusta",
  "Columbus",
  "Macon",
  "Athens",
  "Sandy Springs",
  "Roswell",
  "Albany",
  "Johns Creek",
  "Warner Robins",
  "Alpharetta",
  "Marietta",
  "Valdosta",
  "Smyrna",
  "Brookhaven",
  "Dunwoody",
  "Peachtree City",
  "Gainesville",
  "Newnan",
  "Milton",
  "Decatur",
  "East Point",
  "Kennesaw",
  "Statesboro",
  "Dalton",
  "Lawrenceville",
  "Woodstock",
  "Canton",
  "Carrollton",
  "Rome",
  "Tucker",
  "Stone Mountain",
  "College Park",
  "Hinesville",
  "Douglasville",
  "Griffin",
  "Pooler",
  "Duluth",
  "LaGrange",
];

interface Article {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage: string | null;
}

const LOCAL_SOURCES = [
  "AJC",
  "Atlanta News First",
  "Axios Atlanta",
  "11Alive",
  "WSB-TV",
  "The Atlanta Voice",
  "Decaturish",
  "Saporta Report",
];

/* ── Shared card chrome ─────────────────────────────────────────── */
const card: React.CSSProperties = {
  background: C.card,
  border: `1px solid ${C.rule}`,
  borderRadius: 12,
  boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
};

/* ── Article card ────────────────────────────────────────────────── */
function ArticleCard({ article }: { article: Article }) {
  return (
    <div style={{ ...card, padding: 14 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {article.urlToImage && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ flexShrink: 0, display: "block" }}
          >
            <img
              src={article.urlToImage}
              alt=""
              loading="lazy"
              decoding="async"
              crossOrigin="anonymous"
              style={{
                width: 88,
                height: 60,
                borderRadius: 6,
                objectFit: "cover",
                display: "block",
              }}
              onError={(e) => {
                (e.currentTarget.parentElement as HTMLElement).style.display =
                  "none";
              }}
            />
          </a>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Meta row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 5,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: C.ink700,
                background: C.shade,
                border: `1px solid ${C.rule}`,
                borderRadius: 999,
                padding: "1px 7px",
                whiteSpace: "nowrap",
              }}
            >
              {article.source}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: C.teal,
                background: C.tealSoft,
                border: "1px solid #C0DAD4",
                borderRadius: 999,
                padding: "1px 7px",
                whiteSpace: "nowrap",
              }}
            >
              Local
            </span>
            <span
              style={{
                fontSize: 11,
                color: C.ink400,
                marginLeft: "auto",
                whiteSpace: "nowrap",
              }}
            >
              {formatNewsTime(article.publishedAt)}
            </span>
          </div>

          {/* Headline */}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              fontSize: 14.5,
              fontWeight: 700,
              color: C.ink900,
              lineHeight: 1.35,
              textDecoration: "none",
              marginBottom: article.description ? 5 : 10,
            }}
          >
            {article.title}
          </a>

          {/* Description — 2-line clamp via Tailwind utility */}
          {article.description && (
            <p
              className="line-clamp-2"
              style={{
                fontSize: 12.5,
                color: C.ink700,
                lineHeight: 1.55,
                margin: "0 0 10px",
              }}
            >
              {article.description}
            </p>
          )}

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                fontWeight: 600,
                color: C.teal,
                textDecoration: "none",
                padding: "5px 12px",
                borderRadius: 999,
                background: C.tealSoft,
                border: "1px solid #C0DAD4",
                transition: "all 0.15s ease",
              }}
            >
              <ExternalLink size={11} />
              Read Article
            </a>

            <Dialog>
              <DialogTrigger asChild>
                <button
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.ink500,
                    background: "transparent",
                    border: `1.5px solid ${C.rule}`,
                    borderRadius: 999,
                    padding: "5px 12px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <MessageCircle size={11} />
                  Discuss
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-left">
                    {article.title}
                  </DialogTitle>
                </DialogHeader>
                <CommentSystem
                  articleUrl={article.url}
                  articleTitle={article.title}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function LocalNewsPage() {
  const { profile } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("Atlanta");

  // Seed city from the user's saved profile location
  useEffect(() => {
    if (profile?.location) setLocation(profile.location);
  }, [profile?.location]);

  useEffect(() => {
    load(location);
  }, [location]);

  async function load(loc: string) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/news?perspective=local&location=${encodeURIComponent(loc)}`
      );
      const data = await res.json();
      setArticles(data.articles || []);
    } catch {
      setArticles([]);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-paper-100">
      <div className="container mx-auto px-4 pt-4 pb-8">
        <NewsNavigation />

        {/* Section label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: C.shade,
              border: `1px solid ${C.rule}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <MapPin size={14} color={C.ink500} />
          </div>
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.ink400,
                margin: 0,
                letterSpacing: 0.3,
                textTransform: "uppercase",
              }}
            >
              Local News · Georgia
            </p>
            <p style={{ fontSize: 13, color: C.ink700, margin: 0 }}>
              {location}, Georgia
            </p>
          </div>
        </div>

        {/* City picker */}
        <div
          style={{
            ...card,
            padding: "10px 14px",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <MapPin size={13} color={C.ink400} style={{ flexShrink: 0 }} />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label="Select Georgia city"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 13.5,
              fontWeight: 600,
              color: C.ink900,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {GEORGIA_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}, Georgia
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => load(location)}
            disabled={loading}
            aria-label="Refresh news"
            style={{
              background: "transparent",
              border: "none",
              padding: 4,
              cursor: loading ? "default" : "pointer",
              color: C.ink400,
              display: "flex",
              opacity: loading ? 0.5 : 1,
              flexShrink: 0,
            }}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Sources strip */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 5,
            marginBottom: 16,
          }}
        >
          <span
            style={{ fontSize: 11, color: C.ink400, fontWeight: 500 }}
          >
            Sources:
          </span>
          {LOCAL_SOURCES.map((name) => (
            <span
              key={name}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: C.ink700,
                background: C.shade,
                border: `1px solid ${C.rule}`,
                borderRadius: 999,
                padding: "2px 8px",
              }}
            >
              {name}
            </span>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          /* Skeleton */
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  ...card,
                  padding: 14,
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 88,
                    height: 60,
                    borderRadius: 6,
                    background: C.shade,
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 7,
                  }}
                >
                  <div
                    style={{
                      height: 13,
                      background: C.shade,
                      borderRadius: 4,
                      width: "80%",
                    }}
                  />
                  <div
                    style={{
                      height: 12,
                      background: C.shade,
                      borderRadius: 4,
                    }}
                  />
                  <div
                    style={{
                      height: 12,
                      background: C.shade,
                      borderRadius: 4,
                      width: "55%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          /* Empty state */
          <div style={{ ...card, padding: "40px 20px", textAlign: "center" }}>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: C.ink700,
                margin: "0 0 4px",
              }}
            >
              No local articles found
            </p>
            <p
              style={{
                fontSize: 13,
                color: C.ink500,
                margin: "0 0 14px",
                lineHeight: 1.55,
              }}
            >
              Try a different city or check back in a few minutes — local news
              refreshes throughout the day.
            </p>
            <button
              onClick={() => load(location)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 8,
                background: C.shade,
                border: `1px solid ${C.rule}`,
                fontSize: 13,
                fontWeight: 600,
                color: C.ink700,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        ) : (
          /* Article list */
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {articles.map((article, i) => (
              <React.Fragment key={article.url || i}>
                {i > 0 && i % 4 === 0 && <NewsFeedAd />}
                <ArticleCard article={article} />
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
