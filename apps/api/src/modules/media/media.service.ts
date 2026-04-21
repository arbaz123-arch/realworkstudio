import type { MediaRepository } from './media.repository.js';

export type MediaUploadResponseDto = {
  url: string;
  provider: 'mock' | 'cloudinary';
};

export class MediaService {
  constructor(private readonly repository: MediaRepository) {}

  async upload(fileName: string): Promise<MediaUploadResponseDto> {
    const cloudinaryUrl = await this.repository.uploadToCloudinary(fileName);
    const url = cloudinaryUrl ?? (await this.repository.createMockUrl(fileName));
    return {
      url,
      provider: cloudinaryUrl ? 'cloudinary' : 'mock',
    };
  }
}
