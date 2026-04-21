'use client'
import React, { useState } from 'react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import WhatsAppWidget from 'react-whatsapp-chat-widget'
import 'react-whatsapp-chat-widget/index.css'

const contactInfo = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Office Address',
    value: 'Ramshab Lane, Along Ngong Road\nNext to Nairobi Baptist Church, Nairobi',
    iconBg: 'bg-[#C25757]',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: 'Phone Number',
    value: '+254 705 927 424',
    href: 'tel:+254705927424',
    iconBg: 'bg-[#236331]',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Email Address',
    value: 'info@upiaparty.com',
    href: 'mailto:info@upiaparty.com',
    iconBg: 'bg-[#111111]',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Office Hours',
    value: 'Monday – Friday: 9:00 AM – 5:00 PM\nWeekends: Closed',
    iconBg: 'bg-[#A84545]',
  },
]

const inputClass =
  'block w-full rounded-[6px] border border-[#E2DCDA] bg-white px-[14px] text-sm text-[#111111] placeholder:text-[#5A5450]/50 focus:border-[#D46868] focus:outline-none focus:ring-[3px] focus:ring-[rgba(194,87,87,0.12)] transition-all'

const labelClass = 'block text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450] mb-2'

export default function Contact() {
  const [formState, setFormState] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <WhatsAppWidget
        phoneNo="+254705927424"
        position="right"
        widgetWidth="400px"
        widgetWidthMobile="360px"
        autoOpen={true}
        autoOpenTimer={2000}
        messageBox={true}
        messageBoxTxt="Hi, I need help with... ?"
        iconSize="40"
        iconColor="white"
        iconBgColor="#236331"
        headerIconColor="white"
        headerTxtColor="white"
        headerBgColor="#236331"
        headerTitle="UPIA Support"
        headerCaption="Online"
        bodyBgColor="#f0fdf4"
        chatPersonName="Support"
        chatMessage={<>Hi there 👋 <br /><br /> How can I help you?</>}
        footerBgColor="#f0fdf4"
        placeholder="Type a message..."
        btnBgColor="#236331"
        btnTxt="Start Chat"
        btnTxtColor="white"
      />

      <div className="min-h-screen bg-white">
        <Header />

        {/* Page hero */}
        <section className="relative overflow-hidden bg-[#14321e] pt-[60px]">
          <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, rgba(35,99,49,0.18) 0%, rgba(35,99,49,0.14) 50%, rgba(20,60,30,0.16) 100%)' }} />
          <div className="absolute -bottom-16 -left-16 h-[280px] w-[280px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(107,38,38,0.50) 0%, transparent 70%)' }} />
          <div className="absolute -top-10 right-0 h-[200px] w-[200px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(194,87,87,0.25) 0%, transparent 70%)' }} />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 text-center">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-white/60 mb-4">
              Get in Touch
            </span>
            <h1 className="text-[32px] font-semibold text-white sm:text-5xl">
              Contact UPIA Kenya
            </h1>
            <p className="mt-4 text-[15px] leading-[1.75] text-white/55 max-w-xl mx-auto">
              We are a progressive political party committed to unbiased development. Reach out — we&apos;d love to hear from you.
            </p>
          </div>
          <div className="flex h-1">
            <div className="flex-1 bg-[#C25757]" />
            <div className="flex-1 bg-[#236331]" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-[#111111]" />
          </div>
        </section>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          {/* Contact cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-16">
            {contactInfo.map((item) => (
              <div
                key={item.label}
                className="rounded-[12px] bg-white p-[20px]"
                style={{ border: '0.5px solid #E2DCDA' }}
              >
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-[8px] ${item.iconBg} text-white mb-4`}>
                  {item.icon}
                </div>
                <h3 className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450] mb-2">{item.label}</h3>
                {item.href ? (
                  <a href={item.href} className="text-sm font-medium text-[#111111] hover:text-[#C25757] transition-colors">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm text-[#5A5450] whitespace-pre-line">{item.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Form + Map */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Contact form */}
            <div className="rounded-[12px] bg-white overflow-hidden" style={{ border: '0.5px solid #E2DCDA' }}>
              <div className="border-b border-[#E2DCDA] px-4 py-5 sm:px-8 sm:py-6">
                <h2 className="text-[22px] font-medium text-[#111111]">Send us a Message</h2>
                <p className="text-sm text-[#5A5450] mt-1">We&apos;ll respond within 24 hours</p>
              </div>

              {submitted ? (
                <div className="p-6 sm:p-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF5EC] mb-6">
                    <svg className="h-8 w-8 text-[#236331]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-[17px] font-medium text-[#111111]">Message Sent!</h3>
                  <p className="mt-2 text-sm text-[#5A5450]">Thank you for reaching out. We&apos;ll get back to you soon.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-sm font-medium text-[#C25757] hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="px-4 py-5 sm:px-8 sm:py-8 space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="first-name" className={labelClass}>First Name *</label>
                      <input type="text" id="first-name" className={inputClass} style={{ height: '42px' }}
                        placeholder="John" required
                        value={formState.firstName} onChange={(e) => setFormState(s => ({ ...s, firstName: e.target.value }))} />
                    </div>
                    <div>
                      <label htmlFor="last-name" className={labelClass}>Last Name *</label>
                      <input type="text" id="last-name" className={inputClass} style={{ height: '42px' }}
                        placeholder="Doe" required
                        value={formState.lastName} onChange={(e) => setFormState(s => ({ ...s, lastName: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>Email Address *</label>
                    <input type="email" id="email" className={inputClass} style={{ height: '42px' }}
                      placeholder="john@example.com" required
                      value={formState.email} onChange={(e) => setFormState(s => ({ ...s, email: e.target.value }))} />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelClass}>Phone Number</label>
                    <input type="tel" id="phone" className={inputClass} style={{ height: '42px' }}
                      placeholder="+254 7XX XXX XXX"
                      value={formState.phone} onChange={(e) => setFormState(s => ({ ...s, phone: e.target.value }))} />
                  </div>
                  <div>
                    <label htmlFor="message" className={labelClass}>Message *</label>
                    <textarea id="message" rows={5} className={inputClass}
                      style={{ paddingTop: '10px', paddingBottom: '10px', height: 'auto' }}
                      placeholder="How can we help you?" required
                      value={formState.message} onChange={(e) => setFormState(s => ({ ...s, message: e.target.value }))} />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-[6px] bg-[#C25757] px-6 py-4 text-sm font-medium text-white hover:bg-[#A84545] active:scale-[0.99] transition-all duration-150 focus:outline-none focus:ring-[3px] focus:ring-[rgba(194,87,87,0.20)]"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Map */}
            <div className="rounded-[12px] overflow-hidden min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]" style={{ border: '0.5px solid #E2DCDA' }}>
              <iframe
                className="h-full w-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] border-0"
                src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Ramshab+Lane,+Along+Ngong+Road,+Nairobi,+(UPIA%20Party%20HQ)&t=&z=15&ie=UTF8&iwloc=B&output=embed"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="UPIA Party HQ"
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
