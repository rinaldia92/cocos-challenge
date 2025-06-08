import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { httpStatus } from '../constants/httpStatus';

export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        message: detail.message,
        path: detail.path,
      }));

      return res.status(httpStatus.UNPROCESSABLE_ENTITY.code).json({
        errors,
      });
    }

    return next();
  };
};
