import Image from 'next/image'
import hero from '../images/images/hero-congress.jpg'

export default function QuoteBand() {
  return (
    <section className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
      <Image
        src={hero}
        alt="UPIA Party congress"
        fill
        className="object-cover object-center"
        style={{ filter: 'brightness(0.45) saturate(0.85)' }}
      />
      {/* Gradient overlay — denser on left */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(100deg, rgba(107,38,38,0.82) 0%, rgba(107,38,38,0.45) 55%, rgba(13,32,18,0.30) 100%)' }}
      />
      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 flex h-[3px]">
        <div className="flex-1 bg-[#C25757]" />
        <div className="flex-1 bg-[#236331]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#111111]" />
      </div>

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <blockquote className="max-w-2xl">
            <p className="text-[22px] sm:text-3xl font-semibold italic leading-snug text-white">
              &ldquo;Together, we are shaping a future where every voice matters and every Kenyan can thrive.&rdquo;
            </p>
            <footer className="mt-4 text-[13px] font-medium uppercase tracking-[0.09em] text-white/60">
              — UPIA Party Leadership
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
