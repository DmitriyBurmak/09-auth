import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

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
        const API_BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
          : 'http://localhost:3000/api';

        const refreshResponse = await fetch(
          `${API_BASE_URL}/auth/refresh-token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',

              Cookie: `refreshToken=${refreshToken.value}`,
            },
          }
        );

        if (refreshResponse.ok) {
          return NextResponse.next();
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
