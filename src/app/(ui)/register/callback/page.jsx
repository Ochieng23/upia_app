'use client'
import { Suspense, useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { saveAuth } from '../../../../lib/auth'
import { useAuth } from '../../../../context/AuthContext'

const BASE = '/api/backend'
const SESSION_KEY = 'upia_reg_session'

function CallbackInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setAuthUser } = useAuth()

  // phase: verifying → verified → creating → done | pending | failed
  const [phase, setPhase] = useState('verifying')
  const [email, setEmail] = useState('')
  const [sessionToken, setSessionToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const verified = useRef(false)
  const refRef = useRef('')

  const checkPayment = () => {
    const ref = refRef.current
    const session = searchParams.get('session')

    if (!ref) { setPhase('failed'); return }

    fetch(`${BASE}/registration/payment/verify/${ref}`)
      .then((r) => r.json())
      .then(async (data) => {
        if (data.status === 'pending') {
          setPhase('pending')
          return
        }
        if (data.status !== 'success' && !data.alreadyPaid) {
          setPhase('failed')
          return
        }

        // Fetch session details so we can pre-fill the email
        const token = session || localStorage.getItem(SESSION_KEY) || ''
        if (!token) { setPhase('failed'); return }

        try {
          const sr = await fetch(`${BASE}/registration/status/${token}`)
          const sd = await sr.json()
          if (sd.success && sd.data?.email) setEmail(sd.data.email)
        } catch {
          // email is optional UI nicety — not a blocker
        }

        setSessionToken(token)
        localStorage.setItem(SESSION_KEY, token)
        setPhase('verified')
      })
      .catch(() => setPhase('failed'))
  }

  useEffect(() => {
    if (verified.current) return
    verified.current = true

    refRef.current = searchParams.get('reference') || searchParams.get('trxref') || searchParams.get('ref')
    setPhase('verifying')
    checkPayment()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCheckAgain = () => {
    setPhase('verifying')
    checkPayment()
  }

  const handleCreateAccount = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8)  { setError('Password must be at least 8 characters'); return }

    setSubmitting(true)
    setPhase('creating')
    try {
      const fd = new FormData()
      fd.append('sessionToken', sessionToken)
      fd.append('password', password)

      const res  = await fetch(`${BASE}/registration/complete`, { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Account creation failed')

      saveAuth(data.token, data.refreshToken, data.user)
      setAuthUser(data.user)
      localStorage.removeItem(SESSION_KEY)
      setPhase('done')
      setTimeout(() => router.replace('/portal'), 1800)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setPhase('verified') // return to password form
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F5F3] flex items-center justify-center p-6">
      <div className="bg-white rounded-[12px] p-10 max-w-sm w-full text-center" style={{ border: '0.5px solid #E2DCDA' }}>

        {/* ── Verifying ── */}
        {phase === 'verifying' && (
          <>
            <div className="animate-spin h-12 w-12 rounded-full border-4 border-[#1a3c5e] border-t-transparent mx-auto mb-5" />
            <h1 className="text-lg font-medium text-[#111111]">Verifying Payment</h1>
            <p className="mt-2 text-sm text-[#5A5450]">Please wait while we confirm your payment…</p>
          </>
        )}

        {/* ── Payment verified — set password ── */}
        {phase === 'verified' && (
          <>
            <div className="mx-auto h-14 w-14 rounded-full bg-[#EBF5EC] flex items-center justify-center mb-4">
              <svg className="h-7 w-7 text-[#236331]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-lg font-medium text-[#111111]">Payment Confirmed!</h1>
            <p className="mt-1 text-sm text-[#5A5450]">
              Set a password to complete your account.
            </p>

            <form onSubmit={handleCreateAccount} className="mt-6 text-left space-y-4">
              {email && (
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450] mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="block w-full rounded-[6px] border border-[#E2DCDA] bg-[#F8F5F3] px-[14px] text-sm text-[#111111] cursor-not-allowed"
                    style={{ height: '42px' }}
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450] mb-1.5">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    required
                    className="block w-full rounded-[6px] border border-[#E2DCDA] bg-white px-[14px] pr-11 text-sm text-[#111111] placeholder:text-[#5A5450]/50 focus:border-[#D46868] focus:outline-none focus:ring-[3px] focus:ring-[rgba(194,87,87,0.12)] transition-all"
                    style={{ height: '42px' }}
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5450] hover:text-[#111111] transition-colors">
                    {showPassword ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450] mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat password"
                    required
                    className="block w-full rounded-[6px] border border-[#E2DCDA] bg-white px-[14px] pr-11 text-sm text-[#111111] placeholder:text-[#5A5450]/50 focus:border-[#D46868] focus:outline-none focus:ring-[3px] focus:ring-[rgba(194,87,87,0.12)] transition-all"
                    style={{ height: '42px' }}
                  />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5450] hover:text-[#111111] transition-colors">
                    {showConfirm ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-[6px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-[6px] bg-[#236331] px-6 py-3.5 text-sm font-medium text-white hover:bg-[#2B753A] disabled:opacity-50 transition-all"
              >
                {submitting ? 'Creating account…' : 'Create My Account →'}
              </button>
            </form>
          </>
        )}

        {/* ── Creating account ── */}
        {phase === 'creating' && (
          <>
            <div className="animate-spin h-12 w-12 rounded-full border-4 border-[#236331] border-t-transparent mx-auto mb-5" />
            <h1 className="text-lg font-medium text-[#111111]">Creating Your Account</h1>
            <p className="mt-2 text-sm text-[#5A5450]">Setting up your aspirant profile…</p>
          </>
        )}

        {/* ── All done ── */}
        {phase === 'done' && (
          <>
            <div className="mx-auto h-14 w-14 rounded-full bg-[#EBF5EC] flex items-center justify-center mb-5">
              <svg className="h-7 w-7 text-[#236331]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-lg font-medium text-[#111111]">Registration Complete!</h1>
            <p className="mt-2 text-sm text-[#5A5450]">
              Your account is ready. Taking you to your portal…
            </p>
            <div className="mt-4 h-1 rounded-full bg-[#E2DCDA] overflow-hidden">
              <div className="h-full bg-[#236331]" style={{ width: '100%', transition: 'width 1.8s ease-in-out' }} />
            </div>
          </>
        )}

        {/* ── Still processing (e.g. mobile money confirmation in progress) ── */}
        {phase === 'pending' && (
          <>
            <div className="mx-auto h-14 w-14 rounded-full bg-amber-50 flex items-center justify-center mb-5">
              <svg className="h-7 w-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-lg font-medium text-[#111111]">Still Confirming Your Payment</h1>
            <p className="mt-2 text-sm text-[#5A5450]">
              If you approved an M-Pesa or mobile money prompt, this can take a minute to confirm.
              If money was deducted, there's no need to pay again — it will confirm automatically.
            </p>
            <button
              type="button"
              onClick={handleCheckAgain}
              className="mt-6 inline-flex items-center justify-center w-full rounded-[6px] bg-[#236331] px-6 py-3 text-sm font-medium text-white hover:bg-[#2B753A] transition-colors"
            >
              Check Again
            </button>
          </>
        )}

        {/* ── Failed ── */}
        {phase === 'failed' && (
          <>
            <div className="mx-auto h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mb-5">
              <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-lg font-medium text-[#111111]">Payment Not Confirmed</h1>
            <p className="mt-2 text-sm text-[#5A5450]">
              The payment was not completed or could not be verified. Your registration details are saved — you can go back and try again.
            </p>
            <button
              type="button"
              onClick={handleCheckAgain}
              className="mt-6 inline-flex items-center justify-center w-full rounded-[6px] bg-[#1a3c5e] px-6 py-3 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 transition-colors"
            >
              Check Again
            </button>
            <Link
              href="/register/aspirant"
              className="mt-3 inline-flex items-center justify-center w-full rounded-[6px] px-6 py-3 text-sm font-medium text-[#5A5450] hover:text-[#111111] transition-colors"
            >
              ← Back to Registration
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function RegistrationCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F5F3] flex items-center justify-center">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-[#1a3c5e] border-t-transparent" />
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  )
}
