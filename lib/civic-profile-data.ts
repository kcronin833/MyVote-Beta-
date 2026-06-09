/**
 * civic-profile-data.ts
 *
 * Shared data for the 8 MyVote civic archetypes — used by both:
 *   • app/profiles/page.tsx   (the full public profiles directory)
 *   • components/intake-quiz.tsx  (inline on the quiz results screen)
 *
 * Each archetype gets:
 *   primaryFigure    — the lead historical figure (shown most prominently)
 *   moreFigures      — two additional historical examples
 *   science          — the research frameworks behind the profile type
 */

import type { ArchetypeKey } from "@/lib/quiz-engine"

export interface HistoricalFigure {
  name: string
  years: string
  role: string
  quote: string
  why: string
  wikiTitle: string
}

export interface ArchetypeProfileData {
  primaryFigure: HistoricalFigure
  moreFigures: [HistoricalFigure, HistoricalFigure]
  science: string
}

export const ARCHETYPE_PROFILE_DATA: Record<ArchetypeKey, ArchetypeProfileData> = {

  // ─── Civic Pragmatist ──────────────────────────────────────────────────────
  civic_pragmatist: {
    primaryFigure: {
      name: "Dwight D. Eisenhower",
      years: "1890–1969",
      role: "34th President & Supreme Allied Commander",
      quote: "Neither a wise man nor a brave man lies down on the tracks of history to wait for the train of the future to run over him.",
      why: "Eisenhower built the Interstate Highway System (massive federal investment) while simultaneously warning against the military-industrial complex — evaluating every issue on evidence and real-world outcomes, not ideology. He left office as one of the most broadly respected presidents in American history precisely because he refused to be captured by either party's orthodoxy.",
      wikiTitle: "Dwight_D._Eisenhower",
    },
    moreFigures: [
      {
        name: "Henry Clay",
        years: "1777–1852",
        role: "U.S. Senator & \"The Great Compromiser\"",
        quote: "I would rather be right than be president.",
        why: "Clay brokered three landmark compromises that delayed the Civil War for decades, repeatedly sacrificing his own presidential ambitions to keep the Union intact. He believed the job of a statesman was to find workable solutions, not to score rhetorical victories — a philosophy that defined pragmatic governance for a generation.",
        wikiTitle: "Henry_Clay",
      },
      {
        name: "Daniel Patrick Moynihan",
        years: "1927–2003",
        role: "U.S. Senator & Policy Architect",
        quote: "Everyone is entitled to his own opinion, but not to his own facts.",
        why: "Moynihan served four presidents of both parties, authored landmark social policy research, and championed evidence-based governance at a time when politics was becoming increasingly tribal. His career embodied the pragmatist creed: rigorous data, honest disagreement, and policies judged by outcomes rather than ideology.",
        wikiTitle: "Daniel_Patrick_Moynihan",
      },
    ],
    science: "**Research basis:** Big Five personality studies (Costa & McCrae) find pragmatists score high on Agreeableness and lower on rigid ideological Openness. Jonathan Haidt's Moral Foundations Theory shows this type balances all six foundations — Care, Fairness, Loyalty, Authority, Sanctity, and Liberty — rather than elevating any single one. Pew Research's Political Typology consistently identifies an \"Ambivalent\" cluster that supports programs from both parties based on issue-by-issue assessment rather than partisan identity. This profile correlates with high need for cognition and preference for complexity over simplicity in political judgment.",
  },

  // ─── Freedom First ────────────────────────────────────────────────────────
  freedom_first: {
    primaryFigure: {
      name: "Barry Goldwater",
      years: "1909–1998",
      role: "U.S. Senator & 1964 Presidential Candidate",
      quote: "A government big enough to give you everything you want is big enough to take everything you have.",
      why: "Goldwater's \"The Conscience of a Conservative\" defined a generation of limited-government thinking. He opposed federal overreach in both economic and personal life — including opposing government intrusion into private behavior — arguing that individual liberty, not government programs, was the true foundation of a free society.",
      wikiTitle: "Barry_Goldwater",
    },
    moreFigures: [
      {
        name: "Milton Friedman",
        years: "1912–2006",
        role: "Nobel Laureate Economist",
        quote: "The society that puts equality before freedom will end up with neither.",
        why: "Friedman's \"Capitalism and Freedom\" made the rigorous academic case that economic and personal freedom are inseparable. His ideas — school choice, the negative income tax, drug decriminalization — were driven by a consistent principle: voluntary exchange beats government mandate, every time. He influenced economic policy across the ideological spectrum.",
        wikiTitle: "Milton_Friedman",
      },
      {
        name: "Frederick Douglass",
        years: "1818–1895",
        role: "Abolitionist, Statesman & Author",
        quote: "I prefer to be true to myself, even at the hazard of incurring the ridicule of others.",
        why: "Douglass escaped enslavement and spent his life arguing that freedom — genuine, uncompromised individual freedom — was the birthright of every person regardless of race. He distrusted paternalism even from allies, insisting that self-determination and personal dignity were non-negotiable, not gifts to be granted by any government or benefactor.",
        wikiTitle: "Frederick_Douglass",
      },
    ],
    science: "**Research basis:** Big Five studies link this profile to high Openness (valuing autonomy and novelty) combined with high Conscientiousness (personal responsibility and self-reliance). Jonathan Haidt's Moral Foundations Theory identifies a dominant **Liberty** foundation — a strong sensitivity to coercion and paternalism — with weaker Loyalty-to-institutions. Ronald Inglehart's post-materialist values research shows that as societies become more prosperous, a segment prioritizes individual self-expression and freedom from state control over collective security. This profile appears most strongly in Pew's \"Core Conservative\" and \"Libertarian\" clusters.",
  },

  // ─── Community Builder ────────────────────────────────────────────────────
  community_builder: {
    primaryFigure: {
      name: "Jane Addams",
      years: "1860–1935",
      role: "Nobel Peace Prize Winner & Social Reformer",
      quote: "The good we secure for ourselves is precarious unless it is secured for all of us.",
      why: "Addams co-founded Hull House in Chicago — a community center offering childcare, English classes, job training, and healthcare to thousands of immigrants. She helped establish the modern social safety net not as a government abstraction but as a practical conviction: society is only as strong as its most vulnerable members, and the strong have a responsibility to act.",
      wikiTitle: "Jane_Addams",
    },
    moreFigures: [
      {
        name: "Franklin D. Roosevelt",
        years: "1882–1945",
        role: "32nd President of the United States",
        quote: "The test of our progress is not whether we add to the abundance of those who have much; it is whether we provide enough for those who have little.",
        why: "FDR responded to the Great Depression by fundamentally redefining the federal government's role as a guarantor of economic security. Social Security, the FDIC, rural electrification, unemployment insurance — each was an expression of the community builder's core belief that collective investment makes everyone safer and freer, not just the recipients.",
        wikiTitle: "Franklin_D._Roosevelt",
      },
      {
        name: "Dorothea Dix",
        years: "1802–1887",
        role: "Social Reformer & Superintendent of Army Nurses",
        quote: "I tell what I have seen.",
        why: "Dix single-handedly transformed the treatment of people with mental illness in America, personally lobbying 15 state legislatures after visiting asylum after asylum to document inhumane conditions. She embodied the community builder's method: bear witness, build coalitions, use the levers of government to protect those who cannot protect themselves.",
        wikiTitle: "Dorothea_Dix",
      },
    ],
    science: "**Research basis:** Big Five personality research consistently links this profile to high Agreeableness (empathy, cooperative behavior) and high Openness (concern for social justice). Jonathan Haidt's Moral Foundations Theory shows dominant **Care** and **Fairness** foundations — a heightened sensitivity to suffering and a strong belief that outcomes should be equitable. Research on \"moral elevation\" (Jonathan Haidt, Dacher Keltner) shows this profile is particularly motivated by witnessing acts of virtue and sacrifice. Pew's Political Typology places this cluster in the \"Solid Liberal\" and \"Opportunity Democrat\" groups, unified by belief in government as a vehicle for community investment.",
  },

  // ─── Institutional Skeptic ────────────────────────────────────────────────
  institutional_skeptic: {
    primaryFigure: {
      name: "Thomas Jefferson",
      years: "1743–1826",
      role: "3rd President of the United States",
      quote: "The price of liberty is eternal vigilance.",
      why: "Jefferson fiercely distrusted concentrated power — in banks, standing armies, and central government alike. He believed citizens must remain perpetually skeptical of institutions to preserve their freedom, and built constitutional safeguards to limit what those institutions could do. His vision was a republic of independent, self-governing citizens who never fully surrendered their judgment to any authority.",
      wikiTitle: "Thomas_Jefferson",
    },
    moreFigures: [
      {
        name: "Henry David Thoreau",
        years: "1817–1862",
        role: "Author & Philosopher",
        quote: "That government is best which governs least.",
        why: "Thoreau's \"Civil Disobedience\" — written after he refused to pay a war tax — became the foundational text of principled institutional resistance. He argued that individual conscience must always trump the demands of the state, and that compliant citizens are complicit citizens. His ideas directly inspired Gandhi and the Civil Rights Movement.",
        wikiTitle: "Henry_David_Thoreau",
      },
      {
        name: "Ida B. Wells",
        years: "1862–1931",
        role: "Journalist, Civil Rights Leader & Co-founder of the NAACP",
        quote: "The way to right wrongs is to turn the light of truth upon them.",
        why: "Wells documented the epidemic of lynching in the American South at a time when the government not only failed to act but actively enabled racial terror. Her investigative journalism was a masterclass in institutional skepticism: she trusted data over official narratives, exposed the gap between what institutions claimed and what they did, and refused to accept that any authority was above accountability.",
        wikiTitle: "Ida_B._Wells",
      },
    ],
    science: "**Research basis:** Political psychology research (Citrin, Miller) links political distrust to higher *need for cognition* — a tendency to seek out complexity and question surface-level explanations. Jonathan Haidt's Moral Foundations Theory shows this profile scores high on **Fairness** and **Liberty**, with strong skepticism of **Authority** and **Loyalty**-based appeals. Big Five studies link institutional skepticism to high Openness (desire to question norms) and lower Agreeableness (willingness to challenge). Pew's Political Typology identifies a consistent \"Disaffected\" cluster that distrusts both parties and government institutions — not from apathy, but from an evidence-based conviction that institutions underperform their promises.",
  },

  // ─── Local Impact ─────────────────────────────────────────────────────────
  local_impact: {
    primaryFigure: {
      name: "Fiorello LaGuardia",
      years: "1882–1947",
      role: "Mayor of New York City, 1934–1945",
      quote: "I sometimes violate party lines for the good of the city.",
      why: "LaGuardia believed city hall — not Washington — was where government actually touched people's lives. He personally arrived at fires, read comics over the radio during a newspaper strike, and rebuilt NYC's infrastructure from the ground up. To him, local governance was not a stepping stone to higher office; it was the whole point.",
      wikiTitle: "Fiorello_La_Guardia",
    },
    moreFigures: [
      {
        name: "Jane Jacobs",
        years: "1916–2006",
        role: "Urban Theorist & Activist",
        quote: "Cities have the capability of providing something for everybody, only because, and only when, they are created by everybody.",
        why: "Jacobs's \"The Death and Life of Great American Cities\" revolutionized urban planning by insisting that the people who actually live in neighborhoods know more about what makes them work than any distant planner. She stopped a highway through lower Manhattan through grassroots organizing — proving that local knowledge, applied locally, beats top-down design every time.",
        wikiTitle: "Jane_Jacobs",
      },
      {
        name: "Maynard Jackson",
        years: "1938–2003",
        role: "First Black Mayor of Atlanta",
        quote: "Atlanta is too busy to hate.",
        why: "Jackson transformed Atlanta from a mid-sized Southern city into an international hub, overseeing construction of Hartsfield Airport and pioneering minority business contracting. He worked at the intersection of local power and practical impact — using city government as the lever to expand economic opportunity in ways no federal program had managed to deliver at the neighborhood level.",
        wikiTitle: "Maynard_Jackson",
      },
    ],
    science: "**Research basis:** \"Place attachment\" research (Leila Scannell & Robert Gifford, 2010) demonstrates that strong local identity correlates directly with civic participation, volunteerism, and political engagement — more so than national or abstract political identity. Big Five studies find this profile tends toward high Conscientiousness (follow-through on community commitments) and high Agreeableness (cooperative, relationship-oriented). Pew's research on local engagement finds that people who attend city council meetings and know their neighbors by name report higher civic satisfaction and efficacy than those who engage only at the national level. This aligns with E.J. Dionne's concept of \"communitarian liberalism\" — the idea that democracy is most real at the scale where people can actually see each other.",
  },

  // ─── National Policy Watcher ─────────────────────────────────────────────
  national_policy_watcher: {
    primaryFigure: {
      name: "George Marshall",
      years: "1880–1959",
      role: "Secretary of State & Nobel Peace Prize Winner",
      quote: "Don't fight the problem, decide it.",
      why: "Marshall architected the Marshall Plan — committing billions to rebuild a shattered Europe and reorient the post-WWII world order. He believed the United States had not just the power but the responsibility to lead at scale, and that only strategic federal policy — patient, evidence-based, and long-horizon — could shape outcomes of that magnitude.",
      wikiTitle: "George_C._Marshall",
    },
    moreFigures: [
      {
        name: "Dean Acheson",
        years: "1893–1971",
        role: "U.S. Secretary of State, 1949–1953",
        quote: "No good comes from shouting at the wind.",
        why: "Acheson helped construct the entire architecture of postwar American foreign policy — NATO, the Truman Doctrine, containment — with a clear-eyed belief that great-power decisions made in Washington had consequences for millions. He treated policy as engineering: you define the problem rigorously, model the second-order effects, and build systems that outlast any individual administration.",
        wikiTitle: "Dean_Acheson",
      },
      {
        name: "George Kennan",
        years: "1904–2005",
        role: "Diplomat & Author of Containment Strategy",
        quote: "Heroism is endurance for one moment more.",
        why: "Kennan's 1946 \"Long Telegram\" and subsequent \"X Article\" gave American foreign policy a durable strategic framework that shaped four decades of Cold War decision-making. He exemplified the national policy watcher's approach: deep analysis, long time horizons, and willingness to accept that the right policy is often the patient one that produces no immediate headlines.",
        wikiTitle: "George_Kennan",
      },
    ],
    science: "**Research basis:** Big Five research links this profile to high Conscientiousness (systematic, long-term planning orientation) and high Openness (comfort with policy complexity and abstract systems). Jonathan Haidt's Moral Foundations Theory shows elevated **Authority** and **Loyalty** foundations — not as deference to individuals, but as respect for institutional structures that aggregate and act on collective knowledge. Political scientist Philip Tetlock's research on expert forecasting finds that \"fox\" thinkers (who integrate many sources of information at a national/global scale) outperform \"hedgehog\" thinkers (committed to single big ideas) — the national policy watcher tends toward the fox model. Pew's typology places this cluster in groups that closely track federal legislation and believe government at scale is a uniquely powerful tool for progress.",
  },

  // ─── Public Safety ────────────────────────────────────────────────────────
  public_safety: {
    primaryFigure: {
      name: "Theodore Roosevelt",
      years: "1858–1919",
      role: "26th President & NYC Police Commissioner",
      quote: "No man is above the law and no man is below it.",
      why: "As NYC Police Commissioner in the 1890s, Roosevelt patrolled beats at midnight to catch officers sleeping on duty and rooted out corruption at every level. He believed a well-ordered, safe society was the precondition for everything else — and was willing to give law enforcement the authority and accountability it needed to actually deliver that safety.",
      wikiTitle: "Theodore_Roosevelt",
    },
    moreFigures: [
      {
        name: "August Vollmer",
        years: "1876–1955",
        role: "\"Father of Modern Policing\"",
        quote: "The policeman's job is not to make arrests — it is to prevent crime.",
        why: "Vollmer transformed American law enforcement from a patronage-driven system into a professional public safety institution. He introduced fingerprinting, lie detectors, patrol cars, and university-based police training — and argued passionately that police should be social workers as much as enforcers. He exemplified the public safety profile's core belief: rigorous, professional, accountable institutions protect everyone.",
        wikiTitle: "August_Vollmer",
      },
      {
        name: "Eliot Ness",
        years: "1903–1957",
        role: "Federal Agent & Cleveland Safety Director",
        quote: "I was taught to fight fair.",
        why: "Ness brought Al Capone's criminal empire down not through violence but through meticulous forensic accounting — proving that order could be restored through institutional competence and the rule of law. As Cleveland's Safety Director, he applied the same discipline to reforming a corrupt police department, demonstrating that public safety is as much about institutional integrity as enforcement.",
        wikiTitle: "Eliot_Ness",
      },
    ],
    science: "**Research basis:** Jonathan Haidt's Moral Foundations Theory identifies elevated **Authority** and **Loyalty** foundations in this profile — not as obedience to individuals, but as belief in hierarchical social structures as stabilizers of collective life. This is distinct from authoritarianism: research (Feldman, Stenner) shows public safety orientation correlates with desire for *order* in response to *threat*, not with desire to dominate others. Big Five studies find high Conscientiousness (rule-following, institutional respect) and lower Openness to disrupting established social arrangements. Pew's Political Typology places this cluster in groups that consistently prioritize crime and public order as top-tier policy concerns, and who view strong, well-funded law enforcement as a community asset rather than a threat.",
  },

  // ─── Independent Localist ─────────────────────────────────────────────────
  independent_localist: {
    primaryFigure: {
      name: "Benjamin Franklin",
      years: "1706–1790",
      role: "Founding Father, Inventor & Statesman",
      quote: "An investment in knowledge pays the best interest.",
      why: "Franklin defied every label: a self-made entrepreneur who founded public libraries, fire departments, and mutual-aid societies. He combined fierce personal independence with a genuine belief in community investment — proving that individual freedom and civic responsibility are not opposites but are, in fact, each other's prerequisites.",
      wikiTitle: "Benjamin_Franklin",
    },
    moreFigures: [
      {
        name: "Alexis de Tocqueville",
        years: "1805–1859",
        role: "Historian, Diplomat & Author of Democracy in America",
        quote: "The health of a democratic society may be measured by the quality of functions performed by private citizens.",
        why: "Tocqueville visited America in 1831 and saw something European observers missed: democracy's vitality came not from the federal government but from thousands of voluntary associations — town meetings, civic clubs, religious organizations — that trained citizens in self-governance. He gave intellectual grounding to the independent localist's conviction that the most important political life happens below the national level.",
        wikiTitle: "Alexis_de_Tocqueville",
      },
      {
        name: "Wendell Berry",
        years: "1934–present",
        role: "Author, Farmer & Agrarian Philosopher",
        quote: "It may be that when we no longer know what to do, we have come to our real work, and when we no longer know which way to go, we have begun our real journey.",
        why: "Berry's decades of essays, novels, and poetry make a sustained case for the irreplaceable value of local community, small-scale agriculture, and the kind of knowledge that only comes from living somewhere long enough to understand it. He has consistently argued — from a perspective that defies both liberal and conservative categories — that both market forces and government programs tend to undermine the local relationships that actually sustain human life.",
        wikiTitle: "Wendell_Berry",
      },
    ],
    science: "**Research basis:** Amitai Etzioni's \"communitarian\" framework (The Spirit of Community, 1993) defines this profile precisely: rights and responsibilities are inseparable, and voluntary community bonds are more durable and legitimate than either market transactions or government mandates. Big Five research finds high Openness (intellectual curiosity, comfort with unconventional positions) combined with moderate Conscientiousness (personal responsibility without rigidity). Alexis de Tocqueville's foundational research on American democracy identified \"voluntary associations\" as the key mediating institution between isolated individuals and an overreaching state — exactly the civic ecosystem this profile seeks to nurture. Pew's typology often places this cluster outside standard partisan groupings, reflecting its genuinely cross-cutting nature.",
  },
}
