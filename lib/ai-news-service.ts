import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface FactualNews {
  title: string
  description: string
  time: string
  trending: boolean
  source: string
  category: "economic" | "political" | "legal" | "scientific" | "international"
}

export async function generateFactualNews(): Promise<FactualNews[]> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a factual news generator that creates objective, unbiased news summaries. 
      
      Guidelines:
      - Focus on verifiable facts, data, and official announcements
      - Avoid opinion, speculation, or political bias
      - Include government data, economic indicators, court decisions, scientific findings
      - Use neutral, professional language
      - Cite official sources when possible
      - Each news item should be factual and informative
      
      Generate exactly 4 factual news items in JSON format with this structure:
      {
        "news": [
          {
            "title": "Factual headline",
            "description": "Objective description with facts and data",
            "time": "X hours ago",
            "trending": boolean,
            "source": "Official source name",
            "category": "economic|political|legal|scientific|international"
          }
        ]
      }`,
      prompt: `Generate 4 current factual news items covering different categories (economic, political, legal, scientific). Focus on:
      - Government data releases and official announcements
      - Economic indicators and statistics
      - Court decisions and legal proceedings
      - Scientific research and findings
      - International agreements and treaties
      
      Make them realistic and current, as if from today's news cycle.`,
    })

    const parsed = JSON.parse(text)
    return parsed.news || []
  } catch (error) {
    console.error("Error generating factual news:", error)
    // Fallback to static content if AI fails
    return [
      {
        title: "Federal Reserve Maintains Interest Rates at 5.25-5.50%",
        description:
          "The Federal Reserve announced no change to current interest rates following their two-day meeting, citing stable economic indicators.",
        time: "2 hours ago",
        trending: true,
        source: "Federal Reserve",
        category: "economic" as const,
      },
      {
        title: "Supreme Court Schedules Three Cases for March Oral Arguments",
        description:
          "The Court will hear cases involving digital privacy rights, environmental regulations, and interstate commerce law.",
        time: "4 hours ago",
        trending: false,
        source: "Supreme Court",
        category: "legal" as const,
      },
      {
        title: "Bureau of Labor Statistics Reports 3.7% Unemployment Rate",
        description:
          "January employment data shows unemployment holding steady with 187,000 new jobs added across various sectors.",
        time: "6 hours ago",
        trending: false,
        source: "Bureau of Labor Statistics",
        category: "economic" as const,
      },
      {
        title: "NASA Announces New Climate Monitoring Satellite Launch",
        description:
          "The satellite will provide enhanced data on atmospheric conditions and climate patterns for scientific research.",
        time: "8 hours ago",
        trending: false,
        source: "NASA",
        category: "scientific" as const,
      },
    ]
  }
}

export async function generateFactualNewsSummary(topic: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a factual news summarizer. Provide objective, unbiased summaries based on verifiable facts and data. Avoid speculation, opinion, or political bias. Focus on what is known and documented.`,
      prompt: `Provide a factual, objective summary about: ${topic}
      
      Include:
      - Key facts and data points
      - Official sources and statements
      - Relevant statistics or numbers
      - Timeline of events if applicable
      
      Keep it concise (2-3 sentences) and purely factual.`,
    })

    return text
  } catch (error) {
    console.error("Error generating summary:", error)
    return "Unable to generate summary at this time."
  }
}
