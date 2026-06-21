import Image from 'next/image'
import Link from 'next/link'
import Tero from '../images/images/about-6.jpg'

const stats = [
  { value: '1M+', label: 'Registered Members', accent: '#C25757' },
  { value: '500+', label: 'Aspirants',         accent: '#236331' },
  { value: '29',  label: 'Years of Service',  accent: '#FFFFFF' },
  { value: '47',  label: 'Counties Reached',   accent: '#C25757' },
]

export function Hero() {
  return (
    <section className="relative w-full min-h-[100svh] overflow-hidden bg-[#0d2012]">

      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={Tero}
          alt="UPIA Party"
          fill
          priority
          className="object-cover object-center"
          style={{ filter: 'brightness(0.52) saturate(0.9)' }}
        />
        {/* Directional overlay — denser on left for text contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(110deg, rgba(13,32,18,0.72) 0%, rgba(13,32,18,0.52) 45%, rgba(13,32,18,0.28) 100%)',
          }}
        />
      </div>

      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* Maroon radial glow — bottom-left */}
      <div
        className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(107,38,38,0.40) 0%, transparent 60%)' }}
      />

      {/* Green radial glow — top-right */}
      <div
        className="absolute -top-24 -right-24 h-[480px] w-[480px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(35,99,49,0.18) 0%, transparent 60%)' }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-20 items-center min-h-[100svh] py-28 pt-32 sm:pt-40">

          {/* ── Left: copy ──────────────────────────────────── */}
          <div className="max-w-[580px]">

            {/* Overline */}
            <div className="flex items-center gap-3 mb-8">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C25757] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C25757]" />
              </span>
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/80">
                2027 General Elections
              </span>
              <span className="h-px w-12 bg-white/15 flex-shrink-0" />
            </div>

            {/* Headline */}
            <h1
              className="font-extrabold text-white leading-[1.04] tracking-[-0.01em]"
              style={{ fontSize: 'clamp(40px, 5.6vw, 70px)' }}
            >
              United for a{' '}
              <span className="relative inline-block">
                Better
                <span
                  className="absolute left-0 -bottom-[6px] h-[3px] w-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #236331 0%, #C25757 100%)' }}
                />
              </span>
              <br />Kenya.
            </h1>

            {/* Sub-label */}
            <div className="mt-7 flex items-center gap-3">
              <span className="block h-px w-8 bg-[#C25757] flex-shrink-0" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-white/70">
                United Party of Independent Alliance
              </p>
            </div>

            {/* Body copy */}
            <p className="mt-5 text-[15.5px] leading-[1.82] text-white/80 max-w-[460px]">
              Building a nation where every voice is heard, every opportunity is
              accessible, and every Kenyan can thrive — join the movement for
              real, lasting change.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2.5 rounded-[6px] bg-white px-6 sm:px-8 py-3.5 text-sm font-semibold text-[#0d2012] hover:bg-[#EBF5EC] active:scale-[0.98] transition-all duration-150"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.25)' }}
              >
                Become a Member
                <svg
                  className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <Link
                href="/register/aspirant"
                className="group inline-flex items-center gap-2.5 rounded-[6px] px-6 sm:px-8 py-3.5 text-sm font-semibold text-white/85 hover:text-white active:scale-[0.98] transition-all duration-150"
                style={{
                  background: 'rgba(194,87,87,0.16)',
                  border: '1px solid rgba(194,87,87,0.38)',
                }}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Become an Aspirant
              </Link>
            </div>

            {/* Trust signal */}
            <p className="mt-5 text-[12px] text-white/55 tracking-wide">
              Over{' '}
              <span className="text-white/80 font-semibold">1,000,000+</span>{' '}
              registered members across all 47 counties
            </p>
          </div>

          {/* ── Right: stat cards ───────────────────────────── */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="relative flex flex-col overflow-hidden rounded-[10px] px-5 sm:px-6 py-5 sm:py-7"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '0.5px solid rgba(255,255,255,0.12)',
                }}
              >
                {/* Top accent bar */}
                <span
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, ${stat.accent} 0%, transparent 80%)`,
                  }}
                />

                <span className="text-[32px] sm:text-[38px] font-bold text-white leading-none tabular-nums tracking-tight">
                  {stat.value}
                </span>

                <span className="mt-3 block h-px w-7 bg-white/15" />

                <span className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-white/70 leading-snug">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
           style={{ opacity: 0.35 }}>
        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white">Scroll</span>
        <div className="h-9 w-px bg-gradient-to-b from-white/80 to-transparent" />
      </div>

      {/* Bottom 4-segment color bar */}
      <div className="absolute bottom-0 left-0 right-0 flex h-[3px]">
        <div className="flex-1 bg-[#C25757]" />
        <div className="flex-1 bg-[#236331]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#111111]" />
      </div>
    </section>
  )
}
