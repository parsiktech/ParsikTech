import { NextRequest, NextResponse } from 'next/server'

const NOINDEX_ROUTES = ['/audit/intake', '/audit/thank-you']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const res = NextResponse.next()

  if (NOINDEX_ROUTES.some(route => pathname.startsWith(route))) {
    // HTTP-level noindex — respected even if the meta tag is stripped
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet')
  }

  return res
}

export const config = {
  matcher: ['/audit/intake/:path*', '/audit/thank-you/:path*'],
}
