'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const BASE = '/api/backend'

function CallbackInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState('verifying') // verifying | success | failed

  useEffect(() => {
    const ref = searchParams.get('reference') || searchParams.get('trxref') || searchParams.get('ref')
    const session = searchParams.get('session')

    if (!ref) {
      setStatus('failed')
      return
    }

    fetch(`${BASE}/registration/payment/verify/${ref}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === 'success' || data.alreadyPaid) {
          setStatus('success')
          // Redirect to the aspirant registration page so the user can create their account
          const dest = session
            ? `/register/aspirant?session=${session}&verified=true`
            : '/register/aspirant'
          setTimeout(() => router.replace(dest), 1500)
        } else {
          setStatus('failed')
        }
      })
      .catch(() => setStatus('failed'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-[#F8F5F3] flex items-center justify-center p-6">
      <div
        className="bg-white rounded-[12px] p-10 max-w-sm w-full text-center"
        style={{ border: '0.5px solid #E2DCDA' }}
      >
        {status === 'verifying' && (
          <>
            <div className="animate-spin h-12 w-12 rounded-full border-4 border-[#1a3c5e] border-t-transparent mx-auto mb-5" />
            <h1 className="text-lg font-medium text-[#111111]">Verifying Payment</h1>
            <p className="mt-2 text-sm text-[#5A5450]">Please wait while we confirm your payment…</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto h-14 w-14 rounded-full bg-[#EBF5EC] flex items-center justify-center mb-5">
              <svg className="h-7 w-7 text-[#236331]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-lg font-medium text-[#111111]">Payment Confirmed!</h1>
            <p className="mt-2 text-sm text-[#5A5450]">
              Redirecting you to complete your account setup…
            </p>
            <div className="mt-4 h-1 rounded-full bg-[#E2DCDA] overflow-hidden">
              <div className="h-full bg-[#236331] animate-[progress_1.5s_ease-in-out_forwards]" style={{ width: '100%', animationFillMode: 'forwards' }} />
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="mx-auto h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mb-5">
              <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-lg font-medium text-[#111111]">Payment Not Confirmed</h1>
            <p className="mt-2 text-sm text-[#5A5450]">
              The payment was not completed or could not be verified. You can go back and try again — your registration details are saved.
            </p>
            <Link
              href="/register/aspirant"
              className="mt-6 inline-flex items-center justify-center w-full rounded-[6px] bg-[#1a3c5e] px-6 py-3 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 transition-colors"
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
