import { Pool } from 'pg';
import type { Pool as PgPool } from 'pg';
import { assertDatabaseConfigured, env } from '../config/env.js';

let pool: PgPool | undefined;

export function getPool(): PgPool {
  assertDatabaseConfigured();
  if (pool === undefined) {
    pool = new Pool({
      connectionString: env.databaseUrl,
      max: 10,
    });
  }
  return pool;
}
