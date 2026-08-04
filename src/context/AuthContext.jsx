'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'
import { saveAuth, clearAuth, getToken, getStoredUser } from '../lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Hydrate from localStorage on mount then verify with /auth/me
  useEffect(() => {
    const stored = getStoredUser()
    if (stored) setUser(stored)

    const token = getToken()
    if (token) {
      api
        .get('/auth/me')
        .then((data) => {
          setUser(data.user)
          saveAuth(token, null, data.user)
        })
        .catch((err) => {
          // Only a confirmed 401/403 means the token is actually invalid.
          // Network errors, timeouts, and 5xx responses are transient - keep
          // the already-hydrated localStorage user rather than logging the
          // person out from under themselves (e.g. right after registration).
          if (err?.status === 401 || err?.status === 403) {
            clearAuth()
            setUser(null)
          }
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await api.post('/auth/login', { email, password })
    saveAuth(data.token, data.refreshToken, data.user)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (payload) => {
    const data = await api.post('/auth/register', payload)
    saveAuth(data.token, data.refreshToken, data.user)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const data = await api.get('/auth/me')
    setUser(data.user)
    saveAuth(getToken(), null, data.user)
    return data.user
  }, [])

  // For flows that call saveAuth() directly (e.g. registration callback pages
  // navigating client-side to /portal) - keeps context state in sync without
  // an extra round-trip, since those pages already have the full user object.
  const setAuthUser = useCallback((nextUser) => {
    setUser(nextUser)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
