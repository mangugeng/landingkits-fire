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

  // Cek apakah path dimulai dengan /dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Cek status login dari cookie
    const userLoginCookie = request.cookies.get('user_login');
    console.log('User login cookie:', userLoginCookie);

    const isLoggedIn = userLoginCookie?.value === 'true';
    console.log('Is logged in:', isLoggedIn);

    // Jika tidak ada cookie, cek header x-user-login
    if (!isLoggedIn) {
      const userLoginHeader = request.headers.get('x-user-login');
      console.log('User login header:', userLoginHeader);

      if (userLoginHeader === 'true') {
        return NextResponse.next();
      }
    }

    if (!isLoggedIn) {
      console.log('Redirecting to auth page');
      // Redirect ke halaman auth jika belum login
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
} 