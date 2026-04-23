import type { NextFunction, Request, Response } from 'express';
import type { ApplyService } from './apply.service.js';

type ApplyBody = {
  name: string;
  email: string;
  phone: string;
  programId: string;
  collegeName: string;
  status: 'STUDENT' | 'GRADUATE';
  currentYearOrExperience: string;
  motivation?: string;
  // answers is deprecated but kept for backward compatibility
  answers?: Record<string, unknown>;
};

type UpdateStatusBody = {
  status: 'pending' | 'reviewed' | 'rejected';
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

  // Admin: List all applications with pagination and search
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const programId = req.query.programId as string | undefined;
      const programIdsRaw = req.query.programIds as string | undefined;
      const programIds = programIdsRaw ? programIdsRaw.split(',').filter(id => id.trim() !== '') : undefined;
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;
      const page = Math.max(1, Number.parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit as string) || 10));

      const result = await this.service.listApplications({ programId, programIds, status, search, page, limit });
      res.status(200).json({
        data: result.applications,
        meta: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (err) {
      next(err);
    }
  };

  // Admin: Export applications to CSV
  export = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const programId = req.query.programId as string | undefined;
      const programIdsRaw = req.query.programIds as string | undefined;
      const programIds = programIdsRaw ? programIdsRaw.split(',').filter(id => id.trim() !== '') : undefined;
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;

      const csv = await this.service.exportApplications({ programId, programIds, status, search });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="applications.csv"');
      res.status(200).send(csv);
    } catch (err) {
      next(err);
    }
  };

  // Admin: Get single application
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const result = await this.service.getApplicationById(id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // Admin: Update application status
  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const body = req.body as UpdateStatusBody;
      const result = await this.service.updateApplicationStatus(id, body.status);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
