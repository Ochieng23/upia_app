'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { Logo } from '../components/Logo'

const navLinks = [
  { href: '/',          label: 'Home' },
  { href: '/about',     label: 'About' },
  { href: '/register',  label: 'Register' },
  { href: '/resources', label: 'Resources' },
  { href: '/news',      label: 'News' },
  { href: '/contact',   label: 'Contact' },
]

const GUTTER = 'clamp(18px, 5vw, 72px)'
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const SERIF = "Georgia, 'Times New Roman', Times, serif"

function Wordmark({ light }) {
  return (
    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
      <Logo className={`h-14 w-auto${light ? ' brightness-0 invert' : ''}`} />
    </Link>
  )
}

export function Header() {
  const pathname = usePathname()

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      {/* Utility bar */}
      <div style={{ background: '#0A3521' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: `8px ${GUTTER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px 24px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.05em', color: '#CFDCD2' }}>
            Dial <strong style={{ color: '#E8C782' }}>*509#</strong> to verify your membership
          </span>
          <div style={{ display: 'flex', gap: 20, fontSize: 11.5, letterSpacing: '0.04em' }}>
            <Link href="/login" style={{ color: '#B9C7BC', textDecoration: 'none' }} className="hover:text-white transition-colors duration-100">Login</Link>
            <Link href="/contact" style={{ color: '#B9C7BC', textDecoration: 'none' }} className="hover:text-white transition-colors duration-100">Contact</Link>
          </div>
        </div>
      </div>

      {/* Nav header */}
      <header style={{ background: 'rgba(251,250,247,0.96)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderBottom: '1px solid #DFDCD1' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: `0 ${GUTTER}`, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <Wordmark />

          {/* Desktop nav */}
          <nav className="hidden lg:flex" style={{ alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  padding: '8px 12px', fontSize: 13.5, borderRadius: 3,
                  textDecoration: 'none',
                  color: pathname === href ? '#0F4D2E' : '#3C423A',
                  fontWeight: pathname === href ? 500 : 400,
                  background: pathname === href ? '#EEF4EE' : 'transparent',
                }}
                className="hover:bg-[#F1EEE6] transition-colors duration-100"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <Link href="/donate" style={{ padding: '9px 16px', fontSize: 13, fontWeight: 500, color: '#161A14', border: '1px solid #C9C4B4', borderRadius: 3, textDecoration: 'none' }}>
              Support Us
            </Link>
            <Link href="/register" style={{ padding: '9px 17px', fontSize: 13, fontWeight: 500, color: '#FBFAF7', background: '#0F4D2E', borderRadius: 3, textDecoration: 'none' }}>
              Register
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden">
            <Popover>
              {({ open }) => (
                <>
                  <PopoverButton className="flex h-10 w-10 items-center justify-center focus:outline-none" aria-label="Toggle navigation">
                    {open ? (
                      <svg width="20" height="20" fill="none" stroke="#161A14" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" fill="none" stroke="#161A14" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                      </svg>
                    )}
                  </PopoverButton>

                  <PopoverPanel transition className="fixed inset-0 z-[60] flex flex-col bg-[#0A3521] transition duration-200 ease-out data-[closed]:opacity-0">
                    {/* Mobile header row */}
                    <div style={{ padding: `0 ${GUTTER}`, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <Wordmark light />
                      <PopoverButton className="flex h-10 w-10 items-center justify-center focus:outline-none">
                        <svg width="20" height="20" fill="none" stroke="#EDEFE9" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </PopoverButton>
                    </div>

                    {/* Nav links */}
                    <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: `24px ${GUTTER}` }}>
                      {navLinks.map(({ href, label }) => (
                        <PopoverButton key={href} as={Link} href={href}
                          style={{ display: 'block', padding: '16px 0', fontSize: 19, fontFamily: SERIF, color: '#EDEFE9', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                          {label}
                        </PopoverButton>
                      ))}
                    </nav>

                    {/* Mobile CTAs */}
                    <div style={{ padding: `0 ${GUTTER} 48px`, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <PopoverButton as={Link} href="/register"
                        style={{ display: 'block', padding: 15, textAlign: 'center', background: '#FBFAF7', color: '#0F4D2E', borderRadius: 3, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
                        Register
                      </PopoverButton>
                      <PopoverButton as={Link} href="/donate"
                        style={{ display: 'block', padding: 15, textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)', color: '#EDEFE9', borderRadius: 3, fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
                        Support Us
                      </PopoverButton>
                    </div>
                  </PopoverPanel>
                </>
              )}
            </Popover>
          </div>
        </div>
      </header>
    </div>
  )
}
