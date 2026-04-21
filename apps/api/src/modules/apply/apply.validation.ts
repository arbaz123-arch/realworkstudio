import Joi from 'joi';

export const applyBodySchema = Joi.object({
  name: Joi.string().trim().min(2).max(255).required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().max(50).allow('', null).optional(),
  programId: Joi.string().uuid().required(),
  answers: Joi.object().optional(),
});
