import type { NextFunction, Request, Response } from 'express';
import type { ObjectSchema } from 'joi';

export function validateBody<T>(schema: ObjectSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error !== undefined) {
      const message = error.details.map((d) => d.message).join('; ');
      res.status(400).json({ error: message });
      return;
    }
    req.body = value;
    next();
  };
}
