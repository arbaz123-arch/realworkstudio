import { getPool } from '../../../db/pool.js';
import type { AdminRole, AdminUserRecord } from '../../../types/admin.js';

type AdminUserRow = {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: Date;
  updated_at: Date;
};

function toRole(raw: string): AdminRole {
  if (raw === 'super_admin' || raw === 'content_manager') {
    return raw;
  }
  throw new Error('Invalid admin role in database');
}

export class AdminAuthRepository {
  async findByEmail(email: string): Promise<AdminUserRecord | null> {
    const pool = getPool();
    const result = await pool.query<AdminUserRow>(
      `SELECT id, email, password_hash, role, created_at, updated_at
       FROM admin_users
       WHERE email = $1
       LIMIT 1`,
      [email.toLowerCase().trim()]
    );
    const row = result.rows[0];
    if (row === undefined) {
      return null;
    }
    return {
      id: row.id,
      email: row.email,
      password_hash: row.password_hash,
      role: toRole(row.role),
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }
}
