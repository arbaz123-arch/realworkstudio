import type { NextFunction, Request, Response } from 'express';
import type { ProgramsService } from './programs.service.js';

type CreateProgramBody = {
  title: string;
  slug?: string;
  description: string;
  price: number;
};

type UpdateProgramBody = Partial<CreateProgramBody>;

function getParam(value: string | string[] | undefined): string | null {
  if (typeof value === 'string' && value !== '') {
    return value;
  }
  return null;
}

export class ProgramsController {
  constructor(private readonly service: ProgramsService) {}

  listAdmin = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const programs = await this.service.listAdmin();
      res.status(200).json({ items: programs });
    } catch (err) {
      next(err);
    }
  };

  listPublic = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const programs = await this.service.listPublic();
      res.status(200).json({ items: programs });
    } catch (err) {
      next(err);
    }
  };

  getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const slug = getParam(req.params['slug']);
      if (slug === null) {
        res.status(400).json({ error: 'Program slug is required' });
        return;
      }
      const program = await this.service.getBySlug(slug);
      res.status(200).json(program);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as CreateProgramBody;
      const created = await this.service.create(body);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getParam(req.params['id']);
      if (id === null) {
        res.status(400).json({ error: 'Program id is required' });
        return;
      }
      const body = req.body as UpdateProgramBody;
      const updated = await this.service.update(id, body);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getParam(req.params['id']);
      if (id === null) {
        res.status(400).json({ error: 'Program id is required' });
        return;
      }
      await this.service.remove(id);
      res.status(200).json({ ok: true });
    } catch (err) {
      next(err);
    }
  };
}
