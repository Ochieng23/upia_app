'use client'
import React from 'react'

const cards = [
  {
    name: 'IDEOLOGY',
    description:
      'The party aims to establish political stability, advance economic empowerment, create social justice, and ensure equitable resource sharing for all Kenyans.',
    icon: (
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    name: 'VISION',
    description:
      'To have a country that is united, prosperous, and sustainably developed with equal opportunities for all Kenyans to develop their potential and be free from poverty.',
    icon: (
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    name: 'MISSION',
    description:
      'To identify and build capacity for all Kenyans to realize and exercise their political, social, economic, and cultural rights and fundamental freedoms enshrined in the constitution.',
    icon: (
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function AboutHome() {
  return (
    <section className="relative bg-[#F8F5F3] py-20 sm:py-28 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="inline-block rounded-full bg-[#FBF0F0] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-[#C25757] mb-4">
            Who We Are
          </span>
          <h2 className="text-[32px] font-semibold tracking-tight text-[#111111]">
            Our Mission Statement
          </h2>
          <p className="mt-4 text-[15px] leading-[1.75] text-[#5A5450]">
            Guided by principle, driven by purpose — for every Kenyan.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.name}
              className="flex flex-col overflow-hidden rounded-[12px] bg-white transition-all duration-150 hover:border-[#D46868]"
              style={{
                border: '0.5px solid #E2DCDA',
                borderLeft: '3px solid #C25757',
                borderRadius: '0 12px 12px 0',
              }}
            >
              {/* Card header */}
              <div className="flex items-center gap-4 px-[22px] pt-[20px] pb-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[8px] bg-[#C25757]">
                  {card.icon}
                </div>
                <span className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450]">
                  {card.name}
                </span>
              </div>

              {/* Divider */}
              <div className="mx-[22px] h-px bg-[#E2DCDA]" />

              {/* Content */}
              <div className="flex-1 px-[22px] py-5">
                <p className="text-[15px] leading-[1.75] text-[#5A5450]">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
