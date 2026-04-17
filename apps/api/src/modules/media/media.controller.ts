import type { NextFunction, Request, Response } from 'express';
import type { MediaService } from './media.service.js';

type UploadBody = {
  fileName: string;
  mimeType?: string;
};

export class MediaController {
  constructor(private readonly service: MediaService) {}

  upload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as UploadBody;
      const result = await this.service.upload(body.fileName);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
