import React from 'react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import Image from 'next/image'

export default function Example() {
  return (
    <>
      <Header />
      <main className="relative isolate min-h-screen  overflow-hidden bg-slate-100 px-6 py-24 sm:py-32 lg:px-8">
        <Image
          src=""
          alt=""
          width={400}
          height={400}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div
          className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div
          className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
          aria-hidden="true"
        >
          <div
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto min-h-screen max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-black sm:text-6xl">
            Support our course
          </h2>
          <h3 className="text-black-300 mt-6 text-lg leading-8">
            Paybill Number: 247247
          </h3>
          <h3 className="text-black-300 mt-6 text-lg leading-8">
            Account Number: 1010272135531
          </h3>
        </div>
      </main>
      <Footer />
    </>
  )
}
