import { Router } from 'express';
import { getInstrumentsController } from '../controllers/instrumentsController';
import {
  validateRequestInstruments,
  validateRequestPortfolio,
  validateRequestOrders,
} from '../middleware/validateRequest';
import { getPortfolioController } from '../controllers/portfolioController';
import { createOrderController } from '../controllers/ordersController';

const router = Router();

router.get('/instruments', validateRequestInstruments(), getInstrumentsController);
router.get('/users/:userId/portfolio', validateRequestPortfolio(), getPortfolioController);
router.post('/orders', validateRequestOrders(), createOrderController);

export default router;
