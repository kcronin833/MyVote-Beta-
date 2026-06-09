import Link from "next/link"

export const metadata = {
  title: "Privacy Policy | MyVote",
  description: "MyVote Privacy Policy — how we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <div className="border-b border-rule bg-card">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-ink-900 mb-1">Privacy Policy</h1>
          <p className="text-ink-500 text-sm">Last updated: May 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-gray max-w-none space-y-8 text-ink-700/80">

          <section>
            <h2 className="text-xl font-bold text-ink-700">1. Overview</h2>
            <p>
              MyVote ("we," "us," or "our") operates the MyVote website and platform (the "Service"). This Privacy
              Policy explains what information we collect when you use our Service, how we use it, and the choices
              you have. By using MyVote, you agree to the practices described in this policy.
            </p>
            <p>
              MyVote is currently operating as a pilot platform for Georgia voters. We are committed to handling
              your data responsibly and transparently.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-700">2. Information We Collect</h2>
            <h3 className="text-base font-semibold text-ink-700 mt-4">Information you provide directly:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account information:</strong> When you create an account, we collect your email address, a username, and a display name.</li>
              <li><strong>Profile information:</strong> You may optionally add a bio, location (e.g., city, state), and political lean indicator.</li>
              <li><strong>Comments and posts:</strong> Any content you submit publicly on the platform.</li>
              <li><strong>Contact form submissions:</strong> If you contact us through the Contact page, we collect your name, email address, and message.</li>
            </ul>

            <h3 className="text-base font-semibold text-ink-700 mt-4">Information collected automatically:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Usage data:</strong> Pages visited, features used, and general interaction patterns.</li>
              <li><strong>Location data:</strong> With your browser's permission, we may detect your approximate city and state to show relevant local news. This is not stored permanently.</li>
              <li><strong>Device information:</strong> Browser type, operating system, and IP address for security and analytics purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-700">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Create and manage your account</li>
              <li>Deliver local and personalized news content</li>
              <li>Allow you to comment on and discuss articles</li>
              <li>Respond to your contact form messages</li>
              <li>Improve the platform based on usage patterns</li>
              <li>Detect and prevent abuse or unauthorized access</li>
              <li>Send transactional emails (e.g., email verification, password reset)</li>
            </ul>
            <p className="mt-3">
              We do <strong>not</strong> sell your personal data to political campaigns, advertisers, data brokers,
              or any third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-700">4. Data Storage and Security</h2>
            <p>
              Your account data is stored securely using <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline">Supabase</a>,
              a secure cloud database provider. Passwords are hashed and never stored in plain text. We use
              industry-standard security practices including HTTPS encryption for all data in transit.
            </p>
            <p className="mt-3">
              No system is 100% secure. While we take your data security seriously, we cannot guarantee absolute
              security of your information. In the event of a breach, we will notify affected users as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-700">5. Cookies</h2>
            <p>
              We use cookies and similar technologies to keep you logged into your account and to maintain your
              session preferences. We do not use tracking cookies for advertising purposes. You can disable
              cookies in your browser settings, but this may prevent you from staying logged in.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-700">6. Third-Party Services</h2>
            <p>MyVote uses the following third-party services:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Supabase</strong> — database and user authentication</li>
              <li><strong>Vercel</strong> — website hosting and deployment</li>
              <li><strong>NewsAPI</strong> — news article aggregation (no personal data is sent to NewsAPI)</li>
            </ul>
            <p className="mt-3">
              News articles linked on MyVote are provided by third-party publishers. We are not responsible for
              the privacy practices of those publishers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-700">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate information in your profile</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of any non-essential communications</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at <a href="mailto:kcronin833@gmail.com" className="text-teal-600 underline">kcronin833@gmail.com</a>.
              We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-700">8. Children's Privacy</h2>
            <p>
              MyVote is not intended for users under the age of 13. We do not knowingly collect personal
              information from children under 13. If you believe we have inadvertently collected such information,
              please contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-700">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the "Last updated"
              date at the top of this page. Continued use of MyVote after any changes constitutes your acceptance
              of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-700">10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or how we handle your data, please contact us:
            </p>
            <ul className="list-none space-y-1 mt-2">
              <li><strong>Email:</strong> <a href="mailto:kcronin833@gmail.com" className="text-teal-600 underline">kcronin833@gmail.com</a></li>
              <li><strong>Contact form:</strong> <Link href="/contact" className="text-teal-600 underline">MyVote Contact Page</Link></li>
            </ul>
          </section>
        </div>
      </div>

    </div>
  )
}
