'use client'
import React from 'react'

function Location() {
  return (
    <div className="mb-3 mt-5 bg-white">
      <h1 className="text-center text-2xl font-extrabold text-black">
        Our <span className=" text-red-500">Location</span>
      </h1>
      <div className=" mx-auto   max-w-2xl sm:mt-20 lg:mx-0 lg:flex lg:max-w-none lg:gap-0">
        <div className="m-5 w-auto lg:w-1/3 ">
          <div className="sm:w-50 max-w-sm  rounded-lg border border-gray-200 bg-white p-6 shadow sm:m-5 md:mt-5 dark:border-gray-700 dark:bg-gray-800">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              UPIA PARTY HQ-Nairobi{' '}
            </h5>
            <a href="#">
              <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Opening Hours
              </h5>
            </a>
            <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
              Mon-Friday 9:00 AM - 5:00 PM
            </p>
            <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
              Weekends closed
            </p>
            <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Location
            </h5>
            <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
              Gem Lane, Mandera Road, Kileleshwa, Nairobi
            </p>
            <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Contact Us
            </h5>
            <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
              +254791410460
            </p>
            <a
              href="#"
              className="inline-flex items-center font-medium text-blue-600 hover:underline"
            >
              See our guideline
              <svg
                className="ms-2.5 h-3 w-3 rtl:rotate-[270deg]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
                />
              </svg>
            </a>
          </div>
        </div>
        <div className="w-full sm:mb-4  sm:mt-5 lg:w-2/3   ">
          <div style={{ marginBottom: '10px' }} className=" md:mt-5">
            <iframe
              width="90%"
              height="400"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              className="sm:w-50 sm: ml-5"
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Gem%20Lane,%20Mandera%20Road,%20Kileleshwa,%20Nairobi,+(UPIA%20Party%20HQ)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
            >
              <a href="https://www.gps.ie/">gps devices</a>
            </iframe>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Location
