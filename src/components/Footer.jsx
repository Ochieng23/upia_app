import Link from 'next/link'

const GUTTER = 'clamp(18px, 5vw, 72px)'
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const SERIF = "Georgia, 'Times New Roman', Times, serif"

const cols = [
  {
    heading: 'UPIA Party',
    links: [
      { label: 'Home',       href: '/' },
      { label: 'About Us',   href: '/about' },
      { label: 'Manifesto',  href: '/about' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    heading: 'Get Involved',
    links: [
      { label: 'Become a Member',    href: '/register' },
      { label: 'Become an Aspirant', href: '/register/aspirant' },
      { label: 'Donate',             href: '/donate' },
      { label: 'Resources',          href: '/resources' },
    ],
  },
  {
    heading: 'News',
    links: [
      { label: 'Latest News',    href: '/news' },
      { label: 'Press Releases', href: '/news' },
      { label: 'Events',         href: '/news' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Use',   href: '#' },
    ],
  },
]

const socials = [
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
      </svg>
    ),
  },
  {
    name: 'X / Twitter',
    href: '#',
    icon: (
      <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.682 10.622L20.239 3H18.685l-5.693 6.618L8.445 3H3.2l6.877 10.007L3.2 21h1.554l6.012-6.989 4.801 6.989H20.813l-7.131-10.378z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: '#',
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"/>
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer style={{ background: '#0A3521' }}>
      {/* Main content */}
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: `clamp(52px, 7vw, 80px) ${GUTTER}` }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_repeat(4,1fr)]" style={{ gap: 'clamp(40px, 5vw, 60px)' }}>

          {/* Brand column */}
          <div>
            {/* Wordmark */}
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 18 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#FBFAF7', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 13, color: '#0F4D2E' }}>U</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 15, color: '#EDEFE9', letterSpacing: '0.04em' }}>UPIA</span>
                <span style={{ fontFamily: SANS, fontSize: 7.5, letterSpacing: '0.16em', color: '#8FA694', textTransform: 'uppercase' }}>Party of Kenya</span>
              </div>
            </Link>

            <p style={{ margin: '0 0 24px', fontFamily: SANS, fontSize: 13.5, lineHeight: 1.70, color: '#8FA694', maxWidth: '28ch' }}>
              United Party of Independent Alliance — building a Kenya that is united, prosperous, and equitable for every citizen.
            </p>

            {/* Social circles */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', display: 'grid', placeItems: 'center', color: '#8FA694', textDecoration: 'none', transition: 'border-color 0.12s, color 0.12s' }}
                  className="hover:border-white/40 hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* *509# */}
            <div style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 3 }}>
              <svg width="14" height="14" fill="none" stroke="#8FA694" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18h3"/>
              </svg>
              <span style={{ fontFamily: SANS, fontSize: 12.5, color: '#B9C7BC' }}>Dial <strong style={{ color: '#E8C782' }}>*509#</strong> to verify membership</span>
            </div>
          </div>

          {/* Nav columns */}
          {cols.map((col) => (
            <div key={col.heading}>
              <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8FA694', marginBottom: 20, fontWeight: 600 }}>
                {col.heading}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} style={{ fontFamily: SANS, fontSize: 13.5, color: '#8FA694', textDecoration: 'none', transition: 'color 0.1s' }} className="hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: `18px ${GUTTER}`, display: 'flex', flexWrap: 'wrap', gap: '8px 24px', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ margin: 0, fontFamily: SANS, fontSize: 12, color: '#5C6157' }}>
            &copy; {new Date().getFullYear()} UPIA Party Kenya. All rights reserved.
          </p>
          <span style={{ fontFamily: SANS, fontSize: 12, color: '#5C6157' }}>
            Building a better Kenya, together.
          </span>
        </div>
      </div>
    </footer>
  )
}
