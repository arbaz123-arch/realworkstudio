import type { MediaRepository } from './media.repository.js';
import { uploadToFirebase } from '../../services/firebase.service.js';

export type MediaUploadResponseDto = {
  url: string;
  id: string;
  filename: string;
  size: number;
  type: 'image' | 'video';
  provider: 'firebase' | 'mock';
};

export type UploadedFile = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
};

export class MediaService {
  constructor(private readonly repository: MediaRepository) {}

  /**
   * Upload file to storage (Firebase or mock fallback)
   */
  async upload(
    file: UploadedFile,
    adminId?: string
  ): Promise<MediaUploadResponseDto> {
    // Validate file
    this.validateFile(file);

    const type = this.getFileType(file.mimetype);

    try {
      // Try Firebase first
      const url = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);

      // Save to database
      const mediaRecord = await this.repository.saveMedia({
        url,
        filename: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        type,
        uploadedBy: adminId ?? null,
      });

      return {
        url,
        id: mediaRecord.id,
        filename: file.originalname,
        size: file.size,
        type,
        provider: 'firebase',
      };
    } catch (error) {
      console.warn('[MediaService] Firebase upload failed, using mock:', error);

      // Fallback to mock URL
      const mockUrl = await this.repository.createMockUrl(file.originalname);

      return {
        url: mockUrl,
        id: 'mock-' + Date.now(),
        filename: file.originalname,
        size: file.size,
        type,
        provider: 'mock',
      };
    }
  }

  /**
   * Get all media files
   */
  async listMedia(): Promise<Array<{
    id: string;
    url: string;
    filename: string;
    type: 'image' | 'video';
    size: number;
    createdAt: string;
  }>> {
    const records = await this.repository.getAllMedia();
    return records.map((r) => ({
      id: r.id,
      url: r.url,
      filename: r.filename,
      type: r.type as 'image' | 'video',
      size: Number(r.sizeBytes),
      createdAt: r.createdAt.toISOString(),
    }));
  }

  /**
   * Validate file type and size
   */
  private validateFile(file: UploadedFile): void {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(
        `Invalid file type: ${file.mimetype}. Allowed types: ${allowedTypes.join(', ')}`
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error(`File too large: ${file.size} bytes. Maximum size: 10MB`);
    }
  }

  /**
   * Determine file type from MIME type
   */
  private getFileType(mimeType: string): 'image' | 'video' {
    if (mimeType.startsWith('image/')) {
      return 'image';
    }
    if (mimeType.startsWith('video/')) {
      return 'video';
    }
    throw new Error(`Unsupported MIME type: ${mimeType}`);
  }
}
