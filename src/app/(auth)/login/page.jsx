'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Logo } from '../../../components/Logo'
import { useAuth } from '../../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = new FormData(e.target)
    try {
      const user = await login(form.get('email'), form.get('password'))
      router.push(user.role === 'admin' ? '/admin' : '/portal')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] flex-col bg-[#6B2626] relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute top-1/2 -right-24 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-white/5" />

        {/* Color bar at top */}
        <div className="flex h-1 flex-shrink-0">
          <div className="flex-1 bg-[#C25757]" />
          <div className="flex-1 bg-[#236331]" />
          <div className="flex-1 bg-white/40" />
          <div className="flex-1 bg-[#111111]/60" />
        </div>

        <div className="relative flex flex-col flex-1 px-12 py-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-10 w-auto brightness-0 invert" />
          </Link>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center">
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-white/60 mb-6">
              Member Portal
            </span>
            <h1 className="text-4xl font-semibold text-white leading-tight">
              Welcome back to<br />UPIA Kenya
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-white/55 max-w-sm">
              Sign in to manage your aspirant profile, track your registration status, and access your certificates.
            </p>

            {/* Feature list */}
            <ul className="mt-10 space-y-4">
              {[
                'Manage your aspirant profile',
                'ORPP party registration via IPPMS',
                'Download nomination certificates',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/70">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#236331]">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Footer note */}
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
          <Link href="/register" className="text-sm font-medium text-[#5A5450] hover:text-[#C25757]">
            Not a member? <span className="text-[#C25757]">Register</span>
          </Link>
        </div>

        {/* Scrollable form area */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
          <div className="w-full max-w-sm">
            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-[26px] font-semibold text-[#111111]">Sign in</h2>
              <p className="mt-2 text-sm text-[#5A5450]">
                Don&apos;t have an account?{' '}
                <Link href="/registerr" className="font-medium text-[#C25757] hover:underline">
                  Create one
                </Link>
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3">
                <svg className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="block w-full rounded-[8px] border border-[#E2DCDA] bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] placeholder:text-[#5A5450]/40 focus:border-[#C25757] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C25757]/20 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5A5450]">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="block w-full rounded-[8px] border border-[#E2DCDA] bg-[#FAFAFA] px-4 py-3 pr-11 text-sm text-[#111111] placeholder:text-[#5A5450]/40 focus:border-[#C25757] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C25757]/20 transition-all"
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
                className="mt-2 w-full rounded-[8px] bg-[#6B2626] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#7d2d2d] active:scale-[0.99] disabled:opacity-60 transition-all duration-150 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>Sign in <span aria-hidden="true">→</span></>
                )}
              </button>
            </form>

            {/* Divider */}
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
