/**
 * Seeds one admin user. Run from apps/api:
 *   npx tsx scripts/seed-admin.ts
 * Requires .env with DATABASE_URL, ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD
 */
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
config({ path: resolve(__dirname, '../.env') });

async function main(): Promise<void> {
  const { assertDatabaseConfigured } = await import('../src/config/env.js');
  const { getPool } = await import('../src/db/pool.js');
  const { hashPassword } = await import('../src/modules/admin/auth/admin.service.js');

  assertDatabaseConfigured();

  const email = process.env['ADMIN_SEED_EMAIL']?.toLowerCase().trim();
  const password = process.env['ADMIN_SEED_PASSWORD'];
  const roleRaw = process.env['ADMIN_SEED_ROLE'] ?? 'super_admin';

  if (email === undefined || email === '') {
    throw new Error('ADMIN_SEED_EMAIL is required');
  }
  if (password === undefined || password.length < 8) {
    throw new Error('ADMIN_SEED_PASSWORD is required (min 8 characters)');
  }
  const role = roleRaw === 'content_manager' ? 'content_manager' : 'super_admin';

  const pool = getPool();
  const passwordHash = await hashPassword(password);

  await pool.query(
    `INSERT INTO admin_users (email, password_hash, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, updated_at = NOW()`,
    [email, passwordHash, role]
  );

  console.log(`Admin user ready: ${email} (${role})`);
  await pool.end();
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
