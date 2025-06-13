// Mock AI service for preview environment
export interface FactualNews {
  title: string
  description: string
  time: string
  trending: boolean
  source: string
  category: "economic" | "political" | "legal" | "scientific" | "international"
}

const factualNewsPool = [
  // Economic News
  {
    title: "Federal Reserve Maintains Interest Rates at 5.25-5.50%",
    description:
      "The Federal Reserve announced no change to current interest rates following their two-day meeting, citing stable economic indicators and controlled inflation metrics.",
    time: "2 hours ago",
    trending: true,
    source: "Federal Reserve",
    category: "economic" as const,
  },
  {
    title: "Bureau of Labor Statistics Reports 3.7% Unemployment Rate",
    description:
      "January employment data shows unemployment holding steady at 3.7% with 187,000 new jobs added across various sectors including healthcare and technology.",
    time: "4 hours ago",
    trending: false,
    source: "Bureau of Labor Statistics",
    category: "economic" as const,
  },
  {
    title: "Treasury Department Releases Q4 GDP Growth Data",
    description:
      "The U.S. economy grew at an annualized rate of 2.1% in the fourth quarter, according to preliminary data from the Treasury Department.",
    time: "6 hours ago",
    trending: false,
    source: "Treasury Department",
    category: "economic" as const,
  },
  {
    title: "Consumer Price Index Shows 0.2% Monthly Increase",
    description:
      "The Consumer Price Index rose 0.2% in January, with core inflation excluding food and energy remaining at 3.1% annually.",
    time: "8 hours ago",
    trending: false,
    source: "Bureau of Labor Statistics",
    category: "economic" as const,
  },

  // Political News
  {
    title: "Congressional Budget Office Releases 2024 Economic Projections",
    description:
      "CBO projects GDP growth of 2.1% for 2024 with unemployment rate expected to remain between 3.6% and 3.9% throughout the year.",
    time: "3 hours ago",
    trending: false,
    source: "Congressional Budget Office",
    category: "political" as const,
  },
  {
    title: "Senate Committee Schedules Infrastructure Oversight Hearings",
    description:
      "The Senate Commerce Committee announced three hearings in March to review implementation of the Infrastructure Investment and Jobs Act.",
    time: "5 hours ago",
    trending: false,
    source: "U.S. Senate",
    category: "political" as const,
  },
  {
    title: "House Passes Bipartisan Veterans Healthcare Expansion Bill",
    description:
      "The House voted 387-42 to expand mental health services for veterans, with the bill now moving to the Senate for consideration.",
    time: "1 day ago",
    trending: false,
    source: "U.S. House of Representatives",
    category: "political" as const,
  },

  // Legal News
  {
    title: "Supreme Court Schedules Oral Arguments for Three Cases in March",
    description:
      "The Court will hear cases involving digital privacy rights, environmental regulations, and interstate commerce law during the March session.",
    time: "5 hours ago",
    trending: false,
    source: "Supreme Court",
    category: "legal" as const,
  },
  {
    title: "Federal Appeals Court Rules on Telecommunications Privacy Case",
    description:
      "The 9th Circuit Court of Appeals upheld lower court ruling requiring warrants for accessing location data from telecommunications providers.",
    time: "1 day ago",
    trending: false,
    source: "9th Circuit Court of Appeals",
    category: "legal" as const,
  },
  {
    title: "Department of Justice Announces New Cybersecurity Guidelines",
    description:
      "DOJ released updated guidelines for federal agencies on reporting and responding to cybersecurity incidents within 24 hours.",
    time: "2 days ago",
    trending: false,
    source: "Department of Justice",
    category: "legal" as const,
  },

  // Scientific News
  {
    title: "NASA Announces Successful Mars Sample Collection Mission",
    description:
      "The Perseverance rover has successfully collected and sealed 24 rock samples for future return to Earth, exceeding mission objectives.",
    time: "7 hours ago",
    trending: true,
    source: "NASA",
    category: "scientific" as const,
  },
  {
    title: "CDC Reports Seasonal Flu Activity Remains Moderate Nationwide",
    description:
      "Weekly surveillance data shows influenza activity at moderate levels with H1N1 and H3N2 strains predominating across most regions.",
    time: "1 day ago",
    trending: false,
    source: "Centers for Disease Control",
    category: "scientific" as const,
  },
  {
    title: "NOAA Releases Climate Data Showing Record Ocean Temperatures",
    description:
      "National Oceanic and Atmospheric Administration data confirms 2023 ocean temperatures reached highest levels since record-keeping began in 1880.",
    time: "2 days ago",
    trending: false,
    source: "NOAA",
    category: "scientific" as const,
  },
  {
    title: "NIH Announces Breakthrough in Alzheimer's Research Funding",
    description:
      "National Institutes of Health allocated $3.7 billion for Alzheimer's disease research in fiscal year 2024, focusing on early detection methods.",
    time: "3 days ago",
    trending: false,
    source: "National Institutes of Health",
    category: "scientific" as const,
  },

  // International News
  {
    title: "World Trade Organization Reports Global Trade Volume Increase",
    description:
      "WTO data shows global merchandise trade volume increased 2.3% in Q4 2023, with services trade growing 4.1% year-over-year.",
    time: "6 hours ago",
    trending: false,
    source: "World Trade Organization",
    category: "international" as const,
  },
  {
    title: "International Monetary Fund Updates Global Economic Outlook",
    description:
      "IMF revised global growth projections to 3.1% for 2024, citing resilient consumer spending and stabilizing inflation rates.",
    time: "1 day ago",
    trending: false,
    source: "International Monetary Fund",
    category: "international" as const,
  },
  {
    title: "United Nations Security Council Schedules Climate Security Session",
    description:
      "The UN Security Council will convene a special session on climate-related security risks in small island developing states.",
    time: "2 days ago",
    trending: false,
    source: "United Nations",
    category: "international" as const,
  },
]

export async function generateFactualNews(): Promise<FactualNews[]> {
  // Simulate AI generation delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Randomly select 4 items from different categories
  const categories = ["economic", "political", "legal", "scientific", "international"]
  const selectedNews: FactualNews[] = []

  // Try to get one from each category, then fill remaining slots
  const shuffledCategories = [...categories].sort(() => Math.random() - 0.5)

  for (const category of shuffledCategories.slice(0, 4)) {
    const categoryNews = factualNewsPool.filter((news) => news.category === category)
    if (categoryNews.length > 0) {
      const randomNews = categoryNews[Math.floor(Math.random() * categoryNews.length)]
      selectedNews.push({
        ...randomNews,
        // Randomize timing to make it feel fresh
        time: getRandomTime(),
        trending: Math.random() < 0.25, // 25% chance of being trending
      })
    }
  }

  // If we need more items, fill from remaining pool
  while (selectedNews.length < 4) {
    const remainingNews = factualNewsPool.filter(
      (news) => !selectedNews.some((selected) => selected.title === news.title),
    )
    if (remainingNews.length > 0) {
      const randomNews = remainingNews[Math.floor(Math.random() * remainingNews.length)]
      selectedNews.push({
        ...randomNews,
        time: getRandomTime(),
        trending: Math.random() < 0.25,
      })
    } else {
      break
    }
  }

  return selectedNews.slice(0, 4)
}

function getRandomTime(): string {
  const times = [
    "1 hour ago",
    "2 hours ago",
    "3 hours ago",
    "4 hours ago",
    "5 hours ago",
    "6 hours ago",
    "8 hours ago",
    "12 hours ago",
    "1 day ago",
    "2 days ago",
  ]
  return times[Math.floor(Math.random() * times.length)]
}

export async function generateFactualNewsSummary(topic: string): Promise<string> {
  // Simulate AI generation delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const summaries: Record<string, string> = {
    economy:
      "Current economic indicators show stable growth with unemployment at 3.7%, inflation moderating to 3.1% annually, and GDP expanding at 2.1% in Q4 2023.",
    politics:
      "Congressional activity focuses on bipartisan infrastructure oversight and veterans' healthcare expansion, with budget projections indicating continued economic stability.",
    legal:
      "Recent court decisions emphasize digital privacy protections and cybersecurity requirements, with the Supreme Court addressing key constitutional questions in upcoming sessions.",
    science:
      "Scientific developments include successful Mars sample collection, climate monitoring advances, and increased federal funding for Alzheimer's research totaling $3.7 billion.",
    international:
      "Global trade shows resilience with 2.3% volume growth, while international organizations address climate security and economic stability challenges.",
    default:
      "Current factual developments span economic stability, legislative progress, judicial decisions, scientific advances, and international cooperation efforts.",
  }

  const key = topic.toLowerCase()
  return summaries[key] || summaries["default"]
}
