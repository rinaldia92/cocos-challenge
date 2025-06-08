import { Router } from 'express';
import { getInstrumentsController } from '../controllers/instrumentsController';
import { validateRequest } from '../middleware/validateRequest';
import { instrumentsRequestSchema } from '../schemas/instrumentsSchemas';
import { portfolioRequestSchema } from '../schemas/portfoliosSchemas';
import { ordersRequestSchema } from '../schemas/ordersSchemas';
import { getPortfolioController } from '../controllers/portfolioController';
import { createOrderController } from '../controllers/ordersController';

const router = Router();

router.get('/instruments', validateRequest(instrumentsRequestSchema), getInstrumentsController);
router.get('/users/:userId/portfolio', validateRequest(portfolioRequestSchema), getPortfolioController);
router.post('/orders', validateRequest(ordersRequestSchema), createOrderController);

export default router;