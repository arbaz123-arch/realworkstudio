import { config } from 'dotenv';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertDatabaseConfigured } from '../src/config/env.js';
import { getPool } from '../src/db/pool.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

config({ path: resolve(__dirname, '../.env') });

async function main(): Promise<void> {
  assertDatabaseConfigured();

  const migrationsDir = resolve(__dirname, '../migrations');
  const files = (await readdir(migrationsDir))
    .filter((name) => name.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b));

  const pool = getPool();
  try {
    for (const file of files) {
      const fullPath = resolve(migrationsDir, file);
      const sql = await readFile(fullPath, 'utf8');
      await pool.query(sql);
      console.log(`Applied migration: ${file}`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
