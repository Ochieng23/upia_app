import Link from 'next/link'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'

export default function RegisterChoicePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <div className="relative overflow-hidden bg-[#14321e] pt-[60px]">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(26,60,94,0.25) 0%, rgba(20,50,30,0.15) 100%)' }} />
        <div className="absolute -bottom-16 -left-16 h-[280px] w-[280px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(107,38,38,0.45) 0%, transparent 70%)' }} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-white/60 mb-4">
            Get Involved
          </span>
          <h1 className="text-[30px] font-semibold text-white sm:text-4xl">Join UPIA Kenya</h1>
          <p className="mt-3 text-[14px] leading-relaxed text-white/55 max-w-md mx-auto">
            Choose the path that best describes your role in the 2027 elections.
          </p>
        </div>
        <div className="flex h-1">
          <div className="flex-1 bg-[#C25757]" />
          <div className="flex-1 bg-[#236331]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#111111]" />
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

          {/* Party Member */}
          <div className="flex flex-col rounded-[14px] bg-white overflow-hidden" style={{ border: '0.5px solid #E2DCDA', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            {/* Top accent */}
            <div className="h-1.5 bg-[#236331]" />

            <div className="flex flex-col flex-1 p-8">
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EBF5EC] mb-6">
                <svg className="h-6 w-6 text-[#236331]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              <span className="inline-block rounded-full bg-[#EBF5EC] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.07em] text-[#236331] mb-3 w-fit">
                Free
              </span>

              <h2 className="text-[22px] font-semibold text-[#111111]">Party Member</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#5A5450]">
                Register as a general UPIA party member through the ORPP&apos;s IPPMS system. Verify your eligibility with your ID or Passport.
              </p>

              <ul className="mt-5 space-y-2.5 flex-1">
                {[
                  'Verified via IPPMS (ORPP system)',
                  'Confirmation code sent to your phone',
                  'Official party membership certificate',
                  'Dial *509# to confirm status',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#5A5450]">
                    <svg className="h-4 w-4 text-[#236331] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/register/member"
                className="mt-8 flex items-center justify-center gap-2 rounded-[8px] bg-[#236331] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#2B753A] transition-all"
              >
                Register as Party Member
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>

          {/* Aspirant */}
          <div className="flex flex-col rounded-[14px] bg-white overflow-hidden" style={{ border: '0.5px solid #E2DCDA', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            {/* Top accent */}
            <div className="h-1.5 bg-[#1a3c5e]" />

            <div className="flex flex-col flex-1 p-8">
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDF3FA] mb-6">
                <svg className="h-6 w-6 text-[#1a3c5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>

              <span className="inline-block rounded-full bg-[#FBF0F0] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.07em] text-[#C25757] mb-3 w-fit">
                Registration fee required
              </span>

              <h2 className="text-[22px] font-semibold text-[#111111]">Aspirant Candidate</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#5A5450]">
                Register your candidacy for the 2027 General Elections. Pay your seat-specific registration fee and create your aspirant account.
              </p>

              <ul className="mt-5 space-y-2.5 flex-1">
                {[
                  'MCA — KES 2,000',
                  'Women\'s Rep / Senator / MP — KES 5,000',
                  'Governor — KES 10,000',
                  'Secure Paystack payment',
                  'Full aspirant portal access',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#5A5450]">
                    <svg className="h-4 w-4 text-[#1a3c5e] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/register/aspirant"
                className="mt-8 flex items-center justify-center gap-2 rounded-[8px] bg-[#1a3c5e] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#1a3c5e]/90 transition-all"
              >
                Register as Aspirant
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>

        </div>

        {/* Already have account */}
        <p className="mt-10 text-center text-sm text-[#5A5450]">
          Already registered?{' '}
          <Link href="/login" className="font-medium text-[#1a3c5e] hover:underline">
            Sign in to your portal →
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  )
}
