import { NextResponse } from 'next/server';
import { getApiUrl } from '@/lib/admin-api';

export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string }> }
) {
  const { key } = await context.params;
  const res = await fetch(getApiUrl(`/api/content/${encodeURIComponent(key)}`), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  const data = (await res.json()) as unknown;
  return NextResponse.json(data, { status: res.status });
}

