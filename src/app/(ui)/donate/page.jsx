import React from 'react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import Link from 'next/link'

const donationTiers = [
  {
    name: 'Supporter',
    amount: 'KES 500',
    description: 'Help us spread the message of change across Kenya.',
    features: ['Campaign materials', 'Monthly newsletter', 'Digital membership card'],
    border: 'border-[#E2DCDA]',
    badgeBg: 'bg-[#F8F5F3] text-[#5A5450]',
    featured: false,
  },
  {
    name: 'Champion',
    amount: 'KES 2,000',
    description: 'Power our grassroots outreach and community programs.',
    features: ['Everything in Supporter', 'Priority event invites', 'Dedicated support channel'],
    border: 'border-[#236331]',
    badgeBg: 'bg-[#236331] text-white',
    featured: true,
  },
  {
    name: 'Patron',
    amount: 'KES 10,000+',
    description: "Make a major impact on Kenya's political future.",
    features: ['Everything in Champion', 'Direct leadership access', 'Recognition in publications'],
    border: 'border-[#C25757]',
    badgeBg: 'bg-[#C25757] text-white',
    featured: false,
  },
]

const steps = [
  { step: '01', title: 'Open M-Pesa',             description: 'Go to M-Pesa menu on your phone' },
  { step: '02', title: 'Select Lipa na M-Pesa',    description: 'Choose "Lipa na M-Pesa" then "Pay Bill"' },
  { step: '03', title: 'Enter Paybill Number',     description: 'Enter Business Number: 247247' },
  { step: '04', title: 'Enter Account Number',     description: 'Enter Account: 1010272135531' },
  { step: '05', title: 'Enter Amount',             description: 'Type your desired donation amount' },
  { step: '06', title: 'Confirm Payment',          description: 'Enter your M-Pesa PIN and confirm' },
]

export default function Donate() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">

        {/* Hero */}
        <section className="relative bg-[#14321e] pt-[60px] pb-20 overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, rgba(35,99,49,0.18) 0%, rgba(35,99,49,0.14) 50%, rgba(20,60,30,0.16) 100%)' }} />
          <div className="absolute -bottom-16 -left-16 h-[300px] w-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(107,38,38,0.50) 0%, transparent 70%)' }} />
          <div className="absolute -top-10 right-0 h-[220px] w-[220px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(194,87,87,0.25) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
            <svg className="h-full w-full" viewBox="0 0 800 400" fill="none">
              <circle cx="700" cy="50" r="300" stroke="#C25757" strokeWidth="1" />
              <circle cx="100" cy="350" r="200" stroke="#C25757" strokeWidth="1" />
            </svg>
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 text-center">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-white/60 mb-6">
              Make a Difference
            </span>
            <h1 className="text-[32px] font-semibold text-white sm:text-5xl">
              Support Our Course
            </h1>
            <p className="mt-6 text-[15px] leading-[1.75] text-white/55 max-w-2xl mx-auto">
              Your contribution powers the movement for a better, fairer, and more prosperous Kenya.
              Every shilling counts.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              <div
                className="rounded-[12px] px-8 py-5 text-center"
                style={{ background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.15)' }}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-white/40 mb-1">Paybill Number</p>
                <p className="text-3xl font-semibold text-[#EBF5EC]">247247</p>
              </div>
              <div
                className="rounded-[12px] px-8 py-5 text-center"
                style={{ background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.15)' }}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-white/40 mb-1">Account Number</p>
                <p className="text-3xl font-semibold text-[#EBF5EC]">1010272135531</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex h-1">
            <div className="flex-1 bg-[#C25757]" />
            <div className="flex-1 bg-[#236331]" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-[#111111]" />
          </div>
        </section>

        {/* Donation tiers */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block rounded-full bg-[#EBF5EC] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-[#236331] mb-4">
                Give Today
              </span>
              <h2 className="text-[32px] font-semibold text-[#111111]">
                Choose Your Impact Level
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {donationTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative bg-white border-2 p-8 flex flex-col rounded-[12px] ${tier.border} ${tier.featured ? 'shadow-lg' : ''}`}
                >
                  {tier.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-[#236331] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-white shadow-sm">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-6">
                    <span className={`inline-block rounded-[6px] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.07em] mb-4 ${tier.badgeBg}`}>
                      {tier.name}
                    </span>
                    <div className="text-[32px] font-semibold text-[#111111]">{tier.amount}</div>
                    <p className="mt-2 text-[15px] text-[#5A5450]">{tier.description}</p>
                  </div>
                  <ul className="space-y-3 flex-1 mb-8">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[#5A5450]">
                        <svg className="h-4 w-4 flex-shrink-0 text-[#236331]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-[6px] bg-[#F8F5F3] p-4 text-center" style={{ border: '0.5px solid #E2DCDA' }}>
                    <p className="text-xs font-medium text-[#5A5450] mb-1">Via M-Pesa Paybill</p>
                    <p className="text-sm font-medium text-[#236331]">247247 → 1010272135531</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to donate steps */}
        <section className="bg-[#F8F5F3] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block rounded-full bg-[#FBF0F0] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-[#C25757] mb-4">
                Easy Steps
              </span>
              <h2 className="text-[32px] font-semibold text-[#111111]">
                How to Donate via M-Pesa
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {steps.map((s) => (
                <div
                  key={s.step}
                  className="flex gap-4 rounded-[12px] bg-white p-[20px]"
                  style={{ border: '0.5px solid #E2DCDA' }}
                >
                  <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#C25757] text-white font-medium text-sm">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-medium text-[#111111] text-[15px]">{s.title}</h3>
                    <p className="mt-1 text-sm text-[#5A5450]">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-[#236331] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-[32px] font-semibold text-white">
              Questions about donating?
            </h2>
            <p className="mt-3 text-[15px] text-white/70">
              Our team is happy to assist you with any donation inquiries.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-[6px] bg-white px-8 py-3 text-sm font-medium text-[#236331] hover:bg-[#EBF5EC] active:scale-[0.98] transition-all duration-150 shadow-sm"
            >
              Contact Us
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
