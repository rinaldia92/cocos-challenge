import { Request, Response, NextFunction } from 'express';

import { httpStatus } from '../constants/httpStatus';
import { getPortfolioService } from '../services/portfolioServices';

export const getPortfolioController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const portfolio = await getPortfolioService(userId as unknown as number);
        return res.status(httpStatus.OK.code).json(portfolio);
    } catch (error) {
        return next(error);
    }
}