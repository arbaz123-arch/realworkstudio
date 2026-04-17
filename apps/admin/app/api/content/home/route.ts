import { NextResponse } from 'next/server';
import { getApiUrl } from '@/lib/admin-api';

export async function GET() {
  const res = await fetch(getApiUrl('/api/content/home'), {
    method: 'GET',
    cache: 'no-store',
  });
  const data = (await res.json()) as unknown;
  return NextResponse.json(data, { status: res.status });
}
