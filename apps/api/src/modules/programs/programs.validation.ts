import Joi from 'joi';

export const createProgramBodySchema = Joi.object({
  title: Joi.string().trim().min(2).max(255).required(),
  slug: Joi.string()
    .trim()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  description: Joi.string().trim().min(10).required(),
  price: Joi.number().min(0).required(),
});

export const updateProgramBodySchema = Joi.object({
  title: Joi.string().trim().min(2).max(255).optional(),
  slug: Joi.string()
    .trim()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  description: Joi.string().trim().min(10).optional(),
  price: Joi.number().min(0).optional(),
}).min(1);
