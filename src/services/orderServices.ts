import { appDataSource } from '../config/database';
import { EOrderSide, EOrderType, EOrderStatus } from '../enums/orders';
import { IOrderRequest } from '../interfaces/orders';
import { ordersModel } from '../models/orders';
import { createOrderRepository, getOrdersBy, getOrdersByUserId } from '../repositories/orders';
import { getMarketDataByInstrumentId } from '../repositories/marketData';
import { notFoundError } from '../utils/errors';
import { EntityManager } from 'typeorm';
import { getInstrumentById } from '../repositories/instruments';
import { marketDataModel } from '../models/marketData';

const calculateSize = (amount: number, price: number) => {
  return Math.floor(amount / price);
};

const calculateAvailableCash = (orders: ordersModel[]) => {
  const totalCashIn = orders
    .filter((order) => order.side === EOrderSide.CASH_IN)
    .reduce((acc, order) => acc + order.size, 0);
  const totalCashOut = orders
    .filter((order) => order.side === EOrderSide.CASH_OUT)
    .reduce((acc, order) => acc + order.size, 0);
  const totalBuy = orders
    .filter((order) => order.side === EOrderSide.BUY)
    .reduce((acc, order) => acc + order.size, 0);
  const totalSell = orders
    .filter((order) => order.side === EOrderSide.SELL)
    .reduce((acc, order) => acc + order.size, 0);
  return totalCashIn - totalCashOut - totalBuy + totalSell;
};

const createBuyOrder = async ({
  orderRequest,
  orders,
  orderToCreate,
  marketData,
}: {
  orderRequest: IOrderRequest;
  orders: ordersModel[];
  orderToCreate: Partial<ordersModel>;
  marketData: marketDataModel;
}) => {
  const currentPrice = marketData.close;

  const availableCash = calculateAvailableCash(orders);

  let size = orderRequest.quantity;

  if (!size) {
    size = calculateSize(orderRequest.amount!, currentPrice);
  }

  const totalAmount = size * currentPrice;

  orderToCreate.size = size;
  orderToCreate.price = currentPrice;
  orderToCreate.datetime = new Date();

  if (totalAmount > availableCash) {
    orderToCreate.status = EOrderStatus.REJECTED;
  } else {
    if (orderRequest.type === EOrderType.MARKET) {
      orderToCreate.status = EOrderStatus.FILLED;
    } else {
      orderToCreate.status = EOrderStatus.NEW;
    }
  }
};

const createSellOrder = async ({
  orderRequest,
  orders,
  orderToCreate,
  marketData,
}: {
  orderRequest: IOrderRequest;
  orders: ordersModel[];
  orderToCreate: Partial<ordersModel>;
  marketData: marketDataModel;
}) => {
  const ordersToUse = orders.filter((order) => order.instrumentId === orderRequest.instrumentId);
  const netQuantity = ordersToUse.reduce((acc, order) => {
    if (order.side === EOrderSide.BUY) {
      console.log(`BUY order.size: ${order.size}`);
      return acc + order.size;
    }
    console.log(`SELL order.size: ${order.size}`);
    return acc - order.size;
  }, 0);

  orderToCreate.size = orderRequest.quantity!;
  orderToCreate.price = marketData.close;

  if (netQuantity < orderRequest.quantity!) {
    orderToCreate.status = EOrderStatus.REJECTED;
  } else {
    if (orderRequest.type === EOrderType.MARKET) {
      orderToCreate.status = EOrderStatus.FILLED;
    } else {
      orderToCreate.status = EOrderStatus.NEW;
    }
  }
};

const createOrderStrategy: { [key in EOrderSide]?: (args: any) => Promise<void> } = {
  [EOrderSide.BUY]: createBuyOrder,
  [EOrderSide.SELL]: createSellOrder,
};

export const createOrderService = async (orderRequest: IOrderRequest) => {
  return appDataSource.transaction(async (manager) => {
    const instrument = await getInstrumentById(orderRequest.instrumentId, manager);
    if (!instrument) {
      throw notFoundError('Instrument not found');
    }

    const marketData = await getMarketDataByInstrumentId(orderRequest.instrumentId, manager);
    if (!marketData) {
      throw notFoundError('Market data not found');
    }

    const orders = await getOrdersBy(
      { userId: orderRequest.userId, status: EOrderStatus.FILLED },
      manager,
    );

    const orderToCreate: Partial<ordersModel> = {
      userId: orderRequest.userId,
      instrumentId: orderRequest.instrumentId,
      type: orderRequest.type,
      side: orderRequest.side,
      datetime: new Date(),
    };

    const createOrderFunction = createOrderStrategy[orderRequest.side];

    if (!createOrderFunction) {
      throw notFoundError('Create order function not found');
    }

    await createOrderFunction({ orderRequest, orders, orderToCreate, marketData });

    const order = await createOrderRepository(orderToCreate, manager);
    return order;
  });
};
