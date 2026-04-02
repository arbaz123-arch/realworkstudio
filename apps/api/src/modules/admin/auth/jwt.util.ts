import jwt from 'jsonwebtoken';
import { assertJwtConfigured, env } from '../../../config/env.js';
import type { AdminRole } from '../../../types/admin.js';

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: AdminRole;
};

export function signAccessToken(payload: AccessTokenPayload): string {
  assertJwtConfigured();
  return jwt.sign(
    {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn } as jwt.SignOptions
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  assertJwtConfigured();
  const decoded = jwt.verify(token, env.jwtSecret) as jwt.JwtPayload & {
    sub?: string;
    email?: string;
    role?: AdminRole;
  };
  if (
    typeof decoded.sub !== 'string' ||
    typeof decoded.email !== 'string' ||
    (decoded.role !== 'super_admin' && decoded.role !== 'content_manager')
  ) {
    throw new Error('Invalid token payload');
  }
  return {
    sub: decoded.sub,
    email: decoded.email,
    role: decoded.role,
  };
}
