'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { api } from '../../../lib/api'
import { Logo } from '../../../components/Logo'
import { useIppmsLocations } from '../../../lib/useIppmsLocations'

const BLANK_POST = {
  title: '', description: '', body: '', coverImage: '',
  categories: '', authorName: '', authorTitle: '', authorImageUrl: '', published: false,
}

const BLANK_EVENT = {
  title: '', description: '', date: '', endDate: '', venue: '',
  countyName: '', constituencyName: '', capacity: '', isPublished: false,
}

const NAV = [
  { id: 'overview',      label: 'Overview',        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'aspirants',     label: 'Aspirants',        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'certificates',  label: 'Certificates',     icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'payments',      label: 'Payments',         icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { id: 'events',        label: 'Events',           icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'structure',     label: 'Party Structure',  icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { id: 'users',         label: 'Users',            icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id: 'news',          label: 'News Posts',       icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { id: 'resources',     label: 'Resources',        icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
]

const NavIcon = ({ d }) => (
  <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
)

export default function AdminDashboard() {
  const { user, logout, loading: authLoading } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [aspirants, setAspirants] = useState([])
  const [certificates, setCertificates] = useState([])
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [events, setEvents] = useState([])
  const [structure, setStructure] = useState([])
  const [payments, setPayments] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  const [issueForm, setIssueForm] = useState(null)
  const [issuing, setIssuing] = useState(false)
  const [postForm, setPostForm] = useState(null)
  const [postSaving, setPostSaving] = useState(false)
  const [coverUploading, setCoverUploading] = useState(false)
  const coverInputRef = useRef(null)
  const [eventForm, setEventForm] = useState(null)
  const [eventSaving, setEventSaving] = useState(false)
  const [structureForm, setStructureForm] = useState(null)
  const [structureSaving, setStructureSaving] = useState(false)
  const [userForm, setUserForm] = useState(null)
  const [userSaving, setUserSaving] = useState(false)
  const [flash, setFlash] = useState('')

  useEffect(() => {
    if (!authLoading && !user) { router.replace('/login'); return }
    if (!authLoading && user && user.role !== 'admin') { router.replace('/portal'); return }
  }, [user, authLoading, router])

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [a, c, u, p, ev, st, pay, anl] = await Promise.all([
        api.get('/admin/aspirants?limit=50'),
        api.get('/admin/certificates?limit=50'),
        api.get('/admin/users?limit=50'),
        api.get('/posts/admin/all?limit=50'),
        api.get('/events/admin/all'),
        api.get('/structure'),
        api.get('/payments/admin/all'),
        api.get('/admin/analytics'),
      ])
      setAspirants(a.data || [])
      setCertificates(c.data || [])
      setUsers(u.data || [])
      setPosts(p.data || [])
      setEvents(ev.data || [])
      setStructure(st.data || [])
      setPayments(pay.data || [])
      setAnalytics(anl.data || null)
    } catch (err) {
      console.error('loadData error', err)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if (!authLoading && user?.role === 'admin') loadData()
  }, [user, authLoading, loadData])

  const showFlash = (msg) => { setFlash(msg); setTimeout(() => setFlash(''), 4000) }
  const handleNav = (id) => { setTab(id); setSidebarOpen(false) }
  const handleLogout = () => { logout(); router.push('/') }

  /* ── Certificates ── */
  const issueCertificate = async (e) => {
    e.preventDefault(); setIssuing(true)
    try { await api.post('/admin/certificates', issueForm); setIssueForm(null); showFlash('Certificate issued'); loadData() }
    catch (err) { alert(err.message) } finally { setIssuing(false) }
  }

  /* ── Posts ── */
  const openEditPost = async (id) => {
    const data = await api.get(`/posts/admin/${id}`); const p = data.data
    setPostForm({ _id: p._id, title: p.title, description: p.description || '', body: p.body || '', coverImage: p.coverImage || '', categories: (p.categories || []).join(', '), authorName: p.author?.name || '', authorTitle: p.author?.title || '', authorImageUrl: p.author?.imageUrl || '', published: p.published })
  }
  const savePost = async (e) => {
    e.preventDefault(); setPostSaving(true)
    try {
      const payload = { title: postForm.title, description: postForm.description, body: postForm.body, coverImage: postForm.coverImage, categories: postForm.categories, author: { name: postForm.authorName, title: postForm.authorTitle, imageUrl: postForm.authorImageUrl }, published: postForm.published }
      if (postForm._id) { await api.put(`/posts/${postForm._id}`, payload); showFlash('Post updated') }
      else { await api.post('/posts', payload); showFlash('Post created') }
      setPostForm(null); loadData()
    } catch (err) { alert(err.message) } finally { setPostSaving(false) }
  }
  const deletePost = async (id) => { if (!confirm('Delete this post?')) return; await api.delete(`/posts/${id}`); showFlash('Post deleted'); loadData() }
  const togglePublish = async (post) => { await api.put(`/posts/${post._id}`, { published: !post.published }); showFlash(post.published ? 'Unpublished' : 'Published'); loadData() }
  const setPost = (field) => (e) => setPostForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const uploadCoverImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const { url } = await api.post('/posts/upload-image', fd)
      setPostForm((f) => ({ ...f, coverImage: url }))
    } catch (err) {
      alert('Image upload failed: ' + err.message)
    } finally {
      setCoverUploading(false)
      if (coverInputRef.current) coverInputRef.current.value = ''
    }
  }

  /* ── Events ── */
  const saveEvent = async (e) => {
    e.preventDefault(); setEventSaving(true)
    try {
      if (eventForm._id) { await api.put(`/events/${eventForm._id}`, eventForm); showFlash('Event updated') }
      else { await api.post('/events', eventForm); showFlash('Event created') }
      setEventForm(null); loadData()
    } catch (err) { alert(err.message) } finally { setEventSaving(false) }
  }
  const deleteEvent = async (id) => { if (!confirm('Delete this event?')) return; await api.delete(`/events/${id}`); showFlash('Event deleted'); loadData() }
  const toggleEventPublish = async (ev) => { await api.put(`/events/${ev._id}`, { isPublished: !ev.isPublished }); showFlash(ev.isPublished ? 'Event unpublished' : 'Event published'); loadData() }
  const setEv = (field) => (e) => setEventForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  /* ── Structure ── */
  const saveStructure = async (e) => {
    e.preventDefault(); setStructureSaving(true)
    try {
      if (structureForm._id) { await api.put(`/structure/${structureForm._id}`, structureForm); showFlash('Node updated') }
      else { await api.post('/structure', structureForm); showFlash('Node added') }
      setStructureForm(null); loadData()
    } catch (err) { alert(err.message) } finally { setStructureSaving(false) }
  }
  const deleteNode = async (id) => { if (!confirm('Remove this node?')) return; await api.delete(`/structure/${id}`); showFlash('Node removed'); loadData() }
  const setSt = (field) => (e) => setStructureForm((f) => ({ ...f, [field]: e.target.value }))

  const BLANK_USER = { firstName: '', lastName: '', email: '', phone: '', role: 'member', password: '', isActive: true }
  const saveUser = async (e) => {
    e.preventDefault(); setUserSaving(true)
    try {
      if (userForm._id) {
        const { firstName, lastName, phone, role, isActive } = userForm
        await api.put(`/admin/users/${userForm._id}`, { firstName, lastName, phone, role, isActive })
        showFlash('User updated')
      } else {
        await api.post('/admin/users', userForm)
        showFlash('User created')
      }
      setUserForm(null); loadData()
    } catch (err) { alert(err.message) } finally { setUserSaving(false) }
  }
  const deleteUser = async (u) => {
    if (!confirm(`Delete ${u.firstName} ${u.lastName} (${u.email})? This cannot be undone.`)) return
    await api.delete(`/admin/users/${u._id}`)
    showFlash('User deleted'); loadData()
  }
  const setUsr = (field) => (e) => setUserForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  if (authLoading || loading) {
    return <div className="min-h-screen bg-[#F8F5F3] flex items-center justify-center"><div className="animate-spin h-8 w-8 rounded-full border-4 border-[#1a3c5e] border-t-transparent" /></div>
  }
  if (!user || user.role !== 'admin') return null

  const initials = `${user.firstName[0]}${user.lastName[0]}`
  const pendingCount = analytics?.totals?.pendingApprovals ?? aspirants.filter(a => !a.isApproved).length

  return (
    <div className="flex h-screen bg-[#F8F5F3] overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-60 bg-[#1a3c5e] flex flex-col transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-3 px-5 border-b border-white/10 flex-shrink-0">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <Logo className="h-7 w-auto brightness-0 invert flex-shrink-0" />
            <span className="text-sm font-semibold text-white truncate">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-0.5">
          {NAV.map(({ id, label, icon }) => (
            <button key={id} onClick={() => handleNav(id)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${tab === id ? 'bg-white/15 text-white' : 'text-white/55 hover:bg-white/8 hover:text-white'}`}>
              <NavIcon d={icon} />
              <span className="flex-1 text-left">{label}</span>
              {id === 'aspirants' && pendingCount > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#C25757] px-1.5 text-[10px] font-bold text-white">{pendingCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-2.5 space-y-0.5 flex-shrink-0">
          <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/55 hover:bg-white/8 hover:text-white transition-colors">
            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            View Site
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/55 hover:bg-white/8 hover:text-white transition-colors">
            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
          <div className="mt-1 flex items-center gap-3 px-3 py-2.5">
            <div className="h-7 w-7 rounded-full bg-[#C25757] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{initials}</div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-white/40 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-[#E2DCDA] flex items-center px-4 sm:px-6 gap-4 flex-shrink-0">
          <button className="lg:hidden text-[#5A5450] hover:text-[#111111]" onClick={() => setSidebarOpen(true)}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <span className="text-xs text-[#5A5450]">Admin</span>
          <svg className="h-3 w-3 text-[#E2DCDA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          <span className="text-sm font-medium text-[#111111]">{NAV.find(n => n.id === tab)?.label}</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#1a3c5e] flex items-center justify-center text-xs font-bold text-white">{initials}</div>
            <span className="hidden sm:block text-sm text-[#5A5450]">{user.firstName} {user.lastName}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
            {flash && (
              <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 flex justify-between items-center">
                {flash}<button onClick={() => setFlash('')} className="text-green-500 ml-4">✕</button>
              </div>
            )}

            {/* ── Overview ── */}
            {tab === 'overview' && (
              <div className="space-y-6">
                <div><h1 className="text-xl font-semibold text-[#111111]">Dashboard Overview</h1><p className="text-sm text-[#5A5450] mt-1">Welcome back, {user.firstName}.</p></div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { label: 'Total Users', value: analytics?.totals.totalUsers ?? users.length, accent: 'bg-blue-50 text-blue-700' },
                    { label: 'Aspirants', value: analytics?.totals.totalAspirants ?? aspirants.length, accent: 'bg-purple-50 text-purple-700' },
                    { label: 'Pending Approval', value: analytics?.totals.pendingApprovals ?? pendingCount, accent: 'bg-amber-50 text-amber-700' },
                    { label: 'Certificates', value: analytics?.totals.totalCerts ?? certificates.length, accent: 'bg-green-50 text-green-700' },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl bg-white p-5 border border-[#E2DCDA] shadow-sm">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#5A5450]">{s.label}</p>
                      <p className={`text-3xl font-semibold mt-2 ${s.accent.split(' ')[1]}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Monthly Registrations */}
                  {analytics?.monthlyRegistrations?.length > 0 && (
                    <div className="rounded-xl bg-white border border-[#E2DCDA] p-5 shadow-sm">
                      <h2 className="text-sm font-semibold text-[#111111] mb-4">Monthly Registrations</h2>
                      <div className="space-y-2">
                        {(() => {
                          const max = Math.max(...analytics.monthlyRegistrations.map(m => m.count), 1)
                          return analytics.monthlyRegistrations.map(m => (
                            <div key={m.label} className="flex items-center gap-3">
                              <span className="text-xs text-[#5A5450] w-16 flex-shrink-0">{m.label}</span>
                              <div className="flex-1 bg-[#F8F5F3] rounded-full h-2">
                                <div className="bg-[#1a3c5e] h-2 rounded-full transition-all" style={{ width: `${(m.count / max) * 100}%` }} />
                              </div>
                              <span className="text-xs font-medium text-[#111111] w-6 text-right">{m.count}</span>
                            </div>
                          ))
                        })()}
                      </div>
                    </div>
                  )}

                  {/* IPPMS Status */}
                  {analytics?.ippmsDistribution?.length > 0 && (
                    <div className="rounded-xl bg-white border border-[#E2DCDA] p-5 shadow-sm">
                      <h2 className="text-sm font-semibold text-[#111111] mb-4">IPPMS Status Breakdown</h2>
                      <div className="space-y-3">
                        {(() => {
                          const total = analytics.ippmsDistribution.reduce((s, i) => s + i.count, 0) || 1
                          const colors = { registered: 'bg-green-500', eligible: 'bg-blue-500', otp_pending: 'bg-yellow-500', ineligible: 'bg-red-400', not_checked: 'bg-gray-300' }
                          return analytics.ippmsDistribution.map(item => (
                            <div key={item.status} className="flex items-center gap-3">
                              <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${colors[item.status] || 'bg-gray-300'}`} />
                              <span className="text-xs text-[#5A5450] flex-1 capitalize">{(item.status || 'not_checked').replace(/_/g, ' ')}</span>
                              <span className="text-xs font-medium text-[#111111]">{item.count}</span>
                              <span className="text-xs text-[#5A5450] w-10 text-right">{Math.round(item.count / total * 100)}%</span>
                            </div>
                          ))
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Members by County */}
                  {analytics?.membersByCounty?.length > 0 && (
                    <div className="rounded-xl bg-white border border-[#E2DCDA] p-5 shadow-sm">
                      <h2 className="text-sm font-semibold text-[#111111] mb-4">Top Counties by Aspirants</h2>
                      <div className="space-y-2">
                        {(() => {
                          const max = Math.max(...analytics.membersByCounty.map(c => c.count), 1)
                          return analytics.membersByCounty.map(c => (
                            <div key={c.county} className="flex items-center gap-3">
                              <span className="text-xs text-[#5A5450] w-28 flex-shrink-0 truncate">{c.county}</span>
                              <div className="flex-1 bg-[#F8F5F3] rounded-full h-2">
                                <div className="bg-[#236331] h-2 rounded-full transition-all" style={{ width: `${(c.count / max) * 100}%` }} />
                              </div>
                              <span className="text-xs font-medium text-[#111111] w-6 text-right">{c.count}</span>
                            </div>
                          ))
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Payment Stats */}
                  {analytics?.paymentStats?.length > 0 && (
                    <div className="rounded-xl bg-white border border-[#E2DCDA] p-5 shadow-sm">
                      <h2 className="text-sm font-semibold text-[#111111] mb-4">Payment Summary</h2>
                      <div className="space-y-3">
                        {analytics.paymentStats.map(p => (
                          <div key={p.status} className="flex items-center justify-between py-2 border-b border-[#F8F5F3] last:border-0">
                            <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${p.status === 'success' ? 'bg-green-500' : p.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                              <span className="text-sm capitalize text-[#5A5450]">{p.status}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-[#111111]">KES {(p.total || 0).toLocaleString()}</p>
                              <p className="text-xs text-[#5A5450]">{p.count} transaction{p.count !== 1 ? 's' : ''}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Aspirants ── */}
            {tab === 'aspirants' && <AspirantManagement showFlash={showFlash} setIssueForm={setIssueForm} />}

            {/* ── Certificates ── */}
            {tab === 'certificates' && (
              <div className="space-y-4">
                <div><h1 className="text-xl font-semibold text-[#111111]">Certificates</h1><p className="text-sm text-[#5A5450] mt-0.5">{certificates.length} issued</p></div>
                <div className="rounded-xl bg-white border border-[#E2DCDA] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#E2DCDA] text-sm">
                      <thead className="bg-[#F8F5F3]"><tr>{['Number','Holder','Type','Title','Issued','Status','Actions'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#5A5450]">{h}</th>)}</tr></thead>
                      <tbody className="divide-y divide-[#E2DCDA]">
                        {certificates.map(c=>(
                          <tr key={c._id} className="hover:bg-[#F8F5F3]">
                            <td className="px-4 py-3 font-mono text-xs text-[#5A5450]">{c.certificateNumber}</td>
                            <td className="px-4 py-3 text-[#111111] whitespace-nowrap">{c.user?.firstName} {c.user?.lastName}</td>
                            <td className="px-4 py-3 capitalize text-[#5A5450]">{c.type}</td>
                            <td className="px-4 py-3 text-[#111111]">{c.title}</td>
                            <td className="px-4 py-3 text-[#5A5450] whitespace-nowrap">{new Date(c.issuedAt).toLocaleDateString('en-KE')}</td>
                            <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${c.isRevoked?'bg-red-100 text-red-700':'bg-green-100 text-green-700'}`}>{c.isRevoked?'Revoked':'Valid'}</span></td>
                            <td className="px-4 py-3"><a href={`/api/backend/certificates/${c._id}/download`} target="_blank" rel="noreferrer" className="text-xs font-medium text-[#1a3c5e] hover:underline">Download</a></td>
                          </tr>
                        ))}
                        {certificates.length===0&&<tr><td colSpan={7} className="px-4 py-12 text-center text-[#5A5450]">No certificates yet.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── Payments ── */}
            {tab === 'payments' && (
              <div className="space-y-4">
                <div><h1 className="text-xl font-semibold text-[#111111]">Payments</h1><p className="text-sm text-[#5A5450] mt-0.5">{payments.length} transactions · KES {payments.filter(p=>p.status==='success').reduce((s,p)=>s+p.amount,0).toLocaleString()} collected</p></div>
                <div className="rounded-xl bg-white border border-[#E2DCDA] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#E2DCDA] text-sm">
                      <thead className="bg-[#F8F5F3]"><tr>{['Reference','Name','Email','Type','Amount','Status','Date'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#5A5450]">{h}</th>)}</tr></thead>
                      <tbody className="divide-y divide-[#E2DCDA]">
                        {payments.map(p=>(
                          <tr key={p._id} className="hover:bg-[#F8F5F3]">
                            <td className="px-4 py-3 font-mono text-xs text-[#5A5450]">{p.reference}</td>
                            <td className="px-4 py-3 font-medium text-[#111111] whitespace-nowrap">
                              {p.user ? `${p.user.firstName} ${p.user.lastName}` : p.metadata?.firstName ? `${p.metadata.firstName} ${p.metadata.lastName}` : <span className="text-[#5A5450] italic text-xs">Registration incomplete</span>}
                            </td>
                            <td className="px-4 py-3 text-[#5A5450]">{p.user?.email || p.metadata?.email || '-'}</td>
                            <td className="px-4 py-3 capitalize text-[#5A5450]">{p.type?.replace(/_/g,' ')}</td>
                            <td className="px-4 py-3 font-medium text-[#111111]">KES {(p.amount||0).toLocaleString()}</td>
                            <td className="px-4 py-3"><PaymentBadge status={p.status} /></td>
                            <td className="px-4 py-3 text-[#5A5450] whitespace-nowrap">{new Date(p.createdAt).toLocaleDateString('en-KE')}</td>
                          </tr>
                        ))}
                        {payments.length===0&&<tr><td colSpan={7} className="px-4 py-12 text-center text-[#5A5450]">No payments yet.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── Events ── */}
            {tab === 'events' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div><h1 className="text-xl font-semibold text-[#111111]">Events</h1><p className="text-sm text-[#5A5450] mt-0.5">{events.length} total · {events.filter(e=>e.isPublished).length} published</p></div>
                  <button onClick={()=>setEventForm({...BLANK_EVENT})} className="rounded-[6px] bg-[#1a3c5e] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 transition-colors">+ New Event</button>
                </div>
                <div className="rounded-xl bg-white border border-[#E2DCDA] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#E2DCDA] text-sm">
                      <thead className="bg-[#F8F5F3]"><tr>{['Title','Date','Venue','County','RSVPs','Status','Actions'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#5A5450]">{h}</th>)}</tr></thead>
                      <tbody className="divide-y divide-[#E2DCDA]">
                        {events.map(ev=>(
                          <tr key={ev._id} className="hover:bg-[#F8F5F3]">
                            <td className="px-4 py-3 font-medium text-[#111111] max-w-[180px] truncate">{ev.title}</td>
                            <td className="px-4 py-3 text-[#5A5450] whitespace-nowrap">{new Date(ev.date).toLocaleDateString('en-KE')}</td>
                            <td className="px-4 py-3 text-[#5A5450]">{ev.venue||'-'}</td>
                            <td className="px-4 py-3 text-[#5A5450]">{ev.countyName||'-'}</td>
                            <td className="px-4 py-3 text-[#111111]">{ev.rsvps?.length||0}{ev.capacity?` / ${ev.capacity}`:''}</td>
                            <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ev.isPublished?'bg-green-100 text-green-700':'bg-gray-100 text-gray-600'}`}>{ev.isPublished?'Published':'Draft'}</span></td>
                            <td className="px-4 py-3"><div className="flex items-center gap-3 whitespace-nowrap">
                              <button onClick={()=>setEventForm({...ev,date:ev.date?.slice(0,16),endDate:ev.endDate?.slice(0,16)||''})} className="text-xs font-medium text-[#1a3c5e] hover:underline">Edit</button>
                              <button onClick={()=>toggleEventPublish(ev)} className="text-xs font-medium text-amber-600 hover:underline">{ev.isPublished?'Unpublish':'Publish'}</button>
                              <button onClick={()=>deleteEvent(ev._id)} className="text-xs font-medium text-red-600 hover:underline">Delete</button>
                            </div></td>
                          </tr>
                        ))}
                        {events.length===0&&<tr><td colSpan={7} className="px-4 py-12 text-center text-[#5A5450]">No events yet.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── Party Structure ── */}
            {tab === 'structure' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div><h1 className="text-xl font-semibold text-[#111111]">Party Structure</h1><p className="text-sm text-[#5A5450] mt-0.5">{structure.length} nodes defined</p></div>
                  <button onClick={()=>setStructureForm({level:'county',code:'',name:'',coordinatorTitle:'',notes:''})} className="rounded-[6px] bg-[#1a3c5e] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 transition-colors">+ Add Node</button>
                </div>
                {['national','county','constituency','ward'].map(level=>{
                  const nodes=structure.filter(s=>s.level===level)
                  if(!nodes.length) return null
                  return (
                    <div key={level} className="rounded-xl bg-white border border-[#E2DCDA] overflow-hidden shadow-sm">
                      <div className="px-5 py-3 bg-[#F8F5F3] border-b border-[#E2DCDA]">
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-[#5A5450] capitalize">{level} Level</h2>
                      </div>
                      <div className="divide-y divide-[#E2DCDA]">
                        {nodes.map(n=>(
                          <div key={n._id} className="flex items-center justify-between px-5 py-3 hover:bg-[#F8F5F3]">
                            <div>
                              <p className="text-sm font-medium text-[#111111]">{n.name} {n.code && <span className="text-xs text-[#5A5450]">({n.code})</span>}</p>
                              {n.coordinator && <p className="text-xs text-[#5A5450] mt-0.5">{n.coordinatorTitle || 'Coordinator'}: {n.coordinator.firstName} {n.coordinator.lastName}</p>}
                            </div>
                            <div className="flex items-center gap-3">
                              <button onClick={()=>setStructureForm({...n,coordinator:n.coordinator?._id||''})} className="text-xs font-medium text-[#1a3c5e] hover:underline">Edit</button>
                              <button onClick={()=>deleteNode(n._id)} className="text-xs font-medium text-red-600 hover:underline">Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
                {structure.length===0&&<div className="rounded-xl bg-white border border-[#E2DCDA] p-12 text-center shadow-sm text-[#5A5450]">No structure defined. Add your first node.</div>}
              </div>
            )}

            {/* ── Users ── */}
            {tab === 'users' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div><h1 className="text-xl font-semibold text-[#111111]">Users</h1><p className="text-sm text-[#5A5450] mt-0.5">{users.length} accounts</p></div>
                  <button onClick={()=>setUserForm({...BLANK_USER})} className="rounded-[6px] bg-[#1a3c5e] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 transition-colors">+ Add User</button>
                </div>
                <div className="rounded-xl bg-white border border-[#E2DCDA] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#E2DCDA] text-sm">
                      <thead className="bg-[#F8F5F3]"><tr>{['Name','Email','Phone','Role','Active','Joined','Actions'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#5A5450]">{h}</th>)}</tr></thead>
                      <tbody className="divide-y divide-[#E2DCDA]">
                        {users.map(u=>(
                          <tr key={u._id} className="hover:bg-[#F8F5F3]">
                            <td className="px-4 py-3 font-medium text-[#111111] whitespace-nowrap">{u.firstName} {u.lastName}</td>
                            <td className="px-4 py-3 text-[#5A5450]">{u.email}</td>
                            <td className="px-4 py-3 text-[#5A5450] whitespace-nowrap">{u.phone||'-'}</td>
                            <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${u.role==='admin'?'bg-purple-100 text-purple-700':'bg-blue-100 text-blue-700'}`}>{u.role}</span></td>
                            <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${u.isActive!==false?'bg-green-100 text-green-700':'bg-gray-100 text-gray-600'}`}>{u.isActive!==false?'Active':'Inactive'}</span></td>
                            <td className="px-4 py-3 text-[#5A5450] whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString('en-KE')}</td>
                            <td className="px-4 py-3"><div className="flex items-center gap-3 whitespace-nowrap">
                              <button onClick={()=>setUserForm({...u})} className="text-xs font-medium text-[#1a3c5e] hover:underline">Edit</button>
                              <button onClick={()=>deleteUser(u)} className="text-xs font-medium text-red-600 hover:underline">Delete</button>
                            </div></td>
                          </tr>
                        ))}
                        {users.length===0&&<tr><td colSpan={7} className="px-4 py-12 text-center text-[#5A5450]">No users yet.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── News ── */}
            {tab === 'news' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div><h1 className="text-xl font-semibold text-[#111111]">News Posts</h1><p className="text-sm text-[#5A5450] mt-0.5">{posts.length} total · {posts.filter(p=>p.published).length} published</p></div>
                  <button onClick={()=>setPostForm({...BLANK_POST})} className="rounded-[6px] bg-[#1a3c5e] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 transition-colors">+ New Post</button>
                </div>
                <div className="rounded-xl bg-white border border-[#E2DCDA] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#E2DCDA] text-sm">
                      <thead className="bg-[#F8F5F3]"><tr>{['Title','Categories','Author','Status','Date','Actions'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#5A5450]">{h}</th>)}</tr></thead>
                      <tbody className="divide-y divide-[#E2DCDA]">
                        {posts.map(p=>(
                          <tr key={p._id} className="hover:bg-[#F8F5F3]">
                            <td className="px-4 py-3 font-medium text-[#111111] max-w-[200px] truncate">{p.title}</td>
                            <td className="px-4 py-3 text-[#5A5450]">{p.categories?.slice(0,2).join(', ') || '-'}</td>
                            <td className="px-4 py-3 text-[#5A5450] whitespace-nowrap">{p.author?.name||'-'}</td>
                            <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${p.published?'bg-green-100 text-green-700':'bg-gray-100 text-gray-600'}`}>{p.published?'Published':'Draft'}</span></td>
                            <td className="px-4 py-3 text-[#5A5450] whitespace-nowrap">{new Date(p.publishedAt||p.createdAt).toLocaleDateString('en-KE')}</td>
                            <td className="px-4 py-3"><div className="flex items-center gap-3 whitespace-nowrap">
                              <button onClick={()=>openEditPost(p._id)} className="text-xs font-medium text-[#1a3c5e] hover:underline">Edit</button>
                              <button onClick={()=>togglePublish(p)} className="text-xs font-medium text-amber-600 hover:underline">{p.published?'Unpublish':'Publish'}</button>
                              <a href={`/post/${p.slug}`} target="_blank" rel="noreferrer" className="text-xs font-medium text-[#5A5450] hover:underline">View</a>
                              <button onClick={()=>deletePost(p._id)} className="text-xs font-medium text-red-600 hover:underline">Delete</button>
                            </div></td>
                          </tr>
                        ))}
                        {posts.length===0&&<tr><td colSpan={6} className="px-4 py-12 text-center text-[#5A5450]">No posts yet.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── Resources ── */}
            {tab === 'resources' && <ResourceManagement showFlash={showFlash} />}
          </div>
        </main>
      </div>


      {/* ── Issue certificate modal ── */}
      {issueForm && (
        <Modal title="Issue Certificate" onClose={()=>setIssueForm(null)}>
          <form onSubmit={issueCertificate} className="space-y-4">
            <Field label="Type"><select className={selectCls} value={issueForm.type} onChange={e=>setIssueForm(f=>({...f,type:e.target.value}))} required>{['nomination','clearance','membership','participation'].map(t=><option key={t} value={t} className="capitalize">{t}</option>)}</select></Field>
            <Field label="Title"><input className={inputCls} value={issueForm.title} onChange={e=>setIssueForm(f=>({...f,title:e.target.value}))} placeholder="Certificate of Nomination" required /></Field>
            <Field label="Description"><textarea className={inputCls} rows={3} value={issueForm.description} onChange={e=>setIssueForm(f=>({...f,description:e.target.value}))} /></Field>
            <Field label="Expires At (optional)"><input type="date" className={inputCls} value={issueForm.expiresAt||''} onChange={e=>setIssueForm(f=>({...f,expiresAt:e.target.value}))} /></Field>
            <ModalActions onCancel={()=>setIssueForm(null)} saving={issuing} label="Issue Certificate" />
          </form>
        </Modal>
      )}

      {/* ── Post modal ── */}
      {postForm && (
        <Modal title={postForm._id?'Edit Post':'New Post'} onClose={()=>setPostForm(null)} wide>
          <form onSubmit={savePost} className="space-y-4">
            <Field label="Title *"><input className={inputCls} value={postForm.title} onChange={setPost('title')} placeholder="Post title" required /></Field>
            <Field label="Excerpt"><textarea className={inputCls} rows={2} value={postForm.description} onChange={setPost('description')} placeholder="Short summary…" /></Field>
            <Field label="Cover Image">
              <input ref={coverInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={uploadCoverImage} />
              <div className="flex gap-2">
                <button type="button" onClick={()=>coverInputRef.current?.click()} disabled={coverUploading}
                  className="shrink-0 rounded-[6px] border border-[#d1d5db] bg-white px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-50 transition-colors">
                  {coverUploading ? 'Uploading…' : '⬆ Upload image'}
                </button>
                <input className={inputCls} type="url" value={postForm.coverImage} onChange={setPost('coverImage')} placeholder="or paste URL…" />
              </div>
              {postForm.coverImage&&<img src={postForm.coverImage} alt="Cover preview" className="mt-2 h-36 w-full object-cover rounded-[6px] border border-[#e5e7eb]" onError={e=>{e.target.style.display='none'}} />}
            </Field>
            <Field label="Categories (comma-separated)"><input className={inputCls} value={postForm.categories} onChange={setPost('categories')} placeholder="Politics, News" /></Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Author Name"><input className={inputCls} value={postForm.authorName} onChange={setPost('authorName')} /></Field>
              <Field label="Author Title"><input className={inputCls} value={postForm.authorTitle} onChange={setPost('authorTitle')} /></Field>
              <Field label="Author Photo URL"><input className={inputCls} type="url" value={postForm.authorImageUrl} onChange={setPost('authorImageUrl')} /></Field>
            </div>
            <Field label="Body (HTML)"><textarea className={`${inputCls} font-mono text-xs`} rows={12} value={postForm.body} onChange={setPost('body')} placeholder="<p>Article content…</p>" /><p className="mt-1 text-xs text-[#5A5450]">Supports HTML: &lt;p&gt;, &lt;h2&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;blockquote&gt;</p></Field>
            <div className="flex items-center gap-3 pt-1"><input id="pub" type="checkbox" checked={postForm.published} onChange={setPost('published')} className="h-4 w-4 rounded text-[#1a3c5e]" /><label htmlFor="pub" className="text-sm text-[#5A5450]">Publish immediately</label></div>
            <ModalActions onCancel={()=>setPostForm(null)} saving={postSaving} label={postForm._id?'Save Changes':'Create Post'} />
          </form>
        </Modal>
      )}

      {/* ── Event modal ── */}
      {eventForm && (
        <Modal title={eventForm._id?'Edit Event':'New Event'} onClose={()=>setEventForm(null)}>
          <form onSubmit={saveEvent} className="space-y-4">
            <Field label="Title *"><input className={inputCls} value={eventForm.title} onChange={setEv('title')} placeholder="Party Rally - Nairobi" required /></Field>
            <Field label="Description"><textarea className={inputCls} rows={2} value={eventForm.description||''} onChange={setEv('description')} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start Date & Time *"><input type="datetime-local" className={inputCls} value={eventForm.date||''} onChange={setEv('date')} required /></Field>
              <Field label="End Date & Time"><input type="datetime-local" className={inputCls} value={eventForm.endDate||''} onChange={setEv('endDate')} /></Field>
            </div>
            <Field label="Venue"><input className={inputCls} value={eventForm.venue||''} onChange={setEv('venue')} placeholder="Uhuru Park, Nairobi" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="County"><input className={inputCls} value={eventForm.countyName||''} onChange={setEv('countyName')} placeholder="Nairobi" /></Field>
              <Field label="Capacity"><input type="number" className={inputCls} value={eventForm.capacity||''} onChange={setEv('capacity')} placeholder="500" /></Field>
            </div>
            <div className="flex items-center gap-3 pt-1"><input id="evpub" type="checkbox" checked={!!eventForm.isPublished} onChange={e=>setEventForm(f=>({...f,isPublished:e.target.checked}))} className="h-4 w-4 rounded text-[#1a3c5e]" /><label htmlFor="evpub" className="text-sm text-[#5A5450]">Publish (visible to aspirants)</label></div>
            <ModalActions onCancel={()=>setEventForm(null)} saving={eventSaving} label={eventForm._id?'Save Changes':'Create Event'} />
          </form>
        </Modal>
      )}

      {/* ── User modal ── */}
      {userForm && (
        <Modal title={userForm._id ? 'Edit User' : 'Add User'} onClose={()=>setUserForm(null)}>
          <form onSubmit={saveUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name *"><input className={inputCls} value={userForm.firstName} onChange={setUsr('firstName')} placeholder="John" required /></Field>
              <Field label="Last Name *"><input className={inputCls} value={userForm.lastName} onChange={setUsr('lastName')} placeholder="Doe" required /></Field>
            </div>
            <Field label="Email *"><input className={inputCls} type="email" value={userForm.email} onChange={setUsr('email')} placeholder="john@example.com" required disabled={!!userForm._id} /></Field>
            <Field label="Phone"><input className={inputCls} type="tel" value={userForm.phone||''} onChange={setUsr('phone')} placeholder="+254 7XX XXX XXX" /></Field>
            <Field label="Role *">
              <select className={selectCls} value={userForm.role} onChange={setUsr('role')} required>
                {['member','aspirant','admin'].map(r=><option key={r} value={r} className="capitalize">{r}</option>)}
              </select>
            </Field>
            {!userForm._id && (
              <Field label="Password *"><input className={inputCls} type="password" value={userForm.password||''} onChange={setUsr('password')} placeholder="Minimum 8 characters" required minLength={8} /></Field>
            )}
            <div className="flex items-center gap-3 pt-1">
              <input id="userActive" type="checkbox" checked={userForm.isActive!==false} onChange={setUsr('isActive')} className="h-4 w-4 rounded text-[#1a3c5e]" />
              <label htmlFor="userActive" className="text-sm text-[#5A5450]">Account active</label>
            </div>
            <ModalActions onCancel={()=>setUserForm(null)} saving={userSaving} label={userForm._id?'Save Changes':'Create User'} />
          </form>
        </Modal>
      )}

      {/* ── Structure modal ── */}
      {structureForm && (
        <Modal title={structureForm._id?'Edit Node':'Add Structure Node'} onClose={()=>setStructureForm(null)}>
          <form onSubmit={saveStructure} className="space-y-4">
            <Field label="Level *"><select className={selectCls} value={structureForm.level} onChange={setSt('level')} required>{['national','county','constituency','ward'].map(l=><option key={l} value={l} className="capitalize">{l}</option>)}</select></Field>
            <Field label="Name *"><input className={inputCls} value={structureForm.name} onChange={setSt('name')} placeholder="Nairobi County" required /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Code"><input className={inputCls} value={structureForm.code||''} onChange={setSt('code')} placeholder="047" /></Field>
              <Field label="Parent Code"><input className={inputCls} value={structureForm.parentCode||''} onChange={setSt('parentCode')} placeholder="(county code)" /></Field>
            </div>
            <Field label="Coordinator">
              <select className={selectCls} value={structureForm.coordinator||''} onChange={setSt('coordinator')}>
                <option value="">- None -</option>
                {users.map(u=>(
                  <option key={u._id} value={u._id}>
                    {u.firstName} {u.lastName} ({u.email})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Coordinator Title"><input className={inputCls} value={structureForm.coordinatorTitle||''} onChange={setSt('coordinatorTitle')} placeholder="County Coordinator" /></Field>
            <Field label="Notes"><textarea className={inputCls} rows={2} value={structureForm.notes||''} onChange={setSt('notes')} /></Field>
            <ModalActions onCancel={()=>setStructureForm(null)} saving={structureSaving} label={structureForm._id?'Save Changes':'Add Node'} />
          </form>
        </Modal>
      )}
    </div>
  )
}

/* ─── Resource Management component ─────────────────────────────────────────── */

const RESOURCE_CATEGORIES = ['Financial Reports', 'Press Releases', 'Party Manifesto', 'Party Constitution', 'Other']
const BLANK_RESOURCE = { title: '', description: '', category: 'Press Releases', fileUrl: '', fileType: 'PDF', date: '', tags: '', published: false }

function ResourceManagement({ showFlash }) {
  const [resources,     setResources]     = useState([])
  const [loading,       setLoading]       = useState(true)
  const [form,          setForm]          = useState(null)  // null | resource object (new or edit)
  const [saving,        setSaving]        = useState(false)
  const [fileUploading, setFileUploading] = useState(false)
  const [filterCat,     setFilterCat]     = useState('')
  const fileInputRef = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    try { const d = await api.get('/resources/admin/all'); setResources(d.data || []) }
    catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = filterCat ? resources.filter(r => r.category === filterCat) : resources
  const counts = RESOURCE_CATEGORIES.reduce((acc, c) => ({ ...acc, [c]: resources.filter(r => r.category === c).length }), {})

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (form._id) {
        await api.put(`/resources/${form._id}`, form)
        showFlash('Resource updated')
      } else {
        await api.post('/resources', form)
        showFlash('Resource created')
      }
      setForm(null)
      load()
    } catch (err) { alert(err.message) } finally { setSaving(false) }
  }

  const handleDelete = async (r) => {
    if (!confirm(`Delete "${r.title}"? This cannot be undone.`)) return
    await api.delete(`/resources/${r._id}`)
    showFlash('Resource deleted')
    load()
  }

  const togglePublish = async (r) => {
    await api.patch(`/resources/${r._id}/toggle-publish`, {})
    showFlash(r.published ? 'Resource unpublished' : 'Resource published')
    load()
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const data = await api.post('/resources/upload-file', fd)
      setForm(f => ({ ...f, fileUrl: data.url, fileType: data.fileType || f.fileType }))
      showFlash('File uploaded')
    } catch (err) { alert(err.message) } finally {
      setFileUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const setF = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const publishedCount = resources.filter(r => r.published).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#111111]">Resources</h1>
          <p className="text-sm text-[#5A5450] mt-0.5">{resources.length} total · {publishedCount} published</p>
        </div>
        <button onClick={() => setForm({ ...BLANK_RESOURCE })} className="rounded-[6px] bg-[#1a3c5e] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 transition-colors">
          + Add Resource
        </button>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilterCat('')} className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${!filterCat ? 'bg-[#1a3c5e] text-white' : 'bg-[#F8F5F3] text-[#5A5450] hover:bg-[#E2DCDA]'}`}>
          All ({resources.length})
        </button>
        {RESOURCE_CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilterCat(filterCat === c ? '' : c)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${filterCat === c ? 'bg-[#1a3c5e] text-white' : 'bg-[#F8F5F3] text-[#5A5450] hover:bg-[#E2DCDA]'}`}>
            {c} ({counts[c] || 0})
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-white border border-[#E2DCDA] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16"><div className="animate-spin h-6 w-6 rounded-full border-4 border-[#1a3c5e] border-t-transparent" /></div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#5A5450]">No resources yet. Click "+ Add Resource" to get started.</div>
          ) : (
            <table className="min-w-full divide-y divide-[#E2DCDA] text-sm">
              <thead className="bg-[#F8F5F3]">
                <tr>
                  {['Title', 'Category', 'Type', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#5A5450]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DCDA]">
                {filtered.map(r => (
                  <tr key={r._id} className="hover:bg-[#F8F5F3]">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#111111] max-w-[260px] truncate">{r.title}</div>
                      {r.description && <div className="text-xs text-[#5A5450] mt-0.5 max-w-[260px] truncate">{r.description}</div>}
                    </td>
                    <td className="px-4 py-3 text-[#5A5450] whitespace-nowrap text-xs">{r.category}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-[#F8F5F3] px-2 py-0.5 text-xs font-medium text-[#5A5450]">{r.fileType || 'PDF'}</span>
                    </td>
                    <td className="px-4 py-3 text-[#5A5450] whitespace-nowrap">{r.date || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${r.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {r.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <a href={r.fileUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-[#1a3c5e] hover:underline">View</a>
                        <button onClick={() => setForm({ ...r, tags: Array.isArray(r.tags) ? r.tags.join(', ') : r.tags || '' })} className="text-xs font-medium text-[#1a3c5e] hover:underline">Edit</button>
                        <button onClick={() => togglePublish(r)} className="text-xs font-medium text-amber-600 hover:underline">{r.published ? 'Unpublish' : 'Publish'}</button>
                        <button onClick={() => handleDelete(r)} className="text-xs font-medium text-red-600 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create / Edit modal */}
      {form && (
        <Modal title={form._id ? 'Edit Resource' : 'Add Resource'} onClose={() => setForm(null)} wide>
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Title *">
              <input className={inputCls} value={form.title} onChange={setF('title')} placeholder="Annual Report FY2024" required />
            </Field>
            <Field label="Description">
              <textarea className={inputCls} rows={2} value={form.description || ''} onChange={setF('description')} placeholder="Brief summary of the document…" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category *">
                <select className={selectCls} value={form.category} onChange={setF('category')} required>
                  {RESOURCE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="File Type">
                <select className={selectCls} value={form.fileType || 'PDF'} onChange={setF('fileType')}>
                  {['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'OTHER'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </div>

            <Field label="File">
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf" className="hidden" onChange={handleFileUpload} />
              <div className="flex gap-2 items-start">
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={fileUploading}
                  className="shrink-0 rounded-[6px] border border-[#d1d5db] bg-white px-3 py-2 text-xs font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-50 transition-colors whitespace-nowrap">
                  {fileUploading ? 'Uploading…' : '⬆ Upload File'}
                </button>
                <input className={inputCls} type="url" value={form.fileUrl} onChange={setF('fileUrl')} placeholder="or paste URL (Google Drive, website…)" required />
              </div>
              {form.fileUrl && (
                <p className="mt-1 text-xs text-[#236331] truncate">
                  ✓ <a href={form.fileUrl} target="_blank" rel="noreferrer" className="hover:underline">{form.fileUrl}</a>
                </p>
              )}
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Display Date">
                <input className={inputCls} value={form.date || ''} onChange={setF('date')} placeholder="e.g. June 2023 or 2025" />
              </Field>
              <Field label="Tags (comma-separated)">
                <input className={inputCls} value={form.tags || ''} onChange={setF('tags')} placeholder="finance, 2024, audited" />
              </Field>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input id="respub" type="checkbox" checked={!!form.published} onChange={setF('published')} className="h-4 w-4 rounded text-[#1a3c5e]" />
              <label htmlFor="respub" className="text-sm text-[#5A5450]">Publish immediately (visible on public Resources page)</label>
            </div>
            <ModalActions onCancel={() => setForm(null)} saving={saving} label={form._id ? 'Save Changes' : 'Create Resource'} />
          </form>
        </Modal>
      )}
    </div>
  )
}

/* ─── Aspirant Management component ─────────────────────────────────────────── */

const PIPELINE_TABS = [
  { id: 'pending_review', label: 'Pending Review' },
  { id: 'approved',       label: 'Approved' },
  { id: 'nominated',      label: 'Nominated' },
  { id: 'rejected',       label: 'Rejected' },
]

const SEAT_OPTIONS = [
  { value: 'mca',       label: 'MCA (Member of County Assembly)',     needsConst: true,  needsWard: true  },
  { value: 'women_rep', label: "Women's Representative",              needsConst: false, needsWard: false },
  { value: 'senator',   label: 'Senator',                             needsConst: false, needsWard: false },
  { value: 'mp',        label: 'MP (Member of Parliament)',           needsConst: true,  needsWard: false },
  { value: 'governor',  label: 'Governor',                            needsConst: false, needsWard: false },
]

const BLANK_CREATE = {
  firstName: '', lastName: '', email: '', password: '', phone: '',
  nationalId: '', documentType: 1,
  dob: '', gender: 'M', isElected: false, aspirantType: 'elective',
  seatCategory: '',
  adminNote: '',
}

function AspirantManagement({ showFlash, setIssueForm }) {
  const [pipelineTab, setPipelineTab]       = useState('pending_review')
  const [aspirants,   setAspirants]         = useState([])
  const [stats,       setStats]             = useState(null)
  const [loading,     setLoading]           = useState(true)
  const [viewAspirant,setViewAspirant]      = useState(null)
  const [search,      setSearch]            = useState('')
  const [filterSeat,  setFilterSeat]        = useState('')
  const [filterType,  setFilterType]        = useState('')
  const filterLoc = useIppmsLocations()
  const [rejectModal, setRejectModal]       = useState(null)
  const [rejectReason,setRejectReason]      = useState('')
  const [rejectSaving,setRejectSaving]      = useState(false)
  const [actionId,    setActionId]          = useState(null)
  const [createForm,     setCreateForm]     = useState(null)
  const [createSaving,   setCreateSaving]   = useState(false)
  const [caShowPassword, setCaShowPassword] = useState(false)
  const [caPhoto,        setCaPhoto]        = useState(null)
  const [caPhotoPreview, setCaPhotoPreview] = useState(null)
  const [caIdFront,      setCaIdFront]      = useState(null)
  const [caIdFrontPrev,  setCaIdFrontPrev]  = useState(null)
  const [caIdBack,       setCaIdBack]       = useState(null)
  const [caIdBackPrev,   setCaIdBackPrev]   = useState(null)
  const [caExisting,     setCaExisting]     = useState({ photo: '', idFront: '', idBack: '' })
  const [deletingId,     setDeletingId]     = useState(null)
  const modalLoc = useIppmsLocations()
  const caPhotoRef   = useRef(null)
  const caIdFrontRef = useRef(null)
  const caIdBackRef  = useRef(null)

  const loadStats = useCallback(async () => {
    try { const d = await api.get('/admin/aspirants/stats'); setStats(d.data) } catch {}
  }, [])

  const loadAspirants = useCallback(async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams({ applicationStatus: pipelineTab, limit: '100' })
      if (filterSeat)          p.set('seatCategory', filterSeat)
      if (filterType)          p.set('aspirantType', filterType)
      if (filterLoc.countyCode)          p.set('countyCode', filterLoc.countyCode)
      if (filterLoc.constituencyCode)    p.set('constituencyCode', filterLoc.constituencyCode)
      if (filterLoc.wardCode)            p.set('wardCode', filterLoc.wardCode)
      if (search)               p.set('search', search)
      const d = await api.get(`/admin/aspirants?${p}`)
      setAspirants(d.data || [])
    } catch {} finally { setLoading(false) }
  }, [pipelineTab, filterSeat, filterType, filterLoc.countyCode, filterLoc.constituencyCode, filterLoc.wardCode, search])

  useEffect(() => { loadStats() }, [loadStats])
  useEffect(() => { loadAspirants() }, [loadAspirants])

  const reload = () => { loadStats(); loadAspirants() }

  const handleApprove = async (id) => {
    setActionId(id)
    try { await api.put(`/admin/aspirants/${id}/approve`, {}); showFlash('Aspirant approved'); reload() }
    catch (e) { alert(e.message) } finally { setActionId(null) }
  }
  const openReject = (a) => {
    setRejectModal({ id: a._id, name: `${a.user?.firstName || ''} ${a.user?.lastName || ''}`.trim() })
    setRejectReason('')
  }
  const handleReject = async () => {
    setRejectSaving(true)
    try { await api.put(`/admin/aspirants/${rejectModal.id}/reject`, { reason: rejectReason || 'Rejected by admin' }); showFlash('Aspirant rejected'); setRejectModal(null); reload() }
    catch (e) { alert(e.message) } finally { setRejectSaving(false) }
  }
  const handleMarkFeePaid = async (id) => {
    if (!confirm('Confirm: mark nomination fee as received for this aspirant?')) return
    setActionId(id)
    try { await api.patch(`/admin/aspirants/${id}/mark-fee-paid`, {}); showFlash('Nomination fee marked as paid'); reload() }
    catch (e) { alert(e.message) } finally { setActionId(null) }
  }
  const handleNominate = async (id) => {
    if (!confirm('Officially nominate and stamp this aspirant? This cannot be undone.')) return
    setActionId(id)
    try { await api.patch(`/admin/aspirants/${id}/nominate`, {}); showFlash('Aspirant officially nominated'); reload() }
    catch (e) { alert(e.message) } finally { setActionId(null) }
  }

  const clearFilters = () => { setSearch(''); setFilterSeat(''); setFilterType(''); filterLoc.reset() }
  const hasFilters = !!(search || filterSeat || filterType || filterLoc.countyCode || filterLoc.constituencyCode || filterLoc.wardCode)

  const setC = (field) => (e) => setCreateForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const clearCreateFiles = () => {
    setCaPhoto(null); setCaPhotoPreview(null)
    setCaIdFront(null); setCaIdFrontPrev(null)
    setCaIdBack(null); setCaIdBackPrev(null)
    setCaExisting({ photo: '', idFront: '', idBack: '' })
    setCaShowPassword(false)
    modalLoc.reset()
  }

  const makeFileHandler = (setFile, setPreview) => (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const openEditAspirant = (a) => {
    setCreateForm({
      _id: a._id,
      firstName: a.user?.firstName || '',
      lastName: a.user?.lastName || '',
      email: a.user?.email || '',
      phone: a.user?.phone || '',
      password: '',
      nationalId: a.nationalId || '',
      documentType: a.documentType || 1,
      dob: a.dateOfBirth ? new Date(a.dateOfBirth).toISOString().slice(0, 10) : '',
      gender: a.gender || 'M',
      isElected: !!a.isElected,
      aspirantType: a.aspirantType || 'elective',
      seatCategory: a.seatCategory || '',
      adminNote: '',
    })
    modalLoc.hydrate(a.countyCode, a.constituencyCode, a.wardCode)
    setCaExisting({ photo: a.profilePhoto || '', idFront: a.idDocumentFront || '', idBack: a.idDocumentBack || '' })
  }

  const handleCreateAspirant = async (e) => {
    e.preventDefault()
    const isEdit = !!createForm._id
    setCreateSaving(true)
    try {
      const fd = new FormData()
      Object.entries(createForm).forEach(([k, v]) => {
        if (k === '_id') return
        if (v !== undefined && v !== null && v !== '') fd.append(k, String(v))
      })
      const locFields = {
        countyCode: modalLoc.countyCode,
        countyName: modalLoc.counties.find((c) => c.code === modalLoc.countyCode)?.name || '',
        constituencyCode: modalLoc.constituencyCode,
        constituencyName: modalLoc.constituencies.find((c) => c.code === modalLoc.constituencyCode)?.name || '',
        wardCode: modalLoc.wardCode,
        wardName: modalLoc.wards.find((w) => w.code === modalLoc.wardCode)?.name || '',
      }
      Object.entries(locFields).forEach(([k, v]) => { if (v) fd.append(k, v) })
      if (caPhoto)   fd.append('passportPhoto', caPhoto)
      if (caIdFront) fd.append('idFront', caIdFront)
      if (caIdBack)  fd.append('idBack', caIdBack)

      if (isEdit) {
        await api.put(`/admin/aspirants/${createForm._id}`, fd)
        showFlash('Aspirant updated successfully')
      } else {
        await api.post('/admin/aspirants', fd)
        showFlash('Aspirant account created successfully')
      }
      setCreateForm(null)
      clearCreateFiles()
      reload()
    } catch (err) {
      alert(err.message || `Failed to ${isEdit ? 'update' : 'create'} aspirant account`)
    } finally {
      setCreateSaving(false)
    }
  }

  const handleDeleteAspirant = async (a) => {
    const name = `${a.user?.firstName || ''} ${a.user?.lastName || ''}`.trim() || 'this aspirant'
    if (!confirm(`Permanently delete ${name} (${a.user?.email})?\n\nThis removes both the aspirant profile and the linked user account. This cannot be undone.`)) return
    setDeletingId(a._id)
    try {
      await api.delete(`/admin/aspirants/${a._id}`)
      showFlash('Aspirant deleted')
      setViewAspirant(null)
      reload()
    } catch (err) {
      alert(err.message || 'Failed to delete aspirant')
    } finally {
      setDeletingId(null)
    }
  }

  const tabCount = {
    pending_review: stats?.pending ?? 0,
    approved: (stats?.approved ?? 0) + (stats?.approvedFeePaid ?? 0),
    nominated: stats?.nominated ?? 0,
    rejected: stats?.rejected ?? 0,
  }
  const tabColors = { pending_review: 'bg-amber-100 text-amber-700', approved: 'bg-blue-100 text-blue-700', nominated: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' }

  const statusBadge = (a) => {
    const st = a.applicationStatus || 'pending_review'
    if (st === 'nominated') return <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700">Nominated</span>
    if (st === 'rejected')  return <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700">Rejected</span>
    if (st === 'approved' && a.nominationFeePaid) return <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700">Fee Paid</span>
    if (st === 'approved')  return <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700">Approved</span>
    return <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700">Pending</span>
  }

  const rowActions = (a) => {
    const busy = actionId === a._id
    const st   = a.applicationStatus || 'pending_review'
    const btns = [
      <button key="v" onClick={() => setViewAspirant(a)} className="text-xs font-medium text-[#1a3c5e] hover:underline">View</button>,
    ]
    if (st === 'pending_review') {
      btns.push(<button key="ap" disabled={busy} onClick={() => handleApprove(a._id)} className="text-xs font-medium text-green-700 hover:underline disabled:opacity-40">{busy?'…':'Approve'}</button>)
      btns.push(<button key="rj" disabled={busy} onClick={() => openReject(a)} className="text-xs font-medium text-red-600 hover:underline disabled:opacity-40">Reject</button>)
    } else if (st === 'approved' && !a.nominationFeePaid) {
      btns.push(<button key="fp" disabled={busy} onClick={() => handleMarkFeePaid(a._id)} className="text-xs font-medium text-indigo-600 hover:underline disabled:opacity-40">{busy?'…':'Mark Fee Paid'}</button>)
      btns.push(<button key="rj" disabled={busy} onClick={() => openReject(a)} className="text-xs font-medium text-red-600 hover:underline disabled:opacity-40">Reject</button>)
    } else if (st === 'approved' && a.nominationFeePaid) {
      btns.push(<button key="nm" disabled={busy} onClick={() => handleNominate(a._id)} className="text-xs font-medium text-green-700 hover:underline disabled:opacity-40">{busy?'…':'Stamp / Nominate'}</button>)
      btns.push(<button key="rj" disabled={busy} onClick={() => openReject(a)} className="text-xs font-medium text-red-600 hover:underline disabled:opacity-40">Reject</button>)
    } else if (st === 'rejected') {
      btns.push(<button key="ra" disabled={busy} onClick={() => handleApprove(a._id)} className="text-xs font-medium text-green-700 hover:underline disabled:opacity-40">{busy?'…':'Re-approve'}</button>)
    }
    btns.push(<button key="cert" onClick={() => setIssueForm({ aspirantId: a._id, type: 'nomination', title: '', description: '' })} className="text-xs font-medium text-[#5A5450] hover:underline">Issue Cert</button>)
    btns.push(<button key="edit" onClick={() => openEditAspirant(a)} className="text-xs font-medium text-[#1a3c5e] hover:underline">Edit</button>)
    btns.push(<button key="del" disabled={deletingId === a._id} onClick={() => handleDeleteAspirant(a)} className="text-xs font-medium text-red-600 hover:underline disabled:opacity-40">{deletingId === a._id ? '…' : 'Delete'}</button>)
    return <div className="flex items-center gap-3 whitespace-nowrap">{btns}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#111111]">Aspirants</h1>
          <p className="text-sm text-[#5A5450] mt-0.5">{stats ? `${stats.total} total · ${stats.pending} pending review` : 'Loading…'}</p>
        </div>
        <button
          onClick={() => setCreateForm({ ...BLANK_CREATE })}
          className="shrink-0 rounded-[6px] bg-[#236331] px-4 py-2 text-sm font-medium text-white hover:bg-[#2B753A] transition-colors"
        >
          + Create Aspirant
        </button>
      </div>

      {/* Stats tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: 'Pending Review', count: stats?.pending ?? 0, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
          { label: 'Approved',       count: stats?.approved ?? 0, color: 'text-blue-700',  bg: 'bg-blue-50',  border: 'border-blue-200' },
          { label: 'Fee Paid',       count: stats?.approvedFeePaid ?? 0, color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' },
          { label: 'Nominated',      count: stats?.nominated ?? 0, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
          { label: 'Rejected',       count: stats?.rejected ?? 0, color: 'text-red-700',   bg: 'bg-red-50',   border: 'border-red-200' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl ${s.bg} px-4 py-3 border ${s.border}`}>
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#5A5450]">{s.label}</p>
            <p className={`text-2xl font-semibold mt-1 ${s.color}`}>{s.count}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="rounded-xl bg-white border border-[#E2DCDA] p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div className="xl:col-span-2">
            <input className={inputCls} placeholder="Search name or email…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className={selectCls} value={filterSeat} onChange={e => setFilterSeat(e.target.value)}>
            <option value="">All seats</option>
            {['president','governor','senator','mp','mca','women_rep'].map(s => (
              <option key={s} value={s}>{s === 'women_rep' ? 'Women Rep' : s === 'mp' ? 'MP' : s === 'mca' ? 'MCA' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <select className={selectCls} value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">All types</option>
            <option value="elective">Elective</option>
            <option value="nominated">Party Nominated</option>
          </select>
          <select className={selectCls} value={filterLoc.countyCode} onChange={e => filterLoc.selectCounty(e.target.value)}>
            <option value="">All counties</option>
            {filterLoc.counties.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
          <select className={selectCls} value={filterLoc.constituencyCode} onChange={e => filterLoc.selectConstituency(e.target.value)} disabled={!filterLoc.countyCode}>
            <option value="">All constituencies</option>
            {filterLoc.constituencies.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </div>
        {filterLoc.error && (
          <div className="mt-3 rounded-[6px] border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">{filterLoc.error}</div>
        )}
        {filterLoc.constituencyCode && filterLoc.wards.length > 0 && (
          <div className="mt-3 max-w-xs">
            <select className={selectCls} value={filterLoc.wardCode} onChange={e => filterLoc.selectWard(e.target.value)}>
              <option value="">All wards</option>
              {filterLoc.wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
            </select>
          </div>
        )}
        {hasFilters && (
          <button onClick={clearFilters} className="mt-3 text-xs font-medium text-[#C25757] hover:underline">Clear all filters</button>
        )}
      </div>

      {/* Pipeline tabs + table */}
      <div className="rounded-xl bg-white border border-[#E2DCDA] overflow-hidden shadow-sm">
        {/* Tabs */}
        <div className="flex border-b border-[#E2DCDA] overflow-x-auto">
          {PIPELINE_TABS.map(t => (
            <button key={t.id} onClick={() => setPipelineTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${pipelineTab === t.id ? 'border-[#1a3c5e] text-[#1a3c5e]' : 'border-transparent text-[#5A5450] hover:text-[#111111]'}`}>
              {t.label}
              <span className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${tabColors[t.id]}`}>
                {tabCount[t.id]}
              </span>
            </button>
          ))}
        </div>

        {/* Approved pipeline hint */}
        {pipelineTab === 'approved' && (
          <div className="bg-blue-50 border-b border-blue-100 px-5 py-2.5 text-xs text-blue-700 flex flex-wrap gap-x-4 gap-y-1">
            <span>Pipeline: <strong>Approved → Mark Fee Paid → Stamp / Nominate</strong></span>
            <span className="text-blue-500">Awaiting fee: {stats?.approved ?? 0} · Ready to stamp: {stats?.approvedFeePaid ?? 0}</span>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin h-6 w-6 rounded-full border-4 border-[#1a3c5e] border-t-transparent" />
            </div>
          ) : aspirants.length === 0 ? (
            <div className="py-16 text-center text-[#5A5450] text-sm">
              No aspirants in this stage{hasFilters ? ' matching your filters' : ''}.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-[#E2DCDA] text-sm">
              <thead className="bg-[#F8F5F3]">
                <tr>
                  {['Name','Email','Type','Seat','Location','IPPMS','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#5A5450]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DCDA]">
                {aspirants.map(a => (
                  <tr key={a._id} className="hover:bg-[#F8F5F3] cursor-pointer" onClick={() => setViewAspirant(a)}>
                    <td className="px-4 py-3 font-medium text-[#111111] whitespace-nowrap">{a.user?.firstName} {a.user?.lastName}</td>
                    <td className="px-4 py-3 text-[#5A5450] max-w-[160px] truncate">{a.user?.email}</td>
                    <td className="px-4 py-3 text-[#5A5450] text-xs whitespace-nowrap">{a.aspirantType === 'nominated' ? 'Party Nom.' : 'Elective'}</td>
                    <td className="px-4 py-3 text-[#5A5450] capitalize whitespace-nowrap">{a.seatCategory?.replace(/_/g,' ') || '-'}</td>
                    <td className="px-4 py-3 text-[#5A5450] text-xs max-w-[150px] truncate">
                      {[a.wardName, a.constituencyName, a.countyName].filter(Boolean).join(', ') || '-'}
                    </td>
                    <td className="px-4 py-3"><Badge status={a.ippmsStatus} /></td>
                    <td className="px-4 py-3">{statusBadge(a)}</td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>{rowActions(a)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Reject modal */}
      {rejectModal && (
        <Modal title={`Reject — ${rejectModal.name}`} onClose={() => setRejectModal(null)}>
          <div className="space-y-4">
            <p className="text-sm text-[#5A5450]">Provide a reason for rejecting this aspirant.</p>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-[#5A5450] mb-1">Rejection Reason</label>
              <textarea
                className={inputCls}
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="e.g. Incomplete documentation, failed verification…"
                autoFocus
              />
            </div>
            <ModalActions onCancel={() => setRejectModal(null)} saving={rejectSaving} label="Confirm Rejection" />
          </div>
        </Modal>
      )}

      {/* Create Aspirant modal */}
      {createForm && (() => {
        const seat = SEAT_OPTIONS.find((s) => s.value === createForm.seatCategory)

        const onSeatChange = (val) => {
          setCreateForm((f) => ({ ...f, seatCategory: val }))
          // Reset location sub-fields that may no longer be required
          modalLoc.selectConstituency('')
        }
        const isEdit = !!createForm._id

        return (
          <Modal title={isEdit ? `Edit Aspirant — ${createForm.firstName} ${createForm.lastName}` : 'Create Aspirant Account'} onClose={() => { setCreateForm(null); clearCreateFiles() }} wide>
            {!isEdit && (
              <div className="mb-4 rounded-[8px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <strong>Admin fallback.</strong> Use this only when the self-service payment flow could not be completed. The account will be created with payment bypassed.
              </div>
            )}
            <form onSubmit={handleCreateAspirant} className="space-y-5">

              {/* Account credentials */}
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5A5450]">Account Credentials</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="First Name *"><input className={inputCls} value={createForm.firstName} onChange={setC('firstName')} placeholder="John" required /></Field>
                  <Field label="Last Name *"><input className={inputCls} value={createForm.lastName} onChange={setC('lastName')} placeholder="Doe" required /></Field>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Email *"><input className={inputCls} type="email" value={createForm.email} onChange={setC('email')} placeholder="aspirant@example.com" required /></Field>
                  <Field label="Phone"><input className={inputCls} type="tel" value={createForm.phone} onChange={setC('phone')} placeholder="07XX XXX XXX" /></Field>
                </div>
                {!isEdit && (
                  <div className="mt-3">
                    <Field label="Temporary Password *">
                      <div className="relative">
                        <input
                          className={`${inputCls} pr-10`}
                          type={caShowPassword ? 'text' : 'password'}
                          value={createForm.password}
                          onChange={setC('password')}
                          placeholder="Minimum 8 characters"
                          required
                          minLength={8}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setCaShowPassword((v) => !v)}
                          className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-[#5A5450] hover:text-[#111111]"
                          aria-label={caShowPassword ? 'Hide password' : 'Show password'}
                          aria-pressed={caShowPassword}
                          tabIndex={-1}
                        >
                          {caShowPassword ? (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.774 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <p className="mt-1 text-[11px] text-[#5A5450]">Share this with the aspirant — they can change it after first login.</p>
                    </Field>
                  </div>
                )}
              </div>

              <hr className="border-[#E2DCDA]" />

              {/* Personal details */}
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5A5450]">Personal Details</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Document Type">
                    <select className={selectCls} value={createForm.documentType} onChange={(e) => setCreateForm((f) => ({ ...f, documentType: Number(e.target.value), nationalId: '' }))}>
                      <option value={1}>National ID</option>
                      <option value={2}>Passport</option>
                    </select>
                  </Field>
                  <Field label={createForm.documentType === 2 ? 'Passport Number' : 'National ID Number'}>
                    <input className={inputCls} value={createForm.nationalId} onChange={setC('nationalId')} placeholder={createForm.documentType === 2 ? 'AK123456' : '20123456'} />
                  </Field>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Date of Birth"><input type="date" className={inputCls} value={createForm.dob} onChange={setC('dob')} /></Field>
                  <Field label="Gender">
                    <select className={selectCls} value={createForm.gender} onChange={setC('gender')}>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </Field>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <input id="ca-elected" type="checkbox" checked={createForm.isElected} onChange={setC('isElected')} className="h-4 w-4 rounded border-[#E2DCDA] text-[#1a3c5e]" />
                  <label htmlFor="ca-elected" className="text-sm text-[#5A5450]">Currently holds an elected office</label>
                </div>
              </div>

              <hr className="border-[#E2DCDA]" />

              {/* Documents */}
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5A5450]">Documents (optional)</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                  {/* Passport photo */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#5A5450]">Passport Photo</label>
                    <div
                      className="flex h-[110px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[8px] border-2 border-dashed border-[#E2DCDA] bg-[#F8F5F3] hover:border-[#1a3c5e]/40 transition-colors"
                      onClick={() => caPhotoRef.current?.click()}
                    >
                      {caPhotoPreview || caExisting.photo
                        ? <img src={caPhotoPreview || caExisting.photo} alt="Passport" className="h-14 w-14 rounded-full object-cover border-2 border-[#E2DCDA]" />
                        : <svg className="h-7 w-7 text-[#5A5450]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                      }
                      <p className="px-2 text-center text-[10px] text-[#5A5450]">{caPhoto ? caPhoto.name : caExisting.photo ? 'Click to replace' : 'Click to upload'}</p>
                    </div>
                    <input ref={caPhotoRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={makeFileHandler(setCaPhoto, setCaPhotoPreview)} />
                  </div>

                  {/* ID front */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#5A5450]">
                      {createForm.documentType === 2 ? 'Passport Bio Page' : 'National ID - Front'}
                    </label>
                    <div
                      className="flex h-[110px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[8px] border-2 border-dashed border-[#E2DCDA] bg-[#F8F5F3] hover:border-[#1a3c5e]/40 transition-colors"
                      onClick={() => caIdFrontRef.current?.click()}
                    >
                      {caIdFrontPrev || caExisting.idFront
                        ? <img src={caIdFrontPrev || caExisting.idFront} alt="ID front" className="h-14 w-auto max-w-full rounded object-cover" />
                        : <svg className="h-7 w-7 text-[#5A5450]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
                      }
                      <p className="px-2 text-center text-[10px] text-[#5A5450]">{caIdFront ? caIdFront.name : caExisting.idFront ? 'Click to replace' : 'Click to upload'}</p>
                    </div>
                    <input ref={caIdFrontRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={makeFileHandler(setCaIdFront, setCaIdFrontPrev)} />
                  </div>

                  {/* ID back — only for National ID */}
                  {createForm.documentType !== 2 && (
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#5A5450]">National ID - Back</label>
                      <div
                        className="flex h-[110px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[8px] border-2 border-dashed border-[#E2DCDA] bg-[#F8F5F3] hover:border-[#1a3c5e]/40 transition-colors"
                        onClick={() => caIdBackRef.current?.click()}
                      >
                        {caIdBackPrev || caExisting.idBack
                          ? <img src={caIdBackPrev || caExisting.idBack} alt="ID back" className="h-14 w-auto max-w-full rounded object-cover" />
                          : <svg className="h-7 w-7 text-[#5A5450]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
                        }
                        <p className="px-2 text-center text-[10px] text-[#5A5450]">{caIdBack ? caIdBack.name : caExisting.idBack ? 'Click to replace' : 'Click to upload'}</p>
                      </div>
                      <input ref={caIdBackRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={makeFileHandler(setCaIdBack, setCaIdBackPrev)} />
                    </div>
                  )}
                </div>
              </div>

              <hr className="border-[#E2DCDA]" />

              {/* Political details */}
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5A5450]">Political Details</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Aspirant Type *">
                    <select className={selectCls} value={createForm.aspirantType} onChange={setC('aspirantType')} required>
                      <option value="elective">Elective</option>
                      <option value="nominated">Party Nominated</option>
                    </select>
                  </Field>
                  <Field label="Seat Category *">
                    <select className={selectCls} value={createForm.seatCategory} onChange={(e) => onSeatChange(e.target.value)} required>
                      <option value="">Select seat</option>
                      {SEAT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </Field>
                </div>

                {createForm.seatCategory && (
                  <div className="mt-3 space-y-3">
                    {modalLoc.error && (
                      <div className="rounded-[6px] border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">{modalLoc.error}</div>
                    )}
                    <Field label="County *">
                      <select className={selectCls} value={modalLoc.countyCode} onChange={(e) => modalLoc.selectCounty(e.target.value)} required>
                        <option value="">Select county</option>
                        {modalLoc.counties.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                      </select>
                    </Field>

                    {seat?.needsConst && createForm.aspirantType === 'elective' && (
                      <Field label="Constituency *">
                        <select className={selectCls} value={modalLoc.constituencyCode} onChange={(e) => modalLoc.selectConstituency(e.target.value)} disabled={!modalLoc.countyCode} required>
                          <option value="">Select constituency</option>
                          {modalLoc.constituencies.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                      </Field>
                    )}

                    {seat?.needsWard && createForm.aspirantType === 'elective' && (
                      <Field label="Ward *">
                        <select className={selectCls} value={modalLoc.wardCode} onChange={(e) => modalLoc.selectWard(e.target.value)} disabled={!modalLoc.constituencyCode} required>
                          <option value="">Select ward</option>
                          {modalLoc.wards.map((w) => <option key={w.code} value={w.code}>{w.name}</option>)}
                        </select>
                      </Field>
                    )}
                  </div>
                )}
              </div>

              <hr className="border-[#E2DCDA]" />

              {/* Admin note */}
              <Field label="Admin Note (internal)">
                <textarea className={inputCls} rows={2} value={createForm.adminNote} onChange={setC('adminNote')} placeholder={isEdit ? 'e.g. Corrected constituency after aspirant reported an error' : 'e.g. Paystack registration fee confirmed paid via reference TXN-XXXXX — account created manually after session expiry'} />
              </Field>

              <ModalActions onCancel={() => { setCreateForm(null); clearCreateFiles() }} saving={createSaving} label={isEdit ? 'Save Changes' : 'Create Aspirant Account'} />
            </form>
          </Modal>
        )
      })()}

      {/* View aspirant modal */}
      {viewAspirant && (() => {
        const a    = viewAspirant
        const name = `${a.user?.firstName || ''} ${a.user?.lastName || ''}`.trim()
        const dob  = a.dateOfBirth ? new Date(a.dateOfBirth).toLocaleDateString('en-KE',{day:'numeric',month:'long',year:'numeric'}) : '-'
        const reg  = a.createdAt   ? new Date(a.createdAt).toLocaleDateString('en-KE',{day:'numeric',month:'long',year:'numeric'}) : '-'
        const busy = actionId === a._id
        const Row = ({ label, value }) => (
          <div className="flex flex-col sm:flex-row sm:gap-4 py-2.5 border-b border-[#F0EDE9] last:border-0">
            <span className="w-44 flex-shrink-0 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5A5450]">{label}</span>
            <span className="text-sm text-[#111111] mt-0.5 sm:mt-0">{value || '-'}</span>
          </div>
        )
        const st = a.applicationStatus || 'pending_review'
        return (
          <Modal title={`Aspirant Profile — ${name}`} onClose={() => setViewAspirant(null)} wide>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-[8px] bg-[#F8F5F3]">
                {a.profilePhoto
                  ? <img src={a.profilePhoto} alt={name} className="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow flex-shrink-0" />
                  : <div className="h-16 w-16 rounded-full bg-[#236331] flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">{name[0]||'?'}</div>
                }
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-[#111111]">{name}</p>
                  <p className="text-sm text-[#5A5450]">{a.user?.email}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">{statusBadge(a)}<Badge status={a.ippmsStatus} /></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(st === 'pending_review') && <button disabled={busy} onClick={() => { handleApprove(a._id); setViewAspirant(null) }} className="rounded-[6px] bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50">{busy?'…':'Approve'}</button>}
                  {(st === 'approved' && !a.nominationFeePaid) && <button disabled={busy} onClick={() => { handleMarkFeePaid(a._id); setViewAspirant(null) }} className="rounded-[6px] bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50">{busy?'…':'Mark Fee Paid'}</button>}
                  {(st === 'approved' && a.nominationFeePaid) && <button disabled={busy} onClick={() => { handleNominate(a._id); setViewAspirant(null) }} className="rounded-[6px] bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50">{busy?'…':'Stamp / Nominate'}</button>}
                  {(st === 'pending_review' || st === 'approved') && <button onClick={() => { setViewAspirant(null); openReject(a) }} className="rounded-[6px] bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600">Reject</button>}
                  <button onClick={() => { setViewAspirant(null); setIssueForm({ aspirantId:a._id, type:'nomination', title:'', description:'' }) }} className="rounded-[6px] bg-[#1a3c5e] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#153150]">Issue Cert</button>
                  <button onClick={() => { setViewAspirant(null); openEditAspirant(a) }} className="rounded-[6px] border border-[#E2DCDA] bg-white px-3 py-1.5 text-xs font-medium text-[#111111] hover:bg-[#F8F5F3]">Edit</button>
                  <button disabled={deletingId === a._id} onClick={() => handleDeleteAspirant(a)} className="rounded-[6px] border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50">{deletingId === a._id ? 'Deleting…' : 'Delete'}</button>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#5A5450] mb-2">Personal Information</p>
                <Row label="Full Name"    value={name} />
                <Row label="Email"        value={a.user?.email} />
                <Row label="Phone"        value={a.user?.phone} />
                <Row label="National ID"  value={a.nationalId} />
                <Row label="Date of Birth" value={dob} />
                <Row label="Gender"       value={a.gender === 'M' ? 'Male' : a.gender === 'F' ? 'Female' : a.gender} />
                <Row label="PWD"          value={a.hasPWD ? 'Yes' : 'No'} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#5A5450] mb-2">Political Details</p>
                <Row label="Aspirant Type"  value={a.aspirantType === 'nominated' ? 'Party Nominated' : 'Elective'} />
                <Row label="Seat Category"  value={a.seatCategory?.replace(/_/g,' ')} />
                <Row label="County"         value={`${a.countyName||''}${a.countyCode?` (${a.countyCode})`:''}`} />
                <Row label="Constituency"   value={`${a.constituencyName||''}${a.constituencyCode?` (${a.constituencyCode})`:''}`} />
                <Row label="Ward"           value={`${a.wardName||''}${a.wardCode?` (${a.wardCode})`:''}`} />
                <Row label="Currently Elected" value={a.isElected ? 'Yes' : 'No'} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#5A5450] mb-2">Nomination Pipeline</p>
                <Row label="Status"         value={(a.applicationStatus || 'pending_review').replace(/_/g,' ')} />
                {a.approvedAt   && <Row label="Approved On"  value={new Date(a.approvedAt).toLocaleDateString('en-KE')} />}
                {a.nominationFeePaid && <Row label="Nom. Fee Paid"  value={`Yes${a.nominationFeePaidAt?' — '+new Date(a.nominationFeePaidAt).toLocaleDateString('en-KE'):''}`} />}
                {a.nominatedAt  && <Row label="Nominated On" value={new Date(a.nominatedAt).toLocaleDateString('en-KE')} />}
                {a.rejectionReason && <Row label="Rejection Reason" value={a.rejectionReason} />}
                {a.rejectedAt   && <Row label="Rejected On"  value={new Date(a.rejectedAt).toLocaleDateString('en-KE')} />}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#5A5450] mb-2">Verification &amp; System</p>
                <Row label="IPPMS Status"  value={a.ippmsStatus?.replace(/_/g,' ')} />
                <Row label="Registered On" value={reg} />
              </div>
            </div>
          </Modal>
        )
      })()}
    </div>
  )
}

/* ─── Shared components ──────────────────────────────────────────────────────── */

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className={`bg-white rounded-xl shadow-xl w-full my-8 ${wide?'max-w-3xl':'max-w-md'}`}>
        <div className="flex items-center justify-between border-b border-[#E2DCDA] px-6 py-4">
          <h2 className="text-base font-semibold text-[#111111]">{title}</h2>
          <button onClick={onClose} className="text-[#5A5450] hover:text-[#111111] text-lg leading-none">✕</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
function Field({ label, children }) {
  return <div><label className="block text-xs font-medium uppercase tracking-wide text-[#5A5450] mb-1">{label}</label>{children}</div>
}
function ModalActions({ onCancel, saving, label }) {
  return (
    <div className="flex gap-3 pt-2">
      <button type="button" onClick={onCancel} className="flex-1 rounded-[6px] border border-[#E2DCDA] px-4 py-2.5 text-sm font-medium text-[#5A5450] hover:bg-[#F8F5F3]">Cancel</button>
      <button type="submit" disabled={saving} className="flex-1 rounded-[6px] bg-[#1a3c5e] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1a3c5e]/90 disabled:opacity-50">{saving?'Saving…':label}</button>
    </div>
  )
}
const inputCls = 'block w-full rounded-[6px] border border-[#E2DCDA] px-3 py-2 text-sm focus:border-[#1a3c5e] focus:outline-none focus:ring-1 focus:ring-[#1a3c5e]'
const selectCls = inputCls
function Badge({ status }) {
  const map = { not_checked:'bg-gray-100 text-gray-600', eligible:'bg-blue-100 text-blue-700', ineligible:'bg-red-100 text-red-700', otp_pending:'bg-yellow-100 text-yellow-700', registered:'bg-green-100 text-green-700' }
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${map[status]||map.not_checked}`}>{(status||'not_checked').replace(/_/g,' ')}</span>
}
function PaymentBadge({ status }) {
  const map = { success:'bg-green-100 text-green-700', pending:'bg-yellow-100 text-yellow-700', failed:'bg-red-100 text-red-700', abandoned:'bg-gray-100 text-gray-600' }
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${map[status]||map.pending}`}>{status||'pending'}</span>
}
