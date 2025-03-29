import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl;

  // Skip middleware untuk file statis dan API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Cek autentikasi untuk dashboard
  if (pathname.startsWith('/dashboard')) {
    const userLoginCookie = request.cookies.get('user_login');
    const isLoggedIn = userLoginCookie?.value === 'true';

    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  // Redirect ke www.landingkits.com jika mengakses tanpa www
  if (host === 'landingkits.com') {
    return NextResponse.redirect(new URL(`https://www.landingkits.com${pathname}`));
  }

  // Jika mengakses via subdomain
  if (host.includes('landingkits.com') && host !== 'www.landingkits.com') {
    const subdomain = host.split('.')[0];
    
    // Skip middleware untuk subdomain yang valid
    if (subdomain !== 'www' && subdomain !== 'api') {
      // Jika path adalah /home atau /[subdomain], redirect ke root subdomain
      if (pathname === '/home' || pathname === `/${subdomain}`) {
        return NextResponse.redirect(new URL(`https://${subdomain}.landingkits.com`));
      }
      
      // Izinkan akses ke subdomain tanpa redirect
      return NextResponse.next();
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