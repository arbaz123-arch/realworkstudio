import Joi from 'joi';

export const adminLoginBodySchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(8).max(128).required(),
});
