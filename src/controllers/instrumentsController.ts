import { NextFunction, Request, Response } from 'express';
import { getInstrumentsService } from '../services/instrumentsServices';
import { httpStatus } from '../constants/httpStatus';
import { IInstrumentRequest } from '../interfaces/instruments';
import { createNamedLogger } from '../utils/logger';

const logger = createNamedLogger('InstrumentsController');

export const getInstrumentsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = req.query as IInstrumentRequest;
    logger.info(`Getting instruments with query params: ${JSON.stringify(queryParams)}`);
    const instruments = await getInstrumentsService(queryParams);
    return res.status(httpStatus.OK.code).send({ instruments });
  } catch (error) {
    logger.error(`Error getting instruments: ${error}`);
    return next(error);
  }
};
