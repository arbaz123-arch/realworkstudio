import type { NextFunction, Request, Response } from 'express';
import type { TestimonialsService } from './testimonials.service.js';
import type { CreateTestimonialInput, UpdateTestimonialInput } from './testimonials.repository.js';

type CreateTestimonialBody = {
  name: string;
  role: string;
  company: string;
  photoUrl?: string | null;
  content: string;
  rating: number;
  programId?: string | null;
  type?: 'text' | 'video';
  videoUrl?: string | null;
  isFeatured?: boolean;
  isApproved?: boolean;
};

type UpdateTestimonialBody = Partial<CreateTestimonialBody>;

function toCreateInput(body: CreateTestimonialBody): CreateTestimonialInput {
  return {
    name: body.name,
    role: body.role,
    company: body.company,
    photo_url: body.photoUrl ?? '',
    content: body.content,
    rating: body.rating,
    program_id: body.programId ?? null,
    type: body.type ?? 'text',
    video_url: body.videoUrl ?? null,
    is_featured: body.isFeatured ?? false,
    is_approved: body.isApproved ?? true,
  };
}

function toUpdateInput(body: UpdateTestimonialBody): UpdateTestimonialInput {
  const input: UpdateTestimonialInput = {};
  if (body.name !== undefined) input.name = body.name;
  if (body.role !== undefined) input.role = body.role;
  if (body.company !== undefined) input.company = body.company;
  if (body.photoUrl !== undefined) input.photo_url = body.photoUrl ?? '';
  if (body.content !== undefined) input.content = body.content;
  if (body.rating !== undefined) input.rating = body.rating;
  if (body.programId !== undefined) input.program_id = body.programId;
  if (body.type !== undefined) input.type = body.type;
  if (body.videoUrl !== undefined) input.video_url = body.videoUrl;
  if (body.isFeatured !== undefined) input.is_featured = body.isFeatured;
  if (body.isApproved !== undefined) input.is_approved = body.isApproved;
  return input;
}

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

  listPublic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const programId = typeof req.query['programId'] === 'string' ? req.query['programId'] : undefined;
      const type = req.query['type'] === 'text' || req.query['type'] === 'video' ? req.query['type'] : undefined;
      const isFeatured = req.query['isFeatured'] === 'true' ? true : undefined;
      const items = await this.service.listPublic(programId, type, isFeatured);
      res.status(200).json({ items });
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as CreateTestimonialBody;
      const item = await this.service.create(toCreateInput(body));
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
      const item = await this.service.update(id, toUpdateInput(body));
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
