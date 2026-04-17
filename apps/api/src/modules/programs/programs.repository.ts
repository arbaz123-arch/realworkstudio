import { getPool } from '../../db/pool.js';

export type ProgramRecord = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  created_at: Date;
};

export type CreateProgramInput = {
  title: string;
  slug: string;
  description: string;
  price: number;
};

export type UpdateProgramInput = Partial<CreateProgramInput>;

export class ProgramsRepository {
  async list(): Promise<ProgramRecord[]> {
    const pool = getPool();
    const result = await pool.query<ProgramRecord>(
      `SELECT id, title, slug, description, price::text, created_at
       FROM programs
       ORDER BY created_at DESC`
    );
    return result.rows;
  }

  async findBySlug(slug: string): Promise<ProgramRecord | null> {
    const pool = getPool();
    const result = await pool.query<ProgramRecord>(
      `SELECT id, title, slug, description, price::text, created_at
       FROM programs
       WHERE slug = $1
       LIMIT 1`,
      [slug]
    );
    return result.rows[0] ?? null;
  }

  async findById(id: string): Promise<ProgramRecord | null> {
    const pool = getPool();
    const result = await pool.query<ProgramRecord>(
      `SELECT id, title, slug, description, price::text, created_at
       FROM programs
       WHERE id = $1
       LIMIT 1`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async findBySlugExceptId(slug: string, id: string): Promise<ProgramRecord | null> {
    const pool = getPool();
    const result = await pool.query<ProgramRecord>(
      `SELECT id, title, slug, description, price::text, created_at
       FROM programs
       WHERE slug = $1 AND id <> $2
       LIMIT 1`,
      [slug, id]
    );
    return result.rows[0] ?? null;
  }

  async create(input: CreateProgramInput): Promise<ProgramRecord> {
    const pool = getPool();
    const result = await pool.query<ProgramRecord>(
      `INSERT INTO programs (title, slug, description, price)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, slug, description, price::text, created_at`,
      [input.title, input.slug, input.description, input.price]
    );
    const row = result.rows[0];
    if (row === undefined) {
      throw new Error('Failed to create program');
    }
    return row;
  }

  async update(id: string, input: UpdateProgramInput): Promise<ProgramRecord | null> {
    const pool = getPool();
    const fields: string[] = [];
    const values: Array<string | number> = [];

    if (input.title !== undefined) {
      fields.push(`title = $${fields.length + 1}`);
      values.push(input.title);
    }
    if (input.slug !== undefined) {
      fields.push(`slug = $${fields.length + 1}`);
      values.push(input.slug);
    }
    if (input.description !== undefined) {
      fields.push(`description = $${fields.length + 1}`);
      values.push(input.description);
    }
    if (input.price !== undefined) {
      fields.push(`price = $${fields.length + 1}`);
      values.push(input.price);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await pool.query<ProgramRecord>(
      `UPDATE programs
       SET ${fields.join(', ')}
       WHERE id = $${fields.length + 1}
       RETURNING id, title, slug, description, price::text, created_at`,
      values
    );
    return result.rows[0] ?? null;
  }

  async remove(id: string): Promise<boolean> {
    const pool = getPool();
    const result = await pool.query('DELETE FROM programs WHERE id = $1', [id]);
    return result.rowCount === 1;
  }
}
