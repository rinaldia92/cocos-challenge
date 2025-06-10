import { Router } from 'express';
import ordersRouter from './orders';
import portfolioRouter from './portfolio';
import instrumentsRouter from './instruments';

const router = Router();

router.use('/instruments', instrumentsRouter);
router.use('/orders', ordersRouter);
router.use('/users', portfolioRouter);

export default router;
