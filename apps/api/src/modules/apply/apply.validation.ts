import Joi from 'joi';

export const applyBodySchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  programId: Joi.string().uuid().required(),
  answers: Joi.object().optional(),
});

export const updateStatusBodySchema = Joi.object({
  status: Joi.string().valid('pending', 'reviewed', 'rejected').required(),
});
