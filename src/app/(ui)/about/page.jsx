import hero from '../../../images/images/about-1.jpg'
import img1 from '../../../images/images/about-2.jpg'
import img2 from '../../../images/images/about-3.jpg'
import img3 from '../../../images/images/about-4.jpg'
import img4 from '../../../images/images/about-5.jpg'
import img5 from '../../../images/images/about-6.jpg'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import Leadership from '../../../components/Leadership'
import Image from 'next/image'
import Link from 'next/link'

const stats = [
  { label: 'Lawfully Elected', value: '0',   unit: 'Governors' },
  { label: 'Voter Oriented',   value: '2',   unit: 'MPs' },
  { label: 'Grassroots',       value: '30+', unit: 'MCAs' },
]

const values = [
  {
    name: 'Inclusivity',
    description:
      'We believe in embracing diversity and fostering an environment where every individual, regardless of background or belief, feels valued, respected, and included in the political process.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    accent: 'bg-[#FBF0F0] text-[#C25757]',
    border: '#C25757',
  },
  {
    name: 'Transparency',
    description:
      'We are committed to transparency in governance, ensuring that our actions, decisions, and policies are open to scrutiny and accessible to all citizens.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    accent: 'bg-[#EBF5EC] text-[#236331]',
    border: '#236331',
  },
  {
    name: 'Innovation',
    description:
      'We recognize the importance of embracing innovation in addressing complex challenges and shaping the future of our society through new ideas and technologies.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    accent: 'bg-[#FBF0F0] text-[#C25757]',
    border: '#C25757',
  },
  {
    name: 'Collaboration',
    description:
      'We believe in the power of collaboration and partnership to achieve our goals, working across political divides to find common ground and build consensus.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    accent: 'bg-[#EBF5EC] text-[#236331]',
    border: '#236331',
  },
  {
    name: 'Peace',
    description:
      'We prioritize the promotion of peace both domestically and internationally, advocating for diplomacy, conflict resolution, and the protection of human rights.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    accent: 'bg-[#FBF0F0] text-[#C25757]',
    border: '#C25757',
  },
  {
    name: 'Economic Growth',
    description:
      'We are dedicated to fostering robust economic growth that benefits all members of society through entrepreneurship, innovation, and sustainable development.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    accent: 'bg-[#EBF5EC] text-[#236331]',
    border: '#236331',
  },
]

export default function About() {
  return (
    <div className="bg-white">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[60vh] overflow-hidden bg-[#14321e] pt-[60px]">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 opacity-40">
          {[img1, img2, img3, img4, img5, hero].map((img, i) => (
            <div key={i} className="relative overflow-hidden">
              <Image src={img} alt="" fill className="object-cover" style={{ filter: 'blur(3px) brightness(0.55)' }} />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, rgba(35,99,49,0.18) 0%, rgba(35,99,49,0.14) 50%, rgba(20,60,30,0.16) 100%)' }} />
        {/* Maroon glows */}
        <div className="absolute -bottom-16 -left-16 h-[300px] w-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(107,38,38,0.50) 0%, transparent 70%)' }} />
        <div className="absolute -top-10 right-0 h-[220px] w-[220px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(194,87,87,0.25) 0%, transparent 70%)' }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-white/60 mb-6">
              About UPIA
            </span>
            <h1 className="text-[32px] font-semibold tracking-tight text-white sm:text-5xl">
              We&apos;re changing the way parties and leaders connect.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/60">
              We endeavour to forge a cohesive society where every voice is heard, every
              opportunity is accessible, and every idea is valued. Through relentless
              dedication to equity and pioneering innovation, we unite diverse perspectives
              and catalyze positive change for all Kenyans.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-[6px] bg-[#236331] px-6 py-3 text-sm font-medium text-white hover:bg-[#2B753A] active:scale-[0.98] transition-all duration-150"
              >
                Join the Party
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-[6px] border border-white/30 px-6 py-3 text-sm font-medium text-white hover:border-white/60 hover:bg-white/8 active:scale-[0.98] transition-all duration-150"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom color bar */}
        <div className="absolute bottom-0 left-0 right-0 flex h-1">
          <div className="flex-1 bg-[#C25757]" />
          <div className="flex-1 bg-[#236331]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#111111]" />
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#111111] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-semibold text-white">{stat.value}</div>
                <div className="mt-1 text-lg font-medium text-white/80">{stat.unit}</div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission section */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-block rounded-full bg-[#FBF0F0] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-[#C25757] mb-4">
                Our Mission
              </span>
              <h2 className="text-[32px] font-semibold tracking-tight text-[#111111]">
                Building bridges, not walls
              </h2>
              <div className="mt-8 space-y-5 text-[15px] leading-[1.75] text-[#5A5450]">
                <p>
                  By leveraging cutting-edge technology and user-centric design, we are
                  empowering parties and leaders to transcend geographical and ideological
                  boundaries, reaching out to a diverse range of individuals and communities.
                </p>
                <p>
                  Our platform serves as a catalyst for collaboration, enabling parties to
                  tap into the collective wisdom and energy of their supporters, driving
                  informed decision-making and effective governance.
                </p>
                <p>
                  We are democratizing access to political discourse, amplifying the voices
                  of marginalized groups and underrepresented communities. By breaking down
                  silos and embracing diversity, we are building a more resilient and
                  responsive political ecosystem.
                </p>
              </div>
            </div>

            {/* Image collage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 overflow-hidden rounded-[12px]">
                  <Image src={img2} alt="" fill className="object-cover" />
                </div>
                <div className="relative h-64 overflow-hidden rounded-[12px]">
                  <Image src={img3} alt="" fill className="object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-64 overflow-hidden rounded-[12px]">
                  <Image src={img4} alt="" fill className="object-cover" />
                </div>
                <div className="relative h-48 overflow-hidden rounded-[12px]">
                  <Image src={img5} alt="" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width quote image */}
      <section className="relative h-72 sm:h-96 overflow-hidden">
        <Image src={hero} alt="UPIA Party" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#6B2626]/85 to-[#6B2626]/40 flex items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <blockquote className="max-w-xl">
              <p className="text-2xl font-semibold italic text-white sm:text-3xl">
                &ldquo;Together, we are shaping a future where every voice matters.&rdquo;
              </p>
              <footer className="mt-4 text-[#EBF5EC] font-medium">— UPIA Party</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-28 bg-[#F8F5F3]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <span className="inline-block rounded-full bg-[#EBF5EC] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-[#236331] mb-4">
              Core Values
            </span>
            <h2 className="text-[32px] font-semibold tracking-tight text-[#111111]">
              What we stand for
            </h2>
            <p className="mt-4 text-[15px] leading-[1.75] text-[#5A5450]">
              The principles that guide every decision we make
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.name}
                className="group bg-white p-[20px] transition-all duration-150 hover:border-[#D46868]"
                style={{
                  borderRadius: '0 12px 12px 0',
                  border: '0.5px solid #E2DCDA',
                  borderLeft: `3px solid ${value.border}`,
                }}
              >
                <div className={`inline-flex items-center justify-center rounded-[8px] p-3 mb-4 ${value.accent}`}>
                  {value.icon}
                </div>
                <h3 className="text-[17px] font-medium text-[#111111]">{value.name}</h3>
                <p className="mt-2 text-[15px] leading-[1.75] text-[#5A5450]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <Leadership />

      {/* CTA */}
      <section className="bg-[#111111] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[32px] font-semibold text-white">
            Ready to make a difference?
          </h2>
          <p className="mt-4 text-[15px] leading-[1.75] text-white/50">
            Join over one million Kenyans already part of the UPIA movement.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-[6px] bg-[#236331] px-8 py-4 text-sm font-medium text-white hover:bg-[#2B753A] active:scale-[0.98] transition-all duration-150"
            >
              Join UPIA Today
            </Link>
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 rounded-[6px] border border-white/20 px-8 py-4 text-sm font-medium text-white hover:border-[#C25757] hover:bg-[#C25757] active:scale-[0.98] transition-all duration-150"
            >
              Support the Cause
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
