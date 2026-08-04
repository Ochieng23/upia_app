import Link from 'next/link'

const GUTTER = 'clamp(18px, 5vw, 72px)'
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const SERIF = "Georgia, 'Times New Roman', Times, serif"

const actions = [
  { label: 'Join Us Today',      href: '/register',           variant: 'solid' },
  { label: 'Become an Aspirant', href: '/register/aspirant',  variant: 'outline' },
  { label: 'Support the Cause',  href: '/donate',             variant: 'outline' },
]

export function CallToAction() {
  return (
    <section id="join" style={{ background: '#0A3521', scrollMarginTop: 106 }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: `clamp(60px, 7.5vw, 104px) ${GUTTER}` }}>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'clamp(40px, 5vw, 72px)', alignItems: 'start' }}>

          {/* Left: copy */}
          <div>
            <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#E8C782', marginBottom: 22 }}>
              Join the Movement
            </div>
            <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(32px, 4vw, 54px)', lineHeight: 1.08, letterSpacing: '-0.02em', color: '#EDEFE9' }}>
              Be a Part of Change
            </h2>
            <p style={{ margin: '22px 0 0', maxWidth: '42ch', fontSize: 17, lineHeight: 1.65, color: '#B9C7BC' }}>
              Three ways to make your mark on Kenya's future. Join over a million Kenyans committed to equity, accountability, and real change.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 40, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1, color: '#EDEFE9', letterSpacing: '-0.01em' }}>1M+</div>
                <div style={{ marginTop: 7, fontFamily: SANS, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8FA694' }}>Members</div>
              </div>
              <div>
                <div style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1, color: '#EDEFE9', letterSpacing: '-0.01em' }}>29+</div>
                <div style={{ marginTop: 7, fontFamily: SANS, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8FA694' }}>Years of Service</div>
              </div>
            </div>
          </div>

          {/* Right: action rows + verification box */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {actions.map((a, i) => (
                <Link
                  key={a.label}
                  href={a.href}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 22px',
                    border: '1px solid',
                    borderColor: a.variant === 'solid' ? 'transparent' : 'rgba(255,255,255,0.14)',
                    borderTop: i > 0 ? 'none' : undefined,
                    borderRadius: i === 0 ? '3px 3px 0 0' : i === actions.length - 1 ? '0 0 3px 3px' : 0,
                    background: a.variant === 'solid' ? '#FBFAF7' : 'transparent',
                    color: a.variant === 'solid' ? '#0F4D2E' : '#EDEFE9',
                    textDecoration: 'none',
                    fontSize: 14.5,
                    fontWeight: 500,
                    fontFamily: SANS,
                    transition: 'opacity 0.1s',
                  }}
                  className="hover:opacity-75"
                >
                  {a.label}
                  <span style={{ fontSize: 18, fontWeight: 300, opacity: 0.7 }}>→</span>
                </Link>
              ))}
            </div>

            <div style={{ marginTop: 18, padding: '15px 20px', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 3 }}>
              <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8FA694', marginBottom: 6 }}>
                Membership Verification
              </div>
              <div style={{ fontFamily: SANS, fontSize: 13, color: '#B9C7BC', lineHeight: 1.5 }}>
                Dial <strong style={{ color: '#E8C782' }}>*509#</strong> to verify your membership status instantly
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
