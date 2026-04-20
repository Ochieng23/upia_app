const TOKEN_KEY = 'upia_token'
const REFRESH_KEY = 'upia_refresh'
const USER_KEY = 'upia_user'

export const saveAuth = (token, refreshToken, user) => {
  localStorage.setItem(TOKEN_KEY, token)
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  // Also set a cookie so Next.js middleware can read it for SSR route protection
  document.cookie = `upia_token=${token}; path=/; max-age=${7 * 24 * 3600}; SameSite=Strict`
}

export const getToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export const getRefreshToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(REFRESH_KEY)
}

export const getStoredUser = () => {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(USER_KEY)
  document.cookie = 'upia_token=; path=/; max-age=0'
}
