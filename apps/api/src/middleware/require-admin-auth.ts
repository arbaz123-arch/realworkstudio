import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../modules/admin/auth/jwt.util.js';

function extractBearerToken(req: Request): string | null {
  const raw = req.headers.authorization;
  if (typeof raw === 'string' && raw.startsWith('Bearer ')) {
    return raw.slice(7).trim();
  }
  return null;
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractBearerToken(req);
  if (token === null || token === '') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const payload = verifyAccessToken(token);
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
