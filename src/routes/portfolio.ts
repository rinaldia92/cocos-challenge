import { Router } from 'express';
import { getPortfolioController } from '../controllers/portfolioController';
import { validateRequestPortfolio } from '../middleware/validateRequest';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Position:
 *       type: object
 *       properties:
 *         instrumentId:
 *           type: integer
 *           description: ID del instrumento
 *         instrumentName:
 *           type: string
 *           description: Nombre del instrumento
 *         quantity:
 *           type: number
 *           description: Cantidad de instrumentos (puede ser negativo para posiciones cortas)
 *         currentPrice:
 *           type: string
 *           description: Precio actual del instrumento
 *         totalValue:
 *           type: number
 *           description: Valor total de la posición (quantity * currentPrice)
 *         pnlPercent:
 *           type: number
 *           description: Porcentaje de ganancia/pérdida de la posición
 *     Portfolio:
 *       type: object
 *       properties:
 *         availableCash:
 *           type: number
 *           description: Efectivo disponible en la cuenta
 *         positions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Position'
 *           description: Lista de posiciones en el portfolio
 *         totalValue:
 *           type: number
 *           description: Valor total del portfolio (availableCash + suma de totalValue de positions)
 *
 * /users/{userId}/portfolio:
 *   get:
 *     summary: Obtener el portfolio de un usuario
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Portfolio obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Portfolio'
 *             example:
 *               availableCash: 771517
 *               positions:
 *                 - instrumentId: 47
 *                   instrumentName: "Pampa Holding S.A."
 *                   quantity: 20
 *                   currentPrice: "925.85"
 *                   totalValue: 18517
 *                   pnlPercent: -0.45
 *                 - instrumentId: 31
 *                   instrumentName: "Banco Macro S.A."
 *                   quantity: -10
 *                   currentPrice: "1502.80"
 *                   totalValue: -15028
 *                   pnlPercent: -2.42
 *                 - instrumentId: 54
 *                   instrumentName: "MetroGAS S.A."
 *                   quantity: 500
 *                   currentPrice: "229.50"
 *                   totalValue: 114750
 *                   pnlPercent: -8.2
 *               totalValue: 889756
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: ID de usuario inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:userId/portfolio', validateRequestPortfolio(), getPortfolioController);

export default router; 