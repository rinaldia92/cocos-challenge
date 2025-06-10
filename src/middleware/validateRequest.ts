import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

import { instrumentsRequestSchema } from '../schemas/instrumentsSchemas';
import { portfolioRequestSchema } from '../schemas/portfoliosSchemas';
import { ordersRequestSchema } from '../schemas/ordersSchemas';
import { invalidSchemaError } from '../utils/errors';

const validateRequest = (schema: Schema, input: any) => {
  const { error } = schema.validate(input, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);

    throw invalidSchemaError(errors.join(', '));
  }
};

export const validateRequestInstruments = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const input = req.query;
    validateRequest(instrumentsRequestSchema, input);
    return next();
  };
};

export const validateRequestPortfolio = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const input = req.params;
    validateRequest(portfolioRequestSchema, input);
    return next();
  };
};

export const validateRequestOrders = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const input = req.body;
    validateRequest(ordersRequestSchema, input);
    return next();
  };
};
