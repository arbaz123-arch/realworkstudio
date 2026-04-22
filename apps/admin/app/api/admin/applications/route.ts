import { NextResponse } from 'next/server';
import { getAdminAuthHeader, getApiUrl } from '@/lib/admin-api';

export async function GET(request: Request) {
  const authHeader = await getAdminAuthHeader();
  if (authHeader === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const apiUrl = getApiUrl(`/api/admin/applications${queryString ? `?${queryString}` : ''}`);

  const res = await fetch(apiUrl, {
    method: 'GET',
    headers: authHeader,
    cache: 'no-store',
  });

  const data = (await res.json()) as unknown;
  return NextResponse.json(data, { status: res.status });
}
