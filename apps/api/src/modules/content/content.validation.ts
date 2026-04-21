import Joi from 'joi';

export const updateHomeContentBodySchema = Joi.object({
  payload: Joi.object().unknown(true).required(),
});

export const saveContentBlockBodySchema = Joi.object({
  value: Joi.object().unknown(true).required(),
});
