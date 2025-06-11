const userRepositoryMock = jest.fn();
const ordersRepositoryMock = jest.fn();
const marketDataRepositoryMock = jest.fn();
const instrumentsRepositoryMock = jest.fn();

import '@jest/globals';

import { getUserByIdMock } from '../mocks/users.mocks';
import { getOrdersByMock } from '../mocks/orders.mocks';
import { getMarketDataByInstrumentIdsMock } from '../mocks/marketData.mocks';
import { getInstrumentsByIdsMock } from '../mocks/instruments.mocks';
import { getPortfolioService } from '../../src/services/portfolioServices';
import { databaseError, notFoundError } from '../../src/utils/errors';
import { EOrderStatus } from '../../src/enums/orders';
import {
  portfolioResponseWithOrdersMock,
  portfolioResponseWithoutOrdersMock,
} from '../mocks/portfolio.mocks';

jest.mock('../../src/repositories/users', () => ({
  getUserById: userRepositoryMock,
}));

jest.mock('../../src/repositories/orders', () => ({
  getOrdersBy: ordersRepositoryMock,
}));

jest.mock('../../src/repositories/marketData', () => ({
  getMarketDataByInstrumentIds: marketDataRepositoryMock,
}));

jest.mock('../../src/repositories/instruments', () => ({
  getInstrumentsByIds: instrumentsRepositoryMock,
}));

describe('Portfolio Service', () => {
  describe('getPortfolioService', () => {
    test('should get portfolio with orders', async () => {
      const userId = 1;

      const orders = getOrdersByMock({ userId, status: EOrderStatus.FILLED });
      const marketData = getMarketDataByInstrumentIdsMock(
        orders.map((order) => order.instrumentId as number),
      );
      const instruments = getInstrumentsByIdsMock(
        orders.map((order) => order.instrumentId as number),
      );

      userRepositoryMock.mockResolvedValue(getUserByIdMock(userId));
      ordersRepositoryMock.mockResolvedValue(orders);
      marketDataRepositoryMock.mockResolvedValue(marketData);
      instrumentsRepositoryMock.mockResolvedValue(instruments);

      const response = await getPortfolioService(userId);
      expect(response).toStrictEqual(portfolioResponseWithOrdersMock);
    });

    test('should get portfolio without orders', async () => {
      const userId = 1;
      userRepositoryMock.mockResolvedValue(getUserByIdMock(userId));
      ordersRepositoryMock.mockResolvedValue([]);

      const response = await getPortfolioService(userId);
      expect(response).toStrictEqual(portfolioResponseWithoutOrdersMock);
    });

    test('should fail because user not found', async () => {
      const userId = 1;
      userRepositoryMock.mockResolvedValue(null);
      try {
        await getPortfolioService(userId);
      } catch (error) {
        expect(error).toStrictEqual(notFoundError(`user with id ${userId} not found`));
      }
    });

    test('should fail because database failed', async () => {
      const userId = 1;
      userRepositoryMock.mockRejectedValue(databaseError('Database failed'));

      try {
        await getPortfolioService(userId);
      } catch (error) {
        expect(error).toStrictEqual(databaseError('Database failed'));
      }
    });
  });
});
