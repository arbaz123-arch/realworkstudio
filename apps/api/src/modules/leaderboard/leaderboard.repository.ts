import { getPool } from '../../db/pool.js';

export type LeaderboardEntryRecord = {
  id: string;
  name: string;
  github_username: string | null;
  score: number;
  rank: number | null;
  notes: string | null;
  last_synced_at: Date | null;
  created_at: Date;
};

export type ReplaceLeaderboardEntry = {
  name: string;
  githubUsername?: string | null;
  score: number;
  rank?: number;
  notes?: string;
};

export class LeaderboardRepository {
  async list(): Promise<LeaderboardEntryRecord[]> {
    const pool = getPool();
    const result = await pool.query<LeaderboardEntryRecord>(
      `SELECT id, name, github_username, score, rank, notes, last_synced_at, created_at
       FROM leaderboard
       ORDER BY rank ASC NULLS LAST, score DESC, created_at DESC`
    );
    return result.rows;
  }

  async replaceAll(entries: ReplaceLeaderboardEntry[]): Promise<LeaderboardEntryRecord[]> {
    const pool = getPool();
    await pool.query('BEGIN');
    try {
      await pool.query('DELETE FROM leaderboard');
      const now = new Date();
      const inserted: LeaderboardEntryRecord[] = [];
      for (const entry of entries) {
        const result = await pool.query<LeaderboardEntryRecord>(
          `INSERT INTO leaderboard (name, github_username, score, rank, notes, last_synced_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, name, github_username, score, rank, notes, last_synced_at, created_at`,
          [
            entry.name,
            entry.githubUsername ?? null,
            entry.score,
            entry.rank ?? null,
            entry.notes ?? null,
            now.toISOString(),
          ]
        );
        const row = result.rows[0];
        if (row !== undefined) {
          inserted.push(row);
        }
      }
      await pool.query('COMMIT');
      return inserted;
    } catch (err) {
      await pool.query('ROLLBACK');
      throw err;
    }
  }
}
