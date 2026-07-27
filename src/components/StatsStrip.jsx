const stats = [
  { value: '1M+',  label: 'Registered Members' },
  { value: '500+', label: 'Aspirants Enrolled' },
  { value: '29',   label: 'Years of Service' },
  { value: '47',   label: 'Counties Reached' },
  { value: '30+',  label: 'MCAs Elected' },
]

export default function StatsStrip() {
  return (
    <section className="bg-[#111111] border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center relative">
              {/* vertical divider except first */}
              {i !== 0 && (
                <span className="hidden lg:block absolute -left-3 top-1/2 -translate-y-1/2 h-10 w-px bg-white/10" />
              )}
              <div className="text-[34px] sm:text-[38px] font-bold text-white leading-none tracking-tight">
                {stat.value}
              </div>
              <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/45">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
