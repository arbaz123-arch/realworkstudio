// ✅ VERY IMPORTANT: load .env file
import 'dotenv/config';

function parsePort(raw: string | undefined): number {
  const fallback = 4000;
  if (raw === undefined || raw === '') {
    return fallback;
  }
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) {
    return fallback;
  }
  return n;
}

function parseBcryptRounds(raw: string | undefined): number {
  const fallback = 12;
  if (raw === undefined || raw === '') {
    return fallback;
  }
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n) || n < 10) {
    return fallback;
  }
  return n;
}

export const env = {
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  port: parsePort(process.env['PORT']),
  databaseUrl: process.env['DATABASE_URL'] ?? '',
  jwtSecret: process.env['JWT_SECRET'] ?? '',
  jwtExpiresIn: process.env['JWT_EXPIRES_IN'] ?? '8h',
  bcryptRounds: parseBcryptRounds(process.env['BCRYPT_ROUNDS']),
  adminOrigin: process.env['ADMIN_ORIGIN'] ?? 'http://localhost:3001',
  webOrigin: process.env['WEB_ORIGIN'] ?? 'http://localhost:3000',
} as const;

// ✅ Check JWT
export function assertJwtConfigured(): void {
  if (!env.jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }
}

// ✅ Check Database
export function assertDatabaseConfigured(): void {
  if (!env.databaseUrl) {
    throw new Error('DATABASE_URL is not configured');
  }
}