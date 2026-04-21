import Joi from 'joi';

export const leaderboardSyncBodySchema = Joi.object({
  entries: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().min(2).max(255).required(),
        githubUsername: Joi.string().trim().max(255).allow('', null).optional(),
        commits: Joi.number().integer().min(0).optional(),
        repos: Joi.number().integer().min(0).optional(),
        score: Joi.number().integer().min(0).optional(),
        rank: Joi.number().integer().min(1).optional(),
        notes: Joi.string().trim().allow('').optional(),
      })
    )
    .default([]),
});
