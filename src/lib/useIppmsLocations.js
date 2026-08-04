'use client'
import { useState, useEffect, useCallback } from 'react'

const BASE = '/api/backend'

// Cascading county -> constituency -> ward picker backed by the live IPPMS
// reference data (server-cached 24h). Codes are nationally sequential from
// IPPMS and are NOT compatible with the old locally-scoped static file codes.
export function useIppmsLocations() {
  const [counties, setCounties] = useState([])
  const [constituencies, setConstituencies] = useState([])
  const [wards, setWards] = useState([])
  const [countyCode, setCountyCode] = useState('')
  const [constituencyCode, setConstituencyCode] = useState('')
  const [wardCode, setWardCode] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${BASE}/ippms/counties`)
      .then((r) => r.json())
      .then((d) => {
        const list = d.data || []
        if (list.length === 0) setError('Could not load counties. Please refresh the page.')
        setCounties(list)
      })
      .catch(() => setError('Could not load counties. Please check your connection and refresh.'))
  }, [])

  // User-driven: picking a new county resets constituency + ward selection
  const selectCounty = useCallback(async (code) => {
    setCountyCode(code)
    setConstituencyCode('')
    setWardCode('')
    setConstituencies([])
    setWards([])
    setError('')
    if (!code) return
    try {
      const r = await fetch(`${BASE}/ippms/constituencies/${code}`)
      const d = await r.json()
      setConstituencies(d.data || [])
    } catch {
      setError('Could not load constituencies. Please try again.')
    }
  }, [])

  // User-driven: picking a new constituency resets ward selection
  const selectConstituency = useCallback(async (code) => {
    setConstituencyCode(code)
    setWardCode('')
    setWards([])
    setError('')
    if (!code) return
    try {
      const r = await fetch(`${BASE}/ippms/wards/${code}`)
      const d = await r.json()
      setWards(d.data || [])
    } catch {
      setError('Could not load wards. Please try again.')
    }
  }, [])

  const selectWard = useCallback((code) => setWardCode(code), [])

  // Prefill to a known county/constituency/ward (e.g. opening an edit form)
  // without resetting the codes the way the user-driven selectors do.
  const hydrate = useCallback(async (nextCountyCode, nextConstituencyCode, nextWardCode) => {
    setCountyCode(nextCountyCode || '')
    setConstituencyCode(nextConstituencyCode || '')
    setWardCode(nextWardCode || '')
    setError('')
    if (!nextCountyCode) return
    try {
      const r = await fetch(`${BASE}/ippms/constituencies/${nextCountyCode}`)
      const d = await r.json()
      setConstituencies(d.data || [])
    } catch {
      setError('Could not load constituencies. Please try again.')
    }
    if (!nextConstituencyCode) return
    try {
      const r = await fetch(`${BASE}/ippms/wards/${nextConstituencyCode}`)
      const d = await r.json()
      setWards(d.data || [])
    } catch {
      setError('Could not load wards. Please try again.')
    }
  }, [])

  const reset = useCallback(() => {
    setCountyCode('')
    setConstituencyCode('')
    setWardCode('')
    setConstituencies([])
    setWards([])
    setError('')
  }, [])

  return {
    counties, constituencies, wards,
    countyCode, constituencyCode, wardCode,
    error,
    selectCounty, selectConstituency, selectWard,
    hydrate, reset,
  }
}
