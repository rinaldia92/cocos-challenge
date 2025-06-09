import Joi from 'joi';

export const instrumentsRequestSchema = Joi.object({
  ticker: Joi.string().optional(),
  name: Joi.string().optional(),
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
});
