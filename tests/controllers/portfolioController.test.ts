const portfolioServiceMock = jest.fn();

import request from 'supertest';
import '@jest/globals';
import app from '../../src/app';
import { notFoundError } from '../../src/utils/errors';
import { portfolioResponseWithOrdersMock, portfolioResponseWithoutOrdersMock } from '../mocks/portfolio.mocks';
import { httpStatus } from '../../src/constants/httpStatus';

jest.mock('../../src/services/portfolioServices', () => ({
  getPortfolioService: portfolioServiceMock,
}));


describe('Portfolio Controller', () => {
  describe('GET /v1/api/users/:userId/portfolio', () => {
    test('should get portfolio successfully', async () => {
      const userId = 1;
      portfolioServiceMock.mockResolvedValue(portfolioResponseWithOrdersMock);

      const response = await request(app)
        .get(`/v1/api/users/${userId}/portfolio`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('availableCash');
      expect(response.body).toHaveProperty('positions');
      expect(Array.isArray(response.body.positions)).toBe(true);
      response.body.positions.forEach((position: any) => {
        expect(position).toHaveProperty('instrumentId');
        expect(position).toHaveProperty('instrumentName');
        expect(position).toHaveProperty('quantity');
        expect(position).toHaveProperty('currentPrice');
        expect(position).toHaveProperty('totalValue');
      });
    });

    test('should get portfolio without orders', async () => {
      const userId = 1;
      portfolioServiceMock.mockResolvedValue(portfolioResponseWithoutOrdersMock);

      const response = await request(app)
        .get(`/v1/api/users/${userId}/portfolio`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('availableCash');
      expect(response.body).toHaveProperty('positions');
      expect(response.body.positions).toHaveLength(0);
      expect(response.body.availableCash).toBe(0);
      expect(response.body.totalValue).toBe(0);
    });

    test('should fail for non-existent user', async () => {
      const userId = 99999; // ID que no existe

      portfolioServiceMock.mockRejectedValue(notFoundError(`user with id ${userId} not found`));

      const response = await request(app)
        .get(`/v1/api/users/${userId}/portfolio`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', `user with id ${userId} not found`);
    });

    test('should fail with invalid schema', async () => {
      const response = await request(app)
        .get(`/v1/api/users/invalid-user/portfolio`);

      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY.code);
    });
  });
}); 