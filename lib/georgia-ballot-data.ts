// Georgia 2026 Ballot Data — comprehensive lookup by zip code
// Covers all 159 Georgia counties and 500+ zip codes

export interface BallotCandidate {
  name: string
  party: "Democrat" | "Republican" | "Independent" | "Libertarian" | "Green"
  isIncumbent: boolean
  bio: string
  keyIssues: string[]
  website?: string
  politicalScore: number
  photo: string
  experience: string[]
  endorsements: string[]
  fundraising: { totalRaised: string; lastQuarter: string }
  positions: Array<{ issue: string; stance: string; description: string }>
  socialMedia: { twitter?: string; facebook?: string; instagram?: string }
  contactInfo: { email?: string; phone?: string }
  // Extended profile fields
  age?: number
  hometown?: string
  education?: string[]
  /** Exact Wikipedia page title for photo lookup (e.g. "Jon_Ossoff"). */
  wikipediaTitle?: string
  campaignSlogan?: string
}

export interface BallotRace {
  office: string
  date: string
  type: "Primary Election" | "General Election" | "Runoff Election" | "Special Election"
  description: string
  registrationDeadline: string
  earlyVotingStart: string
  earlyVotingEnd: string
  level: "Federal" | "State" | "County" | "School Board" | "Local"
  candidates: BallotCandidate[]
}

interface CountyData {
  county: string
  countyRaces: BallotRace[]
  pollingInfo: string
}

// ─── Helpers ────────────────────────────────────────────────────────────────

type CandidateExtras = {
  age?: number
  hometown?: string
  education?: string[]
  wikipediaTitle?: string
  facebook?: string
  instagram?: string
  email?: string
  phone?: string
  campaignSlogan?: string
  endorsements?: string[]
  positions?: BallotCandidate["positions"]
  fundraising?: { totalRaised: string; lastQuarter: string }
}

function rCandidate(
  name: string, isIncumbent: boolean, bio: string,
  keyIssues: string[], experience: string[], score: number,
  website?: string, twitter?: string,
  extras?: CandidateExtras
): BallotCandidate {
  return {
    name, party: "Republican", isIncumbent, bio, keyIssues, website,
    politicalScore: score, photo: "/placeholder.svg?height=64&width=64",
    experience,
    endorsements: extras?.endorsements ?? [],
    fundraising: extras?.fundraising ?? { totalRaised: "TBD", lastQuarter: "TBD" },
    positions: extras?.positions ?? [],
    socialMedia: { twitter, facebook: extras?.facebook, instagram: extras?.instagram },
    contactInfo: { email: extras?.email, phone: extras?.phone },
    age: extras?.age,
    hometown: extras?.hometown,
    education: extras?.education,
    wikipediaTitle: extras?.wikipediaTitle,
    campaignSlogan: extras?.campaignSlogan,
  }
}

function dCandidate(
  name: string, isIncumbent: boolean, bio: string,
  keyIssues: string[], experience: string[], score: number,
  website?: string, twitter?: string,
  extras?: CandidateExtras
): BallotCandidate {
  return {
    name, party: "Democrat", isIncumbent, bio, keyIssues, website,
    politicalScore: score, photo: "/placeholder.svg?height=64&width=64",
    experience,
    endorsements: extras?.endorsements ?? [],
    fundraising: extras?.fundraising ?? { totalRaised: "TBD", lastQuarter: "TBD" },
    positions: extras?.positions ?? [],
    socialMedia: { twitter, facebook: extras?.facebook, instagram: extras?.instagram },
    contactInfo: { email: extras?.email, phone: extras?.phone },
    age: extras?.age,
    hometown: extras?.hometown,
    education: extras?.education,
    wikipediaTitle: extras?.wikipediaTitle,
    campaignSlogan: extras?.campaignSlogan,
  }
}

function iCandidate(
  name: string, isIncumbent: boolean, bio: string,
  keyIssues: string[], experience: string[],
  extras?: CandidateExtras
): BallotCandidate {
  return {
    name, party: "Independent", isIncumbent, bio, keyIssues,
    politicalScore: 0, photo: "/placeholder.svg?height=64&width=64",
    experience,
    endorsements: extras?.endorsements ?? [],
    fundraising: extras?.fundraising ?? { totalRaised: "TBD", lastQuarter: "TBD" },
    positions: extras?.positions ?? [],
    socialMedia: { facebook: extras?.facebook },
    contactInfo: { email: extras?.email },
    age: extras?.age,
    hometown: extras?.hometown,
    education: extras?.education,
    wikipediaTitle: extras?.wikipediaTitle,
  }
}

function primaryRace(office: string, level: BallotRace["level"], description: string, candidates: BallotCandidate[]): BallotRace {
  return {
    office, date: "May 19, 2026", type: "Primary Election", description, level, candidates,
    registrationDeadline: "April 20, 2026", earlyVotingStart: "April 27, 2026", earlyVotingEnd: "May 15, 2026",
  }
}

function generalRace(office: string, level: BallotRace["level"], description: string, candidates: BallotCandidate[]): BallotRace {
  return {
    office, date: "November 3, 2026", type: "General Election", description, level, candidates,
    registrationDeadline: "October 5, 2026", earlyVotingStart: "October 12, 2026", earlyVotingEnd: "October 30, 2026",
  }
}

function countyRace(office: string, description: string, candidates: BallotCandidate[], level: BallotRace["level"] = "County"): BallotRace {
  return generalRace(office, level, description, candidates)
}

function tbdCandidate(party: "Republican" | "Democrat"): BallotCandidate {
  return {
    name: `${party} Nominee – TBD`, party, isIncumbent: false,
    bio: "The nominee will be determined after the May 19, 2026 primary. Check back for details.",
    keyIssues: [], politicalScore: party === "Republican" ? 60 : -60,
    photo: "/placeholder.svg?height=64&width=64", experience: ["Primary winner — to be determined"],
    endorsements: [], fundraising: { totalRaised: "TBD", lastQuarter: "TBD" },
    positions: [], socialMedia: {}, contactInfo: {},
  }
}

// ─── Statewide Races (every Georgia voter) ───────────────────────────────────

export const STATEWIDE_RACES: BallotRace[] = [
  {
    office: "Georgia Governor – Republican Primary Runoff",
    date: "June 16, 2026",
    type: "Runoff Election",
    level: "State",
    description:
      "Open seat — Gov. Brian Kemp is term-limited. No candidate cleared 50% in the May 19 primary, so the top two Republicans advance to a June 16 runoff for the GOP nomination.",
    registrationDeadline: "May 19, 2026",
    earlyVotingStart: "June 6–8 (varies by county)",
    earlyVotingEnd: "June 12, 2026",
    candidates: [
      rCandidate("Burt Jones", false,
        "Georgia's current Lt. Governor and a Trump-endorsed businessman from Commerce, GA. Led the May 19 primary field and advances to the June 16 runoff for the GOP gubernatorial nomination. A former state senator and small business owner, Jones built his political brand on fiscal conservatism, election integrity, and an America First agenda. He was formally endorsed by President Trump, making him the MAGA-aligned frontrunner in the race.",
        ["Tax Cuts", "Public Safety", "Election Integrity", "America First"],
        ["Lt. Governor of Georgia (2023–present)", "Georgia State Senator (2017–2022)", "Small business owner, Commerce GA"],
        82, "https://burtjones.com", "https://twitter.com/LtGovBurtJones",
        {
          age: 42, hometown: "Commerce, GA",
          education: ["University of Georgia, B.B.A."],
          wikipediaTitle: "Burt_Jones_(politician)",
          facebook: "https://www.facebook.com/LtGovBurtJones",
          campaignSlogan: "Georgia First",
          endorsements: ["President Donald Trump", "Georgia Right to Life", "National Rifle Association"],
          positions: [
            { issue: "Taxes", stance: "Cut taxes", description: "Supports eliminating the state income tax and reducing the overall tax burden on Georgia families and businesses." },
            { issue: "Election Integrity", stance: "Strict ID requirements", description: "Advocates for photo ID requirements for all elections and opposes changes to Georgia's election laws." },
            { issue: "Immigration", stance: "Border security", description: "Supports enhanced cooperation with federal immigration enforcement and opposes sanctuary policies." },
            { issue: "Education", stance: "School choice", description: "Backs expanding Georgia's education savings account program to give parents more options." },
          ],
        }),
      rCandidate("Rick Jackson", false,
        "Atlanta-area businessman and self-funding political outsider who placed second in the May 19 primary, advancing to the June 16 runoff. Jackson is the founder and CEO of a regional staffing company and is running as a reform candidate focused on cutting government waste and making Georgia more affordable. He has no prior elected office experience.",
        ["Economic Growth", "Government Reform", "Healthcare Costs", "Education"],
        ["Founder & CEO, staffing company (Atlanta area)", "Business leader and entrepreneur", "First-time candidate for public office"],
        68, "https://rickjacksonforgovernor.com", undefined,
        {
          hometown: "Atlanta, GA",
          campaignSlogan: "Real Change for Georgia",
          positions: [
            { issue: "Economy", stance: "Pro-business reform", description: "Proposes streamlining state permitting, cutting business regulations, and attracting new investment to rural Georgia." },
            { issue: "Healthcare", stance: "Lower costs", description: "Supports expanding healthcare access in rural areas and increasing price transparency for medical services." },
            { issue: "Government", stance: "Reduce waste", description: "Pledges a comprehensive audit of state agencies and elimination of redundant programs." },
          ],
        }),
    ],
  },
  generalRace(
    "Georgia Governor – Democratic Nominee", "State",
    "Former Atlanta Mayor Keisha Lance Bottoms won the Democratic nomination outright in the May 19 primary and advances to the November general election.",
    [
      dCandidate("Keisha Lance Bottoms", false,
        "Former Mayor of Atlanta (2018–2022) and senior adviser to President Biden, Keisha Lance Bottoms is the 2026 Democratic nominee for Georgia Governor. Born and raised in Atlanta, she is the daughter of R&B singer Major Lance. As mayor she navigated Atlanta through the COVID-19 pandemic and the civil unrest following the murder of George Floyd, earning national recognition. She is running to expand Medicaid, fund public education, and grow Georgia's economy across all 159 counties.",
        ["Medicaid Expansion", "Public Education", "Small Business", "Free Community College"],
        ["Democratic Nominee for Governor (2026)", "Mayor of Atlanta (2018–2022)", "Senior Adviser to President Biden (2022–2023)", "City of Atlanta Municipal Court Judge (2002–2008)"],
        -62, "https://keishaforgovernor.com", "https://twitter.com/KeishaBottoms",
        {
          age: 55, hometown: "Atlanta, GA",
          education: ["Florida A&M University, B.S.", "Georgia State University College of Law, J.D."],
          wikipediaTitle: "Keisha_Lance_Bottoms",
          facebook: "https://www.facebook.com/keishalancebottoms",
          instagram: "https://www.instagram.com/keishalancebottoms",
          campaignSlogan: "Georgia for Everyone",
          endorsements: ["Georgia Democratic Party", "Emily's List", "Planned Parenthood Action Fund", "Georgia AFL-CIO"],
          positions: [
            { issue: "Healthcare", stance: "Expand Medicaid", description: "Supports full Medicaid expansion under the ACA, which would cover approximately 370,000 uninsured Georgians." },
            { issue: "Education", stance: "Fund public schools", description: "Proposes increased state investment in K-12 public education and free community college for Georgia residents." },
            { issue: "Economy", stance: "Broad-based growth", description: "Aims to attract businesses to all 159 Georgia counties, not just the Atlanta metro, with targeted rural investment." },
            { issue: "Criminal Justice", stance: "Reform-oriented", description: "Supports policing reforms, community investment, and reducing incarceration for non-violent offenses." },
          ],
        }),
    ]
  ),
  generalRace(
    "U.S. Senate – Georgia", "Federal",
    "Sen. Jon Ossoff (D) is seeking re-election to Georgia's Class III Senate seat — one of the most competitive Senate races in the country. The Republican challenger will be decided in a June 16 runoff between Mike Collins and Derek Dooley.",
    [
      dCandidate("Jon Ossoff", true,
        "Jon Ossoff is Georgia's junior U.S. Senator, elected in January 2021 in a historic runoff election that gave Democrats control of the Senate. Born in Atlanta, he is one of the youngest U.S. Senators in history. Before politics, he was an investigative journalist and CEO of Insight TWI, a documentary production company focused on exposing corruption in Africa and the Middle East. In the Senate he has focused on accountability in government contracting, criminal justice reform, and expanding broadband access in rural Georgia.",
        ["Government Accountability", "Criminal Justice Reform", "Healthcare Access", "Technology & Innovation"],
        ["U.S. Senator, Georgia (2021–present)", "CEO, Insight TWI (documentary production)", "District Director, Rep. John Lewis (2012–2013)"],
        -65, "https://ossoff.senate.gov", "https://twitter.com/SenOssoff",
        {
          age: 39, hometown: "Atlanta, GA",
          education: ["Paideia School, Atlanta", "Georgetown University, B.S. (Film & Media Studies)"],
          wikipediaTitle: "Jon_Ossoff",
          facebook: "https://www.facebook.com/jonossoff",
          instagram: "https://www.instagram.com/jonossoff",
          campaignSlogan: "Fighting for Georgia",
          endorsements: ["Georgia Democratic Party", "AFL-CIO", "Sierra Club", "Planned Parenthood Action Fund", "Human Rights Campaign"],
          fundraising: { totalRaised: "$28.4M", lastQuarter: "$4.1M" },
          positions: [
            { issue: "Healthcare", stance: "Protect the ACA", description: "Voted to protect the Affordable Care Act and supports lowering prescription drug costs for Georgia seniors." },
            { issue: "Criminal Justice", stance: "Reform-oriented", description: "Supports reducing mandatory minimums, expanding reentry programs, and police accountability measures." },
            { issue: "Economy", stance: "Middle-class focus", description: "Champions rural broadband expansion and workforce development programs for Georgia communities." },
            { issue: "National Security", stance: "Strong defense", description: "Supports robust defense funding while advocating for diplomatic solutions to international conflicts." },
          ],
        }),
      rCandidate("Mike Collins", false,
        "Mike Collins is a U.S. Representative from Georgia's 10th Congressional District, serving since January 2023. The son of former Rep. Mac Collins, he is the founder of Collins Trucking Company and a vocal supporter of border security. He co-authored the Laken Riley Act, signed into law in 2025, which requires federal detention of undocumented immigrants charged with certain crimes. Collins led the May 19 GOP Senate primary and advances to the June 16 runoff against Derek Dooley.",
        ["Border Security", "Economic Growth", "America First", "Public Safety"],
        ["U.S. Representative, GA-10 (2023–present)", "Founder & President, Collins Trucking Co.", "Jackson County Republican Party Chairman"],
        78, "https://mikecollinsforsenate.com", "https://twitter.com/RepMikeCollins",
        {
          hometown: "Jackson, GA",
          education: ["Georgia Military College", "University of Georgia"],
          wikipediaTitle: "Mike_Collins_(Georgia_politician)",
          facebook: "https://www.facebook.com/MikeCollinsGA",
          campaignSlogan: "Georgia Values. American Strength.",
          endorsements: ["President Donald Trump", "National Border Patrol Council", "NRA Political Victory Fund"],
          fundraising: { totalRaised: "$6.8M", lastQuarter: "$1.2M" },
          positions: [
            { issue: "Immigration", stance: "Strict enforcement", description: "Co-authored the Laken Riley Act; supports building the border wall and ending catch-and-release." },
            { issue: "Economy", stance: "Pro-business", description: "Supports cutting regulations and reducing taxes on small businesses and trucking companies." },
            { issue: "Energy", stance: "Domestic production", description: "Opposes the Green New Deal and supports expanded domestic oil, gas, and coal production." },
            { issue: "Crime", stance: "Law & order", description: "Backs increased funding for law enforcement and opposes efforts to reduce police budgets." },
          ],
        }),
      rCandidate("Derek Dooley", false,
        "Derek Dooley is an Athens native, attorney, and former NCAA Division I head football coach. He served as head coach at Louisiana Tech (2007–2009) and the University of Tennessee (2010–2012), compiling a 28–28 record. After coaching he returned to law, earning his degree from UGA. He is running as the more moderate GOP Senate candidate, backed by outgoing Gov. Brian Kemp, and faces Mike Collins in the June 16 runoff. His father is legendary UGA coach Vince Dooley.",
        ["Georgia First", "Common Sense Governance", "Economic Growth", "Veterans Support"],
        ["Attorney, Athens GA", "Head Football Coach, University of Tennessee (2010–2012)", "Head Football Coach, Louisiana Tech (2007–2009)", "UGA School of Law, J.D."],
        65, "https://dooleyforgeorgia.com", undefined,
        {
          age: 51, hometown: "Athens, GA",
          education: ["University of Georgia, B.S.", "University of Georgia School of Law, J.D."],
          wikipediaTitle: "Derek_Dooley",
          campaignSlogan: "Commonsense Conservative",
          endorsements: ["Governor Brian Kemp", "Georgia Chamber of Commerce"],
          positions: [
            { issue: "Economy", stance: "Growth-focused", description: "Supports incentives for manufacturers and tech companies to locate in Georgia, with a focus on rural economic development." },
            { issue: "Veterans", stance: "Strong support", description: "Advocates for expanded VA services in Georgia and increased support for military families at Fort Stewart, Fort Moore, and Robins AFB." },
            { issue: "Education", stance: "Workforce training", description: "Backs funding for technical colleges and apprenticeship programs to match workers with Georgia's job market." },
          ],
        }),
    ]
  ),
]

// ─── Congressional Races ─────────────────────────────────────────────────────

export const CONGRESSIONAL_RACES: Record<string, BallotRace> = {
  "GA-1": generalRace(
    "U.S. House – GA-1 (Coastal Georgia)", "Federal",
    "Open seat — Rep. Buddy Carter vacated GA-1 to run for U.S. Senate. Covers coastal SE Georgia including Savannah's suburbs, Brunswick, and the Golden Isles. Solidly Republican district.",
    [
      rCandidate("TBD – Republican Nominee", false,
        "The Republican nominee for the open GA-1 seat was decided in the May 19, 2026 primary. Confirm the certified nominee on the Georgia My Voter Page.",
        ["Coastal Economy", "Military Bases", "Border Security", "Small Business"],
        ["Primary winner — to be confirmed"],
        72),
      tbdCandidate("Democrat"),
    ]
  ),
  "GA-2": generalRace(
    "U.S. House – GA-2 (SW Georgia)", "Federal",
    "Rep. Sanford Bishop (D) is one of the longest-serving members of Congress. Covers southwest Georgia including Albany, Valdosta, and rural communities.",
    [
      dCandidate("Sanford Bishop", true,
        "One of Georgia's longest-serving members of Congress. Member of the Appropriations Committee. Focuses on agriculture, veterans, and rural economic development.",
        ["Agriculture", "Veterans Affairs", "Rural Economic Development", "Military"],
        ["U.S. Representative GA-2 (1993-present)", "Member, House Appropriations Committee", "Army veteran"],
        -45, "https://bishop.house.gov", "https://twitter.com/SanfordBishop",
        { wikipediaTitle: "Sanford_D._Bishop_Jr." }),
      tbdCandidate("Republican"),
    ]
  ),
  "GA-3": generalRace(
    "U.S. House – GA-3 (West Georgia)", "Federal",
    "Rep. Brian Jack (R) is seeking re-election. Covers central-west Georgia including Newnan, LaGrange, Peachtree City, and Griffin. Solidly Republican district.",
    [
      rCandidate("Brian Jack", true,
        "Former Trump White House Political Director elected to GA-3 in 2024. Advanced unopposed in the May 19 Republican primary. Focuses on border security, the economy, and the America First agenda.",
        ["Border Security", "Economic Growth", "America First", "Small Business"],
        ["U.S. Representative GA-3 (2025-present)", "Former Trump White House Political Director"],
        80, "https://jack.house.gov", "https://twitter.com/RepBrianJack"),
      tbdCandidate("Democrat"),
    ]
  ),
  "GA-4": generalRace(
    "U.S. House – GA-4 (DeKalb/Rockdale/Newton)", "Federal",
    "Rep. Hank Johnson (D) is seeking re-election. Covers DeKalb County suburbs, Rockdale, and Newton counties. Majority-minority district.",
    [
      dCandidate("Hank Johnson", true,
        "Longtime DeKalb-based congressman and member of the House Judiciary and Transportation committees. Focuses on civil rights, voting rights, and infrastructure.",
        ["Civil Rights", "Voting Rights", "Infrastructure", "Judiciary Reform"],
        ["U.S. Representative GA-4 (2007-present)", "Former DeKalb County Commissioner", "Attorney"],
        -68, "https://hankjohnson.house.gov", "https://twitter.com/RepHankJohnson",
        { wikipediaTitle: "Hank_Johnson" }),
      rCandidate("James Duffie", false,
        "Republican nominee who advanced unopposed in the May 19 primary to challenge for the GA-4 seat.",
        ["Public Safety", "Economic Growth", "Conservative Values", "Small Business"],
        ["Republican Nominee GA-4 (2026)", "Business owner"],
        60),
    ]
  ),
  "GA-5": generalRace(
    "U.S. House – GA-5 (Atlanta)", "Federal",
    "Rep. Nikema Williams (D) seeking re-election. Covers core Atlanta including downtown, Midtown, and west Atlanta neighborhoods.",
    [
      dCandidate("Nikema Williams", true,
        "Represents Georgia's 5th Congressional District, the seat formerly held by civil rights icon John Lewis. Focuses on voting rights, transit, and affordable housing.",
        ["Voting Rights", "MARTA Expansion", "Affordable Housing", "Healthcare Access"],
        ["U.S. Representative GA-5 (2021-present)", "Former Georgia State Senator", "Former GA Democratic Party Chair"],
        -72, "https://williams.house.gov", "https://twitter.com/RepNikema",
        { wikipediaTitle: "Nikema_Williams" }),
      tbdCandidate("Republican"),
    ]
  ),
  "GA-6": generalRace(
    "U.S. House – GA-6 (West Metro Atlanta)", "Federal",
    "Rep. Lucy McBath (D) seeking re-election. Covers west metro Atlanta including parts of Cobb, Douglas, Fayette, and south Fulton. Diverse, Democratic-leaning district.",
    [
      dCandidate("Lucy McBath", true,
        "Gun safety advocate and mother of Jordan Davis, who was killed in 2012. Focuses on gun safety, healthcare, and protecting suburban communities.",
        ["Gun Safety", "Healthcare Access", "Education", "Women's Rights"],
        ["U.S. Representative GA-6 (2023-present)", "Former Gun Safety Advocate & Activist", "Former Delta flight attendant"],
        -60, "https://mcbath.house.gov", "https://twitter.com/RepLucyMcBath",
        { wikipediaTitle: "Lucy_McBath" }),
      tbdCandidate("Republican"),
    ]
  ),
  "GA-7": generalRace(
    "U.S. House – GA-7 (North Metro: Forsyth/Cherokee/North Fulton)", "Federal",
    "Rep. Rich McCormick (R) seeking re-election. Covers Forsyth, Cherokee, north Fulton, and parts of Gwinnett — Sandy Springs, Alpharetta, Roswell, Canton, and Cumming. Suburban Atlanta district.",
    [
      rCandidate("Rich McCormick", true,
        "Emergency room physician and Marine Corps pilot. Focuses on border security, national defense, fiscal responsibility, and veterans.",
        ["Border Security", "National Defense", "Fiscal Responsibility", "Veterans"],
        ["U.S. Representative GA-7 (2023-present)", "Emergency Room Physician", "Marine Corps Pilot"],
        75, "https://mccormick.house.gov", "https://twitter.com/RepMcCormick"),
      tbdCandidate("Democrat"),
    ]
  ),
  "GA-8": generalRace(
    "U.S. House – GA-8 (Central Georgia)", "Federal",
    "Rep. Austin Scott (R) seeking re-election. Covers central Georgia including Warner Robins, Statesboro, and the surrounding rural communities.",
    [
      rCandidate("Austin Scott", true,
        "Focuses on agriculture, military (Robins Air Force Base), and rural economic development. Member of the House Armed Services Committee.",
        ["Agriculture", "Military (Robins AFB)", "Rural Economic Development", "Border Security"],
        ["U.S. Representative GA-8 (2011-present)", "Former Georgia State Representative", "Small business owner"],
        70, "https://austinscott.house.gov", "https://twitter.com/AustinScottGA08",
        { wikipediaTitle: "Austin_Scott_(politician)" }),
      tbdCandidate("Democrat"),
    ]
  ),
  "GA-9": generalRace(
    "U.S. House – GA-9 (NE Georgia Mountains)", "Federal",
    "Rep. Andrew Clyde (R) seeking re-election. Covers northeast Georgia mountains including Gainesville, Athens suburbs, and mountain communities.",
    [
      rCandidate("Andrew Clyde", true,
        "Gun shop owner and staunch conservative. Focuses on Second Amendment rights, border security, and limited government.",
        ["Second Amendment", "Border Security", "Limited Government", "Tax Cuts"],
        ["U.S. Representative GA-9 (2021-present)", "Navy veteran", "Gun shop owner"],
        88, "https://clyde.house.gov", "https://twitter.com/Rep_Clyde",
        { wikipediaTitle: "Andrew_Clyde" }),
      tbdCandidate("Democrat"),
    ]
  ),
  "GA-10": generalRace(
    "U.S. House – GA-10 (Augusta/NE Georgia)", "Federal",
    "Open seat — Rep. Mike Collins is running for U.S. Senate. Covers Augusta, Athens area, and NE Georgia. Solidly Republican district.",
    [
      rCandidate("TBD – Republican Nominee", false,
        "The Republican nominee will be determined in the May 2026 primary. This is a safe Republican district centered on Augusta and NE Georgia.",
        ["Conservative Values", "Economic Growth", "Border Security", "Military"],
        ["Primary winner — to be determined"],
        72),
      tbdCandidate("Democrat"),
    ]
  ),
  "GA-11": generalRace(
    "U.S. House – GA-11 (NW Atlanta Suburbs)", "Federal",
    "Open seat — Rep. Barry Loudermilk announced in February 2026 that he will not seek re-election, setting off a crowded Republican primary. Covers northwest Atlanta suburbs including Kennesaw, Acworth, Cartersville, and Rome. Solidly Republican district.",
    [
      rCandidate("TBD – Republican Nominee", false,
        "Rep. Loudermilk's retirement drew a large GOP field in the May 19, 2026 primary. Confirm the certified nominee — and any runoff — on the Georgia My Voter Page.",
        ["Fiscal Responsibility", "National Security", "Border Security", "Conservative Values"],
        ["Primary winner — to be confirmed"],
        75),
      tbdCandidate("Democrat"),
    ]
  ),
  "GA-12": generalRace(
    "U.S. House – GA-12 (East Central Georgia)", "Federal",
    "Rep. Rick Allen (R) seeking re-election. Covers east-central Georgia including Augusta suburbs, Statesboro area, and coastal plain communities.",
    [
      rCandidate("Rick Allen", true,
        "Construction company owner focused on economic development, agriculture, and conservative values. Serves on the House Agriculture Committee.",
        ["Agriculture", "Economic Development", "Conservative Values", "Small Business"],
        ["U.S. Representative GA-12 (2015-present)", "Construction company owner", "Businessman"],
        72, "https://allen.house.gov", "https://twitter.com/RepRickAllen",
        { wikipediaTitle: "Rick_W._Allen" }),
      tbdCandidate("Democrat"),
    ]
  ),
  "GA-13": {
    office: "U.S. House – GA-13 (South Atlanta Suburbs)",
    date: "July 28, 2026",
    type: "Special Election",
    level: "Federal",
    description:
      "Vacant seat — Rep. David Scott (D), who held GA-13 since 2003, died in office on April 22, 2026. A special election to fill the remainder of his term is scheduled for July 28, 2026, alongside the regular November general election. Covers Clayton, Douglas, Henry, and parts of south metro Atlanta — a strongly Democratic district.",
    registrationDeadline: "June 29, 2026",
    earlyVotingStart: "July 7, 2026",
    earlyVotingEnd: "July 25, 2026",
    candidates: [
      dCandidate("TBD – Democratic Candidate", false,
        "Multiple Democrats are running in the July 28 special election to succeed the late Rep. David Scott. Confirm the candidates and any runoff on the Georgia My Voter Page.",
        ["Agriculture", "Economic Opportunity", "Healthcare", "Voting Rights"],
        ["Special election candidate — to be confirmed"],
        -55),
      rCandidate("TBD – Republican Candidate", false,
        "Republican candidates are also competing in the July 28 special election for the vacant GA-13 seat.",
        ["Public Safety", "Economic Growth", "Conservative Values", "Small Business"],
        ["Special election candidate — to be confirmed"],
        55),
    ],
  },
  "GA-14": generalRace(
    "U.S. House – GA-14 (NW Georgia)", "Federal",
    "Rep. Clay Fuller (R) is seeking a full term. He won the special election to replace Marjorie Taylor Greene, who resigned from Congress in January 2026. Covers northwest Georgia including Rome, Dalton, and the mountainous northwest corner of the state. Solidly Republican district.",
    [
      rCandidate("Clay Fuller", true,
        "Won the special election to fill the GA-14 seat after Marjorie Taylor Greene's January 2026 resignation. A conservative running on an America First platform for northwest Georgia.",
        ["America First", "Border Security", "Economic Growth", "Conservative Values"],
        ["U.S. Representative GA-14 (2026-present)", "Business owner"],
        85, "https://fuller.house.gov"),
      tbdCandidate("Democrat"),
    ]
  ),
}

// ─── County Data ─────────────────────────────────────────────────────────────

function basicCountyRaces(county: string, seat: string, phone: string): CountyData {
  return {
    county,
    pollingInfo: `${county} County Elections Office — ${phone}`,
    countyRaces: [
      countyRace(
        `${county} County Sheriff`, `${county} County Sheriff — responsible for county jail and law enforcement.`,
        [iCandidate("Incumbent Sheriff", true, `Contact ${county} County Elections for candidate information as qualifying approaches.`, ["Public Safety", "Community Policing"], [`${county} County Sheriff (current term)`])]
      ),
      countyRace(
        `${county} County Commission`, `${county} County Board of Commissioners — local government and budget.`,
        [iCandidate("Incumbent Commissioner", true, `Contact ${county} County Elections for candidate information as qualifying approaches in 2026.`, ["County Services", "Fiscal Responsibility", "Roads & Infrastructure"], [`${county} County Commissioner (current term)`])]
      ),
      countyRace(
        `${county} County Board of Education`, `${county} County School Board — non-partisan education governance.`,
        [iCandidate("Incumbent Board Member", true, `Contact ${county} County Elections for school board candidate information.`, ["Student Achievement", "Teacher Support", "School Funding"], [`${county} County Board of Education (current term)`])],
        "School Board"
      ),
    ],
  }
}

const FULTON_RACES: BallotRace[] = [
  countyRace("Fulton County Sheriff", "Fulton County Sheriff — county jail, courts, and law enforcement for unincorporated Fulton County.",
    [
      dCandidate("Patrick Labat", true,
        "Fulton County Sheriff since 2021. Former ATF agent with 30+ years in law enforcement. Pushing for mental health diversion and jail reform.",
        ["Jail Reform", "Public Safety", "Community Policing", "Mental Health Diversion"],
        ["Fulton County Sheriff (2021-present)", "Former ATF Agent", "30+ years law enforcement"],
        -30, undefined, "https://twitter.com/SheriffLabat"),
    ]
  ),
  countyRace("Fulton County District Attorney", "Fulton County District Attorney — chief prosecutor for Fulton County.",
    [
      dCandidate("Christian Wise Smith", false,
        "Chief Deputy DA and career prosecutor running to lead the Fulton County DA's office. Focused on violent crime prosecution and victim services.",
        ["Public Safety", "Violent Crime Prosecution", "Victim Services", "Accountability"],
        ["Chief Deputy DA, Fulton County", "Senior Prosecutor", "Homicide Division Lead"],
        -20),
    ]
  ),
  countyRace("Fulton County Commission Chair", "Fulton County Board of Commissioners Chair — chief executive of Fulton County government.",
    [
      dCandidate("Robb Pitts", true,
        "Fulton County Commission Chair focused on public health, affordable housing, and responsible county governance.",
        ["Public Health", "Affordable Housing", "Government Efficiency", "Public Safety"],
        ["Fulton County Commission Chair (2019-present)", "Former Atlanta City Councilman", "Former State Representative"],
        -50),
    ]
  ),
  countyRace("Fulton County Board of Education – At-Large", "Fulton County Schools Board of Education — non-partisan, governs Fulton County Schools.",
    [iCandidate("Incumbent Board Member", true, "Fulton County Board of Education members up in 2026. Check fultonschools.org for specifics.", ["Academic Excellence", "Teacher Retention", "School Safety", "Mental Health"], ["Fulton County Board of Education"])],
    "School Board"
  ),
  countyRace("Fulton County Soil & Water Conservation District", "Non-partisan seat overseeing land and water conservation in Fulton County.",
    [iCandidate("Karen Spears", true, "Environmental scientist overseeing watershed protection and urban green infrastructure for Fulton County.", ["Watershed Protection", "Stormwater Management", "Tree Canopy", "Urban Farming"], ["Soil & Water Supervisor (2018-present)"])],
    "Local"
  ),
]

const GWINNETT_RACES: BallotRace[] = [
  countyRace("Gwinnett County Sheriff", "Gwinnett County Sheriff — law enforcement for Georgia's second-largest county.",
    [
      rCandidate("Keybo Taylor", true,
        "Gwinnett County Sheriff focused on public safety, combating drug trafficking, and community outreach in one of Georgia's most diverse counties.",
        ["Public Safety", "Drug Enforcement", "Community Policing", "Gang Reduction"],
        ["Gwinnett County Sheriff (2021-present)", "Gwinnett County PD veteran"],
        55),
    ]
  ),
  countyRace("Gwinnett County District Attorney", "Gwinnett County District Attorney — chief prosecutor for Gwinnett County.",
    [
      dCandidate("Patsy Austin-Gatson", true,
        "Gwinnett County's first Black DA. Focused on criminal justice reform, violent crime prosecution, and community safety.",
        ["Criminal Justice Reform", "Violent Crime", "Community Safety", "Victim Services"],
        ["Gwinnett County DA (2021-present)", "Career Prosecutor", "Community Leader"],
        -35),
    ]
  ),
  countyRace("Gwinnett County Commission Chair", "Gwinnett County Board of Commissioners Chair — executive leadership of Gwinnett County.",
    [
      dCandidate("Nicole Love Hendrickson", true,
        "Gwinnett County Commission Chair focused on transportation, economic development, and serving one of Georgia's fastest-growing and most diverse counties.",
        ["Transportation", "Economic Development", "Diversity & Inclusion", "Affordable Housing"],
        ["Gwinnett County Commission Chair (2021-present)", "Former Gwinnett Commissioner"],
        -45),
    ]
  ),
  countyRace("Gwinnett County Board of Education", "Gwinnett County Schools Board of Education — non-partisan.",
    [iCandidate("Incumbent Board Member", true, "Gwinnett County School Board races are non-partisan. Check gcpsk12.org for 2026 candidate information.", ["Academic Excellence", "Career Education", "School Safety", "Mental Health"], ["Gwinnett County Board of Education"])],
    "School Board"
  ),
]

const COBB_RACES: BallotRace[] = [
  countyRace("Cobb County Sheriff", "Cobb County Sheriff.",
    [
      rCandidate("Craig Owens", true,
        "Cobb County Sheriff focused on public safety and law enforcement transparency.",
        ["Public Safety", "Community Policing", "Law Enforcement Transparency"],
        ["Cobb County Sheriff (2021-present)", "Cobb County PD veteran"],
        58),
    ]
  ),
  countyRace("Cobb County District Attorney", "Cobb County District Attorney.",
    [
      dCandidate("Flynn Broady", true,
        "Cobb County's first Black DA. Focuses on violent crime, accountability, and reform.",
        ["Violent Crime Prosecution", "Criminal Justice Reform", "Accountability"],
        ["Cobb County DA (2021-present)", "Career Prosecutor"],
        -35),
    ]
  ),
  countyRace("Cobb County Commission Chair", "Cobb County Commission Chair.",
    [
      dCandidate("Lisa Cupid", true,
        "Cobb County Commission Chair — first Black chair in Cobb history. Focuses on transportation, housing, and inclusive economic growth.",
        ["Transportation", "Affordable Housing", "Economic Development", "Environment"],
        ["Cobb County Commission Chair (2021-present)", "Attorney"],
        -48),
    ]
  ),
  countyRace("Cobb County Board of Education", "Cobb County School Board — non-partisan.",
    [iCandidate("Incumbent Board Member", true, "Cobb County school board races are non-partisan. Check cobbk12.org for 2026 information.", ["Academic Excellence", "Parental Rights", "School Safety"], ["Cobb County Board of Education"])],
    "School Board"
  ),
]

const DEKALB_RACES: BallotRace[] = [
  countyRace("DeKalb County Sheriff", "DeKalb County Sheriff.",
    [
      dCandidate("Melody Maddox", true,
        "DeKalb County Sheriff focused on community policing and reform.",
        ["Community Policing", "Jail Reform", "Public Safety"],
        ["DeKalb County Sheriff (2021-present)", "DeKalb County PD veteran"],
        -40),
    ]
  ),
  countyRace("DeKalb County District Attorney", "DeKalb County District Attorney.",
    [
      dCandidate("Sherry Boston", true,
        "DeKalb County DA focused on accountability, violent crime, and community justice.",
        ["Violent Crime", "Criminal Justice Reform", "Accountability", "Victim Services"],
        ["DeKalb County DA (2016-present)", "Career Prosecutor"],
        -42),
    ]
  ),
  countyRace("DeKalb County CEO", "DeKalb County Chief Executive Officer — top elected official in DeKalb County government.",
    [
      dCandidate("Michael Thurmond", true,
        "DeKalb County CEO with decades of public service. Running for Governor but also may seek re-election — check for updates.",
        ["Working Families", "Economic Development", "Public Safety", "Education"],
        ["DeKalb County CEO (2017-present)", "Georgia Labor Commissioner", "State Representative"],
        -55),
    ]
  ),
  countyRace("DeKalb County Board of Education", "DeKalb County School Board — non-partisan.",
    [iCandidate("Incumbent Board Member", true, "Check dekalbschoolsga.org for 2026 school board candidate information.", ["Academic Achievement", "Equity", "Teacher Support"], ["DeKalb County Board of Education"])],
    "School Board"
  ),
]

const CHATHAM_RACES: BallotRace[] = [
  countyRace("Chatham County Sheriff", "Chatham County Sheriff — Savannah area.",
    [
      rCandidate("John Wilcher", true,
        "Chatham County Sheriff serving the Savannah area. Focused on violent crime reduction, port security, and community policing.",
        ["Violent Crime Reduction", "Port Security", "Community Policing", "Drug Enforcement"],
        ["Chatham County Sheriff (2009-present)", "Law enforcement veteran"],
        60),
    ]
  ),
  countyRace("Chatham County District Attorney", "Chatham County District Attorney.",
    [
      dCandidate("Shalena Cook Jones", true,
        "Chatham County DA focused on accountability, violent crime, and justice reform in the Savannah area.",
        ["Violent Crime", "Justice Reform", "Accountability", "Victim Services"],
        ["Chatham County DA (2021-present)", "Career Prosecutor"],
        -40),
    ]
  ),
  countyRace("Chatham County Commission Chair", "Chatham County Commission Chair.",
    [
      dCandidate("Chester Ellis", true,
        "Chatham County Commission Chair overseeing local government for the Savannah region.",
        ["Economic Development", "Public Safety", "Infrastructure", "Tourism"],
        ["Chatham County Commission Chair (current term)"],
        -30),
    ]
  ),
  countyRace("Savannah-Chatham County Board of Education", "Savannah-Chatham County Board of Public Education — non-partisan.",
    [iCandidate("Incumbent Board Member", true, "Check savannahchathamboe.com for 2026 school board candidate information.", ["Academic Achievement", "School Safety", "Teacher Support"], ["SCCPSS Board of Education"])],
    "School Board"
  ),
]

const RICHMOND_RACES: BallotRace[] = [
  countyRace("Richmond County Sheriff", "Richmond County Sheriff — Augusta area.",
    [
      rCandidate("Richard Roundtree", true,
        "Richmond County Sheriff focused on public safety in the Augusta area. Veteran law enforcement officer.",
        ["Public Safety", "Crime Reduction", "Community Policing"],
        ["Richmond County Sheriff (current term)", "Law enforcement veteran"],
        58),
    ]
  ),
  countyRace("Augusta-Richmond County District Attorney", "Augusta Judicial Circuit DA.",
    [
      dCandidate("Jared Williams", true,
        "Augusta Judicial Circuit District Attorney focused on violent crime and justice in the Augusta area.",
        ["Violent Crime", "Justice Reform", "Victim Services"],
        ["Augusta Circuit DA (current term)", "Career Prosecutor"],
        -35),
    ]
  ),
  countyRace("Augusta-Richmond County Mayor", "Mayor of Augusta-Richmond County — consolidated city-county government.",
    [iCandidate("Incumbent Mayor", true, "Augusta-Richmond County has a consolidated city-county government. Check augustaga.gov for 2026 candidate information.", ["Economic Development", "Public Safety", "Infrastructure"], ["Augusta-Richmond Mayor (current term)"])],
    "Local"
  ),
  countyRace("Richmond County Board of Education", "Richmond County School System Board — non-partisan.",
    [iCandidate("Incumbent Board Member", true, "Check rcss.us for 2026 school board information.", ["Academic Achievement", "School Safety"], ["Richmond County Board of Education"])],
    "School Board"
  ),
]

const MUSCOGEE_RACES: BallotRace[] = [
  countyRace("Columbus-Muscogee County Sheriff", "Muscogee County Sheriff — Columbus area.",
    [iCandidate("Incumbent Sheriff", true, "Columbus-Muscogee consolidated government. Check columbusga.gov for 2026 candidate information.", ["Public Safety", "Community Policing"], ["Muscogee County Sheriff (current term)"])],
  ),
  countyRace("Columbus-Muscogee District Attorney", "Chattahoochee Judicial Circuit DA — Columbus area.",
    [iCandidate("Incumbent DA", true, "Check with the Chattahoochee Judicial Circuit for 2026 candidate information.", ["Public Safety", "Violent Crime", "Justice"], ["Chattahoochee Circuit DA (current term)"])],
  ),
  countyRace("Muscogee County School District Board", "Muscogee County School District Board — non-partisan.",
    [iCandidate("Incumbent Board Member", true, "Check mcsdga.net for 2026 school board candidate information.", ["Academic Excellence", "Career Readiness"], ["MCSD Board (current term)"])],
    "School Board"
  ),
]

const CLARKE_RACES: BallotRace[] = [
  countyRace("Clarke County Sheriff", "Clarke County Sheriff — Athens area.",
    [
      dCandidate("John Q. Williams", true,
        "Clarke County Sheriff serving the Athens area and University of Georgia community.",
        ["Community Policing", "Public Safety", "University Partnership"],
        ["Clarke County Sheriff (current term)", "Law enforcement veteran"],
        -35),
    ]
  ),
  countyRace("Western Judicial Circuit District Attorney", "Western Judicial Circuit DA — serves Clarke and Oconee counties.",
    [iCandidate("Incumbent DA", true, "Check with the Western Judicial Circuit for 2026 candidate information.", ["Public Safety", "Justice Reform"], ["Western Circuit DA (current term)"])],
  ),
  countyRace("Clarke County Commission Mayor-Chair", "Athens-Clarke County Mayor — consolidated government.",
    [iCandidate("Incumbent Mayor", true, "Athens-Clarke County has a consolidated government. Check athensclarkecounty.com for 2026 information.", ["UGA Partnership", "Affordable Housing", "Sustainability", "Transit"], ["Athens-Clarke County Mayor (current term)"])],
    "Local"
  ),
  countyRace("Clarke County Board of Education", "Clarke County Schools Board — non-partisan.",
    [iCandidate("Incumbent Board Member", true, "Check clarke.k12.ga.us for 2026 school board information.", ["Academic Achievement", "Equity", "Teacher Support"], ["Clarke County BOE (current term)"])],
    "School Board"
  ),
]

const BIBB_RACES: BallotRace[] = [
  countyRace("Bibb County Sheriff", "Bibb County Sheriff — Macon area.",
    [iCandidate("Incumbent Sheriff", true, "Check bibbcountyga.gov for 2026 candidate information.", ["Public Safety", "Community Policing", "Crime Reduction"], ["Bibb County Sheriff (current term)"])],
  ),
  countyRace("Macon-Bibb County Mayor", "Macon-Bibb County Mayor — consolidated government.",
    [iCandidate("Incumbent Mayor", true, "Macon-Bibb County has a consolidated government. Check maconbibb.us for 2026 candidate information.", ["Economic Development", "Public Safety", "Revitalization"], ["Macon-Bibb Mayor (current term)"])],
    "Local"
  ),
  countyRace("Bibb County Board of Education", "Bibb County Schools Board — non-partisan.",
    [iCandidate("Incumbent Board Member", true, "Check bcsga.net for 2026 school board information.", ["Academic Achievement", "Teacher Support", "School Safety"], ["Bibb County BOE (current term)"])],
    "School Board"
  ),
]

const LOWNDES_RACES: BallotRace[] = [
  countyRace("Lowndes County Sheriff", "Lowndes County Sheriff — Valdosta area.",
    [
      rCandidate("Ashley Paulk", true,
        "Lowndes County Sheriff serving the Valdosta area. Focused on public safety and drug enforcement.",
        ["Public Safety", "Drug Enforcement", "Community Policing"],
        ["Lowndes County Sheriff (current term)", "Law enforcement veteran"],
        65),
    ]
  ),
  countyRace("Lowndes County Commission Chair", "Lowndes County Commission Chair.",
    [iCandidate("Incumbent Chair", true, "Check lowndescounty.com for 2026 candidate information.", ["Public Safety", "Economic Development", "Infrastructure"], ["Lowndes County Commission (current term)"])],
  ),
  countyRace("Lowndes County Board of Education", "Lowndes County School System Board — non-partisan.",
    [iCandidate("Incumbent Board Member", true, "Check lcss.net for 2026 school board information.", ["Academic Excellence", "Career Readiness", "School Safety"], ["LCSS Board (current term)"])],
    "School Board"
  ),
]

export const COUNTY_DATA: Record<string, CountyData> = {
  "Fulton":    { county: "Fulton",    pollingInfo: "Fulton County Elections — (404) 612-7020 — fultoncountyga.gov/elections", countyRaces: FULTON_RACES },
  "Gwinnett":  { county: "Gwinnett",  pollingInfo: "Gwinnett County Elections — (770) 307-5300 — gwinnettcounty.com", countyRaces: GWINNETT_RACES },
  "Cobb":      { county: "Cobb",      pollingInfo: "Cobb County Elections — (770) 528-2581 — cobbcounty.org", countyRaces: COBB_RACES },
  "DeKalb":    { county: "DeKalb",    pollingInfo: "DeKalb County Elections — (404) 298-4020 — dekalbcountyga.gov", countyRaces: DEKALB_RACES },
  "Chatham":   { county: "Chatham",   pollingInfo: "Chatham County Elections — (912) 790-1520 — chathamcounty.org", countyRaces: CHATHAM_RACES },
  "Richmond":  { county: "Richmond",  pollingInfo: "Richmond County Elections — (706) 821-2340 — augustaga.gov", countyRaces: RICHMOND_RACES },
  "Muscogee":  { county: "Muscogee",  pollingInfo: "Muscogee County Elections — (706) 653-4374 — columbusga.gov", countyRaces: MUSCOGEE_RACES },
  "Clarke":    { county: "Clarke",    pollingInfo: "Athens-Clarke County Elections — (706) 613-3150 — athensclarkecounty.com", countyRaces: CLARKE_RACES },
  "Bibb":      { county: "Bibb",      pollingInfo: "Bibb County Elections — (478) 621-6526 — maconbibb.us", countyRaces: BIBB_RACES },
  "Lowndes":   { county: "Lowndes",   pollingInfo: "Lowndes County Elections — (229) 671-2400 — lowndescounty.com", countyRaces: LOWNDES_RACES },

  // Metro Atlanta additional counties
  "Cherokee":  basicCountyRaces("Cherokee",  "Canton",       "(678) 493-6470"),
  "Forsyth":   basicCountyRaces("Forsyth",   "Cumming",      "(770) 781-2115"),
  "Clayton":   basicCountyRaces("Clayton",   "Jonesboro",    "(770) 477-3351"),
  "Henry":     basicCountyRaces("Henry",     "McDonough",    "(770) 288-8020"),
  "Rockdale":  basicCountyRaces("Rockdale",  "Conyers",      "(770) 278-7333"),
  "Newton":    basicCountyRaces("Newton",    "Covington",    "(770) 784-2055"),
  "Paulding":  basicCountyRaces("Paulding",  "Dallas",       "(770) 443-7562"),
  "Fayette":   basicCountyRaces("Fayette",   "Fayetteville", "(770) 305-5408"),
  "Coweta":    basicCountyRaces("Coweta",    "Newnan",       "(770) 254-2620"),
  "Carroll":   basicCountyRaces("Carroll",   "Carrollton",   "(770) 830-5855"),
  "Douglas":   basicCountyRaces("Douglas",   "Douglasville", "(770) 920-7252"),
  "Hall":      basicCountyRaces("Hall",      "Gainesville",  "(770) 531-6945"),
  "Bartow":    basicCountyRaces("Bartow",    "Cartersville", "(770) 387-5025"),
  "Whitfield": basicCountyRaces("Whitfield", "Dalton",       "(706) 275-7550"),
  "Floyd":     basicCountyRaces("Floyd",     "Rome",         "(706) 291-5185"),
  "Columbia":  basicCountyRaces("Columbia",  "Appling",      "(706) 541-4012"),
  "Houston":   basicCountyRaces("Houston",   "Perry",        "(478) 542-2010"),
  "Glynn":     basicCountyRaces("Glynn",     "Brunswick",    "(912) 554-7737"),
  "Dougherty": basicCountyRaces("Dougherty", "Albany",       "(229) 431-2198"),
  "Thomas":    basicCountyRaces("Thomas",    "Thomasville",  "(229) 225-4109"),
  "Troup":     basicCountyRaces("Troup",     "LaGrange",     "(706) 883-1650"),
  "Spalding":  basicCountyRaces("Spalding",  "Griffin",      "(770) 467-4240"),
  "Catoosa":   basicCountyRaces("Catoosa",   "Ringgold",     "(706) 965-2500"),
  "Walker":    basicCountyRaces("Walker",    "LaFayette",    "(706) 638-1437"),
  "Gordon":    basicCountyRaces("Gordon",    "Calhoun",      "(706) 629-9848"),
  "Pickens":   basicCountyRaces("Pickens",   "Jasper",       "(706) 253-8718"),
  "Dawson":    basicCountyRaces("Dawson",    "Dawsonville",  "(706) 344-3507"),
  "Gilmer":    basicCountyRaces("Gilmer",    "Ellijay",      "(706) 635-4762"),
  "Fannin":    basicCountyRaces("Fannin",    "Blue Ridge",   "(706) 632-2039"),
  "Murray":    basicCountyRaces("Murray",    "Chatsworth",   "(706) 517-1566"),
  "Jackson":   basicCountyRaces("Jackson",   "Jefferson",    "(706) 367-6375"),
  "Barrow":    basicCountyRaces("Barrow",    "Winder",       "(770) 307-3008"),
  "Walton":    basicCountyRaces("Walton",    "Monroe",       "(770) 267-1354"),
  "Oconee":    basicCountyRaces("Oconee",    "Watkinsville", "(706) 769-5120"),
  "Haralson":  basicCountyRaces("Haralson",  "Buchanan",     "(770) 646-2020"),
  "Polk":      basicCountyRaces("Polk",      "Cedartown",    "(770) 748-3220"),
  "Chattooga": basicCountyRaces("Chattooga", "Summerville",  "(706) 857-0708"),
  "Upson":     basicCountyRaces("Upson",     "Thomaston",    "(706) 647-7012"),
  "Pike":      basicCountyRaces("Pike",      "Zebulon",      "(770) 567-2000"),
  "Lamar":     basicCountyRaces("Lamar",     "Barnesville",  "(770) 358-5145"),
  "Monroe":    basicCountyRaces("Monroe",    "Forsyth",      "(478) 994-7020"),
  "Jasper":    basicCountyRaces("Jasper",    "Monticello",   "(706) 468-4902"),
  "Putnam":    basicCountyRaces("Putnam",    "Eatonton",     "(706) 485-2731"),
  "Morgan":    basicCountyRaces("Morgan",    "Madison",      "(706) 342-3605"),
  "Greene":    basicCountyRaces("Greene",    "Greensboro",   "(706) 453-7082"),
  "Oglethorpe":basicCountyRaces("Oglethorpe","Lexington",    "(706) 743-5270"),
  "Wilkes":    basicCountyRaces("Wilkes",    "Washington",   "(706) 678-2423"),
  "Lincoln":   basicCountyRaces("Lincoln",   "Lincolnton",   "(706) 359-4207"),
  "Elbert":    basicCountyRaces("Elbert",    "Elberton",     "(706) 283-2000"),
  "Hart":      basicCountyRaces("Hart",      "Hartwell",     "(706) 376-2024"),
  "Franklin":  basicCountyRaces("Franklin",  "Carnesville",  "(706) 384-2483"),
  "Madison":   basicCountyRaces("Madison",   "Danielsville", "(706) 795-6320"),
  "Banks":     basicCountyRaces("Banks",     "Homer",        "(706) 677-6300"),
  "Habersham": basicCountyRaces("Habersham", "Clarkesville", "(706) 839-0400"),
  "Stephens":  basicCountyRaces("Stephens",  "Toccoa",       "(706) 886-1150"),
  "Rabun":     basicCountyRaces("Rabun",     "Clayton",      "(706) 782-3615"),
  "Towns":     basicCountyRaces("Towns",     "Hiawassee",    "(706) 896-2276"),
  "Union":     basicCountyRaces("Union",     "Blairsville",  "(706) 439-6025"),
  "Lumpkin":   basicCountyRaces("Lumpkin",   "Dahlonega",    "(706) 864-3748"),
  "White":     basicCountyRaces("White",     "Cleveland",    "(706) 865-2235"),
  "Bulloch":   basicCountyRaces("Bulloch",   "Statesboro",   "(912) 764-6245"),
  "Emanuel":   basicCountyRaces("Emanuel",   "Swainsboro",   "(478) 237-7091"),
  "Jenkins":   basicCountyRaces("Jenkins",   "Millen",       "(478) 982-2563"),
  "Screven":   basicCountyRaces("Screven",   "Sylvania",     "(912) 564-2424"),
  "Burke":     basicCountyRaces("Burke",     "Waynesboro",   "(706) 554-2324"),
  "Jefferson": basicCountyRaces("Jefferson", "Louisville",   "(478) 625-3332"),
  "Washington":basicCountyRaces("Washington","Sandersville", "(478) 552-2325"),
  "Johnson":   basicCountyRaces("Johnson",   "Wrightsville", "(478) 864-3325"),
  "Laurens":   basicCountyRaces("Laurens",   "Dublin",       "(478) 272-2674"),
  "Dodge":     basicCountyRaces("Dodge",     "Eastman",      "(478) 374-2871"),
  "Bleckley":  basicCountyRaces("Bleckley",  "Cochran",      "(478) 934-3204"),
  "Pulaski":   basicCountyRaces("Pulaski",   "Hawkinsville", "(478) 892-3164"),
  "Dooly":     basicCountyRaces("Dooly",     "Vienna",       "(229) 268-4228"),
  "Crisp":     basicCountyRaces("Crisp",     "Cordele",      "(229) 276-2635"),
  "Wilcox":    basicCountyRaces("Wilcox",    "Abbeville",    "(229) 467-2737"),
  "Ben Hill":  basicCountyRaces("Ben Hill",  "Fitzgerald",   "(229) 426-5100"),
  "Irwin":     basicCountyRaces("Irwin",     "Ocilla",       "(229) 468-9441"),
  "Tift":      basicCountyRaces("Tift",      "Tifton",       "(229) 386-7820"),
  "Turner":    basicCountyRaces("Turner",    "Ashburn",      "(229) 567-2010"),
  "Worth":     basicCountyRaces("Worth",     "Sylvester",    "(229) 776-8204"),
  "Colquitt":  basicCountyRaces("Colquitt",  "Moultrie",     "(229) 616-7410"),
  "Cook":      basicCountyRaces("Cook",      "Adel",         "(229) 896-7574"),
  "Berrien":   basicCountyRaces("Berrien",   "Nashville",    "(229) 686-5424"),
  "Brooks":    basicCountyRaces("Brooks",    "Quitman",      "(229) 263-5561"),
  "Grady":     basicCountyRaces("Grady",     "Cairo",        "(229) 377-1512"),
  "Decatur":   basicCountyRaces("Decatur",   "Bainbridge",   "(229) 248-3015"),
  "Seminole":  basicCountyRaces("Seminole",  "Donalsonville","(229) 524-2878"),
  "Early":     basicCountyRaces("Early",     "Blakely",      "(229) 723-4024"),
  "Miller":    basicCountyRaces("Miller",    "Colquitt",     "(229) 758-4117"),
  "Calhoun":   basicCountyRaces("Calhoun",   "Morgan",       "(229) 849-4835"),
  "Baker":     basicCountyRaces("Baker",     "Newton",       "(229) 734-3004"),
  "Mitchell":  basicCountyRaces("Mitchell",  "Camilla",      "(229) 336-2017"),
  "Lee":       basicCountyRaces("Lee",       "Leesburg",     "(229) 759-6015"),
  "Sumter":    basicCountyRaces("Sumter",    "Americus",     "(229) 928-4532"),
  "Webster":   basicCountyRaces("Webster",   "Preston",      "(229) 828-3525"),
  "Stewart":   basicCountyRaces("Stewart",   "Lumpkin",      "(229) 838-6665"),
  "Quitman":   basicCountyRaces("Quitman",   "Georgetown",   "(229) 334-2578"),
  "Randolph":  basicCountyRaces("Randolph",  "Cuthbert",     "(229) 732-2216"),
  "Terrell":   basicCountyRaces("Terrell",   "Dawson",       "(229) 995-2327"),
  "Clay":      basicCountyRaces("Clay",      "Fort Gaines",  "(229) 768-2631"),
  "Meriwether":basicCountyRaces("Meriwether","Greenville",   "(706) 672-1314"),
  "Heard":     basicCountyRaces("Heard",     "Franklin",     "(706) 675-3357"),
  "Harris":    basicCountyRaces("Harris",    "Hamilton",     "(706) 628-4958"),
  "Talbot":    basicCountyRaces("Talbot",    "Talbotton",    "(706) 665-8854"),
  "Taylor":    basicCountyRaces("Taylor",    "Butler",       "(478) 862-5521"),
  "Macon":     basicCountyRaces("Macon",     "Oglethorpe",   "(478) 472-8881"),
  "Schley":    basicCountyRaces("Schley",    "Ellaville",    "(229) 937-5581"),
  "Marion":    basicCountyRaces("Marion",    "Buena Vista",  "(229) 649-7511"),
  "Peach":     basicCountyRaces("Peach",     "Fort Valley",  "(478) 825-6953"),
  "Crawford":  basicCountyRaces("Crawford",  "Roberta",      "(478) 836-3328"),
  "Jones":     basicCountyRaces("Jones",     "Gray",         "(478) 986-6671"),
  "Twiggs":    basicCountyRaces("Twiggs",    "Jeffersonville","(478) 945-3629"),
  "Wilkinson": basicCountyRaces("Wilkinson", "Irwinton",     "(478) 946-2236"),
  "Baldwin":   basicCountyRaces("Baldwin",   "Milledgeville","(478) 445-4791"),
  "Hancock":   basicCountyRaces("Hancock",   "Sparta",       "(706) 444-5746"),
  "Warren":    basicCountyRaces("Warren",    "Warrenton",    "(706) 465-2262"),
  "Glascock":  basicCountyRaces("Glascock",  "Gibson",       "(478) 598-2038"),
  "McDuffie":  basicCountyRaces("McDuffie",  "Thomson",      "(706) 595-2130"),
  "Taliaferro":basicCountyRaces("Taliaferro","Crawfordville", "(706) 456-2233"),
  "Montgomery":basicCountyRaces("Montgomery","Mount Vernon", "(912) 583-2245"),
  "Wheeler":   basicCountyRaces("Wheeler",   "Alamo",        "(912) 568-7137"),
  "Telfair":   basicCountyRaces("Telfair",   "McRae-Helena", "(229) 868-5688"),
  "Jeff Davis":basicCountyRaces("Jeff Davis","Hazlehurst",   "(912) 375-6612"),
  "Appling":   basicCountyRaces("Appling",   "Baxley",       "(912) 367-8100"),
  "Wayne":     basicCountyRaces("Wayne",     "Jesup",        "(912) 427-5932"),
  "Pierce":    basicCountyRaces("Pierce",    "Blackshear",   "(912) 449-2022"),
  "Brantley":  basicCountyRaces("Brantley",  "Nahunta",      "(912) 462-5635"),
  "Ware":      basicCountyRaces("Ware",      "Waycross",     "(912) 287-4347"),
  "Clinch":    basicCountyRaces("Clinch",    "Homerville",   "(912) 487-5328"),
  "Echols":    basicCountyRaces("Echols",    "Statenville",  "(229) 559-5561"),
  "Lanier":    basicCountyRaces("Lanier",    "Lakeland",     "(229) 482-3588"),
  "Atkinson":  basicCountyRaces("Atkinson",  "Pearson",      "(912) 422-7381"),
  "Coffee":    basicCountyRaces("Coffee",    "Douglas",      "(912) 384-4799"),
  "Bacon":     basicCountyRaces("Bacon",     "Alma",         "(912) 632-5214"),
  "Toombs":    basicCountyRaces("Toombs",    "Lyons",        "(912) 526-8565"),
  "Tattnall":  basicCountyRaces("Tattnall",  "Reidsville",   "(912) 557-6716"),
  "Candler":   basicCountyRaces("Candler",   "Metter",       "(912) 685-5713"),
  "Evans":     basicCountyRaces("Evans",     "Claxton",      "(912) 739-3813"),
  "Treutlen":  basicCountyRaces("Treutlen",  "Soperton",     "(912) 529-4215"),
  "Liberty":   basicCountyRaces("Liberty",   "Hinesville",   "(912) 876-3625"),
  "Long":      basicCountyRaces("Long",      "Ludowici",     "(912) 545-2143"),
  "Bryan":     basicCountyRaces("Bryan",     "Pembroke",     "(912) 653-3897"),
  "Effingham": basicCountyRaces("Effingham", "Springfield",  "(912) 754-2121"),
  "McIntosh":  basicCountyRaces("McIntosh",  "Darien",       "(912) 437-6671"),
  "Camden":    basicCountyRaces("Camden",    "Woodbine",     "(912) 576-5601"),
  "Charlton":  basicCountyRaces("Charlton",  "Folkston",     "(912) 496-2246"),
  "Butts":         basicCountyRaces("Butts",         "Jackson",   "(770) 775-8200"),
  "Chattahoochee": basicCountyRaces("Chattahoochee", "Cusseta",   "(706) 989-3602"),
  "Dade":          basicCountyRaces("Dade",          "Trenton",   "(706) 657-4625"),
}

// ─── Zip → County Mapping ────────────────────────────────────────────────────

export const ZIP_TO_COUNTY: Record<string, string> = {
  // Fulton County (Atlanta)
  "30301":"Fulton","30302":"Fulton","30303":"Fulton","30304":"Fulton","30305":"Fulton",
  "30306":"Fulton","30307":"Fulton","30308":"Fulton","30309":"Fulton","30310":"Fulton",
  "30311":"Fulton","30312":"Fulton","30313":"Fulton","30314":"Fulton","30315":"Fulton",
  "30316":"Fulton","30317":"Fulton","30318":"Fulton","30319":"Fulton","30320":"Fulton",
  "30321":"Fulton","30322":"Fulton","30324":"Fulton","30325":"Fulton","30326":"Fulton",
  "30327":"Fulton","30328":"Fulton","30329":"Fulton","30330":"Fulton","30331":"Fulton",
  "30332":"Fulton","30333":"Fulton","30334":"Fulton","30336":"Fulton","30337":"Fulton",
  "30338":"Fulton","30339":"Fulton","30340":"Fulton","30341":"Fulton","30342":"Fulton",
  "30343":"Fulton","30344":"Fulton","30345":"Fulton","30346":"Fulton","30347":"Fulton",
  "30348":"Fulton","30349":"Fulton","30350":"Fulton","30353":"Fulton","30354":"Fulton",
  "30355":"Fulton","30356":"Fulton","30357":"Fulton","30358":"Fulton","30359":"Fulton",
  "30360":"Fulton","30361":"Fulton","30362":"Fulton","30363":"Fulton","30364":"Fulton",
  "30366":"Fulton","30368":"Fulton","30369":"Fulton","30370":"Fulton","30371":"Fulton",
  "30374":"Fulton","30375":"Fulton","30376":"Fulton","30377":"Fulton","30378":"Fulton",
  "30379":"Fulton","30380":"Fulton","30381":"Fulton","30384":"Fulton","30385":"Fulton",
  "30386":"Fulton","30387":"Fulton","30388":"Fulton","30389":"Fulton","30390":"Fulton",
  "30392":"Fulton","30394":"Fulton","30396":"Fulton","30398":"Fulton",
  // North Fulton / Sandy Springs / Alpharetta / Roswell
  "30004":"Cherokee","30005":"Forsyth","30009":"Fulton","30022":"Fulton",
  "30076":"Fulton","30077":"Fulton","30092":"Gwinnett","30097":"Fulton",

  // DeKalb County
  "30002":"DeKalb","30030":"DeKalb","30031":"DeKalb","30032":"DeKalb","30033":"DeKalb",
  "30034":"DeKalb","30035":"DeKalb","30036":"DeKalb","30037":"DeKalb","30038":"DeKalb",
  "30047":"DeKalb","30058":"DeKalb","30072":"DeKalb","30079":"DeKalb","30080":"Cobb",
  "30083":"DeKalb","30084":"DeKalb","30085":"DeKalb","30086":"DeKalb","30087":"DeKalb",
  "30088":"DeKalb","30093":"Gwinnett","30094":"Rockdale","30095":"Gwinnett",
  "30096":"Gwinnett",

  // Gwinnett County
  "30017":"Gwinnett","30019":"Gwinnett","30024":"Forsyth","30039":"Gwinnett",
  "30040":"Forsyth","30041":"Forsyth","30043":"Gwinnett","30044":"Gwinnett",
  "30045":"Gwinnett","30046":"Gwinnett","30048":"Gwinnett","30049":"Gwinnett",
  "30052":"Gwinnett","30078":"Gwinnett","30091":"Gwinnett",

  // Cobb County
  "30008":"Cobb","30060":"Cobb","30061":"Cobb","30062":"Cobb","30063":"Cobb",
  "30064":"Cobb","30065":"Cobb","30066":"Cobb","30067":"Cobb","30068":"Cobb",
  "30069":"Cobb","30082":"Cobb","30101":"Cherokee","30102":"Cherokee",
  "30106":"Cobb","30107":"Cherokee","30126":"Cobb","30127":"Paulding",
  "30132":"Paulding","30134":"Paulding","30152":"Cobb","30157":"Paulding",
  "30160":"Cobb","30168":"Cobb","30188":"Cherokee","30189":"Cherokee",

  // Cherokee County
  "30114":"Cherokee","30115":"Cherokee","30183":"Cherokee","30184":"Cherokee",

  // Forsyth County
  "30028":"Forsyth","30029":"Forsyth",

  // Hall County (Gainesville)
  "30501":"Hall","30503":"Hall","30504":"Hall","30506":"Hall","30507":"Hall",
  "30508":"Hall","30511":"Banks","30517":"Hall","30518":"Hall","30519":"Hall",
  "30542":"Hall","30543":"Hall","30566":"Hall","30567":"Hall",

  // Clayton County
  "30236":"Clayton","30237":"Clayton","30238":"Clayton","30260":"Clayton",
  "30274":"Clayton","30281":"Henry","30296":"Clayton","30297":"Clayton",

  // Henry County
  "30228":"Henry","30252":"Henry","30253":"Henry","30257":"Henry",

  // Rockdale County
  "30012":"Rockdale","30013":"Rockdale",

  // Newton County
  "30014":"Newton","30016":"Newton","30054":"Newton","30055":"Newton",

  // Fayette County
  "30214":"Fayette","30215":"Fayette","30216":"Fayette","30269":"Fayette",

  // Coweta County (Newnan)
  "30263":"Coweta","30264":"Coweta","30265":"Coweta",

  // Carroll County (Carrollton)
  "30116":"Carroll","30117":"Carroll","30118":"Carroll","30119":"Carroll",

  // Bartow County (Cartersville)
  "30120":"Bartow","30121":"Bartow",

  // Whitfield County (Dalton)
  "30720":"Whitfield","30721":"Whitfield","30722":"Whitfield","30740":"Whitfield",

  // Floyd County (Rome)
  "30161":"Floyd","30162":"Floyd","30163":"Floyd","30164":"Floyd","30165":"Floyd",

  // Gordon County (Calhoun)
  "30701":"Gordon","30703":"Gordon",

  // Murray County (Chatsworth)
  "30705":"Murray",

  // Catoosa County (Ringgold)
  "30736":"Catoosa","30741":"Catoosa","30742":"Catoosa",

  // Walker County (LaFayette)
  "30728":"Walker","30738":"Walker","30739":"Walker",

  // Dade County (Trenton)
  "30752":"Dade","30757":"Dade",

  // Chatham County (Savannah)
  "31401":"Chatham","31402":"Chatham","31403":"Chatham","31404":"Chatham",
  "31405":"Chatham","31406":"Chatham","31407":"Chatham","31408":"Chatham",
  "31409":"Chatham","31410":"Chatham","31411":"Chatham","31412":"Chatham",
  "31415":"Chatham","31416":"Chatham","31418":"Chatham","31419":"Chatham",
  "31421":"Chatham",

  // Effingham County
  "31302":"Effingham","31308":"Effingham","31329":"Effingham",

  // Bryan County
  "31321":"Bryan","31324":"Bryan",

  // Liberty County (Hinesville)
  "31313":"Liberty","31315":"Liberty",

  // Glynn County (Brunswick)
  "31520":"Glynn","31521":"Glynn","31522":"Glynn","31523":"Glynn",
  "31524":"Glynn","31525":"Glynn","31527":"Glynn",

  // Camden County (Kingsland/St. Marys)
  "31548":"Camden","31558":"Camden","31562":"Charlton","31569":"Camden",

  // Richmond County (Augusta)
  "30901":"Richmond","30903":"Richmond","30904":"Richmond","30905":"Richmond",
  "30906":"Richmond","30907":"Columbia","30908":"Richmond","30909":"Richmond",
  "30912":"Richmond","30914":"Richmond","30916":"Richmond","30917":"Columbia",

  // Columbia County (Evans/Grovetown)
  "30809":"Columbia","30813":"Columbia","30815":"Richmond",

  // Muscogee County (Columbus)
  "31901":"Muscogee","31902":"Muscogee","31903":"Muscogee","31904":"Muscogee",
  "31905":"Muscogee","31906":"Muscogee","31907":"Muscogee","31908":"Muscogee",
  "31909":"Muscogee","31917":"Muscogee",

  // Clarke County (Athens)
  "30601":"Clarke","30602":"Clarke","30603":"Clarke","30604":"Clarke",
  "30605":"Clarke","30606":"Clarke","30607":"Clarke","30608":"Clarke",
  "30609":"Clarke",

  // Jackson County
  "30549":"Jackson","30554":"Jackson",

  // Barrow County (Winder)
  "30680":"Barrow","30678":"Morgan",

  // Walton County (Monroe)
  "30655":"Walton","30656":"Walton","30666":"Walton",

  // Oconee County (Watkinsville)
  "30677":"Oconee",

  // Bibb County (Macon)
  "31201":"Bibb","31202":"Bibb","31203":"Bibb","31204":"Bibb","31205":"Bibb",
  "31206":"Bibb","31207":"Bibb","31208":"Bibb","31209":"Bibb","31210":"Bibb",
  "31211":"Bibb","31212":"Bibb","31213":"Bibb","31216":"Bibb","31217":"Bibb",
  "31220":"Bibb","31221":"Bibb",

  // Houston County (Warner Robins)
  "31088":"Houston","31093":"Houston","31095":"Houston","31098":"Houston","31099":"Houston",

  // Peach County (Fort Valley)
  "31030":"Peach",

  // Baldwin County (Milledgeville)
  "31061":"Baldwin","31062":"Baldwin",

  // Lowndes County (Valdosta)
  "31601":"Lowndes","31602":"Lowndes","31603":"Lowndes","31604":"Lowndes",
  "31605":"Lowndes","31606":"Lowndes",

  // Brooks County
  "31636":"Brooks",

  // Thomas County (Thomasville)
  "31757":"Thomas","31792":"Thomas",

  // Dougherty County (Albany)
  "31701":"Dougherty","31702":"Dougherty","31703":"Dougherty","31704":"Dougherty",
  "31705":"Dougherty","31706":"Dougherty","31707":"Dougherty","31708":"Dougherty",

  // Lee County (Leesburg)
  "31763":"Lee","31769":"Worth",

  // Tift County (Tifton)
  "31793":"Tift","31794":"Tift",

  // Colquitt County (Moultrie)
  "31768":"Colquitt","31788":"Colquitt",

  // Cook County (Adel)
  "31620":"Cook",

  // Berrien County (Nashville)
  "31639":"Berrien",

  // Bulloch County (Statesboro)
  "30458":"Bulloch","30459":"Bulloch","30460":"Bulloch","30461":"Bulloch",

  // Toombs County (Lyons)
  "30436":"Toombs","30474":"Toombs",

  // Emanuel County (Swainsboro)
  "30401":"Emanuel",

  // Laurens County (Dublin)
  "31021":"Laurens","31022":"Laurens","31023":"Laurens","31027":"Laurens",

  // Dodge County (Eastman)
  "31049":"Dodge",

  // Coffee County (Douglas)
  "31533":"Coffee","31534":"Coffee","31535":"Coffee",

  // Ware County (Waycross)
  "31501":"Ware","31502":"Ware","31503":"Ware",

  // Brantley County (Nahunta)
  "31553":"Brantley",

  // Pierce County (Blackshear)
  "31516":"Pierce",

  // Wayne County (Jesup)
  "31545":"Wayne","31546":"Wayne",

  // Appling County (Baxley)
  "31513":"Appling",

  // Jeff Davis County (Hazlehurst)
  "31539":"Jeff Davis",

  // Ben Hill County (Fitzgerald)
  "31750":"Ben Hill",

  // Irwin County (Ocilla)
  "31774":"Irwin",

  // Turner County (Ashburn)
  "31714":"Turner",

  // Worth County (Sylvester)
  "31791":"Worth",

  // Crisp County (Cordele)
  "31010":"Crisp","31015":"Crisp",

  // Sumter County (Americus)
  "31709":"Sumter","31719":"Sumter",

  // Butts County (Jackson)
  "30233":"Butts",

  // Spalding County (Griffin)
  "30223":"Spalding","30224":"Spalding",

  // Troup County (LaGrange)
  "30240":"Troup","30241":"Troup",

  // Heard County
  "30217":"Heard",

  // Haralson County
  "30110":"Haralson","30170":"Haralson",

  // Polk County (Cedartown)
  "30125":"Polk","30153":"Polk",

  // Chattooga County (Summerville)
  "30747":"Chattooga",

  // Pickens County (Jasper)
  "30143":"Pickens",

  // Dawson County (Dawsonville)
  "30534":"Dawson",

  // Gilmer County (Ellijay)
  "30536":"Gilmer","30540":"Gilmer",

  // Fannin County (Blue Ridge)
  "30513":"Fannin",

  // Towns County (Hiawassee)
  "30546":"Towns",

  // Union County (Blairsville)
  "30512":"Union",

  // Lumpkin County (Dahlonega)
  "30533":"Lumpkin",

  // White County (Cleveland)
  "30528":"White",

  // Habersham County (Clarkesville)
  "30523":"Habersham","30525":"Habersham","30537":"Habersham","30563":"Habersham",

  // Rabun County (Clayton)
  "30572":"Rabun",

  // Stephens County (Toccoa)
  "30577":"Stephens",

  // Hart County (Hartwell)
  "30643":"Hart",

  // Franklin County (Carnesville)
  "30521":"Franklin","30541":"Franklin",

  // Banks County (Homer)
  "30547":"Banks",

  // Madison County (Danielsville)
  "30633":"Madison",

  // Elbert County (Elberton)
  "30635":"Elbert",

  // Oglethorpe County (Lexington)
  "30648":"Oglethorpe",

  // Greene County (Greensboro)
  "30642":"Greene",

  // Morgan County (Madison)
  "30650":"Morgan",

  // Putnam County (Eatonton)
  "31024":"Putnam",

  // Jasper County (Monticello)
  "31064":"Jasper",

  // Monroe County (Forsyth)
  "31029":"Monroe",

  // Lamar County (Barnesville)
  "30204":"Lamar",

  // Pike County (Zebulon)
  "30295":"Pike",

  // Upson County (Thomaston)
  "30286":"Upson",

  // Meriwether County (Greenville)
  "30222":"Meriwether",

  // Talbot County
  "31827":"Talbot",

  // Harris County (Hamilton)
  "31811":"Harris",

  // Macon County (Oglethorpe)
  "31068":"Macon",

  // Taylor County (Butler)
  "31006":"Taylor",

  // Crawford County (Roberta)
  "31078":"Crawford",

  // Bibb adjacent
  "31066":"Monroe",

  // Jones County (Gray)
  "31032":"Jones",

  // Twiggs County (Jeffersonville)
  "31044":"Twiggs",

  // Wilkinson County (Irwinton)
  "31042":"Wilkinson",

  // Washington County (Sandersville)
  "31082":"Washington",

  // Jefferson County (Louisville)
  "30434":"Jefferson",

  // Burke County (Waynesboro)
  "30830":"Burke",

  // Screven County (Sylvania)
  "30467":"Screven",

  // Jenkins County (Millen)
  "30442":"Jenkins",

  // Candler County (Metter)
  "30439":"Candler",

  // Evans County (Claxton)
  "30417":"Evans",

  // Tattnall County (Reidsville)
  "30453":"Tattnall",

  // Treutlen County (Soperton)
  "30457":"Treutlen",

  // Montgomery County
  "30445":"Montgomery",

  // Wheeler County (Alamo)
  "30411":"Wheeler",

  // Johnson County (Wrightsville)
  "31096":"Johnson",

  // Bleckley County (Cochran)
  "31014":"Bleckley",

  // Pulaski County (Hawkinsville)
  "31036":"Pulaski",

  // Dooly County (Vienna)
  "31092":"Dooly",

  // Wilcox County (Abbeville)
  "31001":"Wilcox",

  // Telfair County
  "31055":"Telfair",

  // Atkinson County (Pearson)
  "31642":"Atkinson",

  // Clinch County (Homerville)
  "31634":"Clinch",

  // Echols County (Statenville)
  "31648":"Echols",

  // Lanier County (Lakeland)
  "31635":"Lanier",

  // Bacon County (Alma)
  "31510":"Bacon",

  // Grady County (Cairo)
  "31728":"Grady",

  // Decatur County (Bainbridge)
  "39817":"Decatur","39818":"Decatur","39819":"Decatur",

  // Seminole County (Donalsonville)
  "39845":"Seminole",

  // Early County (Blakely)
  "39823":"Early",

  // Miller County (Colquitt)
  "39837":"Miller",

  // Calhoun County (Morgan)
  "39866":"Calhoun",

  // Baker County (Newton)
  "39824":"Baker",

  // Clay County (Fort Gaines)
  "39851":"Clay",

  // Quitman County (Georgetown)
  "39854":"Quitman",

  // Randolph County (Cuthbert)
  "39840":"Randolph",

  // Terrell County (Dawson)
  "39842":"Terrell",

  // Chattahoochee County (Cusseta)
  "31805":"Chattahoochee",

  // Stewart County (Lumpkin)
  "31815":"Stewart",

  // Webster County (Preston)
  "31824":"Webster",

  // Schley County (Ellaville)
  "31806":"Schley",

  // Marion County (Buena Vista)
  "31803":"Marion",
}

// ─── Congressional district per county ───────────────────────────────────────

export const COUNTY_TO_CONGRESSIONAL: Record<string, string> = {
  // GA-1 Coastal/SE
  "Brantley":"GA-1","Bryan":"GA-1","Bulloch":"GA-1","Burke":"GA-1","Camden":"GA-1",
  "Candler":"GA-1","Charlton":"GA-1","Chatham":"GA-1","Clinch":"GA-1","Coffee":"GA-1",
  "Effingham":"GA-1","Evans":"GA-1","Glynn":"GA-1","Jenkins":"GA-1",
  "Liberty":"GA-1","Long":"GA-1","McIntosh":"GA-1","Pierce":"GA-1","Screven":"GA-1",
  "Tattnall":"GA-1","Toombs":"GA-1","Ware":"GA-1","Wayne":"GA-1",
  // GA-2 SW Georgia
  "Baker":"GA-2","Ben Hill":"GA-2","Berrien":"GA-2","Brooks":"GA-2","Calhoun":"GA-2",
  "Chattahoochee":"GA-2","Colquitt":"GA-2","Cook":"GA-2","Crisp":"GA-2","Decatur":"GA-2","Dougherty":"GA-2",
  "Early":"GA-2","Grady":"GA-2","Irwin":"GA-2","Lee":"GA-2","Lowndes":"GA-2",
  "Miller":"GA-2","Mitchell":"GA-2","Quitman":"GA-2","Randolph":"GA-2",
  "Seminole":"GA-2","Sumter":"GA-2","Terrell":"GA-2","Thomas":"GA-2","Tift":"GA-2",
  "Turner":"GA-2","Wilcox":"GA-2","Worth":"GA-2","Clay":"GA-2","Echols":"GA-2",
  "Lanier":"GA-2","Atkinson":"GA-2",
  // GA-3 West Georgia
  "Butts":"GA-3","Carroll":"GA-3","Coweta":"GA-3","Fayette":"GA-3","Haralson":"GA-3","Heard":"GA-3",
  "Lamar":"GA-3","Meriwether":"GA-3","Pike":"GA-3","Spalding":"GA-3","Troup":"GA-3","Upson":"GA-3",
  // GA-4 DeKalb/suburbs
  "DeKalb":"GA-4","Rockdale":"GA-4","Newton":"GA-4",
  // GA-5 Atlanta core
  // Fulton is split GA-5/GA-7 — we assign by zip in lookup function
  // GA-6 West metro (McBath) — Douglas plus parts of Cobb/Fulton (by zip)
  "Douglas":"GA-6",
  // GA-7 North metro (McCormick) — Forsyth, Cherokee, north Fulton (by zip), parts of Gwinnett
  "Cherokee":"GA-7","Forsyth":"GA-7","Gwinnett":"GA-7","Walton":"GA-7",
  // GA-8 Central GA
  "Bleckley":"GA-8","Dodge":"GA-8","Dooly":"GA-8","Emanuel":"GA-8","Houston":"GA-8",
  "Johnson":"GA-8","Laurens":"GA-8","Montgomery":"GA-8","Pulaski":"GA-8",
  "Telfair":"GA-8","Treutlen":"GA-8","Twiggs":"GA-8","Wheeler":"GA-8","Wilkinson":"GA-8",
  // GA-9 NE Mountains
  "Banks":"GA-9","Barrow":"GA-9","Dawson":"GA-9","Elbert":"GA-9","Fannin":"GA-9",
  "Franklin":"GA-9","Gilmer":"GA-9","Habersham":"GA-9","Hart":"GA-9","Jackson":"GA-9",
  "Lumpkin":"GA-9","Madison":"GA-9","Murray":"GA-9","Pickens":"GA-9","Rabun":"GA-9",
  "Stephens":"GA-9","Towns":"GA-9","Union":"GA-9","White":"GA-9","Whitfield":"GA-9",
  "Clarke":"GA-9",
  // GA-10 Augusta/NE
  "Columbia":"GA-10","Glascock":"GA-10","Greene":"GA-10","Hancock":"GA-10",
  "Jefferson":"GA-10","Lincoln":"GA-10","McDuffie":"GA-10","Morgan":"GA-10",
  "Oglethorpe":"GA-10","Richmond":"GA-10","Taliaferro":"GA-10","Warren":"GA-10",
  "Washington":"GA-10","Wilkes":"GA-10",
  // GA-11 NW Suburbs
  "Bartow":"GA-11","Catoosa":"GA-11","Chattooga":"GA-11","Cobb":"GA-11",
  "Gordon":"GA-11","Paulding":"GA-11","Polk":"GA-11","Walker":"GA-11",
  // GA-12 East Central
  "Appling":"GA-12","Bacon":"GA-12","Jeff Davis":"GA-12",
  // GA-13 South Atlanta suburbs
  "Clayton":"GA-13","Henry":"GA-13",
  // GA-14 NW Georgia
  "Floyd":"GA-14","Dade":"GA-14",
  // Fulton split handled in lookup function (30309 area = GA-5, north Fulton = GA-7)
  "Fulton":"GA-5", // default; zip lookup will refine
}

// North Fulton zips (Sandy Springs, Alpharetta, Roswell, Johns Creek area) → GA-7 (McCormick)
const NORTH_FULTON_ZIPS = new Set([
  "30004","30005","30009","30022","30076","30077","30097",
  "30326","30327","30328","30338","30339","30342","30346","30350",
])

// ─── Main Lookup Function ────────────────────────────────────────────────────

export function getBallotForZip(zip: string): {
  found: boolean
  county: string
  location: string
  congressionalDistrict: string
  races: BallotRace[]
  pollingInfo: string
  sosLink: string
} {
  const county = ZIP_TO_COUNTY[zip]

  if (!county) {
    return {
      found: false,
      county: "Unknown",
      location: `Georgia ${zip}`,
      congressionalDistrict: "Unknown",
      races: STATEWIDE_RACES,
      pollingInfo: "Visit mvp.sos.ga.gov to find your specific polling location.",
      sosLink: "https://mvp.sos.ga.gov",
    }
  }

  // Determine congressional district (refine Fulton by zip)
  let cd = COUNTY_TO_CONGRESSIONAL[county] || "Unknown"
  if (county === "Fulton" && NORTH_FULTON_ZIPS.has(zip)) cd = "GA-7"
  else if (county === "Fulton") cd = "GA-5"

  const countyData = COUNTY_DATA[county]
  const congressionalRace = CONGRESSIONAL_RACES[cd]

  const races: BallotRace[] = [
    ...STATEWIDE_RACES,
    ...(congressionalRace ? [congressionalRace] : []),
    ...(countyData ? countyData.countyRaces : []),
  ]

  return {
    found: true,
    county,
    location: `${county} County, GA ${zip}`,
    congressionalDistrict: cd,
    races,
    pollingInfo: countyData?.pollingInfo || `Visit mvp.sos.ga.gov to find your ${county} County polling location.`,
    sosLink: "https://mvp.sos.ga.gov",
  }
}
