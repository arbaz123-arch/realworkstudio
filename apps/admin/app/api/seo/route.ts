import { NextResponse } from 'next/server';
import { getApiUrl } from '@/lib/admin-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') ?? '';
  const res = await fetch(getApiUrl(`/api/seo?page=${encodeURIComponent(page)}`), {
    method: 'GET',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = (await res.json()) as unknown;
  return NextResponse.json(data, { status: res.status });
}

