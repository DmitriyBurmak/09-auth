import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await api.post('auth/register', body);

    const cookieStore = await cookies();
    const setCookieHeader = apiRes.headers['set-cookie'];

    if (setCookieHeader) {
      const cookieArray = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];

      let accessTokenValue: string | undefined;
      let refreshTokenValue: string | undefined;

      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);
        if (parsed.accessToken) {
          accessTokenValue = parsed.accessToken;
        }
        if (parsed.refreshToken) {
          refreshTokenValue = parsed.refreshToken;
        }
      }

      if (accessTokenValue) {
        cookieStore.set('accessToken', accessTokenValue, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 60 * 60,
          sameSite: 'lax',
        });
      }

      if (refreshTokenValue) {
        cookieStore.set('refreshToken', refreshTokenValue, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
          sameSite: 'lax',
        });
      }

      if (!accessTokenValue && !refreshTokenValue) {
        return NextResponse.json(
          { error: 'Unauthorized: No valid tokens received from upstream API' },
          { status: 401 }
        );
      }

      return NextResponse.json(apiRes.data, { status: apiRes.status });
    }

    return NextResponse.json(
      { error: 'Unauthorized: No Set-Cookie header received' },
      { status: 401 }
    );
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
