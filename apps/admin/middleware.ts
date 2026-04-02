import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/verify-admin-token';

// Middleware needs the JWT secret from env; Edge runtime can have missing env.
export const runtime = 'nodejs';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('rws_admin_token')?.value;
  const ok = await verifyAdminToken(token);

  if (pathname === '/login') {
    if (ok) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (pathname === '/') {
    if (ok) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!ok) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
