import { Request, Response, NextFunction } from 'express';

import { httpStatus } from '../constants/httpStatus';
import { createOrderService } from '../services/orderServices';
import { IOrderRequest } from '../interfaces/orders';

export const createOrderController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderRequest: IOrderRequest = req.body as IOrderRequest;
        const order = await createOrderService(orderRequest);
        return res.status(httpStatus.CREATED.code).json(order); 
    } catch (error) {
        return next(error);
    }
}