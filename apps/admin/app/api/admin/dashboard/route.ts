import { NextResponse } from 'next/server';
import { getAdminAuthHeader, getApiUrl } from '@/lib/admin-api';

export async function GET() {
  const authHeader = await getAdminAuthHeader();
  if (authHeader === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const res = await fetch(getApiUrl('/api/admin/dashboard'), {
    method: 'GET',
    headers: authHeader,
    cache: 'no-store',
  });
  const data = (await res.json()) as unknown;
  return NextResponse.json(data, { status: res.status });
}
