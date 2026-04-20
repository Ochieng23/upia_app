import Image from 'next/image'
import Link from 'next/link'
import Tero from '../images/images/about-6.jpg'

const stats = [
  { value: '1M+',  label: 'Registered Members' },
  { value: '2',    label: 'MPs in Parliament' },
  { value: '30+',  label: 'MCAs Elected' },
  { value: '47',   label: 'Counties Reached' },
]

export function Hero() {
  return (
    <section className="relative w-full min-h-[88vh] overflow-hidden bg-[#14321e]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={Tero}
          alt="UPIA Party"
          fill
          priority
          className="object-cover object-center opacity-40"
          style={{ filter: 'blur(3px) brightness(0.55)' }}
        />
        <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, rgba(35,99,49,0.18) 0%, rgba(35,99,49,0.14) 50%, rgba(20,60,30,0.16) 100%)' }} />
      </div>

      {/* Maroon radial glow — bottom-left */}
      <div className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(107,38,38,0.55) 0%, transparent 70%)' }} />

      {/* Maroon radial glow — top-right */}
      <div className="absolute -top-16 right-0 h-[300px] w-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(194,87,87,0.30) 0%, transparent 70%)' }} />

      {/* Decorative circles */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]">
        <svg className="h-full w-full" viewBox="0 0 800 600" fill="none" preserveAspectRatio="xMidYMid slice">
          <circle cx="650" cy="150" r="350" stroke="#C25757" strokeWidth="1" />
          <circle cx="650" cy="150" r="220" stroke="#C25757" strokeWidth="0.7" />
          <circle cx="650" cy="150" r="100" stroke="#C25757" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[88vh] py-32 pt-36">

          {/* Left — copy */}
          <div>
            {/* Overline */}
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
              style={{ background: 'rgba(107,38,38,0.45)', border: '0.5px solid rgba(194,87,87,0.40)' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#C25757]" />
              <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-white/90">2027 General Elections</p>
            </span>

            {/* Headline */}
            <h1
              className="font-sans font-semibold text-white leading-tight"
              style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}
            >
              United for a{' '}
              <span className="text-[#EBF5EC]">Better</span>{' '}
              Kenya
            </h1>

            <p className="mt-3 text-xl font-medium text-white/80 tracking-wide">
              United Party of Independent Alliance
            </p>

            {/* Sub-text */}
            <p className="mt-6 text-base leading-[1.75] text-white/55 max-w-[480px]">
              Building a nation where every voice is heard, every opportunity is accessible,
              and every Kenyan can thrive. Join the movement for real, lasting change.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center rounded-[6px] bg-white px-7 py-3 text-sm font-medium text-[#236331] hover:bg-[#EBF5EC] active:scale-[0.98] transition-all duration-150"
              >
                Become a Member
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center rounded-[6px] px-7 py-3 text-sm font-medium text-white active:scale-[0.98] transition-all duration-150"
                style={{ background: 'rgba(107,38,38,0.55)', border: '0.5px solid rgba(194,87,87,0.45)' }}
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Become an Aspirant
              </Link>
            </div>
          </div>

          {/* Right — stat pills */}
          <div className="grid grid-cols-2 gap-4 lg:gap-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col rounded-[10px] border px-6 py-6"
                style={{
                  background: 'rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderColor: 'rgba(255,255,255,0.20)',
                  borderWidth: '0.5px',
                }}
              >
                <span className="text-4xl font-semibold text-white leading-none">{stat.value}</span>
                <span className="mt-2 text-[13px] text-white/60 leading-snug">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom 4-segment color bar */}
      <div className="absolute bottom-0 left-0 right-0 flex h-1">
        <div className="flex-1 bg-[#C25757]" />
        <div className="flex-1 bg-[#236331]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#111111]" />
      </div>
    </section>
  )
}
