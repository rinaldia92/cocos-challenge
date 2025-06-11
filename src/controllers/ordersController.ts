import { Request, Response, NextFunction } from 'express';

import { httpStatus } from '../constants/httpStatus';
import { createOrderService } from '../services/orderServices';
import { IOrderRequest } from '../interfaces/orders';
import { createNamedLogger } from '../utils/logger';

const logger = createNamedLogger('OrdersController');

export const createOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderRequest: IOrderRequest = req.body as IOrderRequest;
    logger.info(`Creating order: ${JSON.stringify(orderRequest)}`);
    const order = await createOrderService(orderRequest);
    return res.status(httpStatus.CREATED.code).send(order);
  } catch (error) {
    logger.error(`Error creating order: ${error}`);
    return next(error);
  }
};
