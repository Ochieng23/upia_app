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

    if (getToken()) {
      api
        .get('/auth/me')
        .then((data) => {
          setUser(data.user)
          saveAuth(getToken(), null, data.user)
        })
        .catch(() => {
          clearAuth()
          setUser(null)
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

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
