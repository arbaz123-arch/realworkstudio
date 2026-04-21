import { getPool } from '../../db/pool.js';

export type TestimonialRecord = {
  id: string;
  name: string;
  role: string;
  company: string;
  photo_url: string;
  content: string;
  rating: number;
  program_id: string | null;
  type: 'text' | 'video';
  video_url: string | null;
  is_featured: boolean;
  is_approved: boolean;
  created_at: Date;
};

export type CreateTestimonialInput = Omit<TestimonialRecord, 'id' | 'created_at'>;
export type UpdateTestimonialInput = Partial<CreateTestimonialInput>;

export type TestimonialFilters = {
  programId?: string;
  type?: 'text' | 'video';
  isFeatured?: boolean;
  isApproved?: boolean;
};

export class TestimonialsRepository {
  async list(filters?: TestimonialFilters): Promise<TestimonialRecord[]> {
    const pool = getPool();
    const conditions: string[] = [];
    const values: Array<string | boolean> = [];

    if (filters?.programId !== undefined) {
      conditions.push(`program_id = $${conditions.length + 1}`);
      values.push(filters.programId);
    }
    if (filters?.type !== undefined) {
      conditions.push(`type = $${conditions.length + 1}`);
      values.push(filters.type);
    }
    if (filters?.isFeatured !== undefined) {
      conditions.push(`is_featured = $${conditions.length + 1}`);
      values.push(filters.isFeatured);
    }
    if (filters?.isApproved !== undefined) {
      conditions.push(`is_approved = $${conditions.length + 1}`);
      values.push(filters.isApproved);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await pool.query<TestimonialRecord>(
      `SELECT id, name, role, company, photo_url, content, rating, program_id, type, video_url, is_featured, is_approved, created_at
       FROM testimonials
       ${whereClause}
       ORDER BY created_at DESC`,
      values
    );
    return result.rows;
  }

  async findById(id: string): Promise<TestimonialRecord | null> {
    const pool = getPool();
    const result = await pool.query<TestimonialRecord>(
      `SELECT id, name, role, company, photo_url, content, rating, program_id, type, video_url, is_featured, is_approved, created_at
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
      `INSERT INTO testimonials (name, role, company, photo_url, content, rating, program_id, type, video_url, is_featured, is_approved)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, name, role, company, photo_url, content, rating, program_id, type, video_url, is_featured, is_approved, created_at`,
      [
        input.name,
        input.role,
        input.company,
        input.photo_url ?? '',
        input.content,
        input.rating,
        input.program_id ?? null,
        input.type ?? 'text',
        input.video_url ?? null,
        input.is_featured ?? false,
        input.is_approved ?? true,
      ]
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
    const values: Array<string | number | boolean | null> = [];

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
    if (input.photo_url !== undefined) {
      fields.push(`photo_url = $${fields.length + 1}`);
      values.push(input.photo_url);
    }
    if (input.content !== undefined) {
      fields.push(`content = $${fields.length + 1}`);
      values.push(input.content);
    }
    if (input.rating !== undefined) {
      fields.push(`rating = $${fields.length + 1}`);
      values.push(input.rating);
    }
    if (input.program_id !== undefined) {
      fields.push(`program_id = $${fields.length + 1}`);
      values.push(input.program_id);
    }
    if (input.type !== undefined) {
      fields.push(`type = $${fields.length + 1}`);
      values.push(input.type);
    }
    if (input.video_url !== undefined) {
      fields.push(`video_url = $${fields.length + 1}`);
      values.push(input.video_url);
    }
    if (input.is_featured !== undefined) {
      fields.push(`is_featured = $${fields.length + 1}`);
      values.push(input.is_featured);
    }
    if (input.is_approved !== undefined) {
      fields.push(`is_approved = $${fields.length + 1}`);
      values.push(input.is_approved);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await pool.query<TestimonialRecord>(
      `UPDATE testimonials
       SET ${fields.join(', ')}
       WHERE id = $${fields.length + 1}
       RETURNING id, name, role, company, photo_url, content, rating, program_id, type, video_url, is_featured, is_approved, created_at`,
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
