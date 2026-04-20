import Image from 'next/image'
import ukur from '../images/images/CS-Ukur-1-removebg-preview.png'
import chairman from '../images/images/chairman.jpg'
import secgen from '../images/images/secgen.jpeg'
import hibo from '../images/images/hibo.jpeg'
import sadick from '../images/images/Sadick PP.jpg'
import kanguchu from '../images/images/kanguchu-removebg-preview.png'

const people = [
  { name: 'Amb. Ukur Yattani',       role: 'Party Leader',         imageUrl: ukur      },
  { name: 'Dr. Nuh Nassir Abdi',     role: 'Chairman',             imageUrl: chairman  },
  { name: 'Dr. Mohamed Dahir Duale', role: 'Secretary General',    imageUrl: secgen    },
  { name: 'Hon. Joseph Kanguchu',    role: 'Organizing Secretary', imageUrl: kanguchu  },
  { name: 'Hon. Hibo Bishar',        role: 'National Treasurer',   imageUrl: hibo      },
  { name: 'Hon. Sadick Doufa',       role: 'Chief Executive Officer', imageUrl: sadick },
]

export default function Leadership() {
  return (
    <section className="relative bg-white py-20 sm:py-28">
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
          {/* Decorative rule */}
          <div className="hidden sm:block flex-shrink-0 w-24 h-px bg-[#E2DCDA]" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-px bg-[#E2DCDA] sm:grid-cols-2 lg:grid-cols-3">
          {people.map((person, i) => (
            <div
              key={i}
              className="group relative bg-white flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-lg hover:z-10"
            >
              {/* Photo */}
              <div className="relative h-96 overflow-hidden bg-[#F8F5F3]">
                <Image
                  src={person.imageUrl}
                  alt={person.name}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              {/* Info block */}
              <div className="flex items-stretch">
                {/* Red left accent */}
                <div className="w-1 flex-shrink-0 bg-[#C25757]" />

                <div className="flex-1 px-5 py-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C25757] mb-1">
                    {person.role}
                  </p>
                  <h3 className="text-[17px] font-semibold text-[#111111] leading-snug">
                    {person.name}
                  </h3>
                </div>

                {/* Index number — subtle corporate detail */}
                <div className="flex items-center pr-5">
                  <span className="text-[28px] font-bold text-[#E2DCDA] leading-none select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
