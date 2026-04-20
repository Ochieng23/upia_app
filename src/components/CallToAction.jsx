'use client'
import Image from 'next/image'
import CountUp from 'react-countup'
import Link from 'next/link'
import backgroundImage from '../images/images/about-1.jpg'

export function CallToAction() {
  return (
    <section className="relative bg-white py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">

          {/* Left — image */}
          <div className="relative rounded-[12px] overflow-hidden min-h-[420px]">
            <Image
              src={backgroundImage}
              alt="UPIA community gathering"
              fill
              className="object-cover object-center"
            />
            {/* Maroon gradient overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#6B2626]/80 via-transparent to-transparent" />
            {/* Quote */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <blockquote className="text-base font-medium italic leading-relaxed text-white">
                &ldquo;Together, we can build a Kenya where no one is left behind.&rdquo;
              </blockquote>
              <p className="mt-2 text-sm font-medium text-[#EBF5EC]">— UPIA Party Leadership</p>
            </div>
          </div>

          {/* Right — content */}
          <div>
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E2DCDA] bg-[#FBF0F0] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-[#C25757]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#236331] animate-pulse" />
              Join the Movement
            </span>

            {/* Heading */}
            <h2 className="mt-6 text-[32px] font-semibold leading-tight tracking-tight text-[#111111] sm:text-[42px]">
              Be a Part<br />of Change!
            </h2>

            <p className="mt-5 text-[15px] leading-[1.75] text-[#5A5450] max-w-sm">
              Become a United Party Independent Alliance member and help build a better, fairer Kenya for every citizen.
            </p>

            {/* Stats */}
            <div className="mt-10 flex items-center gap-8">
              <div>
                <div className="flex items-end gap-1 leading-none">
                  <CountUp
                    className="text-4xl font-semibold text-[#C25757]"
                    end={1000007}
                    duration={3}
                    separator=","
                  />
                  <span className="mb-1 text-2xl font-semibold text-[#C25757]">+</span>
                </div>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450]">
                  Registered Members
                </p>
              </div>

              <div className="h-12 w-px bg-[#E2DCDA]" />

              <div>
                <p className="text-4xl font-semibold leading-none text-[#236331]">30+</p>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450]">
                  MCAs Elected
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-[6px] bg-[#236331] px-7 py-3 text-sm font-medium text-white hover:bg-[#2B753A] active:scale-[0.98] transition-all duration-150"
              >
                Join Us Today
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 rounded-[6px] border border-[#C25757] bg-transparent px-7 py-3 text-sm font-medium text-[#C25757] hover:bg-[#FBF0F0] active:scale-[0.98] transition-all duration-150"
              >
                Support the Cause
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
