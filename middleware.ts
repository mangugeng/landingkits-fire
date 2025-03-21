import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl;

  // Redirect ke www.landingkits.com jika mengakses tanpa www
  if (host === 'landingkits.com') {
    return NextResponse.redirect(new URL(`https://www.landingkits.com${pathname}`));
  }

  // Jika mengakses via subdomain
  if (host.includes('landingkits.com') && host !== 'www.landingkits.com') {
    const subdomain = host.split('.')[0];
    
    // Jika path adalah /home, redirect ke root subdomain
    if (pathname === '/home') {
      return NextResponse.redirect(new URL(`https://${subdomain}.landingkits.com`));
    }

    // Jika path adalah /[subdomain], redirect ke root subdomain
    if (pathname === `/${subdomain}`) {
      return NextResponse.redirect(new URL(`https://${subdomain}.landingkits.com`));
    }
  }

  // Cek apakah path dimulai dengan /admin
  if (pathname.startsWith('/admin')) {
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
  if (pathname.startsWith('/dashboard')) {
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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 