import * as jose from 'jose';

// Middleware runs in Next's Edge environment.
// Edge bundles reliably inline only `NEXT_PUBLIC_*` env vars, so we read the secret from there.
const JWT_SECRET =
  process.env['NEXT_PUBLIC_JWT_SECRET'] ?? process.env['JWT_SECRET'];

/**
 * Verifies the admin JWT (same secret as Express API). Used in Edge middleware.
 */
export async function verifyAdminToken(token: string | undefined): Promise<boolean> {
  if (token === undefined || token === '' || JWT_SECRET === undefined || JWT_SECRET === '') {
    return false;
  }
  try {
    const key = new TextEncoder().encode(JWT_SECRET);
    await jose.jwtVerify(token, key);
    return true;
  } catch {
    return false;
  }
}
