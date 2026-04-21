import Joi from 'joi';

export const saveSeoBodySchema = Joi.object({
  page: Joi.string().trim().min(1).max(120).required(),
  metaTitle: Joi.string().trim().min(1).max(255).required(),
  metaDescription: Joi.string().trim().min(1).required(),
  keywords: Joi.string().trim().allow('').optional(),
  ogImage: Joi.string().trim().uri().allow('').optional(),
});

