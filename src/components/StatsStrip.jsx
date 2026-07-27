const stats = [
  { value: '1M+',  label: 'Registered Members' },
  { value: '500+', label: 'Aspirants' },
  { value: '29',   label: 'Years of Service' },
  { value: '47',   label: 'Counties Reached' },
]

const GUTTER = 'clamp(18px, 5vw, 72px)'
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const SERIF = "Georgia, 'Times New Roman', Times, serif"

export default function StatsStrip() {
  return (
    <section style={{ borderTop: '1px solid #E4E1D6', borderBottom: '1px solid #E4E1D6', background: '#F7F5EF' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: `clamp(28px, 3.5vw, 46px) ${GUTTER}`, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '28px 40px' }}>
        {stats.map(({ value, label }) => (
          <div key={label}>
            <div style={{ fontFamily: SERIF, fontSize: 'clamp(32px, 3.5vw, 48px)', lineHeight: 1, color: '#0F4D2E', letterSpacing: '-0.01em' }}>
              {value}
            </div>
            <div style={{ marginTop: 9, fontFamily: SANS, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5C6157' }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
