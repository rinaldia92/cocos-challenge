const createOrderServiceMock = jest.fn();

import request from 'supertest';
import '@jest/globals';
import { EOrderSide, EOrderType, EOrderStatus } from '../../src/enums/orders';
import app from '../../src/app';
import { createOrderMock } from '../mocks/orders.mocks';
import { notFoundError } from '../../src/utils/errors';

jest.mock('../../src/services/orderServices', () => ({
  createOrderService: createOrderServiceMock,
}));

describe('Orders Controller', () => {
  describe('POST /v1/api/orders', () => {
    it('should create a market buy order successfully', async () => {
      const orderRequest = {
        userId: 1,
        instrumentId: 1,
        type: EOrderType.MARKET,
        side: EOrderSide.BUY,
        quantity: 10,
      };

      createOrderServiceMock.mockResolvedValue(
        createOrderMock({
          ...orderRequest,
          status: EOrderStatus.FILLED,
        }),
      );

      const response = await request(app).post('/v1/api/orders').send(orderRequest);

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
        quantity: 999999,
      };

      createOrderServiceMock.mockResolvedValue(
        createOrderMock({
          ...orderRequest,
          status: EOrderStatus.REJECTED,
        }),
      );

      const response = await request(app).post('/v1/api/orders').send(orderRequest);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe(EOrderStatus.REJECTED);
    });

    it('should return 404 when instrument not found', async () => {
      const orderRequest = {
        userId: 1,
        instrumentId: 99999,
        type: EOrderType.MARKET,
        side: EOrderSide.BUY,
        quantity: 10,
      };

      createOrderServiceMock.mockRejectedValue(notFoundError('Instrument not found'));

      const response = await request(app).post('/v1/api/orders').send(orderRequest);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Instrument not found');
    });
  });
});
