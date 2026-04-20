import { getToken, getRefreshToken, saveAuth, clearAuth } from './auth'

const BASE = '/api/backend'

let refreshPromise = null

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new Error('No refresh token')

  const res = await fetch(`${BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })

  if (!res.ok) {
    clearAuth()
    throw new Error('Session expired')
  }

  const data = await res.json()
  saveAuth(data.token, null, null)
  return data.token
}

async function request(path, options = {}) {
  const token = getToken()

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  // Don't set Content-Type for FormData — browser sets it with boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type']
  }

  let res = await fetch(`${BASE}${path}`, { ...options, headers })

  // Auto-refresh on 401 only when the user already has a stored token
  // (skip on login/register where a 401 means wrong credentials)
  if (res.status === 401 && getToken()) {
    try {
      if (!refreshPromise) refreshPromise = refreshAccessToken()
      const newToken = await refreshPromise
      refreshPromise = null

      const retryHeaders = {
        ...headers,
        Authorization: `Bearer ${newToken}`,
      }
      res = await fetch(`${BASE}${path}`, { ...options, headers: retryHeaders })
    } catch {
      refreshPromise = null
      clearAuth()
      if (typeof window !== 'undefined') window.location.href = '/login'
      throw new Error('Session expired — redirecting to login')
    }
  }

  const contentType = res.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await res.json() : await res.text()

  if (!res.ok) {
    const message =
      (data && data.message) ||
      (data && data.errors?.[0]?.msg) ||
      `Request failed (${res.status})`
    throw Object.assign(new Error(message), { status: res.status, data })
  }

  return data
}

export const api = {
  get: (path, opts) => request(path, { method: 'GET', ...opts }),
  post: (path, body, opts) =>
    request(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...opts,
    }),
  put: (path, body, opts) =>
    request(path, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...opts,
    }),
  delete: (path, opts) => request(path, { method: 'DELETE', ...opts }),
}
