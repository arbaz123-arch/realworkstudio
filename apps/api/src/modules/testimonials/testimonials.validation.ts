import Joi from 'joi';

export const createTestimonialBodySchema = Joi.object({
  name: Joi.string().trim().min(2).max(255).required(),
  role: Joi.string().trim().min(2).max(255).required(),
  company: Joi.string().trim().min(2).max(255).required(),
  content: Joi.string().trim().min(10).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
});

export const updateTestimonialBodySchema = Joi.object({
  name: Joi.string().trim().min(2).max(255).optional(),
  role: Joi.string().trim().min(2).max(255).optional(),
  company: Joi.string().trim().min(2).max(255).optional(),
  content: Joi.string().trim().min(10).optional(),
  rating: Joi.number().integer().min(1).max(5).optional(),
}).min(1);
