'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '../../../../components/Header'
import { Footer } from '../../../../components/Footer'
import { saveAuth } from '../../../../lib/auth'
import KENYA_LOCATIONS from '../../../../lib/kenyaLocations'

const BASE = '/api/backend'
const SESSION_KEY = 'upia_reg_session'

const SEAT_OPTIONS = [
  { value: 'mca',       label: 'MCA',             sub: 'Member of County Assembly',   fee: 2000  },
  { value: 'women_rep', label: "Women's Rep",      sub: "Women's Representative",      fee: 5000  },
  { value: 'senator',   label: 'Senator',          sub: 'County Senator',              fee: 5000  },
  { value: 'mp',        label: 'MP',               sub: 'Member of Parliament',        fee: 5000  },
  { value: 'governor',  label: 'Governor',         sub: 'County Governor',             fee: 10000 },
]

// Location fields required per seat
const NEEDS_CONSTITUENCY = new Set(['mp', 'mca'])
const NEEDS_WARD         = new Set(['mca'])

const inputCls =
  'block w-full rounded-[6px] border border-[#E2DCDA] bg-white px-[14px] text-sm text-[#111111] placeholder:text-[#5A5450]/50 focus:border-[#D46868] focus:outline-none focus:ring-[3px] focus:ring-[rgba(194,87,87,0.12)] transition-all'
const labelCls =
  'block text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450] mb-2'

// Safely parse JSON - if the server returns HTML/text on error, surface a readable message
async function safeJson(res) {
  const ct = res.headers.get('content-type') || ''
  if (!ct.includes('application/json')) {
    const text = await res.text()
    throw new Error(
      text.replace(/<[^>]+>/g, '').trim().slice(0, 160) || `Server error (${res.status})`
    )
  }
  return res.json()
}

// ─── Step 1 - Personal Details (+ passport photo) ────────────────────────────
function StepPersonal({ onNext }) {
  const fileRef = useRef()
  const [form, setForm] = useState({
    documentType: 1,
    idNumber: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    gender: 'M',
    dob: '',
    isElected: false,
  })
  const [photoFile, setPhotoFile]     = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  const set = (field) => (e) =>
    setForm((f) => ({
      ...f,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))

  const onFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleNext = (e) => {
    e.preventDefault()
    onNext({ ...form, passportPhotoFile: photoFile })
  }

  return (
    <form onSubmit={handleNext} className="space-y-5">
      {/* Passport photo */}
      <div>
        <label className={labelCls}>Passport Size Photo</label>
        <div
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[8px] border-2 border-dashed border-[#E2DCDA] bg-[#F8F5F3] py-6 transition-colors hover:border-[#D46868]/50"
          onClick={() => fileRef.current?.click()}
        >
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Preview"
              className="h-24 w-24 rounded-full object-cover border-2 border-[#E2DCDA]"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E2DCDA]">
              <svg className="h-8 w-8 text-[#5A5450]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
          )}
          <p className="text-xs text-[#5A5450]">
            {photoFile ? photoFile.name : 'Click to upload passport photo (JPG/PNG, max 5 MB)'}
          </p>
        </div>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onFileChange} />
      </div>

      {/* Document type */}
      <div>
        <label className={labelCls}>Document Type *</label>
        <div className="grid grid-cols-2 gap-3">
          {[{ value: 1, label: 'National ID' }, { value: 2, label: 'Passport' }].map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-[6px] border-2 p-3.5 transition-all ${
                Number(form.documentType) === opt.value
                  ? 'border-[#C25757] bg-[#FBF0F0]'
                  : 'border-[#E2DCDA] bg-white hover:border-[#D46868]/40'
              }`}
            >
              <input type="radio" className="sr-only" checked={Number(form.documentType) === opt.value}
                onChange={() => setForm((f) => ({ ...f, documentType: opt.value }))} />
              <div className={`h-4 w-4 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${Number(form.documentType) === opt.value ? 'border-[#C25757]' : 'border-[#E2DCDA]'}`}>
                {Number(form.documentType) === opt.value && <div className="h-2 w-2 rounded-full bg-[#C25757]" />}
              </div>
              <span className="text-sm font-medium text-[#111111]">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ID number */}
      <div>
        <label className={labelCls}>{Number(form.documentType) === 1 ? 'National ID Number' : 'Passport Number'} *</label>
        <input className={inputCls} style={{ height: '42px' }}
          placeholder={Number(form.documentType) === 1 ? 'e.g. 20123456' : 'e.g. AK123456'}
          value={form.idNumber} onChange={set('idNumber')} required />
      </div>

      {/* Names */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>First Name *</label>
          <input className={inputCls} style={{ height: '42px' }} placeholder="First name" value={form.firstName} onChange={set('firstName')} required />
        </div>
        <div>
          <label className={labelCls}>Last Name *</label>
          <input className={inputCls} style={{ height: '42px' }} placeholder="Last name" value={form.lastName} onChange={set('lastName')} required />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className={labelCls}>Phone Number *</label>
        <input type="tel" className={inputCls} style={{ height: '42px' }} placeholder="07XX XXX XXX" value={form.phone} onChange={set('phone')} required />
      </div>

      {/* Email */}
      <div>
        <label className={labelCls}>Email Address *</label>
        <input type="email" className={inputCls} style={{ height: '42px' }} placeholder="you@example.com" value={form.email} onChange={set('email')} required />
      </div>

      {/* Gender + DOB */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Gender *</label>
          <select className={inputCls} style={{ height: '42px' }} value={form.gender} onChange={set('gender')} required>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Date of Birth *</label>
          <input type="date" className={inputCls} style={{ height: '42px' }} value={form.dob} onChange={set('dob')} required />
        </div>
      </div>

      {/* Currently elected */}
      <div className="flex items-start gap-3 rounded-[6px] border border-[#E2DCDA] bg-[#F8F5F3] px-4 py-3.5">
        <input id="isElected" type="checkbox" checked={form.isElected} onChange={set('isElected')}
          className="mt-0.5 h-4 w-4 rounded border-[#E2DCDA] text-[#C25757] focus:ring-[#C25757]" />
        <label htmlFor="isElected" className="text-sm text-[#111111]">I currently hold an elected office</label>
      </div>

      <button type="submit" className="w-full rounded-[6px] bg-[#1a3c5e] px-6 py-3.5 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 transition-all">
        Next: Choose Your Seat →
      </button>
    </form>
  )
}

// ─── Step 2 - Election Level + Location ──────────────────────────────────────
function StepElectionLevel({ onNext, onBack }) {
  const [seat, setSeat] = useState('')
  const [loc, setLoc] = useState({
    countyCode: '', countyName: '',
    constituencyCode: '', constituencyName: '',
    wardCode: '', wardName: '',
  })

  const selectedCounty = KENYA_LOCATIONS.find((c) => c.code === loc.countyCode)
  const constits        = selectedCounty?.constituencies || []
  const selectedConstit = constits.find((c) => c.code === loc.constituencyCode)
  const wards           = selectedConstit?.wards || []

  const onSeatChange = (value) => {
    setSeat(value)
    // Reset location sub-fields that may no longer be required
    setLoc((l) => ({ ...l, constituencyCode: '', constituencyName: '', wardCode: '', wardName: '' }))
  }

  const onCountyChange = (code) => {
    const county = KENYA_LOCATIONS.find((c) => c.code === code)
    setLoc({ countyCode: code, countyName: county?.name || '', constituencyCode: '', constituencyName: '', wardCode: '', wardName: '' })
  }

  const onConstituencyChange = (code) => {
    const constit = constits.find((c) => c.code === code)
    setLoc((l) => ({ ...l, constituencyCode: code, constituencyName: constit?.name || '', wardCode: '', wardName: '' }))
  }

  const onWardChange = (code) => {
    const ward = wards.find((w) => w.code === code)
    setLoc((l) => ({ ...l, wardCode: code, wardName: ward?.name || '' }))
  }

  const canProceed = () => {
    if (!seat || !loc.countyCode) return false
    if (NEEDS_CONSTITUENCY.has(seat) && !loc.constituencyCode) return false
    if (NEEDS_WARD.has(seat) && !loc.wardCode) return false
    return true
  }

  const handleNext = () => {
    if (!canProceed()) return
    onNext({ seatCategory: seat, ...loc })
  }

  const needsConst = NEEDS_CONSTITUENCY.has(seat)
  const needsWard  = NEEDS_WARD.has(seat)

  return (
    <div className="space-y-6">
      {/* Seat cards */}
      <div>
        <label className={labelCls}>Position *</label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SEAT_OPTIONS.map((opt) => (
            <label key={opt.value} className={`flex cursor-pointer flex-col gap-1 rounded-[8px] border-2 p-4 transition-all ${
              seat === opt.value ? 'border-[#1a3c5e] bg-[#EDF3FA]' : 'border-[#E2DCDA] bg-white hover:border-[#1a3c5e]/30'
            }`}>
              <input type="radio" className="sr-only" checked={seat === opt.value} onChange={() => onSeatChange(opt.value)} />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#111111]">{opt.label}</span>
                <div className={`h-4 w-4 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${seat === opt.value ? 'border-[#1a3c5e]' : 'border-[#E2DCDA]'}`}>
                  {seat === opt.value && <div className="h-2 w-2 rounded-full bg-[#1a3c5e]" />}
                </div>
              </div>
              <span className="text-xs text-[#5A5450]">{opt.sub}</span>
              <span className="mt-1 text-xs font-semibold text-[#C25757]">KES {opt.fee.toLocaleString()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location - only shown once a seat is selected */}
      {seat && (
        <div className="space-y-4 border-t border-[#E2DCDA] pt-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450]">Location</p>

          {/* County - always */}
          <div>
            <label className={labelCls}>County *</label>
            <select className={inputCls} style={{ height: '42px' }} value={loc.countyCode} onChange={(e) => onCountyChange(e.target.value)} required>
              <option value="">Select county</option>
              {KENYA_LOCATIONS.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </div>

          {/* Constituency - MP + MCA */}
          {needsConst && (
            <div>
              <label className={labelCls}>Constituency *</label>
              <select className={inputCls} style={{ height: '42px' }} value={loc.constituencyCode}
                onChange={(e) => onConstituencyChange(e.target.value)} disabled={!loc.countyCode} required>
                <option value="">Select constituency</option>
                {constits.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
          )}

          {/* Ward - MCA only */}
          {needsWard && (
            <div>
              <label className={labelCls}>Ward *</label>
              <select className={inputCls} style={{ height: '42px' }} value={loc.wardCode}
                onChange={(e) => onWardChange(e.target.value)} disabled={!loc.constituencyCode} required>
                <option value="">Select ward</option>
                {wards.map((w) => <option key={w.code} value={w.code}>{w.name}</option>)}
              </select>
            </div>
          )}

        </div>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={onBack}
          className="flex-1 rounded-[6px] border border-[#E2DCDA] bg-white px-6 py-3.5 text-sm font-medium text-[#5A5450] hover:bg-[#F8F5F3] transition-all">
          ← Back
        </button>
        <button type="button" disabled={!canProceed()} onClick={handleNext}
          className="flex-[2] rounded-[6px] bg-[#1a3c5e] px-6 py-3.5 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 disabled:opacity-50 transition-all">
          Next: Pay Registration Fee →
        </button>
      </div>
    </div>
  )
}

// ─── Step 3 - Payment ─────────────────────────────────────────────────────────
function StepPayment({ sessionToken, seatCategory, fee, onBack, onPaid }) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const seat = SEAT_OPTIONS.find((s) => s.value === seatCategory)

  const handlePay = async () => {
    setError('')
    setLoading(true)
    try {
      const res  = await fetch(`${BASE}/registration/payment/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken }),
      })
      const data = await safeJson(res)
      if (!res.ok) throw new Error(data.message || 'Could not initialize payment')
      if (data.alreadyPaid) { onPaid(); return }
      window.location.href = data.authorization_url
    } catch (err) {
      setError(err.message || 'Payment initialization failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[8px] border border-[#E2DCDA] bg-[#F8F5F3] p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450]">Registration Fee</p>
        <p className="mt-1 text-2xl font-semibold text-[#111111]">KES {(fee || 0).toLocaleString()}</p>
        {seat && <p className="mt-1 text-sm text-[#5A5450]">{seat.sub} - one-time registration fee</p>}
      </div>

      <div className="rounded-[6px] border border-[#EBF5EC] bg-[#EBF5EC] px-4 py-3 text-sm text-[#184824]">
        You will be redirected to Paystack to complete payment securely. Your registration details are saved - you can return at any time.
      </div>

      {error && (
        <div className="rounded-[6px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={onBack} disabled={loading}
          className="flex-1 rounded-[6px] border border-[#E2DCDA] bg-white px-6 py-3.5 text-sm font-medium text-[#5A5450] hover:bg-[#F8F5F3] disabled:opacity-50 transition-all">
          ← Back
        </button>
        <button type="button" onClick={handlePay} disabled={loading}
          className="flex-[2] rounded-[6px] bg-[#236331] px-6 py-3.5 text-sm font-medium text-white hover:bg-[#2B753A] disabled:opacity-50 transition-all">
          {loading ? 'Redirecting…' : `Pay KES ${(fee || 0).toLocaleString()} →`}
        </button>
      </div>
    </div>
  )
}

// ─── Step 4 - Create Account ──────────────────────────────────────────────────
function StepCreateAccount({ sessionToken, email, passportPhotoFile, onSuccess }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const preview = passportPhotoFile ? URL.createObjectURL(passportPhotoFile) : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8)  { setError('Password must be at least 8 characters'); return }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('sessionToken', sessionToken)
      fd.append('password', password)
      if (passportPhotoFile) fd.append('passportPhoto', passportPhotoFile)

      const res  = await fetch(`${BASE}/registration/complete`, { method: 'POST', body: fd })
      const data = await safeJson(res)
      if (!res.ok) throw new Error(data.message || 'Account creation failed')

      saveAuth(data.token, data.refreshToken, data.user)
      localStorage.removeItem(SESSION_KEY)
      onSuccess(data.user)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-[6px] border border-[#EBF5EC] bg-[#EBF5EC] px-4 py-3 text-sm text-[#184824]">
        Payment verified. Set your password to create your account.
      </div>

      {/* Photo preview */}
      {preview && (
        <div className="flex items-center gap-4 rounded-[8px] border border-[#E2DCDA] bg-[#F8F5F3] p-4">
          <img src={preview} alt="Passport photo" className="h-16 w-16 rounded-full object-cover border-2 border-[#E2DCDA]" />
          <div>
            <p className="text-xs font-medium text-[#111111]">Passport photo ready</p>
            <p className="text-xs text-[#5A5450]">{passportPhotoFile.name}</p>
          </div>
        </div>
      )}

      {/* Email read-only */}
      <div>
        <label className={labelCls}>Email Address</label>
        <input type="email" className={`${inputCls} bg-[#F8F5F3] cursor-not-allowed`} style={{ height: '42px' }} value={email} readOnly />
      </div>

      <div>
        <label className={labelCls}>Password *</label>
        <input type="password" className={inputCls} style={{ height: '42px' }} placeholder="Minimum 8 characters"
          value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <div>
        <label className={labelCls}>Confirm Password *</label>
        <input type="password" className={inputCls} style={{ height: '42px' }} placeholder="Repeat password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
      </div>

      {error && (
        <div className="rounded-[6px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <button type="submit" disabled={loading}
        className="w-full rounded-[6px] bg-[#236331] px-6 py-3.5 text-sm font-medium text-white hover:bg-[#2B753A] disabled:opacity-50 transition-all">
        {loading ? 'Creating account…' : 'Create My Account →'}
      </button>
    </form>
  )
}

// ─── Main wizard ──────────────────────────────────────────────────────────────
const STEP_LABELS = ['Personal Details', 'Election Level', 'Payment', 'Create Account']

function AspirantWizard() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const [step, setStep]                     = useState(0)
  const [personalData, setPersonalData]     = useState(null)
  const [passportPhoto, setPassportPhoto]   = useState(null) // File object
  const [seatCategory, setSeatCategory]     = useState('')
  const [sessionToken, setSessionToken]     = useState('')
  const [fee, setFee]                       = useState(0)
  const [email, setEmail]                   = useState('')
  const [done, setDone]                     = useState(false)
  const [doneUser, setDoneUser]             = useState(null)
  const [restoring, setRestoring]           = useState(true)

  // Restore session from URL params or localStorage on mount
  useEffect(() => {
    const urlSession = searchParams.get('session')
    const urlVerified = searchParams.get('verified')
    const stored = localStorage.getItem(SESSION_KEY)
    const token = urlSession || stored

    if (!token) { setRestoring(false); return }

    fetch(`${BASE}/registration/status/${token}`)
      .then((r) => safeJson(r))
      .then((data) => {
        if (!data.success) { localStorage.removeItem(SESSION_KEY); setRestoring(false); return }
        const { step: apiStep, seatCategory: cat, fee: f, email: e } = data.data
        setSessionToken(token)
        setSeatCategory(cat)
        setFee(f)
        setEmail(e)
        localStorage.setItem(SESSION_KEY, token)
        if (apiStep === 'done') { router.replace('/portal'); return }
        setStep(apiStep === 'complete_account' || urlVerified === 'true' ? 3 : 2)
        setRestoring(false)
      })
      .catch(() => { localStorage.removeItem(SESSION_KEY); setRestoring(false) })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Step 1 → 2: just cache data locally, no API call yet
  const onPersonalNext = (data) => {
    const { passportPhotoFile, ...rest } = data
    setPersonalData(rest)
    setPassportPhoto(passportPhotoFile)
    setEmail(rest.email)
    setStep(1)
  }

  // Step 2 → 3: POST to /registration/initiate with full data
  const onElectionNext = async (electionData) => {
    setSeatCategory(electionData.seatCategory)
    setFee(SEAT_OPTIONS.find((s) => s.value === electionData.seatCategory)?.fee || 0)

    try {
      const res  = await fetch(`${BASE}/registration/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...personalData, ...electionData }),
      })
      const data = await safeJson(res)
      if (!res.ok) throw new Error(data.message || 'Failed to save details')

      const token = data.sessionToken
      setSessionToken(token)
      localStorage.setItem(SESSION_KEY, token)

      if (data.resumed) {
        setFee(data.fee)
        setSeatCategory(data.seatCategory)
        setStep(data.step === 'complete_account' ? 3 : 2)
      } else {
        setStep(2)
      }
    } catch (err) {
      alert(err.message || 'Could not save your details. Please try again.')
    }
  }

  if (restoring) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-[#1a3c5e] border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-[#5A5450]">Loading your registration…</p>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="bg-[#14321e] pt-[60px]">
          <div className="mx-auto max-w-7xl px-4 py-14 text-center">
            <h1 className="text-4xl font-semibold text-white">Registration Complete</h1>
          </div>
          <div className="flex h-1">
            <div className="flex-1 bg-[#C25757]" /><div className="flex-1 bg-[#236331]" />
            <div className="flex-1 bg-white" /><div className="flex-1 bg-[#111111]" />
          </div>
        </div>
        <main className="mx-auto max-w-lg px-4 py-14">
          <div className="rounded-[12px] bg-white p-12 text-center" style={{ border: '0.5px solid #E2DCDA' }}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF5EC] mb-6">
              <svg className="h-8 w-8 text-[#236331]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-[22px] font-medium text-[#111111]">Welcome, {doneUser?.firstName}!</h2>
            <p className="mt-3 text-[15px] text-[#5A5450]">
              Your aspirant account has been created. Access your portal to complete your profile and begin the nomination process.
            </p>
            <Link href="/portal" className="mt-8 inline-flex items-center gap-2 rounded-[6px] bg-[#1a3c5e] px-8 py-3 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 transition-all">
              Go to My Portal →
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const stepDescs = [
    'Enter your personal details exactly as they appear on your ID.',
    'Select the position you intend to contest and your location.',
    `Pay the one-time registration fee of KES ${fee ? fee.toLocaleString() : '-'}.`,
    'Set your password to complete your account.',
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="relative overflow-hidden bg-[#14321e] pt-[60px]">
        <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, rgba(26,60,94,0.30) 0%, rgba(20,50,30,0.20) 100%)' }} />
        <div className="absolute -bottom-16 -left-16 h-[280px] w-[280px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(107,38,38,0.50) 0%, transparent 70%)' }} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-white/60 mb-4">Aspirant Registration</span>
          <h1 className="text-[30px] font-semibold text-white sm:text-4xl">Become an Aspirant</h1>
          <p className="mt-3 text-[14px] leading-relaxed text-white/55 max-w-md mx-auto">Register your candidacy with UPIA Kenya for the 2027 General Elections.</p>
        </div>
        <div className="flex h-1">
          <div className="flex-1 bg-[#C25757]" /><div className="flex-1 bg-[#236331]" />
          <div className="flex-1 bg-white" /><div className="flex-1 bg-[#111111]" />
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  i < step ? 'bg-[#236331] text-white' : i === step ? 'bg-[#1a3c5e] text-white' : 'bg-[#E2DCDA] text-[#5A5450]'
                }`}>
                  {i < step
                    ? <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    : i + 1}
                </div>
                <span className="text-[9px] uppercase tracking-wide text-[#5A5450] hidden sm:block text-center w-16">{label}</span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={`flex-1 h-px mx-1 ${i < step ? 'bg-[#236331]' : 'bg-[#E2DCDA]'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-[12px] bg-white overflow-hidden" style={{ border: '0.5px solid #E2DCDA' }}>
          <div className="border-b border-[#E2DCDA] px-7 py-5">
            <h2 className="text-[20px] font-medium text-[#111111]">{STEP_LABELS[step]}</h2>
            <p className="text-sm text-[#5A5450] mt-1">{stepDescs[step]}</p>
          </div>
          <div className="px-7 py-7">
            {step === 0 && <StepPersonal onNext={onPersonalNext} />}
            {step === 1 && <StepElectionLevel onNext={onElectionNext} onBack={() => setStep(0)} />}
            {step === 2 && (
              <StepPayment sessionToken={sessionToken} seatCategory={seatCategory} fee={fee}
                onBack={() => setStep(1)} onPaid={() => setStep(3)} />
            )}
            {step === 3 && (
              <StepCreateAccount sessionToken={sessionToken} email={email} passportPhotoFile={passportPhoto}
                onSuccess={(u) => { setDoneUser(u); setDone(true) }} />
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <Link href="/register" className="inline-flex items-center gap-1.5 text-sm text-[#5A5450] hover:text-[#111111] transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to registration options
          </Link>
          <p className="text-center text-sm text-[#5A5450]">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-[#1a3c5e] hover:underline">Sign in here</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function AspirantRegistrationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-[#1a3c5e] border-t-transparent" />
      </div>
    }>
      <AspirantWizard />
    </Suspense>
  )
}
