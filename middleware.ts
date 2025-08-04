import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { refreshAccessTokenServer } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  const refreshToken = cookieStore.get('refreshToken');
  const isAuthenticated = !!accessToken;
  const pathname = request.nextUrl.pathname;

  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (!isAuthenticated && isPrivateRoute) {
    if (refreshToken) {
      try {
        const refreshResponse = await refreshAccessTokenServer(
          refreshToken.value
        );

        if (
          refreshResponse &&
          refreshResponse.status === 200 &&
          refreshResponse.headers
        ) {
          const newCookies = refreshResponse.headers['set-cookie'];

          const response = NextResponse.redirect(
            new URL(pathname, request.url)
          );

          if (newCookies) {
            if (Array.isArray(newCookies)) {
              for (const cookieStr of newCookies) {
                response.headers.append('Set-Cookie', cookieStr);
              }
            } else {
              response.headers.set('Set-Cookie', newCookies);
            }
          }

          return response;
        } else {
          console.warn('Token refresh failed. Redirecting to sign-in.');
          const response = NextResponse.redirect(
            new URL('/sign-in', request.url)
          );
          response.cookies.delete('accessToken');
          response.cookies.delete('refreshToken');
          return response;
        }
      } catch (error) {
        console.error('Error during token refresh in middleware:', error);
        const response = NextResponse.redirect(
          new URL('/sign-in', request.url)
        );
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        return response;
      }
    } else {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
