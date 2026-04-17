import Joi from 'joi';

export const mediaUploadBodySchema = Joi.object({
  fileName: Joi.string().trim().min(1).max(255).required(),
  mimeType: Joi.string().trim().min(3).max(255).optional(),
});
