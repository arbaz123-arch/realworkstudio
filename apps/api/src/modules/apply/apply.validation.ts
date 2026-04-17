import Joi from 'joi';

export const applyBodySchema = Joi.object({
  name: Joi.string().trim().min(2).max(255).required(),
  email: Joi.string().trim().email().required(),
  programId: Joi.string().uuid().required(),
});
