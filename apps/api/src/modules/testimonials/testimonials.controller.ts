import type { NextFunction, Request, Response } from 'express';
import type { TestimonialsService } from './testimonials.service.js';

type CreateTestimonialBody = {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
};

type UpdateTestimonialBody = Partial<CreateTestimonialBody>;

function getParam(value: string | string[] | undefined): string | null {
  if (typeof value === 'string' && value !== '') {
    return value;
  }
  return null;
}

export class TestimonialsController {
  constructor(private readonly service: TestimonialsService) {}

  listAdmin = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await this.service.listAdmin();
      res.status(200).json({ items });
    } catch (err) {
      next(err);
    }
  };

  listPublic = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await this.service.listPublic();
      res.status(200).json({ items });
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as CreateTestimonialBody;
      const item = await this.service.create(body);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getParam(req.params['id']);
      if (id === null) {
        res.status(400).json({ error: 'Testimonial id is required' });
        return;
      }
      const body = req.body as UpdateTestimonialBody;
      const item = await this.service.update(id, body);
      res.status(200).json(item);
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getParam(req.params['id']);
      if (id === null) {
        res.status(400).json({ error: 'Testimonial id is required' });
        return;
      }
      await this.service.remove(id);
      res.status(200).json({ ok: true });
    } catch (err) {
      next(err);
    }
  };
}
