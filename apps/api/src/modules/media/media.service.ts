import type { MediaRepository } from './media.repository.js';

export type MediaUploadResponseDto = {
  url: string;
  provider: 'mock';
};

export class MediaService {
  constructor(private readonly repository: MediaRepository) {}

  async upload(fileName: string): Promise<MediaUploadResponseDto> {
    const url = await this.repository.createMockUrl(fileName);
    return {
      url,
      provider: 'mock',
    };
  }
}
