'use client'
import React from 'react'
import {
  LifebuoyIcon,
  NewspaperIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline'

import vision from '../images/images/vision.jpg'
import mission from '../images/images/mission.jpg'
import equity from '../images/images/equity.jpg'
import Image from 'next/image'

const cards = [
  {
    name: 'IDEOLOGY',
    description:
      'The party aims to establish political stability, advance economic empowerment, create social justice, and ensure equitable resource sharing for all.',
    image: mission,
    icon: <LifebuoyIcon className="h-6 w-6" />,
  },
  {
    name: 'VISION',
    description:
      'To have a country that is united, prosperous, and sustainably developed with equal opportunities for all Kenyans to develop their potential and be free from poverty.',
    image: vision,
    icon: <LifebuoyIcon className="h-6 w-6" />,
  },
  {
    name: 'MISSION',
    description:
      'To identify and build capacity for all Kenyans to realize and exercise their political, social, economic, and cultural rights and fundamental freedoms enshrined in the constitution.',
    image: equity,
    icon: <LifebuoyIcon className="h-6 w-6" />,
  },
]

export default function AboutHome() {
  return (
    <div className="sm:py-15 h-50 relative isolate overflow-hidden bg-white py-5">
      <h1 className="text-2xl text-center font-extrabold tracking-tight text-black sm:text-3xl">
        <span className="text-red-500">Pillars</span> of{' '}
        <span className="text-green-600">UPIA</span>
      </h1>
      <div className="mx-auto max-w-7xl px-4 lg:px-5">
        <div className="flex justify-center">
          <div className="max-w-2xl text-center lg:mx-0"></div>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
          {cards.map((card) => (
            <div
              key={card.name}
              className="bg-white-300 border-white-200 dark:bg-white-300 dark:border-white-700 max-w-sm rounded-lg border p-4 shadow "
            >
              <a href="#">
                <Image
                  className="rounded-t-lg transition-transform hover:scale-105"
                  src={card.image}
                  alt="img"
                  width={200}
                  height={200}
                  layout="responsive"
                />
              </a>

              <div className="text-base leading-7">
                <h3 className="mt-2 flex items-center text-1xl font-bold tracking-tight text-black dark:text-black">
                  <div className="mr-2">{card.icon}</div>
                  {card.name}
                </h3>
                <p className="mt-2 text-black">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
