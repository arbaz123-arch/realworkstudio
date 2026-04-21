import { HttpError } from '../../middleware/error-handler.js';
import type { SeoMetaRecord, SeoRepository, UpsertSeoMetaInput } from './seo.repository.js';

export type SeoMetaDto = {
  page: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  createdAt: string;
  updatedAt: string;
};

function toDto(row: SeoMetaRecord): SeoMetaDto {
  return {
    page: row.page,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    keywords: row.keywords,
    ogImage: row.og_image,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export class SeoService {
  constructor(private readonly repository: SeoRepository) {}

  async getByPage(page: string): Promise<SeoMetaDto> {
    const row = await this.repository.findByPage(page);
    if (row === null) {
      throw new HttpError(404, 'SEO metadata not found');
    }
    return toDto(row);
  }

  async save(input: UpsertSeoMetaInput): Promise<SeoMetaDto> {
    const row = await this.repository.upsert(input);
    return toDto(row);
  }
}

