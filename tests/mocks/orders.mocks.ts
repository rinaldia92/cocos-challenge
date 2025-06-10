import { EOrderType, EOrderSide, EOrderStatus } from '../../src/enums/orders';
import { ordersModel } from '../../src/models/orders';

const orders = [
  {
    id: 1,
    instrumentId: 66,
    userId: 1,
    size: 1000000,
    price: 1.0,
    type: EOrderType.MARKET,
    side: EOrderSide.CASH_IN,
    status: EOrderStatus.FILLED,
    createdAt: new Date('2023-07-12 12:11:20.000000'),
  },
  {
    id: 2,
    instrumentId: 47,
    userId: 1,
    size: 50,
    price: 930.0,
    type: EOrderType.MARKET,
    side: EOrderSide.BUY,
    status: EOrderStatus.FILLED,
    createdAt: new Date('2023-07-12 12:31:20.000000'),
  },
  {
    id: 3,
    instrumentId: 47,
    userId: 1,
    size: 50,
    price: 920.0,
    type: EOrderType.LIMIT,
    side: EOrderSide.BUY,
    status: EOrderStatus.CANCELLED,
    createdAt: new Date('2023-07-12 14:21:20.000000'),
  },
  {
    id: 4,
    instrumentId: 47,
    userId: 1,
    size: 10,
    price: 940.0,
    type: EOrderType.MARKET,
    side: EOrderSide.SELL,
    status: EOrderStatus.FILLED,
    createdAt: new Date('2023-07-12 14:51:20.000000'),
  },
  {
    id: 5,
    instrumentId: 45,
    userId: 1,
    size: 50,
    price: 710.0,
    type: EOrderType.LIMIT,
    side: EOrderSide.BUY,
    status: EOrderStatus.NEW,
    createdAt: new Date('2023-07-12 15:14:20.000000'),
  },
  {
    id: 6,
    instrumentId: 47,
    userId: 1,
    size: 100,
    price: 950.0,
    type: EOrderType.MARKET,
    side: EOrderSide.SELL,
    status: EOrderStatus.REJECTED,
    createdAt: new Date('2023-07-12 16:11:20.000000'),
  },
  {
    id: 7,
    instrumentId: 31,
    userId: 1,
    size: 60,
    price: 1500.0,
    type: EOrderType.LIMIT,
    side: EOrderSide.BUY,
    status: EOrderStatus.NEW,
    createdAt: new Date('2023-07-13 11:13:20.000000'),
  },
  {
    id: 8,
    instrumentId: 66,
    userId: 1,
    size: 100000,
    price: 1.0,
    type: EOrderType.MARKET,
    side: EOrderSide.CASH_OUT,
    status: EOrderStatus.FILLED,
    createdAt: new Date('2023-07-13 12:31:20.000000'),
  },
  {
    id: 9,
    instrumentId: 31,
    userId: 1,
    size: 20,
    price: 1540.0,
    type: EOrderType.LIMIT,
    side: EOrderSide.BUY,
    status: EOrderStatus.FILLED,
    createdAt: new Date('2023-07-13 12:51:20.000000'),
  },
  {
    id: 10,
    instrumentId: 54,
    userId: 1,
    size: 500,
    price: 250.0,
    type: EOrderType.MARKET,
    side: EOrderSide.BUY,
    status: EOrderStatus.FILLED,
    createdAt: new Date('2023-07-13 14:11:20.000000'),
  },
  {
    id: 11,
    instrumentId: 31,
    userId: 1,
    size: 30,
    price: 1530.0,
    type: EOrderType.MARKET,
    side: EOrderSide.SELL,
    status: EOrderStatus.FILLED,
    createdAt: new Date('2023-07-13 15:13:20.000000'),
  },
];

export const getOrdersByUserIdMock = (userId: number): ordersModel[] => {
  return orders.filter((order) => order.userId === userId) as unknown as ordersModel[];
};

type OrderSearchParams = {
  userId?: number;
  instrumentId?: number;
  status?: EOrderStatus;
  type?: EOrderType;
  side?: EOrderSide;
};

export const getOrdersByMock = (searchParams: OrderSearchParams): Partial<ordersModel>[] => {
  return orders.filter((order) => {
    return Object.keys(searchParams).every((key) => {
      return order[key as keyof typeof order] === searchParams[key as keyof OrderSearchParams];
    });
  });
};
