const userRepositoryMock = jest.fn();
const getOrdersRepositoryMock = jest.fn();
const createOrderRepositoryMock = jest.fn();
const marketDataRepositoryMock = jest.fn();
const instrumentsRepositoryMock = jest.fn();

import '@jest/globals';

import { getUserByIdMock } from '../mocks/users.mocks';
import { getOrdersByMock } from '../mocks/orders.mocks';
import { getLastMarketDataByInstrumentIdMock } from '../mocks/marketData.mocks';
import { getInstrumentByIdMock } from '../mocks/instruments.mocks';
import { createOrderService } from '../../src/services/orderServices';
import { NOT_FOUND_ERROR, notFoundError } from '../../src/utils/errors';
import { EOrderSide, EOrderStatus, EOrderType } from '../../src/enums/orders';

jest.mock('../../src/repositories/users', () => ({
  getUserById: userRepositoryMock,
}));

jest.mock('../../src/repositories/orders', () => ({
  getOrdersBy: getOrdersRepositoryMock,
  createOrderRepository: createOrderRepositoryMock,
}));

jest.mock('../../src/repositories/marketData', () => ({
  getLastMarketDataByInstrumentId: marketDataRepositoryMock,
}));

jest.mock('../../src/repositories/instruments', () => ({
  getInstrumentById: instrumentsRepositoryMock,
}));

describe('Orders Service', () => {
  describe('createOrderService', () => {
    test('should create a marker order with status filled because the user wants to buy 10 units of an instrument and he has enough cash', async () => {
      const userId = 1;
      const instrumentId = 47;
      const orderRequest = {
        userId,
        instrumentId,
        type: EOrderType.MARKET,
        side: EOrderSide.BUY,
        quantity: 10,
      };

      userRepositoryMock.mockResolvedValue(getUserByIdMock(userId));
      instrumentsRepositoryMock.mockResolvedValue(getInstrumentByIdMock(instrumentId));
      marketDataRepositoryMock.mockResolvedValue(getLastMarketDataByInstrumentIdMock(instrumentId));
      getOrdersRepositoryMock.mockResolvedValue(
        getOrdersByMock({ userId, status: EOrderStatus.FILLED }),
      );
      createOrderRepositoryMock.mockImplementation((order) => Promise.resolve(order));

      const result = await createOrderService(orderRequest);

      expect(result).toMatchObject({
        datetime: expect.any(Date),
        instrumentId,
        price: expect.any(Number),
        side: orderRequest.side,
        size: orderRequest.quantity,
        status: EOrderStatus.FILLED,
        type: orderRequest.type,
        userId,
      });
    });

    test('should create a marker order with status filled because the user wants to buy with an amount and he has enough cash', async () => {
      const userId = 1;
      const instrumentId = 47;
      const orderRequest = {
        userId,
        instrumentId,
        type: EOrderType.MARKET,
        side: EOrderSide.BUY,
        amount: 10000,
      };

      const marketData = getLastMarketDataByInstrumentIdMock(instrumentId);

      userRepositoryMock.mockResolvedValue(getUserByIdMock(userId));
      instrumentsRepositoryMock.mockResolvedValue(getInstrumentByIdMock(instrumentId));
      marketDataRepositoryMock.mockResolvedValue(marketData);
      getOrdersRepositoryMock.mockResolvedValue(
        getOrdersByMock({ userId, status: EOrderStatus.FILLED }),
      );
      createOrderRepositoryMock.mockImplementation((order) => Promise.resolve(order));

      const result = await createOrderService(orderRequest);

      const expectedQuantity = Math.floor(orderRequest.amount / marketData!.close);

      expect(result).toMatchObject({
        datetime: expect.any(Date),
        instrumentId,
        price: expect.any(Number),
        side: orderRequest.side,
        size: expectedQuantity,
        status: EOrderStatus.FILLED,
        type: orderRequest.type,
        userId,
      });
    });
    test('should create a limit order with status new because the user wants to buy 10 units of an instrument and he has enough cash', async () => {
      const userId = 1;
      const instrumentId = 47;
      const orderRequest = {
        userId,
        instrumentId,
        type: EOrderType.LIMIT,
        side: EOrderSide.BUY,
        quantity: 10,
        priceLimit: 10000,
      };

      userRepositoryMock.mockResolvedValue(getUserByIdMock(userId));
      instrumentsRepositoryMock.mockResolvedValue(getInstrumentByIdMock(instrumentId));
      marketDataRepositoryMock.mockResolvedValue(getLastMarketDataByInstrumentIdMock(instrumentId));
      getOrdersRepositoryMock.mockResolvedValue(
        getOrdersByMock({ userId, status: EOrderStatus.FILLED }),
      );
      createOrderRepositoryMock.mockImplementation((order) => Promise.resolve(order));

      const result = await createOrderService(orderRequest);

      expect(result).toMatchObject({
        datetime: expect.any(Date),
        instrumentId,
        price: expect.any(Number),
        side: orderRequest.side,
        size: orderRequest.quantity,
        status: EOrderStatus.NEW,
        type: orderRequest.type,
        userId,
      });
    });
    test('should create a limit order with status new because the user wants to buy with an amount and he has enough cash', async () => {
      const userId = 1;
      const instrumentId = 47;
      const orderRequest = {
        userId,
        instrumentId,
        type: EOrderType.LIMIT,
        side: EOrderSide.BUY,
        amount: 10000,
        priceLimit: 10000,
      };

      const marketData = getLastMarketDataByInstrumentIdMock(instrumentId);
      userRepositoryMock.mockResolvedValue(getUserByIdMock(userId));
      instrumentsRepositoryMock.mockResolvedValue(getInstrumentByIdMock(instrumentId));
      marketDataRepositoryMock.mockResolvedValue(marketData);
      getOrdersRepositoryMock.mockResolvedValue(
        getOrdersByMock({ userId, status: EOrderStatus.FILLED }),
      );
      createOrderRepositoryMock.mockImplementation((order) => Promise.resolve(order));

      const result = await createOrderService(orderRequest);

      const expectedQuantity = Math.floor(orderRequest.amount / marketData!.close);

      expect(result).toMatchObject({
        datetime: expect.any(Date),
        instrumentId,
        price: expect.any(Number),
        side: orderRequest.side,
        size: expectedQuantity,
        status: EOrderStatus.NEW,
        type: orderRequest.type,
        userId,
      });
    });

    test('should create a marker order with status rejected because the user wants to buy instruments and he has not enough cash', async () => {
      const userId = 1;
      const instrumentId = 47;
      const orderRequest = {
        userId,
        instrumentId,
        type: EOrderType.MARKET,
        side: EOrderSide.BUY,
        quantity: 99999999999999,
      };

      userRepositoryMock.mockResolvedValue(getUserByIdMock(userId));
      instrumentsRepositoryMock.mockResolvedValue(getInstrumentByIdMock(instrumentId));
      marketDataRepositoryMock.mockResolvedValue(getLastMarketDataByInstrumentIdMock(instrumentId));
      getOrdersRepositoryMock.mockResolvedValue(
        getOrdersByMock({ userId, status: EOrderStatus.FILLED }),
      );
      createOrderRepositoryMock.mockImplementation((order) => Promise.resolve(order));

      const result = await createOrderService(orderRequest);

      expect(result).toMatchObject({
        datetime: expect.any(Date),
        instrumentId,
        price: expect.any(Number),
        side: orderRequest.side,
        size: orderRequest.quantity,
        status: EOrderStatus.REJECTED,
        type: orderRequest.type,
        userId,
      });
    });

    test('should create a limit order with status rejected because the user wants to buy instruments and he has not enough cash', async () => {
      const userId = 1;
      const instrumentId = 47;
      const orderRequest = {
        userId,
        instrumentId,
        type: EOrderType.LIMIT,
        side: EOrderSide.BUY,
        quantity: 99999999999999,
        priceLimit: 10000,
      };

      userRepositoryMock.mockResolvedValue(getUserByIdMock(userId));
      instrumentsRepositoryMock.mockResolvedValue(getInstrumentByIdMock(instrumentId));
      marketDataRepositoryMock.mockResolvedValue(getLastMarketDataByInstrumentIdMock(instrumentId));
      getOrdersRepositoryMock.mockResolvedValue(
        getOrdersByMock({ userId, status: EOrderStatus.FILLED }),
      );
      createOrderRepositoryMock.mockImplementation((order) => Promise.resolve(order));

      const result = await createOrderService(orderRequest);

      expect(result).toMatchObject({
        datetime: expect.any(Date),
        instrumentId,
        price: expect.any(Number),
        side: orderRequest.side,
        size: orderRequest.quantity,
        status: EOrderStatus.REJECTED,
        type: orderRequest.type,
        userId,
      });
    });

    test('should create a limit order with status rejected because the user wants to buy but price limit is less than market data', async () => {
      const userId = 1;
      const instrumentId = 47;
      const orderRequest = {
        userId,
        instrumentId,
        type: EOrderType.LIMIT,
        side: EOrderSide.BUY,
        quantity: 10,
        priceLimit: 10,
      };

      const marketData = getLastMarketDataByInstrumentIdMock(instrumentId);
      userRepositoryMock.mockResolvedValue(getUserByIdMock(userId));
      instrumentsRepositoryMock.mockResolvedValue(getInstrumentByIdMock(instrumentId));
      marketDataRepositoryMock.mockResolvedValue(marketData);
      getOrdersRepositoryMock.mockResolvedValue(
        getOrdersByMock({ userId, status: EOrderStatus.FILLED }),
      );  
      createOrderRepositoryMock.mockImplementation((order) => Promise.resolve(order));

      const result = await createOrderService(orderRequest);

      expect(result).toMatchObject({
        datetime: expect.any(Date),
        instrumentId,
        price: expect.any(Number),
        side: orderRequest.side,
        size: orderRequest.quantity,
        status: EOrderStatus.REJECTED,
        type: orderRequest.type,
        userId,
      });
    });

    test('should create a marker order with status filled because the user wants to sell 10 units of an instrument and he has enough instruments', async () => {
      const userId = 1;
      const instrumentId = 47;
      const orderRequest = {
        userId,
        instrumentId,
        type: EOrderType.MARKET,
        side: EOrderSide.SELL,
        quantity: 10,
      };

      userRepositoryMock.mockResolvedValue(getUserByIdMock(userId));
      instrumentsRepositoryMock.mockResolvedValue(getInstrumentByIdMock(instrumentId));
      marketDataRepositoryMock.mockResolvedValue(getLastMarketDataByInstrumentIdMock(instrumentId));
      getOrdersRepositoryMock.mockResolvedValue(
        getOrdersByMock({ userId, status: EOrderStatus.FILLED }),
      );
      createOrderRepositoryMock.mockImplementation((order) => Promise.resolve(order));

      const result = await createOrderService(orderRequest);

      expect(result).toMatchObject({
        datetime: expect.any(Date),
        instrumentId,
        price: expect.any(Number),
        side: orderRequest.side,
        size: orderRequest.quantity,
        status: EOrderStatus.FILLED,
        type: orderRequest.type,
        userId,
      });
    });

    test('should create a limit order with status new because the user wants to sell 10 units of an instrument and he has enough instruments', async () => {
      const userId = 1;
      const instrumentId = 47;
      const orderRequest = {
        userId,
        instrumentId,
        type: EOrderType.LIMIT,
        side: EOrderSide.SELL,
        quantity: 10,
        priceLimit: 1,
      };

      userRepositoryMock.mockResolvedValue(getUserByIdMock(userId));
      instrumentsRepositoryMock.mockResolvedValue(getInstrumentByIdMock(instrumentId));
      marketDataRepositoryMock.mockResolvedValue(getLastMarketDataByInstrumentIdMock(instrumentId));
      getOrdersRepositoryMock.mockResolvedValue(
        getOrdersByMock({ userId, status: EOrderStatus.FILLED }),
      );
      createOrderRepositoryMock.mockImplementation((order) => Promise.resolve(order));

      const result = await createOrderService(orderRequest);

      expect(result).toMatchObject({
        datetime: expect.any(Date),
        instrumentId,
        price: expect.any(Number),
        side: orderRequest.side,
        size: orderRequest.quantity,
        status: EOrderStatus.NEW,
        type: orderRequest.type,
        userId,
      });
    });

    test('should create a market order with status rejected because the user wants to sell more instruments than he has', async () => {
      const userId = 1;
      const instrumentId = 47;
      const orderRequest = {
        userId,
        instrumentId,
        type: EOrderType.MARKET,
        side: EOrderSide.SELL,
        quantity: 99999999999999,
      };

      userRepositoryMock.mockResolvedValue(getUserByIdMock(userId));
      instrumentsRepositoryMock.mockResolvedValue(getInstrumentByIdMock(instrumentId));
      marketDataRepositoryMock.mockResolvedValue(getLastMarketDataByInstrumentIdMock(instrumentId));
      getOrdersRepositoryMock.mockResolvedValue(
        getOrdersByMock({ userId, status: EOrderStatus.FILLED }),
      );
      createOrderRepositoryMock.mockImplementation((order) => Promise.resolve(order));

      const result = await createOrderService(orderRequest);

      expect(result).toMatchObject({
        datetime: expect.any(Date),
        instrumentId,
        price: expect.any(Number),
        side: orderRequest.side,
        size: orderRequest.quantity,
        status: EOrderStatus.REJECTED,
        type: orderRequest.type,
        userId,
      });
    });

    test('should create a limit order with status rejected because the user wants to sell more instruments than he has', async () => {
      const userId = 1;
      const instrumentId = 47;
      const orderRequest = {
        userId,
        instrumentId,
        type: EOrderType.LIMIT,
        side: EOrderSide.SELL,
        quantity: 99999999999999,
        priceLimit: 1,
      };

      userRepositoryMock.mockResolvedValue(getUserByIdMock(userId));
      instrumentsRepositoryMock.mockResolvedValue(getInstrumentByIdMock(instrumentId));
      marketDataRepositoryMock.mockResolvedValue(getLastMarketDataByInstrumentIdMock(instrumentId));
      getOrdersRepositoryMock.mockResolvedValue(
        getOrdersByMock({ userId, status: EOrderStatus.FILLED }),
      );
      createOrderRepositoryMock.mockImplementation((order) => Promise.resolve(order));

      const result = await createOrderService(orderRequest);

      expect(result).toMatchObject({
        datetime: expect.any(Date),
        instrumentId,
        price: expect.any(Number),
        side: orderRequest.side,
        size: orderRequest.quantity,
        status: EOrderStatus.REJECTED,
        type: orderRequest.type,
        userId,
      });
    });

    test('should create a limit order with status rejected because the user wants to sell but price limit is greater than market data', async () => {
      const userId = 1;
      const instrumentId = 47;
      const orderRequest = {
        userId,
        instrumentId,
        type: EOrderType.LIMIT,
        side: EOrderSide.SELL,
        quantity: 10,
        priceLimit: 1000,
      };

      const marketData = getLastMarketDataByInstrumentIdMock(instrumentId);
      userRepositoryMock.mockResolvedValue(getUserByIdMock(userId));
      instrumentsRepositoryMock.mockResolvedValue(getInstrumentByIdMock(instrumentId));
      marketDataRepositoryMock.mockResolvedValue(marketData);
      getOrdersRepositoryMock.mockResolvedValue(
        getOrdersByMock({ userId, status: EOrderStatus.FILLED }),
      );
      createOrderRepositoryMock.mockImplementation((order) => Promise.resolve(order));

      const result = await createOrderService(orderRequest);

      expect(result).toMatchObject({
        datetime: expect.any(Date),
        instrumentId,
        price: expect.any(Number),
        side: orderRequest.side,
        size: orderRequest.quantity,
        status: EOrderStatus.REJECTED,
        type: orderRequest.type,
        userId,
      });
    });

    test('should fail when user not found', async () => {
      const userId = 1;
      const instrumentId = 1;
      const orderRequest = {
        userId,
        instrumentId,
        type: EOrderType.MARKET,
        side: EOrderSide.BUY,
        quantity: 10,
      };

      userRepositoryMock.mockResolvedValue(null);

      try {
        await createOrderService(orderRequest);
      } catch (error) {
        expect(error).toEqual(notFoundError('User not found'));
      }
    });

    test('should fail when instrument not found', async () => {
      const userId = 1;
      const instrumentId = 1;
      const orderRequest = {
        userId,
        instrumentId,
        type: EOrderType.MARKET,
        side: EOrderSide.BUY,
        quantity: 10,
      };

      userRepositoryMock.mockResolvedValue(getUserByIdMock(userId));
      instrumentsRepositoryMock.mockResolvedValue(null);

      try {
        await createOrderService(orderRequest);
      } catch (error) {
        expect(error).toEqual(notFoundError('Instrument not found'));
      }
    });

    test('should fail when market data not found', async () => {
      const userId = 1;
      const instrumentId = 1;
      const orderRequest = {
        userId,
        instrumentId,
        type: EOrderType.MARKET,
        side: EOrderSide.BUY,
        quantity: 10,
      };

      userRepositoryMock.mockResolvedValue(getUserByIdMock(userId));
      instrumentsRepositoryMock.mockResolvedValue(getInstrumentByIdMock(instrumentId));
      marketDataRepositoryMock.mockResolvedValue(null);

      try {
        await createOrderService(orderRequest);
      } catch (error: any) {
        expect(error.internalCode).toEqual(NOT_FOUND_ERROR);
      }
    });

    test('should fail when create order function not found', async () => {
      const userId = 1;
      const instrumentId = 1;
      const orderRequest = {
        userId,
        instrumentId,
        type: EOrderType.LIMIT,
        side: EOrderSide.CASH_IN,
        quantity: 10,
      };

      userRepositoryMock.mockResolvedValue(getUserByIdMock(userId));
      instrumentsRepositoryMock.mockResolvedValue(getInstrumentByIdMock(instrumentId));
      marketDataRepositoryMock.mockResolvedValue(getLastMarketDataByInstrumentIdMock(instrumentId));
      getOrdersRepositoryMock.mockResolvedValue(
        getOrdersByMock({ userId, status: EOrderStatus.FILLED }),
      );

      try {
        await createOrderService(orderRequest);
      } catch (error: any) {
        expect(error.internalCode).toEqual(NOT_FOUND_ERROR);
      }
    });
  });
});
