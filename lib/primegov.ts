/* PrimeGov public meeting feed.
 *
 * Georgia cities that run PrimeGov (e.g. Brookhaven) expose a fully public,
 * no-auth JSON API for their meeting portal. We use it to auto-populate a
 * group's Meetings panel with the REAL, always-current schedule — dates,
 * times, the body, location, and which documents (agenda / minutes / packet)
 * have been published — straight from the city's own system. Because it's the
 * authoritative source, showing it live is the most accurate option (no human
 * transcription, nothing pulled from memory — see the project accuracy rule).
 *
 * Note: the agenda/minutes DOCUMENT text is served through an encrypted image
 * viewer, so it can't be auto-extracted for AI summarization. The "what was
 * said" synopsis is added separately by an admin pasting the text (see
 * lib/meeting-ai.ts). This file only handles the public schedule + metadata.
 */

export interface PortalDoc {
  kind: "agenda" | "minutes" | "packet" | "other";
  label: string;
}

export interface PortalMeeting {
  id: number;
  title: string;
  committeeId: number;
  dateTime: string; // ISO
  dateLabel: string; // "Aug 05, 2026"
  timeLabel: string; // "07:00 PM"
  location: string | null;
  docs: PortalDoc[];
}

export interface PortalFeed {
  upcoming: PortalMeeting[];
  recent: PortalMeeting[];
  portalUrl: string;
}

interface RawDoc {
  templateName?: string | null;
  publishStatus?: number;
}
interface RawMeeting {
  id: number;
  committeeId: number;
  dateTime: string;
  date?: string;
  time?: string;
  title?: string;
  location?: string | null;
  documentList?: RawDoc[];
}

function classifyDocs(list: RawDoc[] | undefined): PortalDoc[] {
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  const out: PortalDoc[] = [];
  for (const d of list) {
    const name = (d.templateName || "").toLowerCase();
    let kind: PortalDoc["kind"];
    let label: string;
    if (name.includes("minutes")) { kind = "minutes"; label = "Minutes"; }
    else if (name.includes("agenda")) { kind = "agenda"; label = "Agenda"; }
    else if (name.includes("packet")) { kind = "packet"; label = "Packet"; }
    else continue; // skip notices / cancellations / unknown
    if (seen.has(kind)) continue; // collapse HTML + PDF variants into one
    seen.add(kind);
    out.push({ kind, label });
  }
  return out;
}

function toMeeting(r: RawMeeting): PortalMeeting {
  return {
    id: r.id,
    title: (r.title || "Meeting").trim(),
    committeeId: r.committeeId,
    dateTime: r.dateTime,
    dateLabel: r.date || "",
    timeLabel: r.time || "",
    location: r.location || null,
    docs: classifyDocs(r.documentList),
  };
}

async function getJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 3600 }, // refresh hourly; the schedule rarely changes
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetch the public meeting schedule for a PrimeGov tenant, limited to the given
 * committee IDs (e.g. City Council + Planning Commission). Returns a few
 * upcoming and a few recent-past meetings. Never throws — on any failure it
 * returns empty lists so the caller can render gracefully.
 */
export async function getPortalFeed(
  tenant: string,
  committeeIds: number[]
): Promise<PortalFeed> {
  const base = `https://${tenant}.primegov.com`;
  const portalUrl = `${base}/public/portal`;
  const wanted = new Set(committeeIds);
  const now = Date.now();

  const [upcomingRaw, archivedRaw] = await Promise.all([
    getJson(`${base}/api/v2/PublicPortal/ListUpcomingMeetings`),
    getJson(`${base}/api/v2/PublicPortal/ListArchivedMeetings?year=${new Date().getFullYear()}`),
  ]);

  const upcoming = (Array.isArray(upcomingRaw) ? (upcomingRaw as RawMeeting[]) : [])
    .filter((m) => wanted.has(m.committeeId) && m.dateTime)
    .map(toMeeting)
    .filter((m) => new Date(m.dateTime).getTime() >= now - 6 * 3600 * 1000) // include today's, drop long-past
    .sort((a, b) => +new Date(a.dateTime) - +new Date(b.dateTime))
    .slice(0, 6);

  const recent = (Array.isArray(archivedRaw) ? (archivedRaw as RawMeeting[]) : [])
    .filter((m) => wanted.has(m.committeeId) && m.dateTime)
    .map(toMeeting)
    .filter((m) => new Date(m.dateTime).getTime() < now && m.docs.length > 0) // past + has a real document
    .sort((a, b) => +new Date(b.dateTime) - +new Date(a.dateTime))
    .slice(0, 4);

  return { upcoming, recent, portalUrl };
}
