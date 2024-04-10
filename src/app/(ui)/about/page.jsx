'use client'
import { useState } from 'react'
import hero from '../../../images/images/about-1.jpg'
import img1 from '../../../images/images/about-2.jpg'
import img2 from '../../../images/images/about-3.jpg'
import img3 from '../../../images/images/about-4.jpg'
import img4 from '../../../images/images/about-5.jpg'
import img5 from '../../../images/images/about-6.jpg'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import Image from 'next/image'

const stats = [
  { label: 'Lawfully elected ', value: '0 Governors' },
  { label: 'Voter oriented', value: '2 Mps' },
  { label: 'grasroots sensitized', value: '30 MCAs ' },
]
const values = [
  {
    name: 'Inclusivity',
    description:
      'We believe in embracing diversity and fostering an environment where every individual, regardless of background or belief, feels valued, respected, and included in the political process.',
  },
  {
    name: 'Transparency',
    description:
      'We are committed to transparency in governance, ensuring that our actions, decisions, and policies are open to scrutiny and accessible to all citizens. We believe that transparency is essential for building trust and accountability within our party and with the communities we serve.',
  },
  {
    name: 'Innovation',
    description:
      'We recognize the importance of embracing innovation in addressing complex challenges and shaping the future of our society. We strive to harness new ideas, technologies, and approaches to governance to drive positive change and improve the lives of all citizens.',
  },
  {
    name: 'Collaboration',
    description:
      'We believe in the power of collaboration and partnership to achieve our goals. We seek to work across political divides and engage with diverse stakeholders to find common ground, build consensus, and enact meaningful and sustainable solutions for the benefit of our nation.',
  },
  {
    name: 'Peace',
    description:
      'We prioritize the promotion of peace both domestically and internationally. We advocate for diplomacy, conflict resolution, and the protection of human rights as fundamental principles of our governance. We believe that a peaceful society fosters stability, prosperity, and social harmony, and we are dedicated to fostering dialogue, understanding, and reconciliation among all communities.',
  },
  {
    name: 'Economic Growth',
    description:
      'We are dedicated to fostering robust economic growth that benefits all members of society. We advocate for policies that promote entrepreneurship, innovation, and sustainable development, creating opportunities for job creation, wealth distribution, and upward mobility. We believe in fostering an environment where businesses can thrive, investments are encouraged, and economic prosperity is shared equitably among all citizens.',
  },
]

export default function About() {
  return (
    <div>
      <Header />
      <main className="isolate min-h-screen ">
        <div className="relative isolate -z-10 ">
          <svg
            className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
            />
          </svg>
          <div
            className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
            aria-hidden="true"
          >
            <div
              className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
              }}
            />
          </div>
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    We’re changing the way parties and leaders connect.
                  </h1>
                  <p className="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                    We endevour to forge a cohesive society where every voice is
                    heard, every opportunity is accessible, and every idea is
                    valued. Through relentless dedication to equity and
                    pioneering innovation, we strive to unite diverse
                    perspectives, foster inclusive growth, and catalyze positive
                    change for all.
                  </p>
                </div>
                <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <div className="relative">
                      <Image
                        src={img4}
                        width={300}
                        layout="responsive"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <Image
                        src={img2}
                        layout="responsive"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <Image
                        src={img3}
                        layout="responsive"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <div className="relative">
                      <Image
                        src={img5}
                        layout="responsive"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <Image
                        src={img1}
                        layout="responsive"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our mission
            </h2>
            <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
              <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
                <p className="text-xl leading-8 text-gray-600"></p>
                <div className="mt-10 max-w-xl text-base leading-7 text-gray-700">
                  <p>
                    By leveraging cutting-edge technology and user-centric
                    design, we're empowering parties and leaders to transcend
                    geographical and ideological boundaries, reaching out to a
                    diverse range of individuals and communities. Our platform
                    serves as a catalyst for collaboration, enabling parties to
                    tap into the collective wisdom and energy of their
                    supporters, driving informed decision-making and effective
                    governance.
                  </p>
                  <p className="mt-10">
                    Moreover, we're democratizing access to political discourse,
                    amplifying the voices of marginalized groups and
                    underrepresented communities. By breaking down silos and
                    embracing diversity, we're building a more resilient and
                    responsive political ecosystem, one that reflects the rich
                    tapestry of human experiences and aspirations. In essence,
                    we're not just changing the way parties and leaders connect;
                    we're revolutionizing the very fabric of political
                    engagement, ushering in a new era of inclusivity,
                    transparency, and empowerment. Together, we're shaping a
                    future where every voice matters, and every individual has
                    the opportunity to contribute to the collective well-being
                    of society.
                  </p>
                </div>
              </div>
              <div className="lg:flex lg:flex-auto lg:justify-center">
                <dl className="w-64 space-y-8 xl:w-80">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col-reverse gap-y-4"
                    >
                      <dt className="text-base leading-7 text-gray-600">
                        {stat.label}
                      </dt>
                      <dd className="text-5xl font-semibold tracking-tight text-gray-900">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Image section */}
        <div className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
          <Image
            src={hero}
            alt=""
            width={600}
            height={300}
            layout="responsive"
            className="aspect-[5/2] w-full object-cover xl:rounded-3xl"
          />
        </div>

        {/* Values section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our values
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.name}>
                <dt className="font-semibold text-gray-900">{value.name}</dt>
                <dd className="mt-1 text-gray-600">{value.description}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Logo cloud */}
        <div className="relative isolate -z-10 mt-32 sm:mt-48">
          <div className="absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden [mask-image:radial-gradient(50%_45%_at_50%_55%,white,transparent)]">
            <svg
              className="h-[40rem] w-[80rem] flex-none stroke-gray-200"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="e9033f3e-f665-41a6-84ef-756f6778e6fe"
                  width={200}
                  height={200}
                  x="50%"
                  y="50%"
                  patternUnits="userSpaceOnUse"
                  patternTransform="translate(-100 0)"
                >
                  <path d="M.5 200V.5H200" fill="none" />
                </pattern>
              </defs>
              <svg x="50%" y="50%" className="overflow-visible fill-gray-50">
                <path
                  d="M-300 0h201v201h-201Z M300 200h201v201h-201Z"
                  strokeWidth={0}
                />
              </svg>
              <rect
                width="100%"
                height="100%"
                strokeWidth={0}
                fill="url(#e9033f3e-f665-41a6-84ef-756f6778e6fe)"
              />
            </svg>
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8"> </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
