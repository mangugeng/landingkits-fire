import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Cek apakah path dimulai dengan /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Cek status login dari cookie
    const adminLoginCookie = request.cookies.get('admin_login');
    console.log('Admin login cookie:', adminLoginCookie);

    const isLoggedIn = adminLoginCookie?.value === 'true';
    console.log('Is logged in:', isLoggedIn);

    // Jika tidak ada cookie, cek header x-admin-login
    if (!isLoggedIn) {
      const adminLoginHeader = request.headers.get('x-admin-login');
      console.log('Admin login header:', adminLoginHeader);

      if (adminLoginHeader === 'true') {
        return NextResponse.next();
      }
    }

    if (!isLoggedIn) {
      console.log('Redirecting to login page');
      // Redirect ke halaman login jika belum login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
} 