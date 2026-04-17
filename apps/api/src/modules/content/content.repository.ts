import { getPool } from '../../db/pool.js';

type ContentHomeRow = {
  payload: unknown;
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
}
