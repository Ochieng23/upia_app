'use client'

import Image from 'next/image'
import ukur from '../images/images/CS-Ukur-1-removebg-preview.png'
import secgen from '../images/images/secgen.jpeg'
import hibo from '../images/images/hibo.jpeg'
import sadick from '../images/images/Sadick PP.jpg'
import kanguchu from '../images/images/kanguchu-removebg-preview.png'

const people = [
  {
    name: 'Amb. Ukur Yattani',
    role: 'Party Leader',
    imageUrl: ukur,
    objectPosition: 'center top',
  },
  {
    name: 'Maj. RTD Iltasayon Neepe',
    role: 'Chairman',
    imageUrl: 'https://res.cloudinary.com/dhz4c0oae/image/upload/v1751961365/Director-Maj.-Rtd-Iltasayon-Neepe-Director_a2l5tg.jpg',
    objectPosition: 'center top',
  },
  {
    name: 'Dr. Mohamed Dahir Duale',
    role: 'Secretary General',
    imageUrl: secgen,
    objectPosition: 'center top',
  },
  {
    name: 'Hon. Joseph Kanguchu',
    role: 'Organizing Secretary',
    imageUrl: kanguchu,
    objectPosition: 'center top',
  },
  {
    name: 'Hon. Hibo Bishar',
    role: 'National Treasurer',
    imageUrl: hibo,
    objectPosition: 'center top',
  },
  {
    name: 'Hon. Sadick Doufa',
    role: 'Chief Executive Officer',
    imageUrl: sadick,
    objectPosition: 'center top',
  },
]

export default function Leadership() {
  return (
    <section className="relative bg-[#F9F6F4] py-20 sm:py-28">
      {/* Top accent strip */}
      <div className="absolute top-0 left-0 right-0 flex h-1">
        <div className="flex-1 bg-[#C25757]" />
        <div className="flex-1 bg-[#236331]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#111111]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-[#FBF0F0] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-[#C25757] mb-4">
              Leadership
            </span>
            <h2 className="text-[32px] font-semibold tracking-tight text-[#111111]">
              Our Party Leadership
            </h2>
            <p className="mt-3 text-[15px] leading-[1.75] text-[#5A5450] max-w-lg">
              Dedicated leaders committed to Kenya&apos;s progress and prosperity
            </p>
          </div>
          <div className="hidden sm:block flex-shrink-0 w-24 h-px bg-[#E2DCDA]" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((person, i) => (
            <div
              key={i}
              className="group relative bg-white overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 rounded-sm"
            >
              {/* Fixed-ratio photo container — all cards identical height */}
              <div className="relative w-full" style={{ paddingBottom: '120%' }}>
                <Image
                  src={person.imageUrl}
                  alt={person.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized={typeof person.imageUrl === 'string'}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  style={{ objectPosition: person.objectPosition }}
                />

                {/* Gradient overlay — ensures text area is always legible */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Index badge — top-right */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-white leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Name + role pinned to bottom of photo */}
                <div className="absolute bottom-0 left-0 right-0 px-5 py-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#D46868] mb-1">
                    {person.role}
                  </p>
                  <h3 className="text-[16px] font-semibold text-white leading-snug drop-shadow-sm">
                    {person.name}
                  </h3>
                </div>
              </div>

              {/* Red bottom accent line */}
              <div className="h-[3px] bg-[#C25757] w-0 group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
