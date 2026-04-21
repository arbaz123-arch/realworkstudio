import type { NextFunction, Request, Response } from 'express';
import type { ApplyService } from './apply.service.js';

type ApplyBody = {
  name: string;
  email: string;
  phone?: string;
  programId: string;
  answers?: Record<string, unknown>;
};

export class ApplyController {
  constructor(private readonly service: ApplyService) {}

  submit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as ApplyBody;
      const result = await this.service.submit(body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };
}
