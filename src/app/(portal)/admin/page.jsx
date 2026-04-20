'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { api } from '../../../lib/api'
import { Logo } from '../../../components/Logo'

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
  const [eventForm, setEventForm] = useState(null)
  const [eventSaving, setEventSaving] = useState(false)
  const [structureForm, setStructureForm] = useState(null)
  const [structureSaving, setStructureSaving] = useState(false)
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

  /* ── Aspirants ── */
  const approve = async (id) => { await api.put(`/admin/aspirants/${id}/approve`, {}); showFlash('Aspirant approved'); loadData() }
  const reject = async (id) => { const reason = prompt('Rejection reason:'); await api.put(`/admin/aspirants/${id}/reject`, { reason }); showFlash('Aspirant rejected'); loadData() }

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

  if (authLoading || loading) {
    return <div className="min-h-screen bg-[#F8F5F3] flex items-center justify-center"><div className="animate-spin h-8 w-8 rounded-full border-4 border-[#1a3c5e] border-t-transparent" /></div>
  }
  if (!user || user.role !== 'admin') return null

  const initials = `${user.firstName[0]}${user.lastName[0]}`
  const pendingCount = aspirants.filter(a => !a.isApproved).length

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
            {tab === 'aspirants' && (
              <div className="space-y-4">
                <div><h1 className="text-xl font-semibold text-[#111111]">Aspirants</h1><p className="text-sm text-[#5A5450] mt-0.5">{aspirants.length} total · {pendingCount} pending</p></div>
                <div className="rounded-xl bg-white border border-[#E2DCDA] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#E2DCDA] text-sm">
                      <thead className="bg-[#F8F5F3]"><tr>{['Name','Email','Seat','IPPMS','Status','Actions'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#5A5450]">{h}</th>)}</tr></thead>
                      <tbody className="divide-y divide-[#E2DCDA]">
                        {aspirants.map(a=>(
                          <tr key={a._id} className="hover:bg-[#F8F5F3]">
                            <td className="px-4 py-3 font-medium text-[#111111] whitespace-nowrap">{a.user?.firstName} {a.user?.lastName}</td>
                            <td className="px-4 py-3 text-[#5A5450]">{a.user?.email}</td>
                            <td className="px-4 py-3 text-[#5A5450] capitalize">{a.seatCategory?.replace('_',' ') || '—'}</td>
                            <td className="px-4 py-3"><Badge status={a.ippmsStatus} /></td>
                            <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${a.isApproved?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>{a.isApproved?'Approved':'Pending'}</span></td>
                            <td className="px-4 py-3"><div className="flex items-center gap-3 whitespace-nowrap">
                              {!a.isApproved&&<button onClick={()=>approve(a._id)} className="text-xs font-medium text-green-700 hover:underline">Approve</button>}
                              {a.isApproved&&<button onClick={()=>reject(a._id)} className="text-xs font-medium text-red-600 hover:underline">Reject</button>}
                              <button onClick={()=>setIssueForm({aspirantId:a._id,type:'nomination',title:'',description:''})} className="text-xs font-medium text-[#1a3c5e] hover:underline">Issue Cert</button>
                            </div></td>
                          </tr>
                        ))}
                        {aspirants.length===0&&<tr><td colSpan={6} className="px-4 py-12 text-center text-[#5A5450]">No aspirants yet.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

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
                            <td className="px-4 py-3 font-medium text-[#111111] whitespace-nowrap">{p.user?.firstName} {p.user?.lastName}</td>
                            <td className="px-4 py-3 text-[#5A5450]">{p.user?.email}</td>
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
                            <td className="px-4 py-3 text-[#5A5450]">{ev.venue||'—'}</td>
                            <td className="px-4 py-3 text-[#5A5450]">{ev.countyName||'—'}</td>
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
                <div><h1 className="text-xl font-semibold text-[#111111]">Users</h1><p className="text-sm text-[#5A5450] mt-0.5">{users.length} accounts</p></div>
                <div className="rounded-xl bg-white border border-[#E2DCDA] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#E2DCDA] text-sm">
                      <thead className="bg-[#F8F5F3]"><tr>{['Name','Email','Role','Active','Joined'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#5A5450]">{h}</th>)}</tr></thead>
                      <tbody className="divide-y divide-[#E2DCDA]">
                        {users.map(u=>(
                          <tr key={u._id} className="hover:bg-[#F8F5F3]">
                            <td className="px-4 py-3 font-medium text-[#111111] whitespace-nowrap">{u.firstName} {u.lastName}</td>
                            <td className="px-4 py-3 text-[#5A5450]">{u.email}</td>
                            <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${u.role==='admin'?'bg-purple-100 text-purple-700':'bg-blue-100 text-blue-700'}`}>{u.role}</span></td>
                            <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${u.isActive?'bg-green-100 text-green-700':'bg-gray-100 text-gray-600'}`}>{u.isActive?'Active':'Inactive'}</span></td>
                            <td className="px-4 py-3 text-[#5A5450] whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString('en-KE')}</td>
                          </tr>
                        ))}
                        {users.length===0&&<tr><td colSpan={5} className="px-4 py-12 text-center text-[#5A5450]">No users yet.</td></tr>}
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
                            <td className="px-4 py-3 text-[#5A5450]">{p.categories?.slice(0,2).join(', ') || '—'}</td>
                            <td className="px-4 py-3 text-[#5A5450] whitespace-nowrap">{p.author?.name||'—'}</td>
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
            <Field label="Cover Image URL"><input className={inputCls} type="url" value={postForm.coverImage} onChange={setPost('coverImage')} placeholder="https://…" />{postForm.coverImage&&<img src={postForm.coverImage} alt="" className="mt-2 h-28 w-full object-cover rounded-[6px]" onError={e=>{e.target.style.display='none'}} />}</Field>
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
            <Field label="Title *"><input className={inputCls} value={eventForm.title} onChange={setEv('title')} placeholder="Party Rally — Nairobi" required /></Field>
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
            <Field label="Coordinator (User ID)"><input className={inputCls} value={structureForm.coordinator||''} onChange={setSt('coordinator')} placeholder="MongoDB user _id" /></Field>
            <Field label="Coordinator Title"><input className={inputCls} value={structureForm.coordinatorTitle||''} onChange={setSt('coordinatorTitle')} placeholder="County Coordinator" /></Field>
            <Field label="Notes"><textarea className={inputCls} rows={2} value={structureForm.notes||''} onChange={setSt('notes')} /></Field>
            <ModalActions onCancel={()=>setStructureForm(null)} saving={structureSaving} label={structureForm._id?'Save Changes':'Add Node'} />
          </form>
        </Modal>
      )}
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
