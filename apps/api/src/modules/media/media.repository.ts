import { env } from '../../config/env.js';

type UploadResult = {
  secure_url: string;
};

function toPublicId(fileName: string): string {
  return fileName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_/.]/g, '');
}

export class MediaRepository {
  async uploadToCloudinary(fileName: string): Promise<string | null> {
    if (!env.cloudinaryUrl) {
      return null;
    }

    const { v2: cloudinary } = await import('cloudinary');
    cloudinary.config({ cloudinary_url: env.cloudinaryUrl });

    const publicId = `rws/${Date.now()}-${toPublicId(fileName)}`;
    // 1x1 transparent GIF so we can keep request shape (fileName only) without breaking UI.
    const tinyGif =
      'data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACwAAAAAAQABAEACAkQBADs=';

    const uploaded = (await cloudinary.uploader.upload(tinyGif, {
      public_id: publicId,
      resource_type: 'image',
      overwrite: true,
    })) as UploadResult;

    return uploaded.secure_url;
  }

  async createMockUrl(fileName: string): Promise<string> {
    const safeName = fileName.replace(/\s+/g, '-').toLowerCase();
    return Promise.resolve(`https://mock-storage.realworkstudio.dev/media/${Date.now()}-${safeName}`);
  }
}
