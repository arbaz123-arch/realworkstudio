import { getPool } from '../../db/pool.js';

type ProgramExistsRow = {
  id: string;
};

export type ApplicationRecord = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  program_id: string;
  status: string;
  answers: Record<string, unknown>;
  created_at: Date;
};

export type CreateApplicationInput = {
  name: string;
  email: string;
  phone?: string;
  programId: string;
  answers?: Record<string, unknown>;
};

export class ApplyRepository {
  async programExists(programId: string): Promise<boolean> {
    const pool = getPool();
    const result = await pool.query<ProgramExistsRow>(
      `SELECT id FROM programs WHERE id = $1 LIMIT 1`,
      [programId]
    );
    return result.rows[0] !== undefined;
  }

  async createApplication(input: CreateApplicationInput): Promise<ApplicationRecord> {
    const pool = getPool();
    const result = await pool.query<ApplicationRecord>(
      `INSERT INTO applications (name, email, phone, program_id, status, answers)
       VALUES ($1, $2, $3, $4, 'pending', $5)
       RETURNING id, name, email, phone, program_id, status, answers, created_at`,
      [input.name, input.email, input.phone ?? null, input.programId, JSON.stringify(input.answers ?? {})]
    );
    const row = result.rows[0];
    if (row === undefined) {
      throw new Error('Failed to create application');
    }
    return row;
  }
}
