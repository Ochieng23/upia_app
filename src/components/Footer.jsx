'use client'
import Link from 'next/link'
import { Logo } from '../components/Logo'

const navigation = {
  party: [
    { name: 'Home',       href: '/' },
    { name: 'About Us',   href: '/about' },
    { name: 'Manifesto',  href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ],
  get_involved: [
    { name: 'Become a Member', href: '/register' },
    { name: 'Donate',          href: '/donate' },
    { name: 'Party Leaders',   href: '/' },
    { name: 'Resources',       href: '/resources' },
  ],
  news: [
    { name: 'Latest News',    href: '/news' },
    { name: 'Blog',           href: '/news' },
    { name: 'Press Releases', href: '/news' },
    { name: 'Events',         href: '/news' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Use',   href: '#' },
    { name: 'Claims',         href: '#' },
  ],
  social: [
    {
      name: 'Facebook',
      href: '#',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'X',
      href: '#',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823Z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: '#',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
        </svg>
      ),
    },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white/50">
      {/* Top 4-segment color bar */}
      <div className="flex h-1">
        <div className="flex-1 bg-[#C25757]" />
        <div className="flex-1 bg-[#236331]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#6B2626]" />
      </div>

      {/* Newsletter banner */}
      <div className="border-b border-white/8 bg-white/4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-[15px] font-medium text-white">Stay informed</h3>
              <p className="text-sm text-white/40 mt-1">
                Get the latest news, articles, and party updates delivered to your inbox.
              </p>
            </div>
            <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                type="email"
                id="footer-email"
                name="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                className="min-w-0 flex-1 rounded-[6px] border-0 bg-white/8 px-4 py-2.5 text-sm text-white placeholder:text-white/25 ring-1 ring-inset ring-white/15 focus:ring-2 focus:ring-[#C25757] outline-none transition-all"
              />
              <button
                type="submit"
                className="flex-shrink-0 rounded-[6px] bg-[#C25757] px-5 py-3 sm:py-2.5 text-sm font-medium text-white hover:bg-[#A84545] transition-colors duration-150"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo className="h-12 w-auto brightness-0 invert" />
            <p className="mt-4 text-sm leading-relaxed text-white/40 max-w-xs">
              United Party of Independent Alliance — building a Kenya that is united,
              prosperous, and equitable for every citizen.
            </p>

            {/* Social links */}
            <div className="mt-6 flex gap-3">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-white/6 text-white/40 hover:bg-[#C25757] hover:text-white transition-all duration-150"
                  aria-label={item.name}
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* USSD */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-[6px] border border-[#236331]/40 bg-[#236331]/10 px-4 py-2.5">
              <svg className="h-4 w-4 text-[#2B753A] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-[#EBF5EC]">Dial <strong>*509#</strong> to verify membership</span>
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            <div>
              <h4 className="text-[10px] font-medium uppercase tracking-[0.07em] text-white/30 mb-5">UPIA Party</h4>
              <ul className="space-y-3">
                {navigation.party.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm text-white/50 hover:text-white transition-colors duration-150">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-medium uppercase tracking-[0.07em] text-white/30 mb-5">Get Involved</h4>
              <ul className="space-y-3">
                {navigation.get_involved.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm text-white/50 hover:text-white transition-colors duration-150">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-medium uppercase tracking-[0.07em] text-white/30 mb-5">News</h4>
              <ul className="space-y-3">
                {navigation.news.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm text-white/50 hover:text-white transition-colors duration-150">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <h4 className="text-[10px] font-medium uppercase tracking-[0.07em] text-white/30 mb-5 mt-8">Legal</h4>
              <ul className="space-y-3">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm text-white/50 hover:text-white transition-colors duration-150">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} UPIA Party Kenya. All rights reserved.
          </p>
          <span className="text-xs text-white/25">Building a better Kenya, together</span>
        </div>
      </div>
    </footer>
  )
}
