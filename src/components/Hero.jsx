import Image from 'next/image'
import Link from 'next/link'

const heroPhoto = 'https://res.cloudinary.com/dhz4c0oae/image/upload/v1718805108/about-5_oov7bi.jpg'

const GUTTER = 'clamp(18px, 5vw, 72px)'
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const SERIF = "Georgia, 'Times New Roman', Times, serif"

export function Hero() {
  return (
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: `clamp(52px, 7vw, 88px) ${GUTTER} clamp(44px, 6vw, 72px)` }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(36px, 5vw, 72px)', alignItems: 'end' }}>

        {/* Left: copy */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30 }}>
            <div style={{ width: 24, height: 1, background: '#B8862B', flexShrink: 0 }} />
            <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#8A6520' }}>
              2027 General Elections
            </span>
          </div>

          <h1 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(44px, 6.5vw, 80px)', lineHeight: 1.02, letterSpacing: '-0.024em', color: '#161A14' }}>
            United for a<br />Better Kenya.
          </h1>

          <p style={{ margin: '22px 0 0', fontFamily: SANS, fontSize: 11, letterSpacing: '0.10em', color: '#5C6157', textTransform: 'uppercase' }}>
            United Party of Independent Alliance
          </p>

          <p style={{ margin: '24px 0 0', maxWidth: '46ch', fontSize: 'clamp(16px, 1.2vw, 18px)', lineHeight: 1.65, color: '#3C423A' }}>
            Building a nation where every voice is heard, every opportunity is accessible, and every Kenyan can thrive — join the movement for real, lasting change.
          </p>

          <div style={{ marginTop: 36, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link href="/register" style={{ display: 'inline-block', padding: '14px 26px', fontSize: 14.5, fontWeight: 500, color: '#FBFAF7', background: '#0F4D2E', borderRadius: 3, textDecoration: 'none' }}>
              Become a Member
            </Link>
            <Link href="/register/aspirant" style={{ display: 'inline-block', padding: '14px 26px', fontSize: 14.5, fontWeight: 500, color: '#161A14', border: '1px solid #161A14', borderRadius: 3, textDecoration: 'none' }}>
              Become an Aspirant
            </Link>
          </div>

          <div style={{ marginTop: 30, paddingTop: 22, borderTop: '1px solid #E4E1D6', fontFamily: SANS, fontSize: 13, color: '#5C6157' }}>
            Over <strong style={{ color: '#161A14', fontWeight: 600 }}>1,000,000+</strong> registered members across all 47 counties
          </div>
        </div>

        {/* Right: image slot */}
        <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', minHeight: 260, background: '#F1EEE6' }}>
          <Image
            src={heroPhoto}
            alt="UPIA Party members"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>
      </div>
    </section>
  )
}
