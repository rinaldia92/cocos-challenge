import { NextFunction, Request, Response } from 'express';
import { getInstrumentsService } from '../services/instrumentsServices';
import { httpStatus } from '../constants/httpStatus';

export const getInstrumentsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ticker, name, limit, page } = req.query;
    const instruments = await getInstrumentsService({
      ticker: ticker as string,
      name: name as string,
      limit: limit ? parseInt(limit as string) : 10,
      page: page ? parseInt(page as string) : 1,
    });
    return res.status(httpStatus.OK.code).send({ instruments });
  } catch (error) {
    return next(error);
  }
};
