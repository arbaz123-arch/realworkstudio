import Joi from 'joi';

export const createProgramBodySchema = Joi.object({
  title: Joi.string().trim().min(2).max(255).required(),
  slug: Joi.string()
    .trim()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  description: Joi.string().trim().min(10).required(),
  shortDescription: Joi.string().trim().allow('').optional(),
  fullDescription: Joi.string().trim().allow('').optional(),
  thumbnailUrl: Joi.string().trim().uri().allow('', null).optional(),
  bannerUrl: Joi.string().trim().uri().allow('', null).optional(),
  price: Joi.number().min(0).required(),
  skills: Joi.array().items(Joi.string().trim()).optional(),
  tools: Joi.array().items(Joi.string().trim()).optional(),
  outcomes: Joi.string().trim().optional(),
  displayOrder: Joi.number().integer().min(0).optional(),
  status: Joi.string().valid('ACTIVE', 'DRAFT').optional(),
});

export const updateProgramBodySchema = Joi.object({
  title: Joi.string().trim().min(2).max(255).optional(),
  slug: Joi.string()
    .trim()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  description: Joi.string().trim().min(10).optional(),
  shortDescription: Joi.string().trim().allow('').optional(),
  fullDescription: Joi.string().trim().allow('').optional(),
  thumbnailUrl: Joi.string().trim().uri().allow('', null).optional(),
  bannerUrl: Joi.string().trim().uri().allow('', null).optional(),
  price: Joi.number().min(0).optional(),
  skills: Joi.array().items(Joi.string().trim()).optional(),
  tools: Joi.array().items(Joi.string().trim()).optional(),
  outcomes: Joi.string().trim().optional(),
  displayOrder: Joi.number().integer().min(0).optional(),
  status: Joi.string().valid('ACTIVE', 'DRAFT').optional(),
}).min(1);
