import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/logo"

export const metadata = {
  title: "Terms of Service | MyVote",
  description: "MyVote Terms of Service — the rules for using the MyVote platform.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-paper-50">
      <div className="bg-ink-900 text-white">
        <div className="container mx-auto px-4 py-10">
          <Link href="/">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 mb-4 -ml-3">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Logo size="md" />
          <h1 className="text-3xl font-bold mt-3 mb-1">Terms of Service</h1>
          <p className="text-blue-100">Last updated: May 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-gray max-w-none space-y-8 text-[#3D435A]/80">

          <section>
            <h2 className="text-xl font-bold text-[#3D435A]">1. Acceptance of Terms</h2>
            <p>
              By accessing or using MyVote (the "Service"), you agree to be bound by these Terms of Service
              ("Terms"). If you do not agree to these Terms, please do not use the Service. These Terms apply to
              all visitors, registered users, and guests.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#3D435A]">2. Description of Service</h2>
            <p>
              MyVote is a civic information platform that aggregates political news from multiple perspectives,
              provides information about elected representatives, and facilitates community discussion about
              political topics. MyVote is currently operating as a pilot platform focused on Georgia voters.
            </p>
            <p className="mt-3">
              MyVote is an informational platform only. We do not provide legal, financial, or professional
              political advice. Always verify election information directly with official government sources
              such as the Georgia Secretary of State (sos.ga.gov).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#3D435A]">3. Accounts</h2>
            <p>
              To access certain features (commenting, saving preferences), you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide accurate and truthful information when creating your account</li>
              <li>Keep your password secure and not share it with others</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Be at least 13 years of age to create an account</li>
            </ul>
            <p className="mt-3">
              You are responsible for all activity that occurs under your account. We reserve the right to
              suspend or terminate accounts that violate these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#3D435A]">4. Community Guidelines</h2>
            <p>MyVote is a space for civil political discourse. When using our platform, you agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Post content that is threatening, harassing, or abusive toward any individual or group</li>
              <li>Use hate speech or discriminatory language based on race, religion, gender, sexual orientation, national origin, or disability</li>
              <li>Post spam, advertisements, or promotional content without permission</li>
              <li>Impersonate any person, candidate, elected official, or organization</li>
              <li>Post false or deliberately misleading information presented as fact</li>
              <li>Share personal information of others without their consent (doxxing)</li>
              <li>Coordinate inauthentic behavior or operate fake accounts</li>
              <li>Post content that violates any applicable law</li>
            </ul>
            <p className="mt-3">
              We reserve the right to remove content and suspend accounts that violate these guidelines at our
              sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#3D435A]">5. Content and Intellectual Property</h2>
            <p>
              News articles displayed on MyVote are sourced from third-party publishers. MyVote does not claim
              ownership of this content. All links direct to the original publisher's website.
            </p>
            <p className="mt-3">
              By posting comments or other content on MyVote, you grant us a non-exclusive, royalty-free license
              to display and distribute your content on the platform. You retain ownership of your content and
              can delete it at any time.
            </p>
            <p className="mt-3">
              The MyVote name, logo, and branding are the property of MyVote. You may not use our branding
              without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#3D435A]">6. Disclaimer of Warranties</h2>
            <p>
              MyVote is provided "as is" and "as available" without warranties of any kind. We do not guarantee
              that the Service will be uninterrupted, error-free, or that news content will always be accurate
              or up to date. We are not responsible for the accuracy or completeness of content from third-party
              news sources.
            </p>
            <p className="mt-3">
              Election information on MyVote (dates, candidates, rules) is provided for general informational
              purposes. Always verify critical voting information with the Georgia Secretary of State or your
              county elections office before acting on it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#3D435A]">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, MyVote and its operators shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages arising from your use of, or
              inability to use, the Service — including any reliance on information provided by MyVote.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#3D435A]">8. Changes to These Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. When we make changes, we will update the
              "Last updated" date at the top of this page. Your continued use of MyVote after changes take
              effect constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#3D435A]">9. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of Georgia, United States, without regard to
              conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#3D435A]">10. Contact</h2>
            <p>If you have questions about these Terms, please contact us:</p>
            <ul className="list-none space-y-1 mt-2">
              <li><strong>Email:</strong> <a href="mailto:kcronin833@gmail.com" className="text-ink-900 underline">kcronin833@gmail.com</a></li>
              <li><strong>Contact form:</strong> <Link href="/contact" className="text-ink-900 underline">MyVote Contact Page</Link></li>
            </ul>
          </section>
        </div>
      </div>

      <footer className="border-t border-[#E5E5E5] py-8 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-[#3D435A]/60">
          <Logo size="sm" />
          <p className="mt-2">Inform. Clarify. Empower all political perspectives.</p>
          <div className="flex justify-center gap-4 mt-3">
            <Link href="/about" className="hover:text-ink-900">About</Link>
            <Link href="/privacy" className="hover:text-ink-900">Privacy</Link>
            <Link href="/contact" className="hover:text-ink-900">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
