import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Admin authentication middleware
 *
 * This middleware checks if the user is authenticated and has admin privileges
 * before allowing access to admin routes.
 *
 * TODO: Integrate with better-auth session verification
 * For now, this is a placeholder that allows all requests
 */

export function middleware(request: NextRequest) {
  // Skip middleware for API routes and static files
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  // TODO: Check session cookie and verify admin status
  // const sessionCookie = request.cookies.get("session");
  // if (!sessionCookie) {
  //   return NextResponse.redirect(new URL("/auth/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
