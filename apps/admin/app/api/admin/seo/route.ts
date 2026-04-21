import { NextResponse } from 'next/server';
import { getAdminAuthHeader, getApiUrl } from '@/lib/admin-api';

export async function POST(request: Request) {
  const authHeader = await getAdminAuthHeader();
  if (authHeader === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const res = await fetch(getApiUrl('/api/admin/seo'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const data = (await res.json()) as unknown;
  return NextResponse.json(data, { status: res.status });
}

