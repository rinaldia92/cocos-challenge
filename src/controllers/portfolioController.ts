import { Request, Response, NextFunction } from 'express';

import { httpStatus } from '../constants/httpStatus';
import { getPortfolioService } from '../services/portfolioServices';

import { createNamedLogger } from '../utils/logger';

const logger = createNamedLogger('PortfolioController');

export const getPortfolioController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    logger.info(`Getting portfolio for user ${userId}`);
    const portfolio = await getPortfolioService(userId as unknown as number);
    return res.status(httpStatus.OK.code).json({ portfolio });
  } catch (error) {
    logger.error(`Error getting portfolio for user ${req.params.userId}: ${error}`);
    return next(error);
  }
};
