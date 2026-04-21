import type { NextFunction, Request, Response } from 'express';
import type { SeoService } from './seo.service.js';

type SaveSeoBody = {
  page: string;
  metaTitle: string;
  metaDescription: string;
  keywords?: string;
  ogImage?: string;
};

export class SeoController {
  constructor(private readonly service: SeoService) {}

  getByPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = typeof req.query['page'] === 'string' ? req.query['page'].trim() : '';
      if (page === '') {
        res.status(400).json({ error: 'Query parameter "page" is required' });
        return;
      }
      const data = await this.service.getByPage(page);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  save = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as SaveSeoBody;
      const data = await this.service.save({
        page: body.page,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        keywords: body.keywords,
        ogImage: body.ogImage,
      });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };
}

