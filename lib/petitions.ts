import { countySlug, getAllCountyNames } from "@/lib/county-utils";

/* Shared constants + helpers for standalone Georgia petitions.
   Petitions live in the existing `group_petitions` table; a standalone
   petition simply has group_id = NULL plus the targeting fields added in the
   extend_petitions_for_standalone migration. Signatures use the shared
   `petition_signatures` table (name + email; PII kept private by RLS). */

export const PETITION_TARGET_TYPES: { value: string; label: string }[] = [
  { value: "school_board", label: "School Board" },
  { value: "county_commissioner", label: "County Commissioner" },
  { value: "city_council", label: "City Council" },
  { value: "mayor", label: "Mayor" },
  { value: "state_legislator", label: "State Representative" },
  { value: "state_senator", label: "State Senator" },
  { value: "us_representative", label: "U.S. Representative" },
  { value: "us_senator", label: "U.S. Senator" },
  { value: "other", label: "Other Official or Body" },
];

export const PETITION_CATEGORIES: { value: string; label: string }[] = [
  { value: "education", label: "Education" },
  { value: "environment", label: "Environment" },
  { value: "public_safety", label: "Public Safety" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "voting_rights", label: "Voting Rights" },
  { value: "housing", label: "Housing" },
  { value: "healthcare", label: "Healthcare" },
  { value: "local_government", label: "Local Government" },
  { value: "other", label: "Other" },
];

export function targetTypeLabel(v: string | null | undefined): string {
  return PETITION_TARGET_TYPES.find((t) => t.value === v)?.label ?? "Official";
}
export function categoryLabel(v: string | null | undefined): string {
  return PETITION_CATEGORIES.find((c) => c.value === v)?.label ?? "Other";
}

/* slug ⇄ canonical county name, derived from the existing county list so we
   never hardcode (and get "DeKalb" capitalization right). */
export const GEORGIA_COUNTY_NAMES: string[] = getAllCountyNames();
const SLUG_TO_NAME = new Map(GEORGIA_COUNTY_NAMES.map((n) => [countySlug(n), n]));

export function countyDisplayName(slug: string | null | undefined): string | null {
  if (!slug) return null;
  return (
    SLUG_TO_NAME.get(slug) ??
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

/* Top 20 Georgia counties by population — get their own indexable hub pages. */
export const TOP_COUNTY_SLUGS: string[] = [
  "fulton", "gwinnett", "cobb", "dekalb", "cherokee", "forsyth", "hall",
  "richmond", "clayton", "henry", "columbia", "chatham", "carroll", "coweta",
  "paulding", "houston", "muscogee", "newton", "lowndes", "fayette",
];

export function petitionSlugify(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "petition";
}

export interface PetitionRow {
  id: string;
  title: string;
  description: string | null;
  summary: string | null;
  target: string | null;
  target_type: string | null;
  target_district: string | null;
  county_slug: string | null;
  category: string | null;
  goal: number;
  signature_count: number;
  share_slug: string | null;
  creator_name: string | null;
  created_at: string;
}

export const PETITION_SELECT =
  "id, title, description, summary, target, target_type, target_district, county_slug, category, goal, signature_count, share_slug, creator_name, created_at";

export const PETITION_FAQ = [
  {
    q: "How do I start a free petition in Georgia?",
    a: "On MyVote you can start a free Georgia petition in a few minutes. Create a free account, click Start a Petition, write your title and the change you want, choose the official or body you're petitioning, and publish. Your petition gets its own shareable link immediately.",
  },
  {
    q: "Who can I target with a Georgia petition?",
    a: "MyVote petitions can target Georgia state representatives and senators, U.S. House members and senators, county commissioners, school boards, mayors, and city councils. You choose the specific official or body when you create the petition.",
  },
  {
    q: "Is MyVote's petition tool really free?",
    a: "Yes. Creating and hosting petitions on MyVote is completely free — no signup fees, no per-signature charges, and no premium tier required to collect signatures. MyVote is independently funded with no political advertisers.",
  },
  {
    q: "How is MyVote different from Change.org for Georgia petitions?",
    a: "MyVote is built specifically for Georgia voters and Georgia officials. Your petition sits alongside Georgia's 2026 ballot races, county-level civic groups, and local voter community, so your signatures come from Georgians who are already engaged in local politics.",
  },
  {
    q: "Do signers' email addresses show publicly?",
    a: "No. Signing requires a name and email, but the email is kept private — it is never shown publicly and is only used to verify the signature. Only the signature count and, where shown, signer names are public.",
  },
];
