'use client'
import React from 'react'

function Location() {
  return (
    <section className="relative bg-white py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="inline-block rounded-full bg-[#EBF5EC] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-[#236331] mb-4">
            Find Us
          </span>
          <h2 className="text-[32px] font-semibold tracking-tight text-[#111111]">
            Our Location
          </h2>
          <p className="mt-4 text-[15px] leading-[1.75] text-[#5A5450]">
            Visit our headquarters in Nairobi — we&apos;re always open to connect
          </p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Info cards */}
          <div className="flex flex-col gap-5">
            {/* Hours card */}
            <div
              className="rounded-[12px] bg-white p-6"
              style={{ border: '0.5px solid #E2DCDA' }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[8px] bg-[#236331] text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-[#111111]">Opening Hours</h3>
                  <p className="mt-1 text-sm text-[#5A5450]">Monday – Friday</p>
                  <p className="text-sm font-medium text-[#236331]">9:00 AM – 5:00 PM</p>
                  <p className="mt-1 text-sm text-[#5A5450] italic">Weekends closed</p>
                </div>
              </div>
            </div>

            {/* Address card */}
            <div
              className="rounded-[12px] bg-white p-6"
              style={{ border: '0.5px solid #E2DCDA' }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[8px] bg-[#C25757] text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-[#111111]">UPIA Party HQ</h3>
                  <p className="mt-1 text-sm text-[#5A5450]">
                    Ramshab Lane, Along Ngong Road<br />
                    Next to Nairobi Baptist Church<br />
                    Nairobi
                  </p>
                </div>
              </div>
            </div>

            {/* Contact card */}
            <div
              className="rounded-[12px] bg-white p-6"
              style={{ border: '0.5px solid #E2DCDA' }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[8px] bg-[#111111] text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-[#111111]">Contact</h3>
                  <a href="tel:+254705927424" className="mt-1 block text-sm text-[#236331] hover:text-[#2B753A] font-medium">
                    +254 705 927 424
                  </a>
                  <a href="mailto:info@upiaparty.com" className="mt-1 block text-sm text-[#236331] hover:text-[#2B753A]">
                    info@upiaparty.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div
              className="relative h-full min-h-[400px] overflow-hidden rounded-[12px]"
              style={{ border: '0.5px solid #E2DCDA' }}
            >
              <iframe
                className="absolute inset-0 h-full w-full border-0"
                src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Ramshab+Lane,+Along+Ngong+Road,+Nairobi,+(UPIA%20Party%20HQ)&t=&z=15&ie=UTF8&iwloc=B&output=embed"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="UPIA Party HQ Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Location
