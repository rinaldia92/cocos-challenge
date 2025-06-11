import { Router } from 'express';
import { createOrderController } from '../controllers/ordersController';
import { validateRequestOrders } from '../middleware/validateRequest';
const router = Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crear una nueva orden
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - instrumentId
 *               - type
 *               - side
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID del usuario
 *               instrumentId:
 *                 type: integer
 *                 description: ID del instrumento
 *               type:
 *                 type: string
 *                 enum: [MARKET, LIMIT]
 *                 description: Tipo de orden
 *               side:
 *                 type: string
 *                 enum: [BUY, SELL, CASH_IN, CASH_OUT]
 *                 description: Lado de la orden
 *               quantity:
 *                 type: number
 *                 description: Cantidad de la orden
 *               price:
 *                 type: number
 *                 description: Precio de la orden (requerido para órdenes LIMIT)
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       422:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Instrumento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', validateRequestOrders(), createOrderController);

export default router;
