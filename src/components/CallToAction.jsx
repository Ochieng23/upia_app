'use client'
import CountUp from 'react-countup'
import Link from 'next/link'

const actions = [
  {
    eyebrow: 'Membership',
    heading: 'Join as a Member',
    body: 'Become part of a growing movement of Kenyans committed to equity, accountability, and real change. Membership is open to every citizen aged 18+.',
    cta: { label: 'Register Now', href: '/register' },
    variant: 'solid',
    accent: '#236331',
  },
  {
    eyebrow: 'Aspirants',
    heading: 'Run for Office',
    body: 'Ready to serve your community? We support aspirants at every level — from ward to gubernatorial — with training, networks, and a platform to reach voters.',
    cta: { label: 'Become an Aspirant', href: '/register/aspirant' },
    variant: 'solid',
    accent: '#C25757',
  },
  {
    eyebrow: 'Support',
    heading: 'Fund the Movement',
    body: 'Your contribution — however large or small — directly powers grassroots outreach, youth programmes, and civic education across all 47 counties.',
    cta: { label: 'Donate Today', href: '/donate' },
    variant: 'outline',
    accent: '#236331',
  },
]

export function CallToAction() {
  return (
    <section id="join" className="relative bg-white py-20 sm:py-28 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-14">
          <span className="inline-block rounded-full bg-[#EBF5EC] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-[#236331] mb-4">
            Join the Movement
          </span>
          <h2 className="text-[32px] font-semibold tracking-tight text-[#111111]">
            Be a Part of Change
          </h2>
          <p className="mt-4 text-[15px] leading-[1.75] text-[#5A5450]">
            Three ways to make your mark on Kenya&apos;s future
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {actions.map((a) => (
            <div
              key={a.eyebrow}
              className="flex flex-col rounded-[12px] bg-white p-7"
              style={{ border: '0.5px solid #E2DCDA', borderTop: `3px solid ${a.accent}` }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-[0.14em] mb-4"
                style={{ color: a.accent }}
              >
                {a.eyebrow}
              </span>
              <h3 className="text-[20px] font-semibold text-[#111111] leading-snug">{a.heading}</h3>
              <p className="mt-3 flex-1 text-[14px] leading-[1.82] text-[#5A5450]">{a.body}</p>
              <Link
                href={a.cta.href}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-[6px] px-5 py-3 text-sm font-medium transition-all duration-150 active:scale-[0.98]"
                style={
                  a.variant === 'solid'
                    ? { background: a.accent, color: '#fff' }
                    : { border: `1.5px solid ${a.accent}`, color: a.accent }
                }
              >
                {a.cta.label}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
          <div className="text-center">
            <div className="flex items-end justify-center gap-1 leading-none">
              <CountUp
                className="text-3xl font-bold text-[#C25757]"
                end={1000000}
                duration={3}
                separator=","
              />
              <span className="mb-1 text-xl font-bold text-[#C25757]">+</span>
            </div>
            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-[#5A5450]">Registered Members</p>
          </div>
          <div className="hidden sm:block h-12 w-px bg-[#E2DCDA]" />
          <div className="text-center">
            <p className="text-3xl font-bold leading-none text-[#236331]">47</p>
            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-[#5A5450]">Counties Reached</p>
          </div>
          <div className="hidden sm:block h-12 w-px bg-[#E2DCDA]" />
          <div className="text-center">
            <p className="text-3xl font-bold leading-none text-[#111111]">30+</p>
            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-[#5A5450]">MCAs Elected</p>
          </div>
        </div>
      </div>
    </section>
  )
}
