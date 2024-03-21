import Image from 'next/image'

import { Button } from './Button'
import { Container } from './Container'
import backgroundImage from '../images/images/about-1.jpg'

export function CallToAction() {
  return (
    <section id="get-started-today" className="relative overflow-hidden bg-green-600 py-0 flex flex-col sm:flex-row items-center">
    {/* Image */}
    <div className="w-full sm:w-1/2">
      <Image
        className="max-w-none"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
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
        <Button href="/join" color="white" className="mt-10">
          Join Us
        </Button>
      </div>
    </Container>
  </section>
    )
  }  