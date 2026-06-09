import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CandidatePhoto } from "@/components/elections/candidate-photo"
import { ARCHETYPES, type ArchetypeKey } from "@/lib/quiz-engine"
import { ARCHETYPE_PROFILE_DATA } from "@/lib/civic-profile-data"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Civic Profile Types",
  description:
    "Explore all 8 MyVote civic profile types — from Institutional Skeptic to Civic Pragmatist — and discover which historical figures shared your values.",
  robots: { index: true, follow: true },
}

// Gradient per archetype
const GRADIENTS: Record<ArchetypeKey, string> = {
  institutional_skeptic:    "from-slate-800 to-slate-600",
  freedom_first:            "from-amber-700 to-amber-500",
  public_safety:            "from-blue-800 to-blue-600",
  local_impact:             "from-emerald-800 to-emerald-600",
  independent_localist:     "from-violet-800 to-violet-600",
  community_builder:        "from-teal-800 to-teal-600",
  national_policy_watcher:  "from-indigo-800 to-indigo-600",
  civic_pragmatist:         "from-stone-700 to-stone-500",
}

const ARCHETYPE_ORDER: ArchetypeKey[] = [
  "civic_pragmatist",
  "freedom_first",
  "community_builder",
  "institutional_skeptic",
  "local_impact",
  "national_policy_watcher",
  "public_safety",
  "independent_localist",
]

export default function CivicProfilesPage() {
  return (
    <div className="min-h-screen bg-paper-100">

      {/* ── Back to Home ── */}
      <div className="border-b border-rule bg-card">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 transition-colors py-2.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="bg-ink-900 text-white">
        <div className="container mx-auto px-4 py-14 text-center max-w-3xl">
          <p className="text-teal-400 text-sm font-bold uppercase tracking-widest mb-3">
            MyVote Civic Profiles
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif leading-tight mb-5">
            What kind of civic voice are you?
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            MyVote uses 12 questions to map you to one of 8 civic profiles — each
            reflecting a distinct set of values about government, freedom, and
            community. Below you'll find every profile, the research behind it, and
            the historical figures who embodied it.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/quiz">
              <Button className="bg-teal-600 hover:bg-teal-500 text-white font-semibold h-11 px-7 text-base">
                Take the quiz — find your profile
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-11 px-7 text-base">
                View my profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Science intro ── */}
      <div className="bg-white border-b border-rule">
        <div className="container mx-auto px-4 py-10 max-w-3xl">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-ink-400 mb-3 text-center">
            The Research Behind the Profiles
          </p>
          <h2 className="text-xl font-bold text-ink-900 text-center mb-4">
            Grounded in peer-reviewed political psychology
          </h2>
          <p className="text-sm text-ink-700/80 leading-relaxed mb-4">
            MyVote's 8 civic profiles are derived from four evidence-based frameworks used by political scientists and psychologists to explain how people actually form their civic values — not the partisan labels news media assigns.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Moral Foundations Theory",
                authors: "Jonathan Haidt & Jesse Graham",
                desc: "Six universal moral foundations — Care, Fairness, Loyalty, Authority, Sanctity, and Liberty — that people weight differently, producing distinct moral \"taste profiles\" that map onto civic orientations.",
              },
              {
                title: "Big Five Personality Research",
                authors: "Costa & McCrae / Goldberg",
                desc: "Decades of replicated research showing that Openness, Conscientiousness, Agreeableness, Extraversion, and Neuroticism predict political values and civic behavior with surprising consistency.",
              },
              {
                title: "Pew Research Political Typology",
                authors: "Pew Research Center",
                desc: "Large-sample cluster analysis of American political attitudes that consistently identifies 9–12 coherent value groups that don't map neatly onto the two-party spectrum.",
              },
              {
                title: "Post-Materialist Values",
                authors: "Ronald Inglehart",
                desc: "Research showing that as economic security rises, a segment of citizens prioritizes self-expression, autonomy, and quality of life over security and conformity — reshaping political coalitions in democracies worldwide.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-paper-50 rounded-xl border border-rule p-4">
                <p className="font-bold text-ink-900 text-sm leading-snug">{f.title}</p>
                <p className="text-ink-400 text-xs mt-0.5 mb-2">{f.authors}</p>
                <p className="text-ink-700/75 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Profile cards ── */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {ARCHETYPE_ORDER.map((key) => {
            const arch = ARCHETYPES[key]
            const grad = GRADIENTS[key]
            const data = ARCHETYPE_PROFILE_DATA[key]
            const { primaryFigure, moreFigures, science } = data
            const allFigures = [primaryFigure, ...moreFigures]

            return (
              <div
                key={key}
                id={key}
                className="bg-white rounded-2xl border border-rule shadow-sm overflow-hidden flex flex-col scroll-mt-20"
              >
                {/* Card header — gradient banner */}
                <div className={`bg-gradient-to-r ${grad} p-6 text-white`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-4xl leading-none">{arch.emoji}</span>
                      <h2 className="text-xl font-bold mt-2 leading-snug">{arch.label}</h2>
                      <p className="text-white/75 text-sm mt-1 leading-relaxed">
                        {arch.headline}
                      </p>
                    </div>
                    <span className="flex-shrink-0 text-[11px] font-bold uppercase tracking-wider bg-white/20 border border-white/30 rounded-full px-3 py-1 mt-1">
                      {arch.tag}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="px-6 pt-5 pb-4">
                  <p className="text-sm text-ink-700/80 leading-relaxed">
                    {arch.description}
                  </p>
                </div>

                {/* Science */}
                <div className="mx-6 mb-4 bg-indigo-50 rounded-xl border border-indigo-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">
                    Research Basis
                  </p>
                  <p className="text-xs text-ink-700/80 leading-relaxed">
                    {science.replace(/\*\*[^*]+\*\*\s*/g, "")}
                  </p>
                </div>

                {/* Historical figures */}
                <div className="mx-6 mb-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400 mb-3">
                    Historical Parallels
                  </p>
                  <div className="flex flex-col gap-3">
                    {allFigures.map((fig, idx) => (
                      <div
                        key={fig.name}
                        className={`rounded-xl border p-4 flex gap-3 items-start ${
                          idx === 0 ? "bg-paper-50 border-rule" : "bg-white border-rule/60"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <CandidatePhoto
                            name={fig.name}
                            wikipediaTitle={fig.wikiTitle}
                            size={idx === 0 ? 64 : 48}
                            shape="circle"
                            partyColor="#6B7088"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-ink-900 text-sm leading-snug">{fig.name}</p>
                            {idx === 0 && (
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-ink-900/8 text-ink-500 rounded-full px-2 py-0.5">
                                Primary
                              </span>
                            )}
                          </div>
                          <p className="text-ink-500 text-xs mt-0.5">{fig.years} · {fig.role}</p>
                          <blockquote className="mt-2 text-xs italic text-ink-600 border-l-2 border-rule pl-2.5 leading-relaxed">
                            "{fig.quote}"
                          </blockquote>
                          {idx === 0 && (
                            <p className="text-xs text-ink-700/70 leading-relaxed mt-2">
                              {fig.why}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14 max-w-lg mx-auto">
          <p className="text-ink-700/60 text-sm mb-4">
            Not sure which profile fits you? The quiz takes 2–3 minutes and never
            assigns a partisan label.
          </p>
          <Link href="/quiz">
            <Button className="bg-teal-600 hover:bg-teal-500 text-white font-semibold h-11 px-8 text-base">
              Discover your civic profile →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
