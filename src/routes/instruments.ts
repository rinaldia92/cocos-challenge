import { Router } from 'express';
import { getInstrumentsController } from '../controllers/instrumentsController';
import { validateRequestInstruments } from '../middleware/validateRequest';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Instrument:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del instrumento
 *         ticker:
 *           type: string
 *           description: Símbolo/ticker del instrumento
 *         name:
 *           type: string
 *           description: Nombre del instrumento
 *         type:
 *           type: string
 *           enum: [ACCIONES, MONEDA]
 *           description: Tipo de instrumento
 *     InstrumentsResponse:
 *       type: object
 *       properties:
 *         instruments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Instrument'
 *
 * /instruments:
 *   get:
 *     summary: Obtener lista de instrumentos
 *     tags: [Instruments]
 *     parameters:
 *       - in: query
 *         name: ticker
 *         schema:
 *           type: string
 *         description: Filtrar por ticker del instrumento
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nombre del instrumento
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Cantidad máxima de resultados a retornar
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número de página para paginación
 *     responses:
 *       200:
 *         description: Lista de instrumentos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstrumentsResponse'
 *             example:
 *               instruments:
 *                 - id: 1
 *                   ticker: "DYCA"
 *                   name: "Dycasa S.A."
 *                   type: "ACCIONES"
 *                 - id: 66
 *                   ticker: "ARS"
 *                   name: "PESOS"
 *                   type: "MONEDA"
 *       422:
 *         description: Parámetros de consulta inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', validateRequestInstruments(), getInstrumentsController);

export default router;
