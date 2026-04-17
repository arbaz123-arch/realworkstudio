import { cookies } from 'next/headers';
import { ADMIN_TOKEN_COOKIE } from './constants';

const API_URL = process.env['API_URL'] ?? 'http://localhost:4000';

export function getApiUrl(path: string): string {
  return `${API_URL}${path}`;
}

export async function getAdminAuthHeader(): Promise<{ Authorization: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value;
  if (token === undefined || token === '') {
    return null;
  }
  return { Authorization: `Bearer ${token}` };
}
