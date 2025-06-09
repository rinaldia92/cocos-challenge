import Joi from 'joi';

export const portfolioRequestSchema = Joi.object({
  userId: Joi.number().required(),
});
