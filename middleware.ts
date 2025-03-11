import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  if (url.pathname.startsWith('/admin') && !url.pathname.startsWith('/admin/login')) {
    const isAuthenticated = request.cookies.get('isAuthenticated')
    if (!isAuthenticated) {
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
} 