export interface PerspectiveArticle {
  title: string
  url: string
  source: string
}

export const perspectiveArticles: Record<
  string,
  { left: PerspectiveArticle[]; right: PerspectiveArticle[] }
> = {
  economic: {
    left: [
      {
        title: "Why the Fed Should Cut Rates to Help Working Families",
        url: "https://www.huffpost.com/topic/federal-reserve",
        source: "HuffPost",
      },
      {
        title: "Economic Inequality Persists Despite Low Unemployment",
        url: "https://www.msnbc.com/business",
        source: "MSNBC",
      },
    ],
    right: [
      {
        title: "Fed's Steady Hand Protects Savers and Economic Stability",
        url: "https://www.foxbusiness.com/economy",
        source: "Fox Business",
      },
      {
        title: "Free Market Growth Drives Strong Job Numbers",
        url: "https://www.wsj.com/economy",
        source: "Wall Street Journal",
      },
    ],
  },
  political: {
    left: [
      {
        title: "Congress Must Act on Social Safety Net Programs",
        url: "https://www.huffpost.com/news/politics",
        source: "HuffPost",
      },
      {
        title: "Bipartisan Bills Still Leave Out Key Progressive Priorities",
        url: "https://www.msnbc.com/rachel-maddow-show",
        source: "MSNBC",
      },
    ],
    right: [
      {
        title: "Government Spending Must Be Reined In",
        url: "https://www.foxnews.com/politics",
        source: "Fox News",
      },
      {
        title: "Conservative Priorities Gain Traction in Congress",
        url: "https://www.dailywire.com/news",
        source: "The Daily Wire",
      },
    ],
  },
  legal: {
    left: [
      {
        title: "Supreme Court Cases Could Expand Civil Liberties",
        url: "https://www.huffpost.com/topic/supreme-court",
        source: "HuffPost",
      },
      {
        title: "Digital Privacy Rights Need Stronger Federal Protection",
        url: "https://www.msnbc.com/opinion",
        source: "MSNBC",
      },
    ],
    right: [
      {
        title: "Originalist Approach Key to Upcoming SCOTUS Decisions",
        url: "https://www.foxnews.com/politics/judiciary",
        source: "Fox News",
      },
      {
        title: "Court Must Limit Federal Regulatory Overreach",
        url: "https://www.nationalreview.com/bench-memos",
        source: "National Review",
      },
    ],
  },
  scientific: {
    left: [
      {
        title: "More Federal Funding Needed for Scientific Research",
        url: "https://www.huffpost.com/topic/science",
        source: "HuffPost",
      },
      {
        title: "Climate Science Demands Immediate Government Action",
        url: "https://www.msnbc.com/opinion",
        source: "MSNBC",
      },
    ],
    right: [
      {
        title: "Private Sector Innovation Drives Space Exploration",
        url: "https://www.foxnews.com/science",
        source: "Fox News",
      },
      {
        title: "Science Funding Must Balance Innovation With Fiscal Responsibility",
        url: "https://www.wsj.com/tech",
        source: "Wall Street Journal",
      },
    ],
  },
  international: {
    left: [
      {
        title: "Multilateral Cooperation Is Key to Global Challenges",
        url: "https://www.huffpost.com/topic/world-news",
        source: "HuffPost",
      },
      {
        title: "Climate Justice Must Be Central to Foreign Policy",
        url: "https://www.msnbc.com/opinion",
        source: "MSNBC",
      },
    ],
    right: [
      {
        title: "America First: Trade Policy Must Protect Domestic Interests",
        url: "https://www.foxnews.com/world",
        source: "Fox News",
      },
      {
        title: "Strong National Defense Key to Global Stability",
        url: "https://www.dailywire.com/news",
        source: "The Daily Wire",
      },
    ],
  },
}

const leftViewpoints: Record<string, string> = {
  economic:
    "Interest rates should be lowered to stimulate economic growth and help working families struggling with high costs of living and housing affordability.",
  political:
    "Progressive policies and increased government investment are needed to address systemic inequalities and support working families.",
  legal:
    "The Court should prioritize protecting individual privacy rights and strengthening environmental protections over corporate interests.",
  scientific:
    "Space exploration funding should be increased as it drives innovation, creates jobs, and advances scientific knowledge for humanity's benefit.",
  international:
    "Multilateral cooperation and diplomacy are essential for addressing global challenges like climate change and economic inequality.",
}

const rightViewpoints: Record<string, string> = {
  economic:
    "Maintaining current interest rates is prudent to prevent inflation and ensure economic stability while protecting the value of savings and investments.",
  political:
    "Free market solutions and reduced government intervention will create more opportunities and economic growth for all Americans.",
  legal:
    "The Court should focus on constitutional originalism and limiting federal overreach while protecting business rights and state sovereignty.",
  scientific:
    "While space achievements are impressive, we should prioritize fiscal responsibility and ensure space spending doesn't exceed practical benefits.",
  international:
    "America-first trade policies and strong national defense are key to protecting domestic interests and maintaining global stability.",
}

export function getLeftViewpoint(category: string): string {
  return leftViewpoints[category] || leftViewpoints.political
}

export function getRightViewpoint(category: string): string {
  return rightViewpoints[category] || rightViewpoints.political
}
