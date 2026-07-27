import Image from 'next/image'
import communityPhoto from '../images/images/hero-congress.jpg'

const GUTTER = 'clamp(18px, 5vw, 72px)'
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const SERIF = "Georgia, 'Times New Roman', Times, serif"

export default function QuoteBand() {
  return (
    <section style={{ background: '#FBFAF7', borderTop: '1px solid #E4E1D6', borderBottom: '1px solid #E4E1D6' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: `0 ${GUTTER}` }}>
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Image slot */}
          <div style={{ position: 'relative', aspectRatio: '5/4', overflow: 'hidden', minHeight: 220, background: '#F1EEE6' }}>
            <Image
              src={communityPhoto}
              alt="UPIA community gathering"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>

          {/* Blockquote */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(40px, 5vw, 72px) clamp(28px, 4vw, 56px)' }}>
            <blockquote style={{ margin: 0 }}>
              <p style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(22px, 2.4vw, 30px)', lineHeight: 1.4, letterSpacing: '-0.015em', color: '#161A14' }}>
                "Together, we can build a Kenya where no one is left behind and every voice truly matters."
              </p>
              <footer style={{ marginTop: 28 }}>
                <div style={{ width: 32, height: 2, background: '#B8862B', marginBottom: 14 }} />
                <cite style={{ fontStyle: 'normal', fontFamily: SANS, fontSize: 10.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5C6157' }}>
                  UPIA Party Leadership
                </cite>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
