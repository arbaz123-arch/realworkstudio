import type { AccessTokenPayload } from '../modules/admin/auth/jwt.util.js';

declare global {
  namespace Express {
    interface Request {
      admin?: AccessTokenPayload;
    }
  }
}

export {};
