import { NextFunction, Request, Response } from 'express';
import { getInstrumentsService } from '../services/instrumentsServices';

export const getInstrumentsController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { ticker, name, limit, offset } = req.query;
		const orders = await getInstrumentsService({
			ticker: ticker as string,
			name: name as string,
			limit: limit ? parseInt(limit as string) : 10,
			offset: offset ? parseInt(offset as string) : 0,
		});
		return res.status(200).send(orders);
	} catch (error) {
		return next(error);
	}
};
