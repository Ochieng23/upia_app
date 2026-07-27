import Image from 'next/image'
import Link from 'next/link'
import img2 from '../images/images/about-2.jpg'
import img3 from '../images/images/about-3.jpg'
import img4 from '../images/images/about-4.jpg'
import img5 from '../images/images/about-5.jpg'

const pillars = [
  {
    label: 'Ideology',
    text: 'Political stability, economic empowerment, social justice, and equitable resource sharing for all Kenyans.',
    color: '#C25757',
  },
  {
    label: 'Vision',
    text: 'A united, prosperous, and sustainably developed Kenya with equal opportunities for every citizen.',
    color: '#236331',
  },
  {
    label: 'Mission',
    text: 'Build capacity for all Kenyans to realise and exercise their political, social, economic, and cultural rights.',
    color: '#6B2626',
  },
]

export default function AboutHome() {
  return (
    <section id="mission" className="relative bg-white py-20 sm:py-28 overflow-hidden scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">

          {/* ── Left: copy ─────────────────────────────── */}
          <div>
            <span className="inline-block rounded-full bg-[#FBF0F0] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-[#C25757] mb-6">
              Who We Are
            </span>
            <h2 className="text-[28px] sm:text-[34px] font-semibold tracking-tight text-[#111111] leading-snug">
              Building bridges,<br className="hidden sm:block" /> not walls
            </h2>
            <p className="mt-5 text-[15px] leading-[1.82] text-[#5A5450]">
              By leveraging cutting-edge technology and user-centric design, we empower
              parties and leaders to transcend geographical and ideological boundaries —
              reaching every Kenyan, from Mandera to Mombasa.
            </p>
            <p className="mt-4 text-[15px] leading-[1.82] text-[#5A5450]">
              We are democratising access to political discourse, amplifying the voices of
              marginalised groups and building a more resilient, responsive political ecosystem.
            </p>

            {/* Ideology / Vision / Mission */}
            <ul className="mt-8 space-y-4">
              {pillars.map((p) => (
                <li key={p.label} className="flex gap-4 items-start">
                  <span
                    className="mt-1.5 flex-shrink-0 h-2 w-2 rounded-full"
                    style={{ background: p.color }}
                  />
                  <div>
                    <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#111111]">
                      {p.label}
                    </span>
                    <p className="mt-0.5 text-[14px] leading-[1.75] text-[#5A5450]">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#236331] hover:text-[#2B753A] transition-colors"
            >
              Learn more about UPIA
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* ── Right: image collage ────────────────────── */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="relative w-full overflow-hidden rounded-[12px]" style={{ paddingBottom: '65%' }}>
                <Image src={img2} alt="" fill className="object-cover" />
              </div>
              <div className="relative w-full overflow-hidden rounded-[12px]" style={{ paddingBottom: '85%' }}>
                <Image src={img3} alt="" fill className="object-cover" />
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-10">
              <div className="relative w-full overflow-hidden rounded-[12px]" style={{ paddingBottom: '85%' }}>
                <Image src={img4} alt="" fill className="object-cover" />
              </div>
              <div className="relative w-full overflow-hidden rounded-[12px]" style={{ paddingBottom: '65%' }}>
                <Image src={img5} alt="" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
