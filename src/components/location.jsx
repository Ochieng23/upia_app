'use client'
import { useState } from 'react'

const GUTTER = 'clamp(18px, 5vw, 72px)'
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const SERIF = "Georgia, 'Times New Roman', Times, serif"

const infoCells = [
  {
    label: 'Headquarters',
    content: 'Ramshab Lane, Along Ngong Road\nNext to Nairobi Baptist Church\nNairobi, Kenya',
  },
  {
    label: 'Opening Hours',
    content: 'Monday - Friday\n9:00 AM - 5:00 PM\nWeekends closed',
  },
  {
    label: 'Contact',
    links: [
      { href: 'tel:+254705927424', label: '+254 705 927 424' },
      { href: 'mailto:info@upiaparty.com', label: 'info@upiaparty.com' },
    ],
  },
  {
    label: 'Membership',
    content: 'Dial *509# to verify your\nmembership status',
  },
]

const MAP_SRC = 'https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Ramshab+Lane,+Along+Ngong+Road,+Nairobi,+(UPIA%20Party%20HQ)&t=&z=15&ie=UTF8&iwloc=B&output=embed'

export default function Location() {
  const [showMap, setShowMap] = useState(false)

  return (
    <section id="location" style={{ background: '#F7F5EF', scrollMarginTop: 106 }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: `clamp(60px, 7.5vw, 108px) ${GUTTER}` }}>

        {/* Section header */}
        <div style={{ marginBottom: 'clamp(40px, 5vw, 60px)' }}>
          <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#8A6520', marginBottom: 18 }}>
            Find Us
          </div>
          <h2 style={{ margin: '0 0 16px', fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(30px, 3.8vw, 50px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#161A14' }}>
            Our Location
          </h2>
          <p style={{ margin: 0, fontFamily: SANS, fontSize: 16, lineHeight: 1.65, color: '#3C423A', maxWidth: '54ch' }}>
            Visit our headquarters in Nairobi - we&apos;re always open to connect with members and aspirants.
          </p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'clamp(32px, 5vw, 60px)', alignItems: 'start' }}>

          {/* Info cells */}
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {infoCells.map((cell, i) => (
              <div
                key={cell.label}
                style={{
                  paddingTop: 'clamp(16px, 2vw, 22px)',
                  paddingBottom: 'clamp(16px, 2vw, 22px)',
                  borderTop: '1px solid #DFDCD1',
                  paddingLeft: i % 2 === 1 ? 'clamp(12px, 2vw, 22px)' : 0,
                  paddingRight: i % 2 === 0 ? 'clamp(12px, 2vw, 22px)' : 0,
                }}
                className={i % 2 === 1 ? 'sm:border-l border-[#DFDCD1]' : ''}
              >
                <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#0F4D2E', marginBottom: 10, fontWeight: 600 }}>
                  {cell.label}
                </div>
                {cell.content && (
                  <p style={{ margin: 0, fontFamily: SANS, fontSize: 13.5, lineHeight: 1.72, color: '#3C423A', whiteSpace: 'pre-line' }}>
                    {cell.content}
                  </p>
                )}
                {cell.links && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {cell.links.map((l) => (
                      <a key={l.href} href={l.href} style={{ fontFamily: SANS, fontSize: 13.5, color: '#0F4D2E', textDecoration: 'none' }}>
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Map slot */}
          <div style={{ position: 'relative', background: '#F1EEE6', border: '1px solid #DFDCD1', minHeight: 300, overflow: 'hidden' }}>
            {showMap ? (
              <iframe
                src={MAP_SRC}
                title="UPIA Party HQ"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 24 }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#5C6157" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                </svg>
                <span style={{ fontFamily: SANS, fontSize: 12.5, color: '#5C6157', textAlign: 'center' }}>
                  Ramshab Lane, Ngong Road, Nairobi
                </span>
                <button
                  onClick={() => setShowMap(true)}
                  style={{ padding: '11px 22px', fontSize: 13, fontWeight: 500, color: '#FBFAF7', background: '#0F4D2E', borderRadius: 3, border: 'none', cursor: 'pointer', fontFamily: SANS }}
                >
                  Show Map
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
