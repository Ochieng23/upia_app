'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import clsx from 'clsx'
import { Logo } from '../components/Logo'

const navLinks = [
  { href: '/',          label: 'Home' },
  { href: '/about',     label: 'About' },
  { href: '/register',  label: 'Register' },
  { href: '/resources', label: 'Resources' },
  { href: '/news',      label: 'News' },
  { href: '/contact',   label: 'Contact' },
]

function HamburgerIcon({ open }) {
  return (
    <div className="relative flex h-6 w-6 flex-col justify-center items-center gap-[5px]">
      <span className={clsx('block h-0.5 w-6 bg-current transition-all duration-300 origin-center', open ? 'rotate-45 translate-y-[7px]' : '')} />
      <span className={clsx('block h-0.5 w-6 bg-current transition-all duration-300', open ? 'opacity-0 scale-x-0' : '')} />
      <span className={clsx('block h-0.5 w-6 bg-current transition-all duration-300 origin-center', open ? '-rotate-45 -translate-y-[7px]' : '')} />
    </div>
  )
}

function NavItem({ href, children }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={clsx(
        'relative text-[13px] font-medium transition-colors duration-150',
        isActive
          ? 'text-[#C25757]'
          : 'text-[#5A5450] hover:text-[#C25757]',
      )}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-[#C25757]" />
      )}
    </Link>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={clsx(
        'fixed top-0 z-50 w-full h-[60px] bg-white transition-all duration-300',
        scrolled
          ? 'shadow-md border-b border-[#E2DCDA]'
          : 'border-b border-[#E2DCDA]',
      )}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] flex">
        <div className="flex-1 bg-[#C25757]" />
        <div className="flex-1 bg-[#236331]" />
      </div>

      <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" aria-label="Home" className="flex items-center flex-shrink-0 gap-2">
            <Logo className="h-9 w-auto" />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <NavItem key={href} href={href}>{label}</NavItem>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/donate"
              className="hidden lg:inline-flex items-center rounded-[6px] bg-[#236331] px-[18px] py-2 text-sm font-medium text-white hover:bg-[#2B753A] active:scale-[0.98] transition-all duration-150"
            >
              Support Us
            </Link>

            <div className="lg:hidden">
              <Popover>
                {({ open }) => (
                  <>
                    <PopoverButton
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-[#5A5450] hover:text-[#C25757] focus:outline-none"
                      aria-label="Toggle navigation"
                    >
                      <HamburgerIcon open={open} />
                    </PopoverButton>

                    <PopoverPanel
                      transition
                      className="fixed inset-0 z-50 flex flex-col bg-[#6B2626] transition duration-200 ease-out data-[closed]:opacity-0"
                    >
                      <div className="flex items-center justify-between px-5 h-[60px] border-b border-white/10">
                        <Logo className="h-9 w-auto brightness-0 invert" />
                        <PopoverButton
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-white/70 hover:text-white focus:outline-none"
                          aria-label="Close menu"
                        >
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </PopoverButton>
                      </div>

                      <nav className="flex flex-1 flex-col justify-center gap-1 px-6">
                        {navLinks.map(({ href, label }) => (
                          <PopoverButton
                            key={href}
                            as={Link}
                            href={href}
                            className="rounded-lg px-4 py-4 text-lg font-medium text-white/70 hover:bg-white/8 hover:text-white transition-colors"
                          >
                            {label}
                          </PopoverButton>
                        ))}
                      </nav>

                      <div className="px-6 pb-10">
                        <PopoverButton
                          as={Link}
                          href="/donate"
                          className="flex w-full items-center justify-center rounded-[6px] bg-[#236331] px-6 py-4 text-sm font-medium text-white hover:bg-[#2B753A] transition-colors"
                        >
                          Support UPIA
                        </PopoverButton>
                      </div>
                    </PopoverPanel>
                  </>
                )}
              </Popover>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
