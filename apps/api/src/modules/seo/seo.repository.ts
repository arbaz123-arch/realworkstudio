import { getPool } from '../../db/pool.js';

export type SeoMetaRecord = {
  id: string;
  page: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  og_image: string;
  created_at: Date;
  updated_at: Date;
};

export type UpsertSeoMetaInput = {
  page: string;
  metaTitle: string;
  metaDescription: string;
  keywords?: string;
  ogImage?: string;
};

export class SeoRepository {
  async findByPage(page: string): Promise<SeoMetaRecord | null> {
    const pool = getPool();
    const result = await pool.query<SeoMetaRecord>(
      `SELECT id, page, meta_title, meta_description, keywords, og_image, created_at, updated_at
       FROM seo_meta
       WHERE page = $1
       LIMIT 1`,
      [page]
    );
    return result.rows[0] ?? null;
  }

  async upsert(input: UpsertSeoMetaInput): Promise<SeoMetaRecord> {
    const pool = getPool();
    const result = await pool.query<SeoMetaRecord>(
      `INSERT INTO seo_meta (page, meta_title, meta_description, keywords, og_image, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (page)
       DO UPDATE SET
         meta_title = EXCLUDED.meta_title,
         meta_description = EXCLUDED.meta_description,
         keywords = EXCLUDED.keywords,
         og_image = EXCLUDED.og_image,
         updated_at = NOW()
       RETURNING id, page, meta_title, meta_description, keywords, og_image, created_at, updated_at`,
      [input.page, input.metaTitle, input.metaDescription, input.keywords ?? '', input.ogImage ?? '']
    );
    const row = result.rows[0];
    if (row === undefined) {
      throw new Error('Failed to save SEO metadata');
    }
    return row;
  }
}

