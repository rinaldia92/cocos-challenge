import request from 'supertest';
import '@jest/globals';
import { EOrderSide, EOrderType, EOrderStatus } from '../../src/enums/orders';
import app from '../../src/app';

describe('Orders Controller', () => {
  describe('POST /v1/api/orders', () => {
    it('should create a market buy order successfully', async () => {
      const orderRequest = {
        userId: 1,
        instrumentId: 1,
        type: EOrderType.MARKET,
        side: EOrderSide.BUY,
        quantity: 10
      };

      const response = await request(app)
        .post('/v1/api/orders')
        .send(orderRequest);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe(EOrderStatus.FILLED);
    });

    it('should reject order when insufficient funds', async () => {
      const orderRequest = {
        userId: 1,
        instrumentId: 1,
        type: EOrderType.MARKET,
        side: EOrderSide.BUY,
        quantity: 999999 // cantidad muy alta para asegurar fondos insuficientes
      };

      const response = await request(app)
        .post('/v1/api/orders')
        .send(orderRequest);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe(EOrderStatus.REJECTED);
    });

    it('should return 404 when instrument not found', async () => {
      const orderRequest = {
        userId: 1,
        instrumentId: 99999, // ID que no existe
        type: EOrderType.MARKET,
        side: EOrderSide.BUY,
        quantity: 10
      };

      const response = await request(app)
        .post('/v1/api/orders')
        .send(orderRequest);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Market data not found');
    });
  });
}); 