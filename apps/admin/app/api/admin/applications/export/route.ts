import { NextResponse } from 'next/server';
import { getAdminAuthHeader, getApiUrl } from '@/lib/admin-api';

export async function GET(request: Request) {
  const authHeader = await getAdminAuthHeader();
  if (authHeader === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const apiUrl = getApiUrl(`/api/admin/applications/export${queryString ? `?${queryString}` : ''}`);

  const res = await fetch(apiUrl, {
    method: 'GET',
    headers: authHeader,
    cache: 'no-store',
  });

  // For CSV export, pass through the response as text
  const contentType = res.headers.get('content-type') || 'text/csv';
  const data = await res.text();

  return new NextResponse(data, {
    status: res.status,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': res.headers.get('content-disposition') || '',
    },
  });
}
