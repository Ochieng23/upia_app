'use client'
import React from 'react'
import { FaBookmark } from "react-icons/fa";

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
    icon: <FaBookmark className="h-5 w-6" />,
  },
  {
    name: 'VISION',
    description:
      'To have a country that is united, prosperous, and sustainably developed with equal opportunities for all Kenyans to develop their potential and be free from poverty.',
    image: vision,
    icon: <FaBookmark className="h-5 w-6" />,
  },
  {
    name: 'MISSION',
    description:
      'To identify and build capacity for all Kenyans to realize and exercise their political, social, economic, and cultural rights and fundamental freedoms enshrined in the constitution.',
    image: equity,
    icon: <FaBookmark className="h-5 w-6" />,
  },
]

export default function AboutHome() {
  return (
    <div className="sm:py-15 relative isolate  overflow-hidden bg-white py-2">
      <h1 className="py-5 text-center text-2xl font-extrabold tracking-tight text-red-600 sm:text-2xl">
        <span className="">Mission</span> Statement{' '}
        <span className=""></span>
      </h1>
      <div className="mx-auto max-w-7xl px-4 lg:px-5">
        <div className="flex justify-center">
          <div className="max-w-2xl text-center lg:mx-0"></div>
        </div>
        <div className="mx-auto  mt-6 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none md:grid-cols-3 lg:grid-cols-3 lg:gap-8">
          {cards.map((card) => (
            <div
              key={card.name}
              className="bg-white-300 border-white-200 dark:border-white-700 max-w-sm rounded-lg border p-4 shadow dark:bg-slate-100 "
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
                <h3 className="text-1xl mt-2 flex items-center font-bold tracking-tight text-black dark:text-black">
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
