import Link from 'next/link'

const GUTTER = 'clamp(18px, 5vw, 72px)'
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const SERIF = "Georgia, 'Times New Roman', Times, serif"

const cols = [
  {
    num: '01', head: 'Ideology',
    body: 'The party aims to establish political stability, advance economic empowerment, create social justice, and ensure equitable resource sharing for all Kenyans.',
  },
  {
    num: '02', head: 'Vision',
    body: 'To have a country that is united, prosperous, and sustainably developed with equal opportunities for all Kenyans to develop their potential and be free from poverty.',
  },
  {
    num: '03', head: 'Mission',
    body: 'To identify and build capacity for all Kenyans to realise and exercise their political, social, economic, and cultural rights and fundamental freedoms enshrined in the constitution.',
  },
]

export default function AboutHome() {
  return (
    <section id="mission" style={{ scrollMarginTop: 106, maxWidth: 1240, margin: '0 auto', padding: `clamp(60px, 7.5vw, 108px) ${GUTTER}` }}>

      {/* Section header */}
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'clamp(20px, 4vw, 60px)', alignItems: 'end', marginBottom: 'clamp(40px, 5vw, 64px)' }}>
        <div>
          <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#8A6520', marginBottom: 20 }}>
            Who We Are
          </div>
          <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(30px, 3.8vw, 50px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#161A14' }}>
            Our Mission Statement
          </h2>
        </div>
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.65, color: '#3C423A', maxWidth: '44ch', alignSelf: 'flex-end' }}>
          Guided by principle, driven by purpose — for every Kenyan.
        </p>
      </div>

      {/* 3-column grid with asymmetric padding */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {cols.map((col, i) => (
          <div
            key={col.num}
            style={{
              borderTop: '2px solid #161A14',
              paddingTop: 28,
              paddingBottom: 28,
            }}
            className={i > 0 ? 'md:border-l border-[#E4E1D6]' : ''}
          >
            <div style={{
              paddingLeft: i > 0 ? 'clamp(14px, 2.5vw, 30px)' : 0,
              paddingRight: i < 2 ? 'clamp(14px, 2.5vw, 30px)' : 0,
            }}>
              <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0F4D2E', marginBottom: 16, fontWeight: 500 }}>
                {col.num} — {col.head}
              </div>
              <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.72, color: '#3C423A' }}>
                {col.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40 }}>
        <Link href="/about" style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 500, color: '#0F4D2E', textDecoration: 'none', letterSpacing: '0.01em' }}>
          Learn more about UPIA →
        </Link>
      </div>
    </section>
  )
}
