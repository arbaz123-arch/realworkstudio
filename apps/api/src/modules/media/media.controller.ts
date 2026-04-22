import type { NextFunction, Request, Response } from 'express';
import type { MediaService, UploadedFile } from './media.service.js';

type AdminUser = {
  id: string;
  email: string;
};

type MulterFile = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
};

type AuthRequest = Request & {
  admin?: AdminUser;
  file?: MulterFile;
};

export class MediaController {
  constructor(private readonly service: MediaService) {}

  upload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.file) {
        res.status(400).json({ error: 'No file provided' });
        return;
      }

      const file: UploadedFile = {
        buffer: authReq.file.buffer,
        originalname: authReq.file.originalname,
        mimetype: authReq.file.mimetype,
        size: authReq.file.size,
      };

      const adminId = authReq.admin?.id;
      const result = await this.service.upload(file, adminId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const media = await this.service.listMedia();
      res.status(200).json({ media });
    } catch (err) {
      next(err);
    }
  };
}
