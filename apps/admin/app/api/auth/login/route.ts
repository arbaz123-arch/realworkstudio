import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_TOKEN_COOKIE } from '@/lib/constants';

const API_URL = process.env['API_URL'] ?? 'http://localhost:4000';

type ApiLoginResponse = {
  token?: string;
  user?: unknown;
  error?: string;
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const res = await fetch(`${API_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as ApiLoginResponse;

  if (!res.ok) {
    return NextResponse.json(
      { error: typeof data.error === 'string' ? data.error : 'Login failed' },
      { status: res.status }
    );
  }

  if (typeof data.token !== 'string') {
    return NextResponse.json({ error: 'Invalid response from API' }, { status: 502 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_TOKEN_COOKIE, data.token, {
    httpOnly: true,
    secure: process.env['NODE_ENV'] === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  return NextResponse.json({ user: data.user });
}
