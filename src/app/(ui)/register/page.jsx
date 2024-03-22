'use client'
import React, { useState } from 'react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { FaInfo } from 'react-icons/fa'

const RegisterForm = () => {
  // State variables to store form field values
  const [name, setName] = useState('')
  const [otherNames, setOtherNames] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [email, setEmail] = useState('')
  const [membership, setMembership] = useState('Ordinary')
  const [termsAgreed, setTermsAgreed] = useState(false)

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    // Perform form submission logic here
    console.log({
      name,
      otherNames,
      mobileNumber,
      email,
      membership,
      termsAgreed,
    })
    // Reset form fields
    setName('')
    setOtherNames('')
    setMobileNumber('')
    setEmail('')
    setMembership('Ordinary')
    setTermsAgreed(false)
  }

  return (
    <>
      <Header />
      <main className="mb-5 mt-2 flex  items-center justify-center">
        <form className="mx-auto max-w-sm min-h-screen sm:py-10 sm:min-h-screen  sm:mt-10" onSubmit={handleSubmit}>
          <div className="mb-5 flex items-center rounded-lg p-3 bg-red-200">
            <FaInfo className="mr-2 text-blue-600" />
            <span className="text-sm text-gray-900 dark:text-black">
              Please confirm your membership status by dialing:{' '}
              <strong>*509#</strong>
            </span>
          </div>
          <div className="-mx-2 mb-5 flex flex-wrap">
            <div className="w-full px-2 sm:w-1/2">
              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-black"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-white-600 dark:bg-white dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="First and last name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="w-full px-2 sm:w-1/2">
              <div className="mb-5">
                <label
                  htmlFor="other_names"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-black"
                >
                  ID Number
                </label>
                <input
                  type="text"
                  id="other_names"
                  className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-white-600 dark:bg-white dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="20XX2357"
                  value={otherNames}
                  onChange={(e) => setOtherNames(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="mobile_phone"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-black"
            >
              Mobile Number
            </label>
            <input
              type="text"
              id="mobile_phone"
              className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-white-600 dark:bg-white dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="0791XX0460"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <div className="-mx-2 mb-5 flex flex-wrap">
            <div className="w-full px-2 sm:w-1/2">
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-black"
                >
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-white-600 dark:bg-white dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="name@gmail.com"
                  required
                />
              </div>
            </div>
            <div className="w-full px-2 sm:w-1/2">
              <div className="mb-5">
                <label
                  htmlFor="confirm_email"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-black"
                >
                  Confirm Email
                </label>
                <input
                  type="email"
                  id="confirm_email"
                  className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-white-600 dark:bg-white dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="name@gmail.com"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="membership"
              className="mb-2 block text-sm font-medium text-black dark:text-black"
            >
              Select your Membership
            </label>
            <select
              id="membership"
              className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-black focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-white dark:text-black dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              value={membership}
              onChange={(e) => setMembership(e.target.value)}
            >
              <option>Ordinary</option>
              <option>Life</option>
            </select>
          </div>
          <div className="mb-5 flex items-start">
            <input
              id="terms"
              type="checkbox"
              value=""
              className="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-white dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              required
            />
            <label
              htmlFor="terms"
              className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              I agree with the{' '}
              <a
                href="#"
                className="text-blue-600 hover:underline dark:text-blue-500"
              >
                terms and conditions
              </a>
            </label>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-green-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Register
          </button>
        </form>
      </main>
      <Footer />
    </>
  )
}

export default RegisterForm
