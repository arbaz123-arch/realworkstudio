import { getPool } from '../../db/pool.js';

export type TestimonialRecord = {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  created_at: Date;
};

export type CreateTestimonialInput = Omit<TestimonialRecord, 'id' | 'created_at'>;
export type UpdateTestimonialInput = Partial<CreateTestimonialInput>;

export class TestimonialsRepository {
  async list(): Promise<TestimonialRecord[]> {
    const pool = getPool();
    const result = await pool.query<TestimonialRecord>(
      `SELECT id, name, role, company, content, rating, created_at
       FROM testimonials
       ORDER BY created_at DESC`
    );
    return result.rows;
  }

  async findById(id: string): Promise<TestimonialRecord | null> {
    const pool = getPool();
    const result = await pool.query<TestimonialRecord>(
      `SELECT id, name, role, company, content, rating, created_at
       FROM testimonials
       WHERE id = $1
       LIMIT 1`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async create(input: CreateTestimonialInput): Promise<TestimonialRecord> {
    const pool = getPool();
    const result = await pool.query<TestimonialRecord>(
      `INSERT INTO testimonials (name, role, company, content, rating)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, role, company, content, rating, created_at`,
      [input.name, input.role, input.company, input.content, input.rating]
    );
    const row = result.rows[0];
    if (row === undefined) {
      throw new Error('Failed to create testimonial');
    }
    return row;
  }

  async update(id: string, input: UpdateTestimonialInput): Promise<TestimonialRecord | null> {
    const pool = getPool();
    const fields: string[] = [];
    const values: Array<string | number> = [];

    if (input.name !== undefined) {
      fields.push(`name = $${fields.length + 1}`);
      values.push(input.name);
    }
    if (input.role !== undefined) {
      fields.push(`role = $${fields.length + 1}`);
      values.push(input.role);
    }
    if (input.company !== undefined) {
      fields.push(`company = $${fields.length + 1}`);
      values.push(input.company);
    }
    if (input.content !== undefined) {
      fields.push(`content = $${fields.length + 1}`);
      values.push(input.content);
    }
    if (input.rating !== undefined) {
      fields.push(`rating = $${fields.length + 1}`);
      values.push(input.rating);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await pool.query<TestimonialRecord>(
      `UPDATE testimonials
       SET ${fields.join(', ')}
       WHERE id = $${fields.length + 1}
       RETURNING id, name, role, company, content, rating, created_at`,
      values
    );
    return result.rows[0] ?? null;
  }

  async remove(id: string): Promise<boolean> {
    const pool = getPool();
    const result = await pool.query('DELETE FROM testimonials WHERE id = $1', [id]);
    return result.rowCount === 1;
  }
}
