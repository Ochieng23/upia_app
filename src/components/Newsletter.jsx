'use client'
import { useState } from 'react'

const BASE = '/api/backend'

export default function Newsletter() {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [msg, setMsg]       = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('submitting')
    setMsg('')
    try {
      const res = await fetch(`${BASE}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        const data = await res.json().catch(() => ({}))
        setStatus('error')
        setMsg(data.message || 'Could not subscribe. Please try again.')
      }
    } catch {
      setStatus('error')
      setMsg('Network error. Please try again.')
    }
  }

  return (
    <section className="bg-[#111111] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-white/55 mb-5">
            Stay Informed
          </span>
          <h2 className="text-[28px] sm:text-[32px] font-semibold text-white">
            Get UPIA Updates
          </h2>
          <p className="mt-3 text-[15px] leading-[1.75] text-white/55">
            Party news, event invites, and policy updates — straight to your inbox.
            No spam, unsubscribe any time.
          </p>

          {status === 'success' ? (
            <div className="mt-8 flex items-center justify-center gap-3 rounded-[8px] bg-[#EBF5EC] px-6 py-4">
              <svg className="h-5 w-5 text-[#236331] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium text-[#236331]">You&apos;re subscribed — welcome aboard!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={status === 'submitting'}
                className="flex-1 min-w-0 rounded-[6px] border border-white/15 bg-white/8 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#236331] focus:outline-none focus:ring-[3px] focus:ring-[rgba(35,99,49,0.25)] transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="flex-shrink-0 inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#236331] px-6 py-3 text-sm font-medium text-white hover:bg-[#2B753A] disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                {status === 'submitting' ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Subscribing…
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-3 text-sm text-red-400">{msg}</p>
          )}
        </div>
      </div>
    </section>
  )
}
