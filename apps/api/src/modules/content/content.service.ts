import type { ContentRepository } from './content.repository.js';

export type HomeContentDto = {
  payload: Record<string, unknown>;
};

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
}
