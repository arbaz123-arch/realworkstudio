import type { NextFunction, Request, Response } from 'express';
import type { ContentService } from './content.service.js';

type UpdateHomeContentBody = {
  payload: Record<string, unknown>;
};

type SaveBlockBody = {
  value: Record<string, unknown>;
};

export class ContentController {
  constructor(private readonly service: ContentService) {}

  getHomeContent = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = await this.service.getHomeContent();
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  };

  updateHomeContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as UpdateHomeContentBody;
      const response = await this.service.updateHomeContent(body.payload);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  getBlock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = typeof req.params['key'] === 'string' ? req.params['key'] : '';
      const body = await this.service.getBlock(key);
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  };

  saveBlock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = typeof req.params['key'] === 'string' ? req.params['key'] : '';
      const body = req.body as SaveBlockBody;
      const response = await this.service.saveBlock(key, body.value);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };
}
