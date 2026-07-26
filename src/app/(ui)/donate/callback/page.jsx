'use client'
import { Suspense, useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const BASE = '/api/backend'

function CallbackInner() {
  const searchParams = useSearchParams()
  const [phase, setPhase]     = useState('verifying') // verifying | success | failed
  const [amount, setAmount]   = useState(null)
  const [donorName, setDonorName] = useState('')
  const verified = useRef(false)

  useEffect(() => {
    if (verified.current) return
    verified.current = true

    const ref = searchParams.get('reference') || searchParams.get('trxref') || searchParams.get('ref')
    if (!ref) { setPhase('failed'); return }

    fetch(`${BASE}/donations/verify/${ref}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.status === 'success') {
          setAmount(data.amount)
          setDonorName(data.metadata?.donorName || '')
          setPhase('success')
        } else {
          setPhase('failed')
        }
      })
      .catch(() => setPhase('failed'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-[#F8F5F3] flex items-center justify-center p-6">
      <div className="bg-white rounded-[12px] p-10 max-w-sm w-full text-center" style={{ border: '0.5px solid #E2DCDA' }}>

        {phase === 'verifying' && (
          <>
            <div className="animate-spin h-12 w-12 rounded-full border-4 border-[#236331] border-t-transparent mx-auto mb-5" />
            <h1 className="text-lg font-medium text-[#111111]">Verifying your donation…</h1>
            <p className="mt-2 text-sm text-[#5A5450]">Please wait a moment.</p>
          </>
        )}

        {phase === 'success' && (
          <>
            <div className="mx-auto h-16 w-16 rounded-full bg-[#EBF5EC] flex items-center justify-center mb-5">
              <svg className="h-8 w-8 text-[#236331]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-[#111111]">Thank You{donorName ? `, ${donorName.split(' ')[0]}` : ''}!</h1>
            {amount && (
              <p className="mt-2 text-2xl font-bold text-[#236331]">
                KES {amount.toLocaleString()}
              </p>
            )}
            <p className="mt-3 text-sm text-[#5A5450]">
              Your donation has been received. Together we are building a better Kenya.
            </p>
            <div className="mt-6 h-0.5 w-12 bg-[#E2DCDA] mx-auto" />
            <p className="mt-4 text-xs text-[#5A5450]">A receipt has been sent to your email.</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center w-full rounded-[6px] bg-[#236331] px-6 py-3 text-sm font-medium text-white hover:bg-[#2B753A] transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/donate"
              className="mt-3 inline-flex items-center justify-center w-full rounded-[6px] bg-[#F8F5F3] px-6 py-3 text-sm font-medium text-[#5A5450] hover:bg-[#E2DCDA] transition-colors"
              style={{ border: '0.5px solid #E2DCDA' }}
            >
              Donate Again
            </Link>
          </>
        )}

        {phase === 'failed' && (
          <>
            <div className="mx-auto h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-lg font-medium text-[#111111]">Payment Not Confirmed</h1>
            <p className="mt-2 text-sm text-[#5A5450]">
              The donation was not completed or could not be verified. No charge was made.
            </p>
            <Link
              href="/donate"
              className="mt-6 inline-flex items-center justify-center w-full rounded-[6px] bg-[#1a3c5e] px-6 py-3 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 transition-colors"
            >
              ← Try Again
            </Link>
          </>
        )}

      </div>
    </div>
  )
}

export default function DonateCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F5F3] flex items-center justify-center">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-[#236331] border-t-transparent" />
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  )
}
