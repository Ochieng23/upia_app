'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '../../../../components/Header'
import { Footer } from '../../../../components/Footer'
import { saveAuth } from '../../../../lib/auth'
import { useAuth } from '../../../../context/AuthContext'
import { useIppmsLocations } from '../../../../lib/useIppmsLocations'

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

// ─── Reusable file upload box ─────────────────────────────────────────────────
function FileUploadBox({ label, hint, accept, file, preview, inputRef, onChange, isImage, required }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div
        className="flex h-[130px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[8px] border-2 border-dashed border-[#E2DCDA] bg-[#F8F5F3] transition-colors hover:border-[#D46868]/50"
        onClick={() => inputRef.current?.click()}
      >
        {isImage && preview ? (
          <img src={preview} alt="Preview" className="h-20 w-20 rounded-full object-cover border-2 border-[#E2DCDA]" />
        ) : preview ? (
          <div className="flex h-14 w-14 items-center justify-center rounded-[8px] bg-[#EBF5EC]">
            <svg className="h-7 w-7 text-[#236331]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E2DCDA]">
            <svg className="h-7 w-7 text-[#5A5450]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
        )}
        <p className="text-xs text-[#5A5450] px-4 text-center">
          {file ? file.name : hint}
        </p>
      </div>
      <input ref={inputRef} type="file" accept={accept} className="sr-only" onChange={onChange} required={required && !file} />
    </div>
  )
}

// ─── Step 1 - Personal Details (+ passport photo + ID documents) ──────────────
function StepPersonal({ onNext }) {
  const photoRef   = useRef()
  const idFrontRef = useRef()
  const idBackRef  = useRef()

  const [form, setForm] = useState({
    aspirantType: 'elective',
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
  const [photoFile,      setPhotoFile]      = useState(null)
  const [photoPreview,   setPhotoPreview]   = useState(null)
  const [idFrontFile,    setIdFrontFile]    = useState(null)
  const [idFrontPreview, setIdFrontPreview] = useState(null)
  const [idBackFile,     setIdBackFile]     = useState(null)
  const [idBackPreview,  setIdBackPreview]  = useState(null)
  const [idVerifying,    setIdVerifying]    = useState(false)
  const [idVerified,     setIdVerified]     = useState(false)
  const [idVerifyErr,    setIdVerifyErr]    = useState('')

  const set = (field) => (e) =>
    setForm((f) => ({
      ...f,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))

  const makeFileHandler = (setFile, setPreview) => (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleIdLookup = async () => {
    const id = form.idNumber.trim()
    const minLen = Number(form.documentType) === 2 ? 6 : 7
    if (id.length < minLen) return
    setIdVerifying(true)
    setIdVerified(false)
    setIdVerifyErr('')
    try {
      const res = await fetch(`${BASE}/lookup/id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber: id, documentType: form.documentType }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setIdVerifyErr(json.message || 'Verification failed. Please fill in your details manually.')
        return
      }
      if (!json.verified) {
        setIdVerifyErr(json.message || 'ID not found in registry. Please fill in your details manually.')
        return
      }
      const { firstName, lastName, gender, dob } = json.data
      setForm((f) => ({
        ...f,
        firstName: firstName || f.firstName,
        lastName:  lastName  || f.lastName,
        gender:    gender    || f.gender,
        dob:       dob       || f.dob,
      }))
      setIdVerified(true)
    } catch {
      setIdVerifyErr('Could not reach verification service. Please fill in your details manually.')
    } finally {
      setIdVerifying(false)
    }
  }

  const handleNext = (e) => {
    e.preventDefault()
    onNext({ ...form, passportPhotoFile: photoFile, idFrontFile, idBackFile })
  }

  const isPassport = Number(form.documentType) === 2

  return (
    <form onSubmit={handleNext} className="space-y-5">

      {/* Aspirant type */}
      <div>
        <label className={labelCls}>How are you seeking your position? *</label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            {
              value: 'elective',
              title: 'Elective Seat',
              desc: 'I will contest for an elected position and be voted in by registered voters in my jurisdiction.',
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 20h10M9 20V10m6 10V10M4 7l8-4 8 4M5 7v1a7 7 0 0014 0V7" />
                </svg>
              ),
            },
            {
              value: 'nominated',
              title: 'Party Nomination',
              desc: 'I am seeking to be nominated by UPIA to fill a seat through the party nomination process.',
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              ),
            },
          ].map((opt) => {
            const active = form.aspirantType === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, aspirantType: opt.value }))}
                className={`flex flex-col gap-2 rounded-[8px] border-2 p-4 text-left transition-all ${
                  active ? 'border-[#C25757] bg-[#FBF0F0]' : 'border-[#E2DCDA] bg-white hover:border-[#D46868]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`mt-0.5 flex-shrink-0 ${active ? 'text-[#C25757]' : 'text-[#5A5450]'}`}>{opt.icon}</div>
                  <div className={`ml-auto h-4 w-4 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${active ? 'border-[#C25757]' : 'border-[#E2DCDA]'}`}>
                    {active && <div className="h-2 w-2 rounded-full bg-[#C25757]" />}
                  </div>
                </div>
                <p className="text-sm font-semibold text-[#111111]">{opt.title}</p>
                <p className="text-xs leading-relaxed text-[#5A5450]">{opt.desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Photo requirements notice */}
      <div className="rounded-[8px] border border-[#1a3c5e]/20 bg-[#EDF3FA] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1a3c5e] mb-1.5">
          How to Upload Candidate Photo
        </p>
        <ul className="mb-2 space-y-0.5 text-[12px] text-[#1a3c5e]/80 leading-relaxed">
          <li>- Click the upload button and select the saved photo from your device.</li>
          <li className="font-semibold text-[#1a3c5e]">- Always upload the photo after filling in all mandatory fields.</li>
        </ul>
        <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#1a3c5e]">Photo Requirements</p>
        <ol className="mt-1 space-y-0.5 text-[12px] text-[#1a3c5e]/80 leading-relaxed list-decimal list-inside">
          <li>Format: JPEG or PNG, in Color</li>
          <li>Background: white with no shadows</li>
          <li>Maximum size: <strong>1 MB</strong></li>
          <li>Resolution: 1280x720 pixels (HD Quality)</li>
          <li>Measurements: 50mm x 45mm (Height x Width)</li>
          <li>Aspect ratio: 4:3</li>
          <li>Portrait orientation</li>
          <li>Face fully visible and facing forward</li>
        </ol>
      </div>

      {/* Passport photo */}
      <FileUploadBox
        label="Passport Size Photo *"
        hint="Click to upload (JPG/PNG, max 1 MB, white background)"
        accept="image/jpeg,image/png"
        file={photoFile}
        preview={photoPreview}
        inputRef={photoRef}
        onChange={makeFileHandler(setPhotoFile, setPhotoPreview)}
        isImage
      />

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
                onChange={() => {
                  setForm((f) => ({ ...f, documentType: opt.value, idNumber: '' }))
                  setIdVerified(false)
                  setIdVerifyErr('')
                }} />
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
        <div className="relative">
          <input className={inputCls} style={{ height: '42px' }}
            placeholder={Number(form.documentType) === 1 ? 'e.g. 20123456' : 'e.g. AK123456'}
            value={form.idNumber}
            onChange={(e) => { set('idNumber')(e); setIdVerified(false); setIdVerifyErr('') }}
            onBlur={handleIdLookup}
            required />
          {idVerifying && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="h-4 w-4 animate-spin text-[#C25757]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}
          {!idVerifying && idVerified && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="h-5 w-5 text-[#236331]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        {idVerified && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[#236331]">
            <svg className="h-3.5 w-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            Identity verified via IPRS - details have been pre-filled
          </p>
        )}
        {!idVerified && idVerifyErr && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-amber-700">
            <svg className="h-3.5 w-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {idVerifyErr}
          </p>
        )}
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

      {/* ID document uploads */}
      <div className="border-t border-[#E2DCDA] pt-5 space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#5A5450]">
          {isPassport ? 'Passport' : 'National ID'} Document Upload
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FileUploadBox
            label={isPassport ? 'Passport Photo Page *' : 'National ID - Front *'}
            hint={isPassport ? 'Upload the bio-data page (JPG/PNG)' : 'Upload front side of your ID (JPG/PNG)'}
            accept="image/jpeg,image/png"
            file={idFrontFile}
            preview={idFrontPreview}
            inputRef={idFrontRef}
            onChange={makeFileHandler(setIdFrontFile, setIdFrontPreview)}
          />
          {!isPassport && (
            <FileUploadBox
              label="National ID - Back *"
              hint="Upload back side of your ID (JPG/PNG)"
              accept="image/jpeg,image/png"
              file={idBackFile}
              preview={idBackPreview}
              inputRef={idBackRef}
              onChange={makeFileHandler(setIdBackFile, setIdBackPreview)}
            />
          )}
        </div>
        <p className="text-[11px] text-[#5A5450]">
          Upload clear, legible photos. Blurry or incomplete documents will delay your application.
        </p>
      </div>

      <button type="submit" className="w-full rounded-[6px] bg-[#1a3c5e] px-6 py-3.5 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 transition-all">
        Next: Choose Your Seat &rarr;
      </button>
    </form>
  )
}

// ─── Step 2 - Election Level + Location ──────────────────────────────────────
function StepElectionLevel({ aspirantType, onNext, onBack }) {
  const isNominated = aspirantType === 'nominated'
  const [seat, setSeat] = useState('')
  const loc = useIppmsLocations()

  const onSeatChange = (value) => {
    setSeat(value)
    // Reset location sub-fields that may no longer be required
    loc.selectConstituency('')
  }

  const canProceed = () => {
    if (!seat || !loc.countyCode) return false
    if (!isNominated && NEEDS_CONSTITUENCY.has(seat) && !loc.constituencyCode) return false
    if (!isNominated && NEEDS_WARD.has(seat) && !loc.wardCode) return false
    return true
  }

  const handleNext = () => {
    if (!canProceed()) return
    onNext({
      seatCategory: seat,
      countyCode: loc.countyCode,
      countyName: loc.counties.find((c) => c.code === loc.countyCode)?.name || '',
      constituencyCode: loc.constituencyCode,
      constituencyName: loc.constituencies.find((c) => c.code === loc.constituencyCode)?.name || '',
      wardCode: loc.wardCode,
      wardName: loc.wards.find((w) => w.code === loc.wardCode)?.name || '',
    })
  }

  const needsConst = NEEDS_CONSTITUENCY.has(seat)
  const needsWard  = NEEDS_WARD.has(seat)

  return (
    <div className="space-y-6">
      {/* Nomination mode banner */}
      {isNominated && (
        <div className="rounded-[8px] border border-[#C25757]/30 bg-[#FBF0F0] px-4 py-3 text-sm text-[#8B3232]">
          <span className="font-semibold">Party Nomination path.</span> Select the seat category you are interested in and your preferred county. Constituency and ward are not required for nominated positions.
        </div>
      )}

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

          {loc.error && (
            <div className="rounded-[6px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{loc.error}</div>
          )}

          {/* County - always */}
          <div>
            <label className={labelCls}>County *</label>
            <select className={inputCls} style={{ height: '42px' }} value={loc.countyCode} onChange={(e) => loc.selectCounty(e.target.value)} required>
              <option value="">Select county</option>
              {loc.counties.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </div>

          {/* Constituency - MP + MCA, elective only */}
          {needsConst && !isNominated && (
            <div>
              <label className={labelCls}>Constituency *</label>
              <select className={inputCls} style={{ height: '42px' }} value={loc.constituencyCode}
                onChange={(e) => loc.selectConstituency(e.target.value)} disabled={!loc.countyCode} required>
                <option value="">Select constituency</option>
                {loc.constituencies.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
          )}

          {/* Ward - MCA only, elective only */}
          {needsWard && !isNominated && (
            <div>
              <label className={labelCls}>Ward *</label>
              <select className={inputCls} style={{ height: '42px' }} value={loc.wardCode}
                onChange={(e) => loc.selectWard(e.target.value)} disabled={!loc.constituencyCode} required>
                <option value="">Select ward</option>
                {loc.wards.map((w) => <option key={w.code} value={w.code}>{w.name}</option>)}
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
function StepCreateAccount({ sessionToken, email, passportPhotoFile, idFrontFile, idBackFile, onSuccess }) {
  const { setAuthUser } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)

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
      if (idFrontFile)       fd.append('idFront', idFrontFile)
      if (idBackFile)        fd.append('idBack', idBackFile)

      const res  = await fetch(`${BASE}/registration/complete`, { method: 'POST', body: fd })
      const data = await safeJson(res)
      if (!res.ok) throw new Error(data.message || 'Account creation failed')

      saveAuth(data.token, data.refreshToken, data.user)
      setAuthUser(data.user)
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
        <div className="relative">
          <input type={showPassword ? 'text' : 'password'} className={`${inputCls} pr-11`} style={{ height: '42px' }} placeholder="Minimum 8 characters"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
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
        <label className={labelCls}>Confirm Password *</label>
        <div className="relative">
          <input type={showConfirm ? 'text' : 'password'} className={`${inputCls} pr-11`} style={{ height: '42px' }} placeholder="Repeat password"
            value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
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
  const [passportPhoto, setPassportPhoto]   = useState(null)
  const [idFront, setIdFront]               = useState(null)
  const [idBack, setIdBack]                 = useState(null)
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
    const { passportPhotoFile, idFrontFile, idBackFile, ...rest } = data
    setPersonalData(rest)
    setPassportPhoto(passportPhotoFile)
    setIdFront(idFrontFile)
    setIdBack(idBackFile)
    setEmail(rest.email)
    setStep(1)
  }

  // Step 2 → 3: POST to /registration/initiate with full data + photos
  // Photos are sent as multipart so the server stores them on Azure Blob before
  // the Paystack redirect — once the browser navigates away, React state (files)
  // is gone, so we must persist them server-side here.
  const onElectionNext = async (electionData) => {
    setSeatCategory(electionData.seatCategory)
    setFee(SEAT_OPTIONS.find((s) => s.value === electionData.seatCategory)?.fee || 0)

    try {
      const combined = { ...personalData, ...electionData }
      const fd = new FormData()
      Object.entries(combined).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') fd.append(k, String(v))
      })
      if (passportPhoto) fd.append('passportPhoto', passportPhoto)
      if (idFront)       fd.append('idFront', idFront)
      if (idBack)        fd.append('idBack', idBack)

      // No Content-Type header — browser sets multipart/form-data with boundary
      const res  = await fetch(`${BASE}/registration/initiate`, { method: 'POST', body: fd })
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
            {step === 1 && <StepElectionLevel aspirantType={personalData?.aspirantType} onNext={onElectionNext} onBack={() => setStep(0)} />}
            {step === 2 && (
              <StepPayment sessionToken={sessionToken} seatCategory={seatCategory} fee={fee}
                onBack={() => setStep(1)} onPaid={() => setStep(3)} />
            )}
            {step === 3 && (
              <StepCreateAccount
                sessionToken={sessionToken}
                email={email}
                passportPhotoFile={passportPhoto}
                idFrontFile={idFront}
                idBackFile={idBack}
                onSuccess={(u) => { setDoneUser(u); setDone(true) }}
              />
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
