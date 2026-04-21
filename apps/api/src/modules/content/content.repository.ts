import { getPool } from '../../db/pool.js';

type ContentHomeRow = {
  payload: unknown;
  updated_at: Date;
};

type ContentBlockRow = {
  key: string;
  value: unknown;
  updated_at: Date;
};

export class ContentRepository {
  async getHomePayload(): Promise<Record<string, unknown>> {
    const pool = getPool();
    const result = await pool.query<ContentHomeRow>(
      `SELECT payload, updated_at
       FROM content_home
       WHERE id = TRUE
       LIMIT 1`
    );
    const row = result.rows[0];
    if (row === undefined || typeof row.payload !== 'object' || row.payload === null) {
      return {};
    }
    return row.payload as Record<string, unknown>;
  }

  async updateHomePayload(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
    const pool = getPool();
    const result = await pool.query<ContentHomeRow>(
      `INSERT INTO content_home (id, payload, updated_at)
       VALUES (TRUE, $1::jsonb, NOW())
       ON CONFLICT (id)
       DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()
       RETURNING payload, updated_at`,
      [JSON.stringify(payload)]
    );
    const row = result.rows[0];
    if (row === undefined || typeof row.payload !== 'object' || row.payload === null) {
      return {};
    }
    return row.payload as Record<string, unknown>;
  }

  async getBlock(key: string): Promise<Record<string, unknown> | null> {
    const pool = getPool();
    const result = await pool.query<ContentBlockRow>(
      `SELECT "key" AS key, value, updated_at
       FROM content_blocks
       WHERE "key" = $1
       LIMIT 1`,
      [key]
    );
    const row = result.rows[0];
    if (row === undefined || typeof row.value !== 'object' || row.value === null) {
      return null;
    }
    return row.value as Record<string, unknown>;
  }

  async upsertBlock(key: string, value: Record<string, unknown>): Promise<Record<string, unknown>> {
    const pool = getPool();
    const result = await pool.query<ContentBlockRow>(
      `INSERT INTO content_blocks ("key", value, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT ("key")
       DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
       RETURNING "key" AS key, value, updated_at`,
      [key, JSON.stringify(value)]
    );
    const row = result.rows[0];
    if (row === undefined || typeof row.value !== 'object' || row.value === null) {
      return {};
    }
    return row.value as Record<string, unknown>;
  }
}
