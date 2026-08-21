"use client";

import { useState } from "react";
import type { PortalFeed, PortalMeeting } from "@/lib/primegov";

const C = {
  card: "#FFFFFF", rule: "#E9EBEF", ink900: "#030213", ink700: "#3D435A",
  ink500: "#717182", ink400: "#8B8FA3", teal: "#030213", tealDk: "#030213", tealSoft: "#EFEFF3",
};

export interface MeetingRow {
  id: string;
  body_name: string;
  meeting_date: string | null;
  source_url: string | null;
  bullets: string[];
  synopsis: string | null;
  created_at: string;
}

function fmtDate(d: string | null): string {
  if (!d) return "";
  const dt = new Date(`${d}T12:00:00`);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
}

export function GroupMeetings({
  groupId,
  defaultBody,
  initialMeetings,
  isAdmin,
  portalFeed,
  cityLabel,
}: {
  groupId: string;
  defaultBody: string;
  initialMeetings: MeetingRow[];
  isAdmin: boolean;
  portalFeed?: PortalFeed | null;
  cityLabel?: string | null;
}) {
  const [meetings, setMeetings] = useState<MeetingRow[]>(initialMeetings);
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState(defaultBody);
  const [date, setDate] = useState("");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    if (busy) return;
    if (!body.trim()) { setErr("Name the body (e.g. Brookhaven City Council)."); return; }
    if (text.trim().length < 40) { setErr("Paste the agenda or minutes text."); return; }
    setBusy(true); setErr(null);
    try {
      const res = await fetch("/api/meetings/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ group_id: groupId, body_name: body.trim(), meeting_date: date || null, source_url: url.trim() || null, raw_text: text }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || "Couldn't add the meeting."); setBusy(false); return; }
      setMeetings((m) => [data.meeting as MeetingRow, ...m]);
      setDate(""); setUrl(""); setText(""); setOpen(false);
    } catch {
      setErr("Network error — try again.");
    }
    setBusy(false);
  }

  const upcoming = portalFeed?.upcoming ?? [];
  const recent = portalFeed?.recent ?? [];
  const hasAny = upcoming.length > 0 || recent.length > 0 || meetings.length > 0;

  return (
    <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 14, boxShadow: "0 2px 10px rgba(20,24,40,0.07)", padding: "16px 18px", marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: C.ink900, margin: 0 }}>Meetings</h2>
        {isAdmin && (
          <button
            onClick={() => { setOpen((o) => !o); setErr(null); }}
            style={{ height: 30, padding: "0 12px", borderRadius: 999, border: `1.5px solid ${C.rule}`, background: "transparent", color: C.tealDk, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
          >
            {open ? "Cancel" : "+ Add a meeting"}
          </button>
        )}
      </div>
      <p style={{ fontSize: 12, color: C.ink500, margin: "0 0 12px", lineHeight: 1.5 }}>
        When the body met, what was on the docket, and a plain-English summary of what was decided.
      </p>

      {isAdmin && open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14, padding: 12, background: "#fff", border: `1px solid ${C.rule}`, borderRadius: 10 }}>
          <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body — e.g. Brookhaven City Council" style={inp} />
          <div style={{ display: "flex", gap: 8 }}>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ ...inp, flex: 1 }} />
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Source link (agenda/minutes URL)" style={{ ...inp, flex: 2 }} />
          </div>
          <textarea value={text} onChange={(e) => { setText(e.target.value); if (err) setErr(null); }} rows={6} placeholder="Paste the meeting agenda or minutes text here. The AI summarizes only what you paste." style={{ ...inp, height: "auto", padding: "8px 12px", resize: "vertical", lineHeight: 1.5, fontFamily: "inherit" }} />
          {err && <div style={errBox}>{err}</div>}
          <button onClick={submit} disabled={busy} style={{ alignSelf: "flex-start", height: 36, padding: "0 18px", borderRadius: 999, border: "none", background: busy ? "#E9EBEF" : C.teal, color: busy ? "#8B8FA3" : "#fff", fontSize: 13, fontWeight: 700, cursor: busy ? "default" : "pointer" }}>
            {busy ? "Summarizing…" : "Generate summary & publish"}
          </button>
        </div>
      )}

      {!hasAny && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.tealSoft, border: "1px solid #D9DCE3", borderRadius: 10, padding: "12px 14px" }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, textTransform: "uppercase", color: "#fff", background: C.tealDk, borderRadius: 999, padding: "3px 9px", flexShrink: 0 }}>Coming soon</span>
          <p style={{ fontSize: 12.5, color: C.ink700, margin: 0, lineHeight: 1.5 }}>
            Meeting dates, agendas, and plain-English AI summaries of what was decided will appear here soon.
          </p>
        </div>
      )}

      {upcoming.length > 0 && (
        <div style={{ marginBottom: recent.length || meetings.length ? 16 : 0 }}>
          <SubHead>Upcoming</SubHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {upcoming.map((m) => <ScheduleRow key={m.id} m={m} upcoming />)}
          </div>
        </div>
      )}

      {recent.length > 0 && (
        <div style={{ marginBottom: meetings.length ? 16 : 0 }}>
          <SubHead>Recent</SubHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recent.map((m) => <ScheduleRow key={m.id} m={m} />)}
          </div>
        </div>
      )}

      {meetings.length > 0 && (
        <div>
          <SubHead>What was said · AI summaries</SubHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {meetings.map((m) => (
              <div key={m.id} style={{ border: `1px solid ${C.rule}`, borderRadius: 12, padding: "14px 16px", background: "#fff" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                  <h3 style={{ fontSize: 14.5, fontWeight: 700, color: C.ink900, margin: 0 }}>{m.body_name}</h3>
                  {m.meeting_date && <span style={{ fontSize: 12, fontWeight: 600, color: C.tealDk }}>{fmtDate(m.meeting_date)}</span>}
                </div>

                {m.bullets?.length > 0 && (
                  <ul style={{ margin: "0 0 10px", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
                    {m.bullets.map((b, i) => (
                      <li key={i} style={{ fontSize: 13, color: C.ink700, lineHeight: 1.5 }}>{b}</li>
                    ))}
                  </ul>
                )}

                {m.synopsis && (
                  <div style={{ background: C.tealSoft, border: "1px solid #D9DCE3", borderRadius: 10, padding: "10px 12px", marginBottom: m.source_url ? 8 : 0 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, textTransform: "uppercase", color: C.tealDk, marginBottom: 3 }}>AI summary · what was said</div>
                    <p style={{ fontSize: 13, color: C.ink700, lineHeight: 1.6, margin: 0 }}>{m.synopsis}</p>
                  </div>
                )}

                {m.source_url && (
                  <a href={m.source_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 600, color: C.teal, textDecoration: "none" }}>
                    View the official agenda / minutes ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {portalFeed && (upcoming.length > 0 || recent.length > 0) && (
        <p style={{ fontSize: 10.5, color: C.ink400, margin: "12px 0 0", lineHeight: 1.5 }}>
          Schedule pulled live from the official {cityLabel ? `${cityLabel} ` : ""}meeting portal.{" "}
          <a href={portalFeed.portalUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.teal, fontWeight: 600, textDecoration: "none" }}>
            Open the portal for agendas &amp; minutes ↗
          </a>
        </p>
      )}

      {meetings.length > 0 && (
        <p style={{ fontSize: 10.5, color: C.ink400, margin: "6px 0 0", lineHeight: 1.5 }}>
          Summaries are AI-generated from the official meeting documents. Always verify against the source.
        </p>
      )}
    </div>
  );
}

function SubHead({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: C.ink400, margin: "0 0 8px" }}>
      {children}
    </div>
  );
}

function ScheduleRow({ m, upcoming }: { m: PortalMeeting; upcoming?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, border: `1px solid ${C.rule}`, borderRadius: 10, padding: "10px 12px", background: "#fff" }}>
      <div style={{ flexShrink: 0, textAlign: "center", minWidth: 46 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: upcoming ? C.tealDk : C.ink500, textTransform: "uppercase", letterSpacing: 0.3 }}>
          {m.dateLabel.split(" ")[0]}
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.ink900, lineHeight: 1 }}>
          {m.dateLabel.split(" ")[1]?.replace(",", "")}
        </div>
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: 13.5, fontWeight: 700, color: C.ink900, margin: 0, lineHeight: 1.35 }}>{m.title}</p>
        <p style={{ fontSize: 11.5, color: C.ink500, margin: "2px 0 0" }}>
          {m.timeLabel}{m.location ? ` · ${m.location}` : ""}
        </p>
        {m.docs.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
            {m.docs.map((d) => (
              <span key={d.kind} style={{ fontSize: 10, fontWeight: 700, color: C.tealDk, background: C.tealSoft, border: "1px solid #D9DCE3", borderRadius: 999, padding: "1px 7px" }}>
                {d.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const inp: React.CSSProperties = { height: 36, padding: "0 12px", borderRadius: 8, border: "1px solid #E9EBEF", fontSize: 13, color: "#030213", outline: "none", background: "#fff", width: "100%" };
const errBox: React.CSSProperties = { fontSize: 12, color: "#D4183D", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "7px 10px", lineHeight: 1.4 };
