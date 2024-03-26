'use client'
import Image from 'next/image'
import CountUp from 'react-countup';
import { Button } from './Button'
import { Container } from './Container'
import backgroundImage from '../images/images/about-1.jpg'

export function CallToAction() {
  return (
    <section
      id="get-started-today"
      className="relative flex flex-col items-center overflow-hidden bg-green-600 py-0 sm:flex-row"
    >
      {/* Image */}
      <div className="w-full  sm:w-1/2">
        <Image
          className="max-w-none h-full "
          src={backgroundImage}
          alt=""
          width={2347}
          height={1250}
          layout="responsive"
        />
      </div>

      {/* Container */}
      <Container className="relative w-full sm:w-1/2 sm:py-20 ">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Be a part of change!
          </h2>
          <p className="mt-4 text-lg font-bold tracking-tight text-white">
            Become a United Party Independent Alliance Member today
          </p>
          <CountUp className='text-5xl font-extrabold text-red-600' end={1000007} /> <span className='text-red-600 text-4xl font-bold'>+</span>
               <hr />
               <div><h1 className='font-bold text-white text-2xl'>Registered Members</h1></div>
          <Button href="/register" color="white" className="mt-2 ">
            Join Us
          </Button>
        </div>
      </Container>
    </section>
  )
}
