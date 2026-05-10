import Link from "next/link"
import { Mail } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#4A4A4A]/50">
        <p>© {new Date().getFullYear()} MyVote · Not affiliated with any political party or government entity.</p>
        <nav className="flex items-center gap-4 flex-wrap justify-center">
          <Link href="/contact" className="flex items-center gap-1 text-[#CC2020] font-semibold hover:text-[#aa1818] transition-colors">
            <Mail className="w-3 h-3" />
            Contact Us
          </Link>
          <Link href="/about" className="hover:text-[#1B2B5E] transition-colors">About</Link>
          <Link href="/elections" className="hover:text-[#1B2B5E] transition-colors">Elections 2026</Link>
          <Link href="/privacy" className="hover:text-[#1B2B5E] transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-[#1B2B5E] transition-colors">Terms</Link>
        </nav>
      </div>
    </footer>
  )
}
