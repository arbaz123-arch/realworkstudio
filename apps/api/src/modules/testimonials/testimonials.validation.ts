import Joi from 'joi';

const baseSchema = {
  name: Joi.string().trim().min(2).max(255).required(),
  role: Joi.string().trim().min(2).max(255).required(),
  company: Joi.string().trim().min(2).max(255).required(),
  photoUrl: Joi.string().trim().uri().allow('', null).max(500).optional(),
  rating: Joi.number().integer().min(1).max(5).required(),
  programId: Joi.string().uuid().allow(null).optional(),
  type: Joi.string().valid('text', 'video').optional(),
  videoUrl: Joi.string().trim().uri().allow('', null).max(500).optional(),
  isFeatured: Joi.boolean().optional(),
  isApproved: Joi.boolean().optional(),
};

export const createTestimonialBodySchema = Joi.object({
  ...baseSchema,
  content: Joi.string().trim().min(10).when('type', {
    is: 'video',
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  videoUrl: Joi.string().trim().uri().allow('', null).min(5).max(500).when('type', {
    is: 'video',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
}).custom((value, helpers) => {
  // Additional validation: when type is video, videoUrl must be present and valid
  if (value.type === 'video') {
    if (!value.videoUrl || value.videoUrl === '') {
      return helpers.error('videoUrl.required_when_video');
    }
  }
  return value;
});

export const updateTestimonialBodySchema = Joi.object({
  name: Joi.string().trim().min(2).max(255).optional(),
  role: Joi.string().trim().min(2).max(255).optional(),
  company: Joi.string().trim().min(2).max(255).optional(),
  photoUrl: Joi.string().trim().uri().allow('', null).max(500).optional(),
  content: Joi.string().trim().min(10).when('type', {
    is: 'video',
    then: Joi.optional(),
    otherwise: Joi.optional(),
  }),
  rating: Joi.number().integer().min(1).max(5).optional(),
  programId: Joi.string().uuid().allow(null).optional(),
  type: Joi.string().valid('text', 'video').optional(),
  videoUrl: Joi.string().trim().uri().allow('', null).min(5).max(500).when('type', {
    is: 'video',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  isFeatured: Joi.boolean().optional(),
  isApproved: Joi.boolean().optional(),
})
  .min(1)
  .custom((value, helpers) => {
    // Additional validation: when type is video, videoUrl must be present and valid
    if (value.type === 'video') {
      if (!value.videoUrl || value.videoUrl === '') {
        return helpers.error('videoUrl.required_when_video');
      }
    }
    return value;
  });

export const testimonialQuerySchema = Joi.object({
  programId: Joi.string().uuid().optional(),
  type: Joi.string().valid('text', 'video').optional(),
});
