import { NextResponse } from 'next/server'

const PROTECTED = ['/portal', '/admin']
const AUTH_ONLY = ['/login', '/registerr']

export function proxy(request) {
  const { pathname } = request.nextUrl

  // Check for token in cookies (we also support localStorage but that's client-side only)
  const token = request.cookies.get('upia_token')?.value

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p))
  const isAuthOnly = AUTH_ONLY.some((p) => pathname.startsWith(p))

  if (isProtected && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthOnly && token) {
    const url = request.nextUrl.clone()
    url.pathname = '/portal'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/portal/:path*', '/admin/:path*', '/login', '/registerr'],
}
