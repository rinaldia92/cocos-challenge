import { appDataSource } from '../config/database';
import { EOrderSide, EOrderType, EOrderStatus } from '../enums/orders';
import { IOrderRequest } from '../interfaces/orders';
import { ordersModel } from '../models/orders';
import { createOrderRepository, getOrdersBy } from '../repositories/orders';
import { getLastMarketDataByInstrumentId } from '../repositories/marketData';
import { notFoundError } from '../utils/errors';
import { getInstrumentById } from '../repositories/instruments';
import { marketDataModel } from '../models/marketData';
import { getUserById } from '../repositories/users';
import { calculateAvailableCash } from '../utils/commons';
import { createNamedLogger } from '../utils/logger';

const logger = createNamedLogger('OrderServices');

const calculateSize = (amount: number, price: number) => {
  return Math.floor(amount / price);
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
  logger.info(`Creating buy order for user ${orderRequest.userId}`);
  const currentPrice = marketData.close;

  const availableCash = calculateAvailableCash(orders);

  logger.info(`Available cash: ${availableCash}`);

  let size = orderRequest.quantity;

  if (!size) {
    size = calculateSize(orderRequest.amount!, currentPrice);
  }

  const totalAmount = size * currentPrice;

  logger.info(`Total amount: ${totalAmount}`);

  orderToCreate.size = size;
  orderToCreate.price = currentPrice;
  orderToCreate.datetime = new Date();

  if (totalAmount > availableCash) {
    logger.debug(
      `Buy order rejected for user ${orderRequest.userId} because total amount is greater than available cash`,
    );
    orderToCreate.status = EOrderStatus.REJECTED;
    return;
  }

  if (orderRequest.type === EOrderType.LIMIT && orderToCreate.price > orderRequest.priceLimit!) {
    logger.debug(
      `Buy order rejected for user ${orderRequest.userId} because price is greater than price limit`,
    );
    orderToCreate.status = EOrderStatus.REJECTED;
    return;
  }

  if (orderRequest.type === EOrderType.MARKET) {
    logger.debug(`Buy order filled for user ${orderRequest.userId}`);
    orderToCreate.status = EOrderStatus.FILLED;
  } else {
    logger.debug(`Buy order new for user ${orderRequest.userId}`);
    orderToCreate.status = EOrderStatus.NEW;
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
  logger.info(`Creating sell order for user ${orderRequest.userId}`);
  const ordersToUse = orders.filter((order) => order.instrumentId === orderRequest.instrumentId);
  const netQuantity = ordersToUse.reduce((acc, order) => {
    if (order.side === EOrderSide.BUY) {
      return acc + order.size;
    }
    return acc - order.size;
  }, 0);

  orderToCreate.size = orderRequest.quantity!;
  orderToCreate.price = marketData.close;

  if (orderRequest.type === EOrderType.LIMIT && orderToCreate.price < orderRequest.priceLimit!) {
    logger.debug(
      `Sell order rejected for user ${orderRequest.userId} because price is less than price limit`,
    );
    orderToCreate.status = EOrderStatus.REJECTED;
    return;
  }

  if (netQuantity < orderRequest.quantity!) {
    logger.debug(
      `Sell order rejected for user ${orderRequest.userId} because net quantity is less than quantity`,
    );
    orderToCreate.status = EOrderStatus.REJECTED;
    return;
  }

  if (orderRequest.type === EOrderType.MARKET) {
    logger.debug(`Sell order filled for user ${orderRequest.userId}`);
    orderToCreate.status = EOrderStatus.FILLED;
  } else {
    logger.debug(`Sell order new for user ${orderRequest.userId}`);
    orderToCreate.status = EOrderStatus.NEW;
  }
};

const createOrderStrategy: { [key in EOrderSide]?: (args: any) => Promise<void> } = {
  [EOrderSide.BUY]: createBuyOrder,
  [EOrderSide.SELL]: createSellOrder,
};

export const createOrderService = async (orderRequest: IOrderRequest) => {
  return appDataSource.transaction(async (manager) => {
    logger.info(`Creating order for user ${orderRequest.userId}`);

    logger.debug(`Getting user ${orderRequest.userId}`);
    const user = await getUserById(orderRequest.userId, manager);
    if (!user) {
      throw notFoundError('User not found');
    }

    logger.debug(`Getting instrument ${orderRequest.instrumentId}`);
    const instrument = await getInstrumentById(orderRequest.instrumentId, manager);
    if (!instrument) {
      throw notFoundError('Instrument not found');
    }

    logger.debug(`Getting market data for instrument ${orderRequest.instrumentId}`);
    const marketData = await getLastMarketDataByInstrumentId(orderRequest.instrumentId, manager);
    if (!marketData) {
      throw notFoundError('Market data not found');
    }

    logger.debug(`Getting orders for user ${orderRequest.userId}`);
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
    logger.info(`Order created for user ${orderRequest.userId}: ${JSON.stringify(order)}`);
    return order;
  });
};
