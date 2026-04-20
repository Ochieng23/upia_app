'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { api } from '../../../lib/api'
import { Logo } from '../../../components/Logo'

const SEAT_OPTIONS = [
  { value: 'president', label: 'President' },
  { value: 'governor', label: 'Governor' },
  { value: 'senator', label: 'Senator' },
  { value: 'mp', label: 'Member of Parliament' },
  { value: 'mca', label: 'MCA' },
  { value: 'women_rep', label: "Women's Representative" },
]

const SEAT_LABELS = {
  president: 'President',
  governor: 'Governor',
  senator: 'Senator',
  mp: 'Member of Parliament',
  mca: 'MCA',
  women_rep: "Women's Representative",
}

const IPPMS_STATUS = {
  not_checked: { label: 'Not Checked', color: 'bg-gray-100 text-gray-600' },
  eligible: { label: 'Eligible', color: 'bg-blue-100 text-blue-700' },
  ineligible: { label: 'Ineligible', color: 'bg-red-100 text-red-700' },
  otp_pending: { label: 'OTP Pending', color: 'bg-yellow-100 text-yellow-700' },
  registered: { label: 'Registered ✓', color: 'bg-green-100 text-green-700' },
}

const NAV = [
  {
    id: 'overview', label: 'Overview',
    icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    id: 'certificates', label: 'My Certificates',
    icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  },
  {
    id: 'payments', label: 'Payments',
    icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  },
  {
    id: 'ippms', label: 'IPPMS Registration',
    icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>,
  },
]

export default function Portal() {
  const { user, logout, loading: authLoading } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profile, setProfile] = useState(null)
  const [certificates, setCertificates] = useState([])
  const [payments, setPayments] = useState([])
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  // Edit profile modal
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState(null)
  const [counties, setCounties] = useState([])
  const [constituencies, setConstituencies] = useState([])
  const [wards, setWards] = useState([])
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState('')
  const [editSaved, setEditSaved] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) { router.replace('/login'); return }
    if (!authLoading && user?.role === 'admin') { router.replace('/admin'); return }
    if (user && user.role === 'aspirant') {
      Promise.all([
        api.get('/aspirant/profile'),
        api.get('/aspirant/certificates'),
        api.get('/payments/mine'),
      ])
        .then(([profileRes, certRes, payRes]) => {
          setProfile(profileRes.data)
          setCertificates(certRes.data || [])
          setPayments(payRes.data || [])
        })
        .catch(() => {})
        .finally(() => setLoadingData(false))
    } else if (!authLoading) {
      setLoadingData(false)
    }
  }, [user, authLoading, router])

  const handleLogout = () => { logout(); router.push('/') }
  const handleNav = (id) => { setTab(id); setSidebarOpen(false) }

  const openEditModal = () => {
    setEditForm({ ...profile })
    setEditError('')
    setEditSaved(false)
    setEditOpen(true)
    if (counties.length === 0) api.get('/ippms/counties').then(d => setCounties(d.data || [])).catch(() => {})
    if (profile?.countyCode) api.get(`/ippms/constituencies/${profile.countyCode}`).then(d => setConstituencies(d.data || [])).catch(() => {})
    if (profile?.constituencyCode) api.get(`/ippms/wards/${profile.constituencyCode}`).then(d => setWards(d.data || [])).catch(() => {})
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    setEditError('')
    setEditSaving(true)
    try {
      const updates = {
        seatCategory: editForm.seatCategory,
        seatDescription: editForm.seatDescription,
        countyCode: editForm.countyCode,
        countyName: counties.find(c => c.code === editForm.countyCode)?.name || editForm.countyName,
        constituencyCode: editForm.constituencyCode,
        constituencyName: constituencies.find(c => c.code === editForm.constituencyCode)?.name || editForm.constituencyName,
        wardCode: editForm.wardCode,
        wardName: wards.find(w => w.code === editForm.wardCode)?.name || editForm.wardName,
        bio: editForm.bio,
        manifesto: editForm.manifesto,
      }
      const res = await api.put('/aspirant/profile', updates)
      setProfile(res.data)
      setEditSaved(true)
      setTimeout(() => { setEditOpen(false); setEditSaved(false) }, 1200)
    } catch (err) {
      setEditError(err.message || 'Failed to save')
    } finally {
      setEditSaving(false)
    }
  }

  const setEdit = (field) => (e) => setEditForm(f => ({ ...f, [field]: e.target.value }))

  const payNominationFee = async () => {
    setPaymentLoading(true)
    try {
      const data = await api.post('/payments/initialize/nomination', {})
      window.location.href = data.authorization_url
    } catch (err) {
      alert(err.message)
    } finally {
      setPaymentLoading(false)
    }
  }

  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen bg-[#F8F5F3] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-[#1a3c5e] border-t-transparent" />
      </div>
    )
  }

  if (!user) return null

  const ippms = IPPMS_STATUS[profile?.ippmsStatus] || IPPMS_STATUS.not_checked
  const initials = `${user.firstName[0]}${user.lastName[0]}`

  return (
    <div className="flex h-screen bg-[#F8F5F3] overflow-hidden">

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-[#1a3c5e] flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-white/10 flex-shrink-0">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <Logo className="h-8 w-auto brightness-0 invert flex-shrink-0" />
            <span className="text-sm font-semibold text-white truncate">Aspirant Portal</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-0.5">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/30">
            My Dashboard
          </p>
          {NAV.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                tab === id
                  ? 'bg-white/15 text-white'
                  : 'text-white/55 hover:bg-white/8 hover:text-white'
              }`}
            >
              <span className="flex-shrink-0">{icon}</span>
              {label}
              {id === 'certificates' && certificates.length > 0 && (
                <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/20 px-1.5 text-[10px] font-bold text-white">
                  {certificates.length}
                </span>
              )}
            </button>
          ))}

          <div className="pt-3 mt-3 border-t border-white/10">
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/30">
              Account
            </p>
            <button
              onClick={openEditModal}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/55 hover:bg-white/8 hover:text-white transition-colors"
            >
              <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-3 space-y-0.5 flex-shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/55 hover:bg-white/8 hover:text-white transition-colors"
          >
            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/55 hover:bg-white/8 hover:text-white transition-colors"
          >
            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>

          {/* User chip */}
          <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="h-7 w-7 rounded-full bg-[#236331] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-white/40 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="h-16 bg-white border-b border-[#E2DCDA] flex items-center px-4 sm:px-6 gap-4 flex-shrink-0">
          <button
            className="lg:hidden text-[#5A5450] hover:text-[#111111] flex-shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-[#5A5450]">Portal</span>
            <svg className="h-3 w-3 text-[#E2DCDA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-sm font-medium text-[#111111]">
              {NAV.find(n => n.id === tab)?.label || tab}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* IPPMS status pill */}
            <span className={`hidden sm:inline-flex rounded-full px-3 py-1 text-xs font-medium ${ippms.color}`}>
              IPPMS: {ippms.label}
            </span>
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#1a3c5e] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">

            {/* Overview */}
            {tab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-semibold text-[#111111]">Welcome back, {user.firstName}</h1>
                  <p className="text-sm text-[#5A5450] mt-1">Here&apos;s a summary of your aspirant profile and party status.</p>
                </div>

                {/* Status cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <StatusCard
                    title="Account Status"
                    value={profile?.isApproved ? 'Approved' : 'Pending Approval'}
                    colorClass={profile?.isApproved ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}
                    icon={
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  />
                  <StatusCard
                    title="IPPMS Registration"
                    value={ippms.label}
                    colorClass={ippms.color}
                    icon={
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                      </svg>
                    }
                  />
                  <StatusCard
                    title="My Certificates"
                    value={`${certificates.length} issued`}
                    colorClass="bg-[#EBF5EC] text-[#236331]"
                    icon={
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    }
                  />
                </div>

                {/* Profile summary */}
                <div className="rounded-xl bg-white border border-[#E2DCDA] shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DCDA]">
                    <h2 className="text-sm font-semibold text-[#111111]">Profile Summary</h2>
                    <div className="flex items-center gap-3">
                      <a
                        href="/api/backend/aspirant/card"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-md bg-[#1a3c5e] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1a3c5e]/90 transition-colors"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Member Card
                      </a>
                      <button onClick={openEditModal} className="text-xs font-medium text-[#1a3c5e] hover:underline flex items-center gap-1">
                        Edit profile
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  </div>
                  <dl className="divide-y divide-[#E2DCDA]">
                    {[
                      { label: 'Full Name', value: `${user.firstName} ${user.lastName}` },
                      { label: 'Email', value: user.email },
                      { label: 'Phone', value: user.phone || '—' },
                      { label: 'Seat', value: profile?.seatCategory ? SEAT_LABELS[profile.seatCategory] : '—' },
                      { label: 'County', value: profile?.countyName || '—' },
                      { label: 'Constituency', value: profile?.constituencyName || '—' },
                      { label: 'Ward', value: profile?.wardName || '—' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between px-6 py-3 text-sm">
                        <dt className="text-[#5A5450]">{label}</dt>
                        <dd className="font-medium text-[#111111] text-right max-w-[55%] truncate">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Quick links */}
                {profile?.ippmsStatus !== 'registered' && (
                  <div className="rounded-xl border border-[#1a3c5e]/20 bg-[#1a3c5e]/5 p-5 flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#1a3c5e] text-white">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-[#111111]">Complete Party Registration</h3>
                      <p className="mt-1 text-sm text-[#5A5450]">
                        Register with ORPP via the IPPMS system to complete your party membership.
                      </p>
                      <button
                        onClick={() => setTab('ippms')}
                        className="mt-3 inline-flex items-center rounded-md bg-[#1a3c5e] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 transition-colors"
                      >
                        Register with ORPP →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Certificates */}
            {tab === 'certificates' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-xl font-semibold text-[#111111]">My Certificates</h1>
                  <p className="text-sm text-[#5A5450] mt-1">{certificates.length} certificate{certificates.length !== 1 ? 's' : ''} issued by UPIA</p>
                </div>

                {certificates.length === 0 ? (
                  <div className="rounded-xl bg-white border border-[#E2DCDA] p-12 text-center shadow-sm">
                    <div className="mx-auto h-12 w-12 rounded-full bg-[#F8F5F3] flex items-center justify-center mb-4">
                      <svg className="h-6 w-6 text-[#5A5450]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-[#111111]">No certificates yet</p>
                    <p className="text-sm text-[#5A5450] mt-1">Certificates will appear here once issued by party administration.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {certificates.map((cert) => (
                      <div key={cert._id} className="rounded-xl bg-white border border-[#E2DCDA] px-5 py-4 shadow-sm flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#EBF5EC] text-[#236331]">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#111111] truncate">{cert.title}</p>
                            <p className="text-xs text-[#5A5450] mt-0.5 capitalize">
                              {cert.type} · {new Date(cert.issuedAt).toLocaleDateString('en-KE')}
                            </p>
                          </div>
                        </div>
                        <a
                          href={`/api/backend/certificates/${cert._id}/download`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-shrink-0 flex items-center gap-1.5 rounded-md bg-[#1a3c5e] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1a3c5e]/90 transition-colors"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download PDF
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Payments */}
            {tab === 'payments' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-xl font-semibold text-[#111111]">Payments</h1>
                  <p className="text-sm text-[#5A5450] mt-1">Manage your nomination fee and view transaction history.</p>
                </div>

                {/* Pay nomination fee CTA */}
                {!payments.some(p => p.type === 'nomination_fee' && p.status === 'success') && (
                  <div className="rounded-xl border border-[#1a3c5e]/20 bg-[#1a3c5e]/5 p-6 flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#1a3c5e] text-white">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-[#111111]">Nomination Fee</h3>
                      <p className="mt-1 text-sm text-[#5A5450]">
                        Pay the party nomination fee of <span className="font-semibold text-[#111111]">KES 5,000</span> to complete your aspirant registration. Payment is processed securely via Paystack.
                      </p>
                      <button
                        onClick={payNominationFee}
                        disabled={paymentLoading}
                        className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#1a3c5e] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 disabled:opacity-60 transition-colors"
                      >
                        {paymentLoading ? (
                          <><svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Redirecting…</>
                        ) : (
                          <>Pay KES 5,000 via Paystack →</>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {payments.some(p => p.type === 'nomination_fee' && p.status === 'success') && (
                  <div className="rounded-xl bg-green-50 border border-green-200 p-5 flex items-center gap-3">
                    <svg className="h-5 w-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-sm font-medium text-green-800">Nomination fee paid — your payment has been confirmed.</p>
                  </div>
                )}

                {/* Transaction history */}
                <div className="rounded-xl bg-white border border-[#E2DCDA] shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#E2DCDA]">
                    <h2 className="text-sm font-semibold text-[#111111]">Transaction History</h2>
                  </div>
                  {payments.length === 0 ? (
                    <div className="px-5 py-10 text-center text-sm text-[#5A5450]">No transactions yet.</div>
                  ) : (
                    <div className="divide-y divide-[#E2DCDA]">
                      {payments.map(p => (
                        <div key={p._id} className="flex items-center justify-between px-5 py-4">
                          <div>
                            <p className="text-sm font-medium text-[#111111] capitalize">{p.type?.replace(/_/g, ' ')}</p>
                            <p className="text-xs text-[#5A5450] mt-0.5">{p.reference} · {new Date(p.createdAt).toLocaleDateString('en-KE')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-[#111111]">KES {(p.amount || 0).toLocaleString()}</p>
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium mt-1 ${
                              p.status === 'success' ? 'bg-green-100 text-green-700' :
                              p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>{p.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* IPPMS Registration */}
            {tab === 'ippms' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-xl font-semibold text-[#111111]">IPPMS Registration</h1>
                  <p className="text-sm text-[#5A5450] mt-1">Register with the Office of the Registrar of Political Parties via IPPMS.</p>
                </div>

                {profile?.ippmsStatus === 'registered' ? (
                  <div className="rounded-xl bg-green-50 border border-green-200 p-6 flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-green-800">Successfully Registered</h3>
                      <p className="mt-1 text-sm text-green-700">
                        Your party membership with ORPP has been completed via IPPMS.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-white border border-[#E2DCDA] shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-[#E2DCDA] bg-[#F8F5F3]">
                      <h2 className="text-sm font-semibold text-[#111111]">Current Status</h2>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${ippms.color}`}>
                          {ippms.label}
                        </span>
                      </div>
                    </div>
                    <div className="px-6 py-6 space-y-4">
                      <p className="text-sm text-[#5A5450]">
                        To complete your IPPMS registration, use the public registration flow. The process involves:
                      </p>
                      <ol className="space-y-3">
                        {[
                          'Verify your eligibility using your National ID or Passport',
                          'Receive a confirmation OTP on your registered phone number',
                          'Submit the OTP to confirm and complete your registration',
                        ].map((step, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-[#5A5450]">
                            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#1a3c5e]/10 text-xs font-semibold text-[#1a3c5e]">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                      <Link
                        href="/register"
                        className="mt-2 inline-flex items-center gap-2 rounded-[6px] bg-[#1a3c5e] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 transition-colors"
                      >
                        Start IPPMS Registration →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </main>
      </div>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        form={editForm}
        setForm={setEditForm}
        counties={counties}
        constituencies={constituencies}
        wards={wards}
        setConstituencies={setConstituencies}
        setWards={setWards}
        onSubmit={saveProfile}
        saving={editSaving}
        error={editError}
        saved={editSaved}
      />
    </div>
  )
}

// ─── Edit Profile Modal ───────────────────────────────────────────────────────

function EditProfileModal({ open, onClose, form, setForm, counties, constituencies, wards, setConstituencies, setWards, onSubmit, saving, error, saved }) {
  if (!open || !form) return null

  const fld = 'block w-full rounded-[6px] border border-[#E2DCDA] px-3 py-2.5 text-sm text-[#111111] focus:border-[#1a3c5e] focus:outline-none focus:ring-1 focus:ring-[#1a3c5e] transition-all bg-white'

  const handleCountyChange = async (e) => {
    const code = e.target.value
    setForm(f => ({ ...f, countyCode: code, constituencyCode: '', wardCode: '' }))
    setConstituencies([])
    setWards([])
    if (code) api.get(`/ippms/constituencies/${code}`).then(d => setConstituencies(d.data || [])).catch(() => {})
  }

  const handleConstituencyChange = async (e) => {
    const code = e.target.value
    setForm(f => ({ ...f, constituencyCode: code, wardCode: '' }))
    setWards([])
    if (code) api.get(`/ippms/wards/${code}`).then(d => setWards(d.data || [])).catch(() => {})
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DCDA] flex-shrink-0">
          <h2 className="text-base font-semibold text-[#111111]">Edit Aspirant Profile</h2>
          <button onClick={onClose} className="text-[#5A5450] hover:text-[#111111] rounded-lg p-1 hover:bg-[#F8F5F3] transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={onSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#5A5450] mb-1.5">Seat Category</label>
              <select className={fld} value={form.seatCategory || ''} onChange={e => setForm(f => ({ ...f, seatCategory: e.target.value }))}>
                <option value="">Select seat</option>
                {SEAT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#5A5450] mb-1.5">Seat Description</label>
              <input className={fld} placeholder="e.g. Mombasa Senator" value={form.seatDescription || ''} onChange={e => setForm(f => ({ ...f, seatDescription: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#5A5450] mb-1.5">County</label>
              <select className={fld} value={form.countyCode || ''} onChange={handleCountyChange}>
                <option value="">County</option>
                {counties.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#5A5450] mb-1.5">Constituency</label>
              <select className={fld} value={form.constituencyCode || ''} disabled={!form.countyCode} onChange={handleConstituencyChange}>
                <option value="">Constituency</option>
                {constituencies.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#5A5450] mb-1.5">Ward</label>
              <select className={fld} value={form.wardCode || ''} disabled={!form.constituencyCode} onChange={e => setForm(f => ({ ...f, wardCode: e.target.value }))}>
                <option value="">Ward</option>
                {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#5A5450] mb-1.5">Bio</label>
            <textarea className={fld} rows={3} placeholder="Brief biography…" value={form.bio || ''} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#5A5450] mb-1.5">Manifesto</label>
            <textarea className={fld} rows={4} placeholder="Your campaign manifesto…" value={form.manifesto || ''} onChange={e => setForm(f => ({ ...f, manifesto: e.target.value }))} />
          </div>

          {error && <p className="rounded-[6px] border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}
          {saved && <p className="rounded-[6px] border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">Profile saved!</p>}
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#E2DCDA] flex-shrink-0">
          <button type="button" onClick={onClose} className="flex-1 rounded-[8px] border border-[#E2DCDA] px-4 py-2.5 text-sm font-medium text-[#5A5450] hover:bg-[#F8F5F3] transition-colors">
            Cancel
          </button>
          <button onClick={onSubmit} disabled={saving} className="flex-1 rounded-[8px] bg-[#1a3c5e] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 disabled:opacity-50 transition-colors">
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}

function StatusCard({ title, value, colorClass, icon }) {
  return (
    <div className={`rounded-xl p-5 border border-transparent shadow-sm ${colorClass}`}>
      <div className="flex items-center gap-3">
        <span className="flex-shrink-0 opacity-80">{icon}</span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.07em] opacity-70">{title}</p>
          <p className="text-sm font-semibold mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  )
}
