'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Logo } from '../../../components/Logo'
import { useAuth } from '../../../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const form = new FormData(e.target)
    const payload = {
      firstName: form.get('first_name').trim(),
      lastName: form.get('last_name').trim(),
      email: form.get('email').trim(),
      password: form.get('password'),
      phone: form.get('phone').trim(),
    }

    if (payload.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      await register(payload)
      router.push('/portal')
    } catch (err) {
      setError(err.message || 'Registration failed — please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] flex-col bg-[#14321e] relative overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-white/5" />

        <div className="flex h-1 flex-shrink-0">
          <div className="flex-1 bg-[#C25757]" />
          <div className="flex-1 bg-[#236331]" />
          <div className="flex-1 bg-white/40" />
          <div className="flex-1 bg-[#111111]/60" />
        </div>

        <div className="relative flex flex-col flex-1 px-12 py-12">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-10 w-auto brightness-0 invert" />
          </Link>

          <div className="flex-1 flex flex-col justify-center">
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-white/60 mb-6">
              Aspirant Portal
            </span>
            <h1 className="text-4xl font-semibold text-white leading-tight">
              Start your journey<br />with UPIA Kenya
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-white/55 max-w-sm">
              Create an aspirant account to manage your candidacy, register with ORPP, and receive official party certificates.
            </p>

            <ul className="mt-10 space-y-4">
              {[
                'Free aspirant account in seconds',
                'Step-by-step IPPMS registration guidance',
                'Official nomination certificates',
                'Dedicated aspirant dashboard',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/70">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#C25757]">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} United Progressive Independent Alliance
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 flex-col bg-white">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between px-6 py-5 lg:hidden border-b border-[#E2DCDA]">
          <Link href="/">
            <Logo className="h-9 w-auto" />
          </Link>
          <Link href="/login" className="text-sm font-medium text-[#5A5450] hover:text-[#C25757]">
            Already registered? <span className="text-[#C25757]">Sign in</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h2 className="text-[26px] font-semibold text-[#111111]">Create account</h2>
              <p className="mt-2 text-sm text-[#5A5450]">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-[#C25757] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3">
                <svg className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5A5450] mb-2">
                    First Name
                  </label>
                  <input
                    name="first_name"
                    type="text"
                    autoComplete="given-name"
                    required
                    placeholder="Paul"
                    className={fieldCls}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5A5450] mb-2">
                    Last Name
                  </label>
                  <input
                    name="last_name"
                    type="text"
                    autoComplete="family-name"
                    required
                    placeholder="Ochieng"
                    className={fieldCls}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5A5450] mb-2">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className={fieldCls}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5A5450] mb-2">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="0712 345 678"
                  className={fieldCls}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5A5450] mb-2">
                  Password <span className="normal-case text-[#5A5450]/60 font-normal">(min. 8 characters)</span>
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    className={`${fieldCls} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5450] hover:text-[#111111] transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-[8px] bg-[#14321e] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#1e4570] active:scale-[0.99] disabled:opacity-60 transition-all duration-150 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account…
                  </>
                ) : (
                  <>Create account <span aria-hidden="true">→</span></>
                )}
              </button>

              <p className="text-center text-xs text-[#5A5450] pt-1">
                By registering you agree to UPIA&apos;s membership terms.
              </p>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-[#E2DCDA]" />
              <span className="text-xs text-[#5A5450]">or</span>
              <div className="flex-1 h-px bg-[#E2DCDA]" />
            </div>

            <p className="mt-6 text-center text-sm text-[#5A5450]">
              Want to register as a general party member?{' '}
              <Link href="/register" className="font-medium text-[#236331] hover:underline">
                Join UPIA →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const fieldCls =
  'block w-full rounded-[8px] border border-[#E2DCDA] bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] placeholder:text-[#5A5450]/40 focus:border-[#1a3c5e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]/20 transition-all'
