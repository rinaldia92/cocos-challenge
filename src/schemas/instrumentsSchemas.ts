import Joi from 'joi';

export const instrumentsRequestSchema = Joi.object({
  ticker: Joi.string().optional(),
  name: Joi.string().optional(),
  limit: Joi.number().integer().min(1).optional(),
  page: Joi.number().integer().min(1).optional(),
});
