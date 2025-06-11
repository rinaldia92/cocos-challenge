import { Request, Response, NextFunction } from 'express';
import { httpStatus } from '../constants/httpStatus';

interface IErrorResponse {
  message: string;
  statusCode: number;
  statusTitle: string;
  internalCode?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR.code;
  const statusTitle = err.statusTitle || 'Internal Server Error';
  const message = err.message || 'Something went wrong';
  const internalCode = err.internalCode;

  const errorResponse: IErrorResponse = {
    message,
    statusCode,
    statusTitle,
    internalCode,
  };
  return res.status(statusCode).send(errorResponse);
};
