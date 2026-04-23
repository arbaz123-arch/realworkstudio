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
  review_status: string; // pending/reviewed/rejected
  answers: Record<string, unknown>;
  created_at: Date;
  // New fields
  college_name: string | null;
  status: string | null; // STUDENT or GRADUATE
  current_year_or_experience: string | null;
  motivation: string | null;
};

export type CreateApplicationInput = {
  name: string;
  email: string;
  phone: string;
  programId: string;
  collegeName: string;
  status: 'STUDENT' | 'GRADUATE';
  currentYearOrExperience: string;
  motivation?: string;
  // answers is deprecated but kept for backward compatibility
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

  async checkExistingApplication(email: string, programId: string): Promise<boolean> {
    const pool = getPool();
    const result = await pool.query<{ id: string }>(
      `SELECT id FROM applications WHERE email = $1 AND program_id = $2 LIMIT 1`,
      [email, programId]
    );
    return result.rows[0] !== undefined;
  }

  async createApplication(input: CreateApplicationInput): Promise<ApplicationRecord> {
    const pool = getPool();
    const result = await pool.query<ApplicationRecord>(
      `INSERT INTO applications (
         name, email, phone, program_id, review_status, answers,
         college_name, status, current_year_or_experience, motivation
       )
       VALUES ($1, $2, $3, $4, 'pending', $5, $6, $7, $8, $9)
       RETURNING id, name, email, phone, program_id, review_status, answers, created_at,
                 college_name, status, current_year_or_experience, motivation`,
      [
        input.name,
        input.email,
        input.phone,
        input.programId,
        JSON.stringify(input.answers ?? {}),
        input.collegeName,
        input.status,
        input.currentYearOrExperience,
        input.motivation ?? null,
      ]
    );
    const row = result.rows[0];
    if (row === undefined) {
      throw new Error('Failed to create application');
    }
    return row;
  }

  async getApplications(filters: {
    programId?: string;
    programIds?: string[];
    reviewStatus?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApplicationRecord[]> {
    const pool = getPool();
    let query = `SELECT a.id, a.name, a.email, a.phone, a.program_id, a.review_status, a.answers, a.created_at,
                        a.college_name, a.status, a.current_year_or_experience, a.motivation,
                        p.title as program_title
                 FROM applications a
                 LEFT JOIN programs p ON a.program_id = p.id`;
    const conditions: string[] = [];
    const values: (string | number | string[] | null)[] = [];
    let paramIdx = 1;

    if (filters.programIds && filters.programIds.length > 0) {
      conditions.push(`a.program_id = ANY($${paramIdx++})`);
      values.push(filters.programIds);
    } else if (filters.programId) {
      conditions.push(`a.program_id = $${paramIdx++}`);
      values.push(filters.programId);
    }
    if (filters.reviewStatus) {
      conditions.push(`a.review_status = $${paramIdx++}`);
      values.push(filters.reviewStatus);
    }
    if (filters.search) {
      const searchPattern = `%${filters.search}%`;
      conditions.push(`(a.name ILIKE $${paramIdx} OR a.email ILIKE $${paramIdx})`);
      values.push(searchPattern);
      paramIdx++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY a.created_at DESC';

    // Add pagination
    if (filters.limit !== undefined) {
      query += ` LIMIT $${paramIdx++}`;
      values.push(filters.limit);
    }
    if (filters.offset !== undefined) {
      query += ` OFFSET $${paramIdx++}`;
      values.push(filters.offset);
    }

    const result = await pool.query<ApplicationRecord & { program_title: string | null }>(
      query,
      values
    );
    return result.rows;
  }

  async countApplications(filters: {
    programId?: string;
    programIds?: string[];
    reviewStatus?: string;
    search?: string;
  }): Promise<number> {
    const pool = getPool();
    let query = 'SELECT COUNT(*) FROM applications';
    const conditions: string[] = [];
    const values: (string | string[] | null)[] = [];
    let paramIdx = 1;

    if (filters.programIds && filters.programIds.length > 0) {
      conditions.push(`program_id = ANY($${paramIdx++})`);
      values.push(filters.programIds);
    } else if (filters.programId) {
      conditions.push(`program_id = $${paramIdx++}`);
      values.push(filters.programId);
    }
    if (filters.reviewStatus) {
      conditions.push(`review_status = $${paramIdx++}`);
      values.push(filters.reviewStatus);
    }
    if (filters.search) {
      const searchPattern = `%${filters.search}%`;
      conditions.push(`(name ILIKE $${paramIdx} OR email ILIKE $${paramIdx})`);
      values.push(searchPattern);
      paramIdx++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await pool.query<{ count: string }>(query, values);
    return Number.parseInt(result.rows[0]?.count ?? '0', 10);
  }

  async getApplicationById(id: string): Promise<ApplicationRecord | null> {
    const pool = getPool();
    const result = await pool.query<ApplicationRecord & { program_title: string | null }>(
      `SELECT a.id, a.name, a.email, a.phone, a.program_id, a.review_status, a.answers, a.created_at,
              a.college_name, a.status, a.current_year_or_experience, a.motivation,
              p.title as program_title
       FROM applications a
       LEFT JOIN programs p ON a.program_id = p.id
       WHERE a.id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async updateStatus(
    id: string,
    reviewStatus: 'pending' | 'reviewed' | 'rejected'
  ): Promise<ApplicationRecord | null> {
    const pool = getPool();
    const result = await pool.query<ApplicationRecord & { program_title: string | null }>(
      `UPDATE applications SET review_status = $1 WHERE id = $2
       RETURNING id, name, email, phone, program_id, review_status, answers, created_at,
                 college_name, status, current_year_or_experience, motivation`,
      [reviewStatus, id]
    );
    return result.rows[0] ?? null;
  }
}
