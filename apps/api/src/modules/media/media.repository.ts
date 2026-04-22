import { getPool } from '../../db/pool.js';

export type MediaRecord = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  type: string;
  uploadedBy: string | null;
  createdAt: Date;
};

export type CreateMediaInput = {
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  type: 'image' | 'video';
  uploadedBy: string | null;
};

export class MediaRepository {
  async saveMedia(input: CreateMediaInput): Promise<MediaRecord> {
    const pool = getPool();
    const result = await pool.query<MediaRecord>(
      `INSERT INTO media (url, filename, mime_type, size_bytes, type, uploaded_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, url, filename, mime_type AS "mimeType", size_bytes AS "sizeBytes",
                 type, uploaded_by AS "uploadedBy", created_at AS "createdAt"`,
      [input.url, input.filename, input.mimeType, input.sizeBytes, input.type, input.uploadedBy]
    );
    const row = result.rows[0];
    if (row === undefined) {
      throw new Error('Failed to save media record');
    }
    return row;
  }

  async getAllMedia(): Promise<MediaRecord[]> {
    const pool = getPool();
    const result = await pool.query<MediaRecord>(
      `SELECT id, url, filename, mime_type AS "mimeType", size_bytes AS "sizeBytes",
              type, uploaded_by AS "uploadedBy", created_at AS "createdAt"
       FROM media
       ORDER BY created_at DESC`
    );
    return result.rows;
  }

  async createMockUrl(fileName: string): Promise<string> {
    const safeName = fileName.replace(/\s+/g, '-').toLowerCase();
    return Promise.resolve(`https://mock-storage.realworkstudio.dev/media/${Date.now()}-${safeName}`);
  }
}
