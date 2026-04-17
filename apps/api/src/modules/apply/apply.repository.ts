import { getPool } from '../../db/pool.js';

type ProgramExistsRow = {
  id: string;
};

export type ApplicationRecord = {
  id: string;
  name: string;
  email: string;
  program_id: string;
  status: string;
  created_at: Date;
};

export type CreateApplicationInput = {
  name: string;
  email: string;
  programId: string;
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
      `INSERT INTO applications (name, email, program_id, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING id, name, email, program_id, status, created_at`,
      [input.name, input.email, input.programId]
    );
    const row = result.rows[0];
    if (row === undefined) {
      throw new Error('Failed to create application');
    }
    return row;
  }
}
