'use client'
import React, { useState, useEffect } from 'react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'

const BASE = '/api/backend'

const inputClass =
  'block w-full rounded-[6px] border border-[#E2DCDA] bg-white px-[14px] text-sm text-[#111111] placeholder:text-[#5A5450]/50 focus:border-[#D46868] focus:outline-none focus:ring-[3px] focus:ring-[rgba(194,87,87,0.12)] transition-all'
const labelClass =
  'block text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450] mb-2'
const selectClass = inputClass

// ─── Step components ────────────────────────────────────────────────────────

function Step1EligibilityCheck({ onEligible }) {
  const [documentNo, setDocumentNo] = useState('')
  const [documentType, setDocumentType] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const check = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${BASE}/ippms/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentNo, documentType }),
      })
      const data = await res.json()
      if (data.eligible) {
        onEligible({ documentNo, documentType })
      } else {
        setError(
          'Your ID is not eligible for party registration at this time. ' +
            'This may mean you are already registered with another party. ' +
            'Contact support at ippmssupport@orpp.or.ke for assistance.'
        )
      }
    } catch {
      setError('Could not reach the membership server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={check} className="space-y-6">
      <div>
        <label className={labelClass}>Document Type *</label>
        <div className="grid grid-cols-2 gap-4">
          {[{ value: 1, label: 'National ID' }, { value: 2, label: 'Passport' }].map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-[6px] border-2 p-4 transition-all ${
                documentType === opt.value
                  ? 'border-[#C25757] bg-[#FBF0F0]'
                  : 'border-[#E2DCDA] bg-white hover:border-[#D46868]/40'
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                checked={documentType === opt.value}
                onChange={() => setDocumentType(opt.value)}
              />
              <div
                className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  documentType === opt.value ? 'border-[#C25757]' : 'border-[#E2DCDA]'
                }`}
              >
                {documentType === opt.value && (
                  <div className="h-2 w-2 rounded-full bg-[#C25757]" />
                )}
              </div>
              <span className="text-sm font-medium text-[#111111]">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="documentNo" className={labelClass}>
          {documentType === 1 ? 'National ID Number' : 'Passport Number'} *
        </label>
        <input
          id="documentNo"
          type="text"
          className={inputClass}
          style={{ height: '42px' }}
          placeholder={documentType === 1 ? 'e.g. 20123456' : 'e.g. AK123456'}
          value={documentNo}
          onChange={(e) => setDocumentNo(e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="rounded-[6px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !documentNo}
        className="w-full rounded-[6px] bg-[#1a3c5e] px-6 py-4 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 disabled:opacity-50 transition-all"
      >
        {loading ? 'Checking eligibility…' : 'Check Eligibility →'}
      </button>
    </form>
  )
}

function Step2OTPRequest({ eligibility, onOTPSent }) {
  const [form, setForm] = useState({
    firstName: '',
    phoneNumber: '',
    email: '',
    confirmEmail: '',
    surname: '',
    otherNames: '',
    dateOfBirth: '',
    gender: 'M',
    hasPWD: false,
  })
  const [counties, setCounties] = useState([])
  const [constituencies, setConstituencies] = useState([])
  const [wards, setWards] = useState([])
  const [location, setLocation] = useState({ countyCode: '', constituencyCode: '', wardCode: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${BASE}/ippms/counties`)
      .then((r) => r.json())
      .then((d) => setCounties(d.data || []))
      .catch(() => {})
  }, [])

  const onCountyChange = async (code) => {
    setLocation({ countyCode: code, constituencyCode: '', wardCode: '' })
    setConstituencies([])
    setWards([])
    if (!code) return
    const r = await fetch(`${BASE}/ippms/constituencies/${code}`)
    const d = await r.json()
    setConstituencies(d.data || [])
  }

  const onConstituencyChange = async (code) => {
    setLocation((l) => ({ ...l, constituencyCode: code, wardCode: '' }))
    setWards([])
    if (!code) return
    const r = await fetch(`${BASE}/ippms/wards/${code}`)
    const d = await r.json()
    setWards(d.data || [])
  }

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.email !== form.confirmEmail) {
      setError('Email addresses do not match')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${BASE}/ippms/confirmation-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentNo: eligibility.documentNo,
          documentType: eligibility.documentType,
          phoneNumber: form.phoneNumber,
          firstName: form.firstName,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP')

      onOTPSent({
        registrationId: data.registrationId,
        ...form,
        ...eligibility,
        ...location,
        countyName: counties.find((c) => c.code === location.countyCode)?.name || '',
        constituencyName:
          constituencies.find((c) => c.code === location.constituencyCode)?.name || '',
        wardName: wards.find((w) => w.code === location.wardCode)?.name || '',
      })
    } catch (err) {
      setError(err.message || 'Failed to send confirmation code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>First Name *</label>
          <input className={inputClass} style={{ height: '42px' }} value={form.firstName} onChange={set('firstName')} required />
        </div>
        <div>
          <label className={labelClass}>Surname *</label>
          <input className={inputClass} style={{ height: '42px' }} value={form.surname} onChange={set('surname')} required />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Other Names</label>
          <input className={inputClass} style={{ height: '42px' }} value={form.otherNames} onChange={set('otherNames')} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Date of Birth *</label>
          <input type="date" className={inputClass} style={{ height: '42px' }} value={form.dateOfBirth} onChange={set('dateOfBirth')} required />
        </div>
        <div>
          <label className={labelClass}>Gender *</label>
          <select className={selectClass} style={{ height: '42px' }} value={form.gender} onChange={set('gender')} required>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Phone Number *</label>
        <input type="tel" className={inputClass} style={{ height: '42px' }} placeholder="07XX XXX XXX" value={form.phoneNumber} onChange={set('phoneNumber')} required />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Email Address *</label>
          <input type="email" className={inputClass} style={{ height: '42px' }} value={form.email} onChange={set('email')} required />
        </div>
        <div>
          <label className={labelClass}>Confirm Email *</label>
          <input type="email" className={inputClass} style={{ height: '42px' }} value={form.confirmEmail} onChange={set('confirmEmail')} required />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>County *</label>
          <select className={selectClass} style={{ height: '42px' }} value={location.countyCode} onChange={(e) => onCountyChange(e.target.value)} required>
            <option value="">Select county</option>
            {counties.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Constituency *</label>
          <select className={selectClass} style={{ height: '42px' }} value={location.constituencyCode} onChange={(e) => onConstituencyChange(e.target.value)} disabled={!location.countyCode} required>
            <option value="">Select constituency</option>
            {constituencies.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Ward *</label>
          <select className={selectClass} style={{ height: '42px' }} value={location.wardCode} onChange={(e) => setLocation((l) => ({ ...l, wardCode: e.target.value }))} disabled={!location.constituencyCode} required>
            <option value="">Select ward</option>
            {wards.map((w) => (
              <option key={w.code} value={w.code}>{w.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input id="pwd" type="checkbox" checked={form.hasPWD} onChange={set('hasPWD')} className="h-4 w-4 rounded border-[#E2DCDA] text-[#C25757] focus:ring-[#C25757]" />
        <label htmlFor="pwd" className="text-sm text-[#5A5450]">I have a disability (PWD)</label>
      </div>

      {error && (
        <div className="rounded-[6px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <button type="submit" disabled={loading} className="w-full rounded-[6px] bg-[#1a3c5e] px-6 py-4 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 disabled:opacity-50 transition-all">
        {loading ? 'Sending confirmation code…' : 'Send Confirmation Code →'}
      </button>
      <p className="text-xs text-center text-[#5A5450]">A confirmation code will be sent to your phone number via SMS.</p>
    </form>
  )
}

function Step3Confirm({ payload, onSuccess }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const body = {
        registrationId: payload.registrationId,
        confirmationCode: code,
        documentNo: payload.documentNo,
        documentType: payload.documentType,
        surname: payload.surname,
        otherNames: payload.otherNames || payload.firstName,
        birthDate: payload.dateOfBirth,
        sex: payload.gender,
        countyCode: payload.countyCode,
        constituencyCode: payload.constituencyCode,
        wardCode: payload.wardCode,
        phoneNumber: payload.phoneNumber,
        pwd: payload.hasPWD,
        membershipNo: `UPIA-${Date.now()}`,
      }

      const res = await fetch(`${BASE}/ippms/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Registration failed')
      if (data.data?.statusCode === '1' || data.success) {
        onSuccess()
      } else {
        throw new Error(data.data?.statusDescription || 'Registration failed')
      }
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-[6px] border border-[#EBF5EC] bg-[#EBF5EC] px-4 py-3 text-sm text-[#184824]">
        A confirmation code has been sent to <strong>{payload.phoneNumber}</strong>. Enter it below to complete registration.
      </div>

      <div>
        <label className={labelClass}>Confirmation Code *</label>
        <input
          className={`${inputClass} text-center text-xl tracking-[0.3em] uppercase`}
          style={{ height: '52px' }}
          placeholder="e.g. 3O1Q734A"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={10}
          required
        />
      </div>

      {error && (
        <div className="rounded-[6px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <button type="submit" disabled={loading || code.length < 4} className="w-full rounded-[6px] bg-[#236331] px-6 py-4 text-sm font-medium text-white hover:bg-[#2B753A] disabled:opacity-50 transition-all">
        {loading ? 'Registering…' : 'Complete Registration →'}
      </button>
    </form>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

const STEPS = ['Eligibility Check', 'Member Details', 'Confirmation']

export default function RegisterPage() {
  const [step, setStep] = useState(0)
  const [eligibility, setEligibility] = useState(null)
  const [otpPayload, setOTPPayload] = useState(null)
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="bg-[#6B2626] pt-[60px]">
          <div className="mx-auto max-w-7xl px-4 py-14 text-center">
            <h1 className="text-4xl font-semibold text-white">UPIA Kenya Membership</h1>
          </div>
          <div className="flex h-1">
            <div className="flex-1 bg-[#C25757]" />
            <div className="flex-1 bg-[#236331]" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-[#111111]" />
          </div>
        </div>
        <main className="mx-auto max-w-2xl px-4 py-14">
          <div className="rounded-[12px] bg-white p-12 text-center" style={{ border: '0.5px solid #E2DCDA' }}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF5EC] mb-6">
              <svg className="h-8 w-8 text-[#236331]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-[22px] font-medium text-[#111111]">Registration Complete!</h2>
            <p className="mt-3 text-[15px] text-[#5A5450]">
              Welcome to UPIA Kenya. Your membership has been registered with the Office of the Registrar of Political Parties.
            </p>
            <p className="mt-4 text-sm text-[#5A5450]">
              Dial <strong className="text-[#236331]">*509#</strong> to confirm your membership status.
            </p>
            <button
              onClick={() => { setDone(false); setStep(0); setEligibility(null); setOTPPayload(null) }}
              className="mt-8 inline-flex items-center gap-2 rounded-[6px] bg-[#236331] px-6 py-3 text-sm font-medium text-white hover:bg-[#2B753A] transition-all"
            >
              Register Another Member
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="relative overflow-hidden bg-[#14321e] pt-[60px]">
        <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, rgba(35,99,49,0.18) 0%, rgba(35,99,49,0.14) 50%, rgba(20,60,30,0.16) 100%)' }} />
        <div className="absolute -bottom-16 -left-16 h-[280px] w-[280px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(107,38,38,0.50) 0%, transparent 70%)' }} />
        <div className="absolute -top-10 right-0 h-[200px] w-[200px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(194,87,87,0.25) 0%, transparent 70%)' }} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-white/60 mb-4">Membership</span>
          <h1 className="text-[32px] font-semibold text-white sm:text-5xl">Join UPIA Kenya</h1>
          <p className="mt-4 text-[15px] leading-[1.75] text-white/55 max-w-xl mx-auto">
            Become part of over one million Kenyans driving real, lasting change across our nation.
          </p>
        </div>
        <div className="flex h-1">
          <div className="flex-1 bg-[#C25757]" />
          <div className="flex-1 bg-[#236331]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#111111]" />
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-14">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((label, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-1">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${i < step ? 'bg-[#236331] text-white' : i === step ? 'bg-[#1a3c5e] text-white' : 'bg-[#E2DCDA] text-[#5A5450]'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="text-[10px] uppercase tracking-wide text-[#5A5450] hidden sm:block">{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 ${i < step ? 'bg-[#236331]' : 'bg-[#E2DCDA]'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="rounded-[12px] bg-white overflow-hidden" style={{ border: '0.5px solid #E2DCDA' }}>
          <div className="border-b border-[#E2DCDA] px-8 py-6">
            <h2 className="text-[22px] font-medium text-[#111111]">{STEPS[step]}</h2>
            <p className="text-sm text-[#5A5450] mt-1">
              {step === 0 && 'Enter your ID to verify eligibility before registering.'}
              {step === 1 && 'Complete your personal details. A code will be sent to your phone.'}
              {step === 2 && 'Enter the confirmation code sent to your phone.'}
            </p>
          </div>

          <div className="px-8 py-8">
            {step === 0 && (
              <Step1EligibilityCheck
                onEligible={(data) => { setEligibility(data); setStep(1) }}
              />
            )}
            {step === 1 && (
              <Step2OTPRequest
                eligibility={eligibility}
                onOTPSent={(data) => { setOTPPayload(data); setStep(2) }}
              />
            )}
            {step === 2 && (
              <Step3Confirm
                payload={otpPayload}
                onSuccess={() => setDone(true)}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
