import { NextResponse } from 'next/server';
import { getAdminAuthHeader, getApiUrl } from '@/lib/admin-api';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const authHeader = await getAdminAuthHeader();
  if (authHeader === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await context.params;
  const body = await request.json();
  const res = await fetch(getApiUrl(`/api/admin/testimonials/${id}`), {
    method: 'PATCH',
    headers: { ...authHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as unknown;
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authHeader = await getAdminAuthHeader();
  if (authHeader === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await context.params;
  const res = await fetch(getApiUrl(`/api/admin/testimonials/${id}`), {
    method: 'DELETE',
    headers: authHeader,
  });
  const data = (await res.json()) as unknown;
  return NextResponse.json(data, { status: res.status });
}
