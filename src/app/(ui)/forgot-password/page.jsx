'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '../../../components/Logo'

const BASE = '/api/backend'

export default function ForgotPassword() {
  const [email,     setEmail]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [sent,      setSent]      = useState(false)
  const [error,     setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res  = await fetch(`${BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Request failed')
      setSent(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] flex-col bg-[#1a3c5e] relative overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute top-1/2 -right-24 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-white/5" />
        <div className="flex h-1 flex-shrink-0">
          <div className="flex-1 bg-[#C25757]" />
          <div className="flex-1 bg-[#236331]" />
          <div className="flex-1 bg-white/40" />
          <div className="flex-1 bg-[#111111]/60" />
        </div>
        <div className="relative flex flex-col flex-1 px-12 py-12">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-20 w-auto brightness-0 invert" />
          </Link>
          <div className="flex-1 flex flex-col justify-center">
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-white/60 mb-6">
              Account Recovery
            </span>
            <h1 className="text-4xl font-semibold text-white leading-tight">
              Forgot your<br />password?
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-white/55 max-w-sm">
              No problem. Enter your email address and we will send you a secure link
              to reset your password within minutes.
            </p>
            <div className="mt-10 rounded-[10px] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50 mb-2">What happens next</p>
              <ol className="space-y-2">
                {[
                  'Enter your registered email address',
                  'Check your inbox for a reset link',
                  'Click the link and choose a new password',
                  'Sign in with your new password',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-white/65">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#C25757]/80 text-[10px] font-semibold text-white mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/">
              <Logo className="h-14 w-auto" />
            </Link>
          </div>

          {sent ? (
            /* Success state */
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF5EC]">
                <svg className="h-8 w-8 text-[#236331]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#111111] mb-3">Check your inbox</h2>
              <p className="text-[15px] text-[#5A5450] leading-relaxed mb-2">
                If <strong className="text-[#111111]">{email}</strong> is registered with UPIA Kenya,
                you will receive a password reset link shortly.
              </p>
              <p className="text-[13px] text-[#5A5450] leading-relaxed mb-8">
                The link expires in <strong>30 minutes</strong>. Check your spam folder if you
                don't see it in your inbox.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => { setSent(false); setEmail('') }}
                  className="w-full rounded-[8px] border border-[#E2DCDA] bg-white px-6 py-3 text-sm font-medium text-[#5A5450] hover:bg-[#F8F5F3] transition-all"
                >
                  Try a different email
                </button>
                <Link
                  href="/login"
                  className="block w-full rounded-[8px] bg-[#1a3c5e] px-6 py-3 text-center text-sm font-medium text-white hover:bg-[#1a3c5e]/90 transition-all"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[#111111]">Reset password</h2>
                <p className="mt-2 text-sm text-[#5A5450]">
                  Enter the email address linked to your UPIA account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus
                    className="block w-full rounded-[6px] border border-[#E2DCDA] bg-white px-[14px] text-sm text-[#111111] placeholder:text-[#5A5450]/50 focus:border-[#C25757] focus:outline-none focus:ring-[3px] focus:ring-[rgba(194,87,87,0.12)] transition-all"
                    style={{ height: '44px' }}
                  />
                </div>

                {error && (
                  <div className="rounded-[6px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-[8px] bg-[#C25757] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#b04d4d] active:scale-[0.99] disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>

                <p className="text-center text-sm text-[#5A5450]">
                  Remembered it?{' '}
                  <Link href="/login" className="font-medium text-[#1a3c5e] hover:underline">
                    Back to Sign In
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
