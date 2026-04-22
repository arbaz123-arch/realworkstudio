import { NextResponse } from 'next/server';
import { getAdminAuthHeader, getApiUrl } from '@/lib/admin-api';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = await getAdminAuthHeader();
  if (authHeader === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const res = await fetch(getApiUrl(`/api/admin/applications/${id}`), {
    method: 'GET',
    headers: authHeader,
    cache: 'no-store',
  });

  const data = (await res.json()) as unknown;
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = await getAdminAuthHeader();
  if (authHeader === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const res = await fetch(getApiUrl(`/api/admin/applications/${id}`), {
    method: 'PATCH',
    headers: { ...authHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const data = (await res.json()) as unknown;
  return NextResponse.json(data, { status: res.status });
}
