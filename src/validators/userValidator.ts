import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().required().email(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
}).min(1);
