import { getOrdersBy } from '../repositories/orders';
import { getMarketDataByInstrumentIds } from '../repositories/marketData';
import { appDataSource } from '../config/database';
import { ordersModel } from '../models/orders';
import { EOrderStatus, EOrderSide } from '../enums/orders';
import { EInstrumentType } from '../enums/instruments';
import { marketDataModel } from '../models/marketData';
import { getInstrumentsByIds } from '../repositories/instruments';
import { instrumentsModel } from '../models/instruments';
import { calculateAvailableCash, round } from '../utils/commons';
import { getUserById } from '../repositories/users';
import { notFoundError } from '../utils/errors';
import { IPortfolioResponse } from '../interfaces/porfolio';

const calculateAveragePrice = (orders: ordersModel[]) => {
  const buyOrders = orders.filter((order) => order.side === EOrderSide.BUY);
  const totalQuantity = buyOrders.reduce((acc, order) => acc + order.size, 0);
  const totalPrice = buyOrders.reduce((acc, order) => acc + order.size * order.price, 0);
  return totalQuantity > 0 ? totalPrice / totalQuantity : 0;
};

const calculatePosition = (
  orders: ordersModel[],
  instrument: instrumentsModel,
  marketData: marketDataModel[],
) => {
  const netQuantity = orders.reduce((acc, order) => {
    if (order.side === EOrderSide.BUY) {
      return acc + order.size;
    }
    return acc - order.size;
  }, 0);
  const averagePrice = calculateAveragePrice(orders);

  // revisar si se puede traer facilmente el ultimo market data por instrument desde typeorm
  const currentPrice = Number(
    marketData.sort((a, b) => b.date.getTime() - a.date.getTime())[0].close,
  );

  const totalValue = netQuantity * currentPrice;

  const pnlPercent = round(((currentPrice - averagePrice) / averagePrice) * 100);

  return {
    instrumentId: instrument.id,
    instrumentName: instrument.name,
    quantity: netQuantity,
    currentPrice,
    totalValue,
    pnlPercent,
  };
};

const calculatePositions = (
  orders: ordersModel[],
  instrumentIds: number[],
  instruments: instrumentsModel[],
  marketData: marketDataModel[],
) => {
  const positions = instrumentIds.map((instrumentId) => {
    const instrument = instruments.find((instrument) => instrument.id === instrumentId);
    const ordersByInstrument = orders.filter((order) => order.instrumentId === instrumentId);
    const marketDataByInstrument = marketData.filter(
      (marketData) => marketData.instrumentId === instrumentId,
    );
    const position = calculatePosition(ordersByInstrument, instrument!, marketDataByInstrument);
    return position;
  });

  return positions;
};

export const getPortfolioService = async (userId: number) => {
  const response: IPortfolioResponse = {
    availableCash: 0,
    positions: [],
    totalValue: 0,
  };

  await appDataSource.transaction(async (manager) => {
    const user = await getUserById(userId, manager);
    if (!user) {
      throw notFoundError(`user with id ${userId} not found`);
    }

    const orders = await getOrdersBy({ userId, status: EOrderStatus.FILLED }, manager);
    if (orders.length === 0) {
      return;
    }


    const instrumentIds = orders.map((order) => order.instrumentId);
    const uniqueInstrumentIds = [...new Set(instrumentIds)];
    const marketData = await getMarketDataByInstrumentIds(instrumentIds, manager);

    const instruments = await getInstrumentsByIds(instrumentIds, manager);

    const instrumentsMonedaIds = instruments
      .filter((instrument) => instrument.type === EInstrumentType.MONEDA)
      .map((instrument) => instrument.id);
    const intrumentsIdsToUse = uniqueInstrumentIds.filter(
      (instrumentId) => !instrumentsMonedaIds.includes(instrumentId),
    );

    const availableCash = calculateAvailableCash(orders);

    const positions = calculatePositions(orders, intrumentsIdsToUse, instruments, marketData);

    const totalValue =
      positions.reduce((acc, position) => acc + position.totalValue, 0) + availableCash;

    response.availableCash = availableCash;
    response.positions = positions;
    response.totalValue = totalValue;
  });
  return response;
};
