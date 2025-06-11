import { EOrderSide, EOrderStatus } from '../enums/orders';
import { ordersModel } from '../models/orders';

export const round = (num: number, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
};

const calculateTotalBySide = (orders: ordersModel[], side: EOrderSide) => {
  return orders
    .filter((order) => order.side === side)
    .reduce((acc, order) => acc + order.size * order.price, 0);
};

export const calculateAvailableCash = (orders: ordersModel[]) => {
  const filledOrders = orders.filter((order) => order.status === EOrderStatus.FILLED);
  const totalCashIn = calculateTotalBySide(filledOrders, EOrderSide.CASH_IN);
  const totalCashOut = calculateTotalBySide(filledOrders, EOrderSide.CASH_OUT);
  const totalBuy = calculateTotalBySide(filledOrders, EOrderSide.BUY);
  const totalSell = calculateTotalBySide(filledOrders, EOrderSide.SELL);

  return totalCashIn - totalCashOut - totalBuy + totalSell;
};
