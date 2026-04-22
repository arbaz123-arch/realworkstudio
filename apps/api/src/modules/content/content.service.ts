import type { ContentRepository } from './content.repository.js';
import { HttpError } from '../../middleware/error-handler.js';
import { ContentValidator } from './content.validator.js';
import { ContentSeeder } from './content.seeder.js';

export type HomeContentDto = {
  payload: Record<string, unknown>;
};

export type ContentBlockDto = {
  key: string;
  value: Record<string, unknown>;
  page?: string;
};

export type PageContentDto = {
  page: string;
  blocks: Record<string, Record<string, unknown>>;
};

const ALLOWED_BLOCK_KEYS = new Set(['hero', 'cta', 'section_headings']);

export class ContentService {
  private readonly seeder: ContentSeeder;

  constructor(private readonly repository: ContentRepository) {
    this.seeder = new ContentSeeder(repository);
  }

  async seedDefaultContent(): Promise<void> {
    await this.seeder.seedIfEmpty();
  }

  async getHomeContent(): Promise<HomeContentDto> {
    const payload = await this.repository.getHomePayload();
    return { payload };
  }

  async updateHomeContent(payload: Record<string, unknown>): Promise<HomeContentDto> {
    const updated = await this.repository.updateHomePayload(payload);
    return { payload: updated };
  }

  async getBlock(key: string, page = 'home'): Promise<ContentBlockDto> {
    this.assertAllowedKey(key);
    const value = await this.repository.getBlock(key, page);
    if (value === null) {
      throw new HttpError(404, 'Content block not found');
    }
    return { key, value, page };
  }

  async getPageContent(page: string): Promise<PageContentDto> {
    const blocks = await this.repository.getBlocksByPage(page);
    return { page, blocks };
  }

  async saveBlock(key: string, value: Record<string, unknown>, page = 'home'): Promise<ContentBlockDto> {
    this.assertAllowedKey(key);

    // Validate content for XSS and structure
    ContentValidator.validate(value);

    // Sanitize content before saving
    const sanitizedValue = ContentValidator.sanitize(value);

    const updated = await this.repository.upsertBlock(key, sanitizedValue, page);

    // Log update for audit trail
    console.log(`[ContentService] Block updated: ${key} (page: ${page}) at ${new Date().toISOString()}`);

    return { key, value: updated, page };
  }

  private assertAllowedKey(key: string): void {
    if (!ALLOWED_BLOCK_KEYS.has(key)) {
      throw new HttpError(400, 'Invalid content key');
    }
  }
}
