import { NextResponse } from 'next/server';
import { getAdminAuthHeader, getApiUrl } from '@/lib/admin-api';

export async function GET() {
  const authHeader = await getAdminAuthHeader();
  if (authHeader === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const res = await fetch(getApiUrl('/api/admin/testimonials'), {
    method: 'GET',
    headers: authHeader,
    cache: 'no-store',
  });
  const data = (await res.json()) as unknown;
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: Request) {
  const authHeader = await getAdminAuthHeader();
  if (authHeader === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const res = await fetch(getApiUrl('/api/admin/testimonials'), {
    method: 'POST',
    headers: { ...authHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as unknown;
  return NextResponse.json(data, { status: res.status });
}
