import Joi from 'joi';

export const applyBodySchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(5).max(50).required(),
  programId: Joi.string().uuid().required(),
  collegeName: Joi.string().min(2).max(255).required(),
  status: Joi.string().valid('STUDENT', 'GRADUATE').required(),
  currentYearOrExperience: Joi.string().min(1).max(50).required(),
  motivation: Joi.string().max(1000).optional(),
  // answers is deprecated but kept for backward compatibility
  answers: Joi.object().optional(),
});

export const updateStatusBodySchema = Joi.object({
  status: Joi.string().valid('pending', 'reviewed', 'rejected').required(),
});
