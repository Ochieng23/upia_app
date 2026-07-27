'use client'
import { useState } from 'react'

const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const SERIF = "Georgia, 'Times New Roman', Times, serif"
const BASE = '/api/backend'

export default function NewsletterCard() {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState('idle')
  const [msg, setMsg]       = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('submitting')
    setMsg('')
    try {
      const res = await fetch(`${BASE}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (res.ok) { setStatus('success'); setEmail('') }
      else {
        const data = await res.json().catch(() => ({}))
        setStatus('error')
        setMsg(data.message || 'Could not subscribe. Please try again.')
      }
    } catch {
      setStatus('error')
      setMsg('Network error. Please try again.')
    }
  }

  return (
    <div style={{ background: '#0A3521', borderRadius: 3, padding: '28px 24px', flexShrink: 0 }}>
      <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8FA694', marginBottom: 10 }}>
        Stay Informed
      </div>
      <h3 style={{ margin: '0 0 8px', fontFamily: SERIF, fontWeight: 400, fontSize: 20, color: '#EDEFE9', lineHeight: 1.2 }}>
        Get UPIA Updates
      </h3>
      <p style={{ margin: '0 0 20px', fontFamily: SANS, fontSize: 13.5, lineHeight: 1.6, color: '#B9C7BC' }}>
        Party news, events, and policy updates — straight to your inbox.
      </p>

      {status === 'success' ? (
        <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.08)', borderRadius: 3, fontFamily: SANS, fontSize: 13, color: '#E8C782' }}>
          You&apos;re subscribed — welcome aboard!
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === 'submitting'}
            style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3, color: '#EDEFE9', fontFamily: SANS, fontSize: 13, outline: 'none' }}
          />
          <button
            type="submit"
            disabled={status === 'submitting'}
            style={{ padding: '11px', background: '#FBFAF7', color: '#0F4D2E', borderRadius: 3, border: 'none', fontFamily: SANS, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
          </button>
          {status === 'error' && (
            <p style={{ margin: 0, fontFamily: SANS, fontSize: 12, color: '#E8C782' }}>{msg}</p>
          )}
        </form>
      )}
    </div>
  )
}
