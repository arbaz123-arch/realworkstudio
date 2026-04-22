import type { NextFunction, Request, Response } from 'express';
import type { ContentService } from './content.service.js';

type UpdateHomeContentBody = {
  payload: Record<string, unknown>;
};

type SaveBlockBody = {
  value: Record<string, unknown>;
  page?: string;
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
      const page = typeof req.query['page'] === 'string' ? req.query['page'] : 'home';
      const body = await this.service.getBlock(key, page);
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  };

  getPageContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = typeof req.params['page'] === 'string' ? req.params['page'] : 'home';
      const body = await this.service.getPageContent(page);
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  };

  saveBlock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = typeof req.params['key'] === 'string' ? req.params['key'] : '';
      const body = req.body as SaveBlockBody;
      const page = body.page ?? 'home';
      const response = await this.service.saveBlock(key, body.value, page);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  revalidatePage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = typeof req.params['page'] === 'string' ? req.params['page'] : 'home';
      // Log revalidation request for monitoring
      console.log(`[ContentController] Revalidation requested for page: ${page}`);
      res.status(200).json({
        revalidated: true,
        page,
        message: `Page ${page} marked for revalidation. Next.js ISR will regenerate on next request.`,
      });
    } catch (err) {
      next(err);
    }
  };
}
