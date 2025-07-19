import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('accessToken');
  const isAuthenticated = !!authToken;
  const pathname = request.nextUrl.pathname;
  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );
  if (!isAuthenticated && isPrivateRoute) {
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  if (isAuthenticated && isAuthRoute) {
    const profileUrl = new URL('/profile', request.url);
    return NextResponse.redirect(profileUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
