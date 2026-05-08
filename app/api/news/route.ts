import { NextRequest, NextResponse } from "next/server";
import { getLeftNews, getRightNews, getFactualNews, getLocalNews } from "@/lib/news-service";

export const revalidate = 1800

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const perspective = searchParams.get("perspective") || "facts";
  const location = searchParams.get("location") || "";

  try {
    let articles;
    switch (perspective) {
      case "left":
        articles = await getLeftNews();
        break;
      case "right":
        articles = await getRightNews();
        break;
      case "local":
        articles = await getLocalNews(location);
        break;
      default:
        articles = await getFactualNews();
    }

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("News API error:", error);
    return NextResponse.json({ articles: [], error: "Failed to fetch news" }, { status: 500 });
  }
}
