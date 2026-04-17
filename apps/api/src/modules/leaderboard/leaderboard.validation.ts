import Joi from 'joi';

export const leaderboardSyncBodySchema = Joi.object({
  entries: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().min(2).max(255).required(),
        githubUsername: Joi.string().trim().max(255).allow('', null).optional(),
        score: Joi.number().integer().min(0).required(),
        rank: Joi.number().integer().min(1).optional(),
        notes: Joi.string().trim().allow('').optional(),
      })
    )
    .default([]),
});
