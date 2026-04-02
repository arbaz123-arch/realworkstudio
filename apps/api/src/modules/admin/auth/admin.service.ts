import bcrypt from 'bcryptjs';
import { env } from '../../../config/env.js';
import { HttpError } from '../../../middleware/error-handler.js';
import type { AdminUserPublic } from '../../../types/admin.js';
import type { AdminAuthRepository } from './admin.repository.js';
import { signAccessToken } from './jwt.util.js';

export type LoginResult = {
  token: string;
  user: AdminUserPublic;
};

export class AdminAuthService {
  constructor(private readonly repository: AdminAuthRepository) {}

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.repository.findByEmail(email);
    if (user === null) {
      throw new HttpError(401, 'Invalid email or password');
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      throw new HttpError(401, 'Invalid email or password');
    }
    const publicUser: AdminUserPublic = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return { token, user: publicUser };
  }
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, env.bcryptRounds);
}
