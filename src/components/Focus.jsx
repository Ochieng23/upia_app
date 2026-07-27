'use client'
import Link from 'next/link'

const pillars = [
  {
    num: '01',
    title: 'Equality',
    description:
      'Everyone deserves the same rights, opportunities, and treatment regardless of background. Fairness is not uniformity — it is ensuring every Kenyan can fully participate in national life.',
    href: '/about',
    accent: '#C25757',
  },
  {
    num: '02',
    title: 'Economic Empowerment',
    description:
      'Gaining control over financial resources gives every Kenyan the power to make choices that improve their lives. We champion entrepreneurship, fair wages, and inclusive access to capital.',
    href: '/about',
    accent: '#236331',
  },
  {
    num: '03',
    title: 'Education',
    description:
      'High-quality education ignites curiosity and equips students with the knowledge and skills to thrive. We commit to accessible, relevant education from early childhood through tertiary level.',
    href: '/about',
    accent: '#C25757',
  },
  {
    num: '04',
    title: 'Eradication of Corruption',
    description:
      'Eliminating dishonest acts for personal gain requires systemic transparency and accountability at every level of government. We hold zero tolerance for graft.',
    href: '/about',
    accent: '#236331',
  },
  {
    num: '05',
    title: 'Universal Healthcare',
    description:
      'Every Kenyan deserves the medical treatment they need without facing financial ruin. We champion a national healthcare model that reaches every county, every ward, every home.',
    href: '/about',
    accent: '#C25757',
  },
  {
    num: '06',
    title: 'Climate Action',
    description:
      "Kenya's climate is changing rapidly. We commit to sustainable development policies that protect our ecosystems, reduce our carbon footprint, and safeguard livelihoods for future generations.",
    href: '/about',
    accent: '#236331',
  },
]

// Named export kept for backward-compat with page.jsx
export function HoverEffect() {
  return <FocusAreas />
}

export default function FocusAreas() {
  return (
    <section id="focus" className="relative bg-[#F8F5F3] py-20 sm:py-28 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-2xl text-center mb-14">
          <span className="inline-block rounded-full bg-[#EBF5EC] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-[#236331] mb-4">
            Our Agenda
          </span>
          <h2 className="text-[32px] font-semibold tracking-tight text-[#111111]">Six Focus Areas</h2>
          <p className="mt-4 text-[15px] leading-[1.75] text-[#5A5450]">
            Six pillars driving our commitment to a prosperous, just Kenya
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <Link
              key={p.num}
              href={p.href}
              className="group flex flex-col bg-white rounded-[12px] p-[22px] transition-all duration-150 hover:shadow-md"
              style={{ border: '0.5px solid #E2DCDA', borderLeft: `3px solid ${p.accent}` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.12em] tabular-nums"
                  style={{ color: p.accent }}
                >
                  {p.num}
                </span>
                <span className="h-px flex-1 bg-[#E2DCDA]" />
              </div>
              <h3 className="text-[17px] font-semibold text-[#111111] group-hover:text-[#C25757] transition-colors leading-snug">
                {p.title}
              </h3>
              <p className="mt-2 flex-1 text-[14px] leading-[1.75] text-[#5A5450]">
                {p.description}
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.07em] text-[#5A5450] group-hover:text-[#C25757] transition-colors opacity-0 group-hover:opacity-100">
                Learn more
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// Legacy shape exports for old imports
export const Card = ({ className, children }) => (
  <div className={`relative z-10 h-full w-full overflow-hidden rounded-[12px] p-[20px] bg-white ${className || ''}`} style={{ border: '0.5px solid #E2DCDA' }}>
    {children}
  </div>
)
export const CardTitle = ({ children }) => <h3 className="text-[17px] font-medium text-[#111111]">{children}</h3>
export const CardDescription = ({ children }) => <p className="mt-2 text-[15px] leading-[1.75] text-[#5A5450]">{children}</p>
