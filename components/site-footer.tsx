import Link from "next/link"
import { Mail } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-background mt-auto">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} MyVote · Not affiliated with any political party or government entity.</p>
        <nav className="flex items-center gap-4 flex-wrap justify-center">
          <Link href="/contact" className="flex items-center gap-1 text-civic-red font-semibold hover:text-civic-red/80 transition-colors">
            <Mail className="w-3 h-3" />
            Contact Us
          </Link>
          <Link href="/about" className="hover:text-ink-900 transition-colors">About</Link>
          <Link href="/elections" className="hover:text-ink-900 transition-colors">Elections 2026</Link>
          <Link href="/guides/what-is-a-runoff" className="hover:text-ink-900 transition-colors">Voter Guides</Link>
          <Link href="/privacy" className="hover:text-ink-900 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-ink-900 transition-colors">Terms</Link>
        </nav>
      </div>
    </footer>
  )
}
