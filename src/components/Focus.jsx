import Link from 'next/link'

const GUTTER = 'clamp(18px, 5vw, 72px)'
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const SERIF = "Georgia, 'Times New Roman', Times, serif"

const pillars = [
  { num: '01', title: 'Equality', href: '/about', description: 'Everyone deserves the same rights, opportunities, and treatment regardless of background. Fairness is not uniformity — it is ensuring every Kenyan can fully participate in national life.' },
  { num: '02', title: 'Economic Empowerment', href: '/about', description: 'Gaining control over financial resources gives every Kenyan the power to make choices that improve their lives. We champion entrepreneurship, fair wages, and inclusive access to capital.' },
  { num: '03', title: 'Education', href: '/about', description: 'High-quality education ignites curiosity and equips students with the knowledge and skills to thrive. We commit to accessible, relevant education from early childhood through tertiary level.' },
  { num: '04', title: 'Eradication of Corruption', href: '/about', description: 'Eliminating dishonest acts for personal gain requires systemic transparency and accountability at every level of government. We hold zero tolerance for graft.' },
  { num: '05', title: 'Universal Healthcare', href: '/about', description: 'Every Kenyan deserves the medical treatment they need without facing financial ruin. We champion a national healthcare model that reaches every county, every ward, every home.' },
  { num: '06', title: 'Climate Action', href: '/about', description: "Kenya's climate is changing rapidly. We commit to sustainable development policies that protect our ecosystems, reduce carbon footprint, and safeguard livelihoods for future generations." },
]

export function HoverEffect() { return <FocusAreas /> }
export const Card = ({ className, children }) => <div className={`p-5 ${className || ''}`}>{children}</div>
export const CardTitle = ({ children }) => <h3 style={{ fontFamily: SERIF, fontSize: 18, color: '#161A14' }}>{children}</h3>
export const CardDescription = ({ children }) => <p style={{ fontSize: 14, color: '#3C423A', lineHeight: 1.7 }}>{children}</p>

export default function FocusAreas() {
  return (
    <section id="focus" style={{ background: '#F7F5EF', scrollMarginTop: 106 }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: `clamp(60px, 7.5vw, 108px) ${GUTTER}` }}>

        {/* Section header */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'clamp(20px, 4vw, 60px)', alignItems: 'end', marginBottom: 'clamp(36px, 5vw, 52px)' }}>
          <div>
            <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#8A6520', marginBottom: 18 }}>
              Our Agenda
            </div>
            <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(30px, 3.8vw, 50px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#161A14' }}>
              Six Focus Areas
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.65, color: '#3C423A', maxWidth: '44ch', alignSelf: 'flex-end' }}>
            Six pillars driving our commitment to a prosperous, just Kenya.
          </p>
        </div>

        {/* Pillar grid */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {pillars.map((p, i) => (
            <Link
              key={p.num}
              href={p.href}
              style={{ textDecoration: 'none' }}
              className={`group flex gap-5 items-start border-t border-[#DFDCD1] transition-colors hover:bg-white/60
                ${i % 2 === 1 ? 'md:border-l border-[#DFDCD1]' : ''}`}
            >
              <div style={{
                paddingTop: 'clamp(18px, 2.5vw, 26px)',
                paddingBottom: 'clamp(18px, 2.5vw, 26px)',
                paddingLeft: i % 2 === 1 ? 'clamp(16px, 2.5vw, 30px)' : 0,
                paddingRight: i % 2 === 0 ? 'clamp(16px, 2.5vw, 30px)' : 0,
                display: 'flex', gap: 18, alignItems: 'flex-start', width: '100%',
              }}>
                <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', color: '#B8862B', flexShrink: 0, width: 26, paddingTop: 3 }}>
                  {p.num}
                </span>
                <div>
                  <div style={{ fontFamily: SERIF, fontSize: 19, lineHeight: 1.2, color: '#161A14', marginBottom: 10 }} className="group-hover:text-[#0F4D2E] transition-colors">
                    {p.title}
                  </div>
                  <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.72, color: '#3C423A' }}>
                    {p.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
