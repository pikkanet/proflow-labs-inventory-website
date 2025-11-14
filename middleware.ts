import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;
  
  // Skip for API routes and static files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp)$/)) {
    return NextResponse.next();
  }
  
  // Redirect to login if no token and not on login page
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redirect to inventory if has token and on login page
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/inventory', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
