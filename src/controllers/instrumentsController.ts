import { NextFunction, Request, Response } from 'express';
import { getInstrumentsService } from '../services/instrumentsServices';
import { httpStatus } from '../constants/httpStatus';
import { IInstrumentRequest } from '../interfaces/instruments';

export const getInstrumentsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = req.query as IInstrumentRequest;
    const instruments = await getInstrumentsService(queryParams);
    return res.status(httpStatus.OK.code).send({ instruments });
  } catch (error) {
    return next(error);
  }
};
