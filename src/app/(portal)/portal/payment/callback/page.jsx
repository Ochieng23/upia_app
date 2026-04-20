'use client'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '../../../../../lib/api'

function PaymentCallbackInner() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('verifying') // verifying | success | failed
  const [payment, setPayment] = useState(null)

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref')
    if (!reference) { setStatus('failed'); return }

    api.get(`/payments/verify/${reference}`)
      .then((data) => {
        setPayment(data.payment)
        setStatus(data.status === 'success' ? 'success' : 'failed')
      })
      .catch(() => setStatus('failed'))
  }, [searchParams])

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-[#F8F5F3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-[#1a3c5e] border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-[#5A5450]">Verifying your payment…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F5F3] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-[#E2DCDA] shadow-sm p-8 max-w-sm w-full text-center">
        {status === 'success' ? (
          <>
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-[#111111]">Payment Confirmed</h1>
            <p className="mt-2 text-sm text-[#5A5450]">
              Your nomination fee of <span className="font-semibold text-[#111111]">KES {(payment?.amount || 5000).toLocaleString()}</span> has been received.
            </p>
            {payment?.reference && (
              <p className="mt-1 text-xs text-[#5A5450] font-mono">Ref: {payment.reference}</p>
            )}
          </>
        ) : (
          <>
            <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-[#111111]">Payment Unsuccessful</h1>
            <p className="mt-2 text-sm text-[#5A5450]">
              The payment was not completed. You can try again from your portal.
            </p>
          </>
        )}

        <Link
          href="/portal"
          className="mt-6 inline-flex items-center justify-center w-full rounded-[8px] bg-[#1a3c5e] px-6 py-3 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 transition-colors"
        >
          Back to Portal
        </Link>
      </div>
    </div>
  )
}

export default function PaymentCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F5F3] flex items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-[#1a3c5e] border-t-transparent" />
      </div>
    }>
      <PaymentCallbackInner />
    </Suspense>
  )
}
