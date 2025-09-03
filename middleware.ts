// middleware.ts

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
          console.error('1');
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
          console.error('2');
          const response = NextResponse.redirect(
            new URL('/sign-in', request.url)
          );
          response.cookies.delete('accessToken');
          response.cookies.delete('refreshToken');
          return response;
        }
      } catch (error) {
        console.error('Error during token refresh in middleware:', error);
        console.error('3');
        const response = NextResponse.redirect(
          new URL('/sign-in', request.url)
        );
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        return response;
      }
    } else {
      console.error('4');
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (isAuthenticated && isAuthRoute) {
    console.error('5');
    return NextResponse.redirect(new URL('/profile', request.url));
  }
  console.error('6');
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};

// middleware.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import { parse } from 'cookie';
// import { refreshAccessTokenServer } from './lib/api/serverApi';

// const privateRoutes = ['/profile', '/notes'];
// const publicRoutes = ['/sign-in', '/sign-up'];

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get('accessToken')?.value;
//   const refreshToken = cookieStore.get('refreshToken')?.value;

//   const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
//   const isPrivateRoute = privateRoutes.some(route =>
//     pathname.startsWith(route)
//   );

//   if (!accessToken) {
//     if (refreshToken) {
//       // Якщо accessToken відсутній, але є refreshToken — потрібно перевірити сесію навіть для публічного маршруту,
//       // адже сесія може залишатися активною, і тоді потрібно заборонити доступ до публічного маршруту.
//       const data = await refreshAccessTokenServer(refreshToken);
//       const setCookie = data?.headers['set-cookie'];

//       if (setCookie) {
//         const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
//         for (const cookieStr of cookieArray) {
//           const parsed = parse(cookieStr);
//           const options = {
//             expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
//             path: parsed.Path,
//             maxAge: Number(parsed['Max-Age']),
//           };
//           if (parsed.accessToken)
//             cookieStore.set('accessToken', parsed.accessToken, options);
//           if (parsed.refreshToken)
//             cookieStore.set('refreshToken', parsed.refreshToken, options);
//         }
//         // Якщо сесія все ще активна:
//         // для публічного маршруту — виконуємо редірект на головну.
//         if (isPublicRoute) {
//           return NextResponse.redirect(new URL('/', request.url), {
//             headers: {
//               Cookie: cookieStore.toString(),
//             },
//           });
//         }
//         // для приватного маршруту — дозволяємо доступ
//         if (isPrivateRoute) {
//           return NextResponse.next({
//             headers: {
//               Cookie: cookieStore.toString(),
//             },
//           });
//         }
//       }
//     }
//     // Якщо refreshToken або сесії немає:
//     // публічний маршрут — дозволяємо доступ
//     if (isPublicRoute) {
//       return NextResponse.next();
//     }

//     // приватний маршрут — редірект на сторінку входу
//     if (isPrivateRoute) {
//       return NextResponse.redirect(new URL('/sign-in', request.url));
//     }
//   }

//   // Якщо accessToken існує:
//   // публічний маршрут — виконуємо редірект на головну
//   if (isPublicRoute) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }
//   // приватний маршрут — дозволяємо доступ
//   if (isPrivateRoute) {
//     return NextResponse.next();
//   }
// }

// export const config = {
//   matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
// };
