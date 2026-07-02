'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Logo } from '../../../components/Logo'

const BASE = '/api/backend'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const token        = searchParams.get('token') || ''

  const [password,      setPassword]      = useState('')
  const [confirm,       setConfirm]       = useState('')
  const [showPass,      setShowPass]      = useState(false)
  const [loading,       setLoading]       = useState(false)
  const [verifying,     setVerifying]     = useState(true)
  const [tokenValid,    setTokenValid]    = useState(false)
  const [done,          setDone]          = useState(false)
  const [error,         setError]         = useState('')

  // Verify the token is valid before showing the form
  useEffect(() => {
    if (!token) { setVerifying(false); return }
    fetch(`${BASE}/auth/verify-reset-token?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d) => { setTokenValid(!!d.success) })
      .catch(() => { setTokenValid(false) })
      .finally(() => setVerifying(false))
  }, [token])

  const strengthLevel = () => {
    if (password.length === 0) return 0
    let score = 0
    if (password.length >= 8)  score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }

  const strength = strengthLevel()
  const strengthLabel  = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'][strength] || ''
  const strengthColor  = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'][strength] || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8)  { setError('Password must be at least 8 characters.'); return }

    setLoading(true)
    try {
      const res  = await fetch(`${BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Reset failed')
      setDone(true)
      setTimeout(() => router.push('/login'), 4000)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const EyeIcon = ({ open }) => open ? (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )

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
              Account Security
            </span>
            <h1 className="text-4xl font-semibold text-white leading-tight">
              Choose a strong<br />new password
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-white/55 max-w-sm">
              Your new password must be at least 8 characters. We recommend mixing letters,
              numbers, and symbols for a stronger password.
            </p>
            <div className="mt-10 rounded-[10px] border border-white/10 bg-white/5 p-5 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50 mb-3">Password tips</p>
              {[
                'At least 8 characters long',
                'Mix uppercase and lowercase letters',
                'Include at least one number',
                'Use a symbol like ! @ # $ %',
                'Avoid using personal information',
              ].map((tip) => (
                <div key={tip} className="flex items-center gap-2 text-sm text-white/60">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#C25757]/80 flex-shrink-0" />
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[400px]">

          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/"><Logo className="h-14 w-auto" /></Link>
          </div>

          {verifying && (
            <div className="flex flex-col items-center gap-4 py-12">
              <svg className="h-8 w-8 animate-spin text-[#1a3c5e]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm text-[#5A5450]">Verifying your reset link…</p>
            </div>
          )}

          {!verifying && !tokenValid && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#111111] mb-3">Link expired or invalid</h2>
              <p className="text-[15px] text-[#5A5450] leading-relaxed mb-8">
                This password reset link has expired or has already been used.
                Reset links are valid for <strong>30 minutes</strong>.
              </p>
              <Link
                href="/forgot-password"
                className="inline-block w-full rounded-[8px] bg-[#C25757] px-6 py-3.5 text-center text-sm font-semibold text-white hover:bg-[#b04d4d] transition-all"
              >
                Request a New Link
              </Link>
              <p className="mt-4 text-sm text-[#5A5450]">
                <Link href="/login" className="font-medium text-[#1a3c5e] hover:underline">
                  Back to Sign In
                </Link>
              </p>
            </div>
          )}

          {!verifying && tokenValid && !done && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[#111111]">Set new password</h2>
                <p className="mt-2 text-sm text-[#5A5450]">
                  Choose a strong password for your UPIA Kenya account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New password */}
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450] mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      required
                      autoFocus
                      className="block w-full rounded-[6px] border border-[#E2DCDA] bg-white px-[14px] pr-10 text-sm text-[#111111] placeholder:text-[#5A5450]/50 focus:border-[#C25757] focus:outline-none focus:ring-[3px] focus:ring-[rgba(194,87,87,0.12)] transition-all"
                      style={{ height: '44px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5450] hover:text-[#111111] transition-colors"
                      tabIndex={-1}
                    >
                      <EyeIcon open={showPass} />
                    </button>
                  </div>

                  {/* Strength meter */}
                  {password.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <div
                            key={n}
                            className="h-1 flex-1 rounded-full transition-colors"
                            style={{ background: strength >= n ? strengthColor : '#E2DCDA' }}
                          />
                        ))}
                      </div>
                      <p className="text-[11px]" style={{ color: strengthColor }}>
                        {strengthLabel}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450] mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your new password"
                    required
                    className="block w-full rounded-[6px] border border-[#E2DCDA] bg-white px-[14px] text-sm text-[#111111] placeholder:text-[#5A5450]/50 focus:border-[#C25757] focus:outline-none focus:ring-[3px] focus:ring-[rgba(194,87,87,0.12)] transition-all"
                    style={{ height: '44px' }}
                  />
                  {confirm && password !== confirm && (
                    <p className="mt-1 text-[11px] text-red-500">Passwords do not match</p>
                  )}
                  {confirm && password === confirm && confirm.length >= 8 && (
                    <p className="mt-1 text-[11px] text-[#236331]">Passwords match</p>
                  )}
                </div>

                {error && (
                  <div className="rounded-[6px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || password.length < 8 || password !== confirm}
                  className="w-full rounded-[8px] bg-[#236331] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#2B753A] active:scale-[0.99] disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Updating…
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>

                <p className="text-center text-sm text-[#5A5450]">
                  <Link href="/login" className="font-medium text-[#1a3c5e] hover:underline">
                    Back to Sign In
                  </Link>
                </p>
              </form>
            </>
          )}

          {!verifying && done && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF5EC]">
                <svg className="h-8 w-8 text-[#236331]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#111111] mb-3">Password updated!</h2>
              <p className="text-[15px] text-[#5A5450] leading-relaxed mb-8">
                Your password has been changed successfully. You'll be redirected to the
                sign-in page in a moment.
              </p>
              <Link
                href="/login"
                className="inline-block w-full rounded-[8px] bg-[#1a3c5e] px-6 py-3.5 text-center text-sm font-semibold text-white hover:bg-[#1a3c5e]/90 transition-all"
              >
                Sign In Now
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <svg className="h-8 w-8 animate-spin text-[#1a3c5e]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
