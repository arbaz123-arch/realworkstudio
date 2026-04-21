import type { ContentRepository } from './content.repository.js';
import { HttpError } from '../../middleware/error-handler.js';

export type HomeContentDto = {
  payload: Record<string, unknown>;
};

export type ContentBlockDto = {
  key: string;
  value: Record<string, unknown>;
};

const ALLOWED_BLOCK_KEYS = new Set(['hero', 'cta', 'section_headings']);

export class ContentService {
  constructor(private readonly repository: ContentRepository) {}

  async getHomeContent(): Promise<HomeContentDto> {
    const payload = await this.repository.getHomePayload();
    return { payload };
  }

  async updateHomeContent(payload: Record<string, unknown>): Promise<HomeContentDto> {
    const updated = await this.repository.updateHomePayload(payload);
    return { payload: updated };
  }

  async getBlock(key: string): Promise<ContentBlockDto> {
    this.assertAllowedKey(key);
    const value = await this.repository.getBlock(key);
    if (value === null) {
      throw new HttpError(404, 'Content block not found');
    }
    return { key, value };
  }

  async saveBlock(key: string, value: Record<string, unknown>): Promise<ContentBlockDto> {
    this.assertAllowedKey(key);
    const updated = await this.repository.upsertBlock(key, value);
    return { key, value: updated };
  }

  private assertAllowedKey(key: string): void {
    if (!ALLOWED_BLOCK_KEYS.has(key)) {
      throw new HttpError(400, 'Invalid content key');
    }
  }
}
