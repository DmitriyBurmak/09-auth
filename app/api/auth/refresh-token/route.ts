import { NextRequest, NextResponse } from 'next/server';
import api from '@/lib/api/api';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken');

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'No refresh token provided' },
        { status: 401 }
      );
    }

    const apiRes = await api.post(
      'auth/refresh',
      {},
      {
        headers: {
          Cookie: `refreshToken=${refreshToken.value}`,
        },
      }
    );

    const setCookieHeader = apiRes.headers['set-cookie'];

    if (setCookieHeader) {
      const response = NextResponse.json(apiRes.data, {
        status: apiRes.status,
      });
      const cookieArray = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];

      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);
        const options: Parameters<typeof cookieStore.set>[2] = {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          path: parsed.Path,
          maxAge: Number(parsed['Max-Age']),
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          httpOnly: true,
        };

        if (parsed.accessToken) {
          response.cookies.set('accessToken', parsed.accessToken, options);
        }
        if (parsed.refreshToken) {
          response.cookies.set('refreshToken', parsed.refreshToken, options);
        }
      }
      return response;
    }

    return NextResponse.json(
      {
        message:
          'Failed to refresh token: No Set-Cookie header received from upstream API',
      },
      { status: 401 }
    );
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { message: error.message, details: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { message: 'Internal Server Error during token refresh' },
      { status: 500 }
    );
  }
}
