import Link from "next/link"

export const metadata = {
  title: "Terms of Service | MyVote",
  description: "MyVote Terms of Service — the rules for using the MyVote platform.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <div className="border-b border-rule bg-card">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-ink-900 mb-1">Terms of Service</h1>
          <p className="text-ink-500 text-sm">Last updated: May 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-gray max-w-none space-y-8 text-ink-700/80">

          <section>
            <h2 className="text-xl font-bold text-ink-700">1. Acceptance of Terms</h2>
            <p>
              By accessing or using MyVote (the "Service"), you agree to be bound by these Terms of Service
              ("Terms"). If you do not agree to these Terms, please do not use the Service. These Terms apply to
              all visitors, registered users, and guests.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-700">2. Description of Service</h2>
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
            <h2 className="text-xl font-bold text-ink-700">3. Accounts</h2>
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
            <h2 className="text-xl font-bold text-ink-700">4. Community Guidelines</h2>
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
            <h2 className="text-xl font-bold text-ink-700">5. Content and Intellectual Property</h2>
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
            <h2 className="text-xl font-bold text-ink-700">6. Disclaimer of Warranties</h2>
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
            <h2 className="text-xl font-bold text-ink-700">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, MyVote and its operators shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages arising from your use of, or
              inability to use, the Service — including any reliance on information provided by MyVote.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-700">8. Changes to These Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. When we make changes, we will update the
              "Last updated" date at the top of this page. Your continued use of MyVote after changes take
              effect constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-700">9. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of Georgia, United States, without regard to
              conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-700">10. Contact</h2>
            <p>If you have questions about these Terms, please contact us:</p>
            <ul className="list-none space-y-1 mt-2">
              <li><strong>Email:</strong> <a href="mailto:kcronin833@gmail.com" className="text-teal underline hover:text-teal-dk">kcronin833@gmail.com</a></li>
              <li><strong>Contact form:</strong> <Link href="/contact" className="text-teal underline hover:text-teal-dk">MyVote Contact Page</Link></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
