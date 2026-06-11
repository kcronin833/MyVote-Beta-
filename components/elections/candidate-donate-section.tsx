"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-context"
import { createClient } from "@/lib/supabase/client"
import { DonorboxWidget } from "@/components/elections/donorbox-widget"
import { ExternalLink, Pencil, Check, X, AlertTriangle } from "lucide-react"
import { C } from "@/lib/design-tokens"

interface CandidateProfile {
  slug: string
  verified: boolean
  donorbox_campaign_url: string | null
  claimant_user_id: string | null
}

function isValidDonorboxUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return (
      (u.protocol === "https:" || u.protocol === "http:") &&
      u.hostname === "donorbox.org" &&
      u.pathname.length > 1
    )
  } catch {
    return false
  }
}

export function CandidateDonateSection({
  slug,
  candidateName,
}: {
  slug: string
  candidateName: string
}) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<CandidateProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Edit state (only for verified claimant)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState("")
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveOk, setSaveOk] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("candidate_profiles")
      .select("slug, verified, donorbox_campaign_url, claimant_user_id")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        setProfile(data ?? null)
        setLoading(false)
      })
  }, [slug])

  const isClaimant =
    user && profile?.claimant_user_id && user.id === profile.claimant_user_id
  const hasUrl = !!profile?.donorbox_campaign_url

  async function saveUrl() {
    setSaveError(null)
    setSaveOk(false)
    const url = draft.trim()
    if (!isValidDonorboxUrl(url)) {
      setSaveError("Enter a valid Donorbox URL (e.g. https://donorbox.org/your-campaign)")
      return
    }
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from("candidate_profiles")
      .update({ donorbox_campaign_url: url })
      .eq("slug", slug)
      .eq("claimant_user_id", user!.id)
    setSaving(false)
    if (error) {
      setSaveError("Could not save. Try again.")
    } else {
      setProfile((p) => p ? { ...p, donorbox_campaign_url: url } : p)
      setSaveOk(true)
      setEditing(false)
    }
  }

  // Nothing to show while loading or if not claimed at all
  if (loading) return null
  if (!profile) return null

  // If not verified and not the claimant, nothing to render
  if (!profile.verified && !isClaimant) return null

  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.rule}`,
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 2px 10px rgba(20,24,40,0.07), 0 1px 2px rgba(20,24,40,0.04)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink900 }}>
          Support this campaign
        </div>
        {isClaimant && profile.verified && (
          <button
            onClick={() => {
              setDraft(profile.donorbox_campaign_url ?? "")
              setSaveError(null)
              setSaveOk(false)
              setEditing((e) => !e)
            }}
            title="Edit Donorbox link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              background: "transparent",
              border: `1px solid ${C.rule}`,
              borderRadius: 6,
              padding: "4px 8px",
              fontSize: 11.5,
              fontWeight: 600,
              color: C.ink500,
              cursor: "pointer",
            }}
          >
            <Pencil size={11} />
            Edit link
          </button>
        )}
      </div>

      {/* Verified claimant — no URL yet, or editing */}
      {isClaimant && profile.verified && (editing || !hasUrl) && (
        <div style={{ marginBottom: hasUrl ? 12 : 0 }}>
          {!hasUrl && !editing && (
            <p style={{ fontSize: 12.5, color: C.ink700, marginBottom: 10, lineHeight: 1.5 }}>
              Add your Donorbox campaign link to enable donations directly from your profile.
            </p>
          )}
          <p style={{ fontSize: 11.5, color: C.ink500, marginBottom: 6 }}>
            Paste your Donorbox campaign URL:
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <input
              type="url"
              placeholder="https://donorbox.org/your-campaign"
              value={draft}
              onChange={(e) => { setDraft(e.target.value); setSaveError(null) }}
              style={{
                flex: 1,
                minWidth: 180,
                height: 36,
                borderRadius: 7,
                border: `1px solid ${saveError ? C.red : C.rule}`,
                background: C.shade,
                color: C.ink900,
                padding: "0 10px",
                fontSize: 12.5,
                outline: "none",
              }}
            />
            <button
              onClick={saveUrl}
              disabled={saving}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                height: 36,
                borderRadius: 7,
                background: C.teal,
                color: "#fff",
                border: "none",
                padding: "0 14px",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: saving ? "default" : "pointer",
                opacity: saving ? 0.75 : 1,
              }}
            >
              <Check size={13} />
              {saving ? "Saving…" : "Save"}
            </button>
            {editing && (
              <button
                onClick={() => setEditing(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 36,
                  borderRadius: 7,
                  background: "transparent",
                  border: `1px solid ${C.rule}`,
                  color: C.ink500,
                  padding: "0 10px",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>
          {saveError && (
            <p style={{ fontSize: 11.5, color: C.red, marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
              <AlertTriangle size={12} /> {saveError}
            </p>
          )}
          {saveOk && (
            <p style={{ fontSize: 11.5, color: C.teal, marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
              <Check size={12} /> Donation link saved.
            </p>
          )}
          {/* Link to Donorbox account setup */}
          {!hasUrl && (
            <p style={{ fontSize: 11, color: C.ink500, marginTop: 8, lineHeight: 1.4 }}>
              Don't have a Donorbox account?{" "}
              <a
                href="https://donorbox.org/nonprofit-fundraising-software"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: C.teal, fontWeight: 600, textDecoration: "none" }}
              >
                Set one up free →
              </a>
            </p>
          )}
        </div>
      )}

      {/* Pending verification — claimant can see status */}
      {isClaimant && !profile.verified && (
        <div
          style={{
            background: C.amberSoft,
            border: `1px solid ${C.amberBorder}`,
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 12.5,
            color: C.amber,
            lineHeight: 1.5,
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
          }}
        >
          <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            Your claim is under review. Once the MyVote team verifies your identity, you'll
            be able to add your Donorbox campaign link here.
          </span>
        </div>
      )}

      {/* Donate widget — shown when verified + URL set */}
      {profile.verified && hasUrl && !editing && (
        <>
          <DonorboxWidget
            campaignUrl={profile.donorbox_campaign_url!}
            candidateName={candidateName}
          />
          <p
            style={{
              fontSize: 10.5,
              color: C.ink500,
              marginTop: 8,
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            Donations processed securely by{" "}
            <a
              href="https://donorbox.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.teal, textDecoration: "none", fontWeight: 600 }}
            >
              Donorbox
              <ExternalLink size={9} style={{ display: "inline", marginLeft: 2, verticalAlign: "middle" }} />
            </a>
          </p>
        </>
      )}
    </div>
  )
}
