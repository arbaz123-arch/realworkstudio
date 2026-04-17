import * as jose from 'jose';

const JWT_SECRET = process.env['JWT_SECRET'];

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
