import { getPool } from '../../db/pool.js';

export type ProgramRecord = {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  full_description: string;
  thumbnail_url: string;
  banner_url: string;
  price: string;
  skills: string[];
  tools: string[];
  outcomes: string;
  display_order: number;
  status: 'ACTIVE' | 'DRAFT';
  created_at: Date;
};

export type CreateProgramInput = {
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  fullDescription?: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
  price: number;
  skills?: string[];
  tools?: string[];
  outcomes?: string;
  displayOrder?: number;
  status?: 'ACTIVE' | 'DRAFT';
};

export type UpdateProgramInput = Partial<CreateProgramInput>;

export class ProgramsRepository {
  async list(): Promise<ProgramRecord[]> {
    const pool = getPool();
    const result = await pool.query<ProgramRecord>(
      `SELECT id, title, slug, description,
              short_description, full_description, thumbnail_url, banner_url,
              price::text, skills, tools, outcomes, display_order, status, created_at
       FROM programs
       ORDER BY display_order ASC, created_at DESC`
    );
    return result.rows;
  }

  async findBySlug(slug: string): Promise<ProgramRecord | null> {
    const pool = getPool();
    const result = await pool.query<ProgramRecord>(
      `SELECT id, title, slug, description,
              short_description, full_description, thumbnail_url, banner_url,
              price::text, skills, tools, outcomes, display_order, status, created_at
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
      `SELECT id, title, slug, description,
              short_description, full_description, thumbnail_url, banner_url,
              price::text, skills, tools, outcomes, display_order, status, created_at
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
      `SELECT id, title, slug, description,
              short_description, full_description, thumbnail_url, banner_url,
              price::text, skills, tools, outcomes, display_order, status, created_at
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
      `INSERT INTO programs (
          title, slug, description,
          short_description, full_description, thumbnail_url, banner_url,
          price, skills, tools, outcomes, display_order, status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING id, title, slug, description,
                 short_description, full_description, thumbnail_url, banner_url,
                 price::text, skills, tools, outcomes, display_order, status, created_at`,
      [
        input.title,
        input.slug,
        input.description,
        input.shortDescription ?? '',
        input.fullDescription ?? '',
        input.thumbnailUrl ?? '',
        input.bannerUrl ?? '',
        input.price,
        JSON.stringify(input.skills ?? []),
        JSON.stringify(input.tools ?? []),
        input.outcomes ?? '',
        input.displayOrder ?? 0,
        input.status ?? 'DRAFT',
      ]
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
    const values: Array<string | number | string[]> = [];

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
    if (input.shortDescription !== undefined) {
      fields.push(`short_description = $${fields.length + 1}`);
      values.push(input.shortDescription);
    }
    if (input.fullDescription !== undefined) {
      fields.push(`full_description = $${fields.length + 1}`);
      values.push(input.fullDescription);
    }
    if (input.thumbnailUrl !== undefined) {
      fields.push(`thumbnail_url = $${fields.length + 1}`);
      values.push(input.thumbnailUrl);
    }
    if (input.bannerUrl !== undefined) {
      fields.push(`banner_url = $${fields.length + 1}`);
      values.push(input.bannerUrl);
    }
    if (input.skills !== undefined) {
      fields.push(`skills = $${fields.length + 1}`);
      values.push(JSON.stringify(input.skills));
    }
    if (input.tools !== undefined) {
      fields.push(`tools = $${fields.length + 1}`);
      values.push(JSON.stringify(input.tools));
    }
    if (input.outcomes !== undefined) {
      fields.push(`outcomes = $${fields.length + 1}`);
      values.push(input.outcomes);
    }
    if (input.displayOrder !== undefined) {
      fields.push(`display_order = $${fields.length + 1}`);
      values.push(input.displayOrder);
    }
    if (input.status !== undefined) {
      fields.push(`status = $${fields.length + 1}`);
      values.push(input.status);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await pool.query<ProgramRecord>(
      `UPDATE programs
       SET ${fields.join(', ')}
       WHERE id = $${fields.length + 1}
       RETURNING id, title, slug, description,
                 short_description, full_description, thumbnail_url, banner_url,
                 price::text, skills, tools, outcomes, display_order, status, created_at`,
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
