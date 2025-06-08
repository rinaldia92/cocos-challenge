import { appDataSource } from "../config/database";
import { EOrderSide, EOrderType, EOrderStatus } from "../enums/orders";
import { IOrderRequest } from "../interfaces/orders";
import { ordersModel } from "../models/orders";
import { createOrderRepository, getOrdersByUserId } from "../repositories/orders";
import { getMarketDataByInstrumentId } from "../repositories/marketData";

const calculateSize = (amount: number, price: number) => {
    return Math.floor(amount / price);
}

const calculateAvailableCash = (orders: ordersModel[]) => {
    const ordersToUse = orders.filter(order => order.type === EOrderType.MARKET && order.status === EOrderStatus.FILLED);
    const totalCashIn = ordersToUse.filter(order => order.side === EOrderSide.CASH_IN).reduce((acc, order) => acc + order.size, 0);
    const totalCashOut = ordersToUse.filter(order => order.side === EOrderSide.CASH_OUT).reduce((acc, order) => acc + order.size, 0);
    const totalBuy = ordersToUse.filter(order => order.side === EOrderSide.BUY).reduce((acc, order) => acc + order.size, 0);
    const totalSell = ordersToUse.filter(order => order.side === EOrderSide.SELL).reduce((acc, order) => acc + order.size, 0);
    return totalCashIn - totalCashOut - totalBuy + totalSell;
}

export const createOrderService = async (orderRequest: IOrderRequest) => {
    await appDataSource.transaction(async (manager) => {
        const orders = await getOrdersByUserId(orderRequest.userId, manager);
        const marketData = await getMarketDataByInstrumentId(orderRequest.instrumentId, manager);

        const orderToCreate: Partial<ordersModel> = {
            userId: orderRequest.userId,
            instrumentId: orderRequest.instrumentId,
            type: orderRequest.type,
            side: orderRequest.side,
        }

        if (!marketData) {
            throw new Error('Market data not found');
        }

        const currentPrice = marketData.close;

        if (orderRequest.side === EOrderSide.BUY) {
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

            const order = await createOrderRepository(orderToCreate, manager);
            return order;
        }

        if (orderRequest.side === EOrderSide.SELL) {
            const ordersToUse = orders.filter(order => order.id === orderRequest.instrumentId);
            const netQuantity = ordersToUse.reduce((acc, order) => {
                if (order.side === EOrderSide.BUY) {
                    return acc + order.size;
                }
                return acc - order.size;
            }, 0);

            if (netQuantity < orderRequest.quantity!) {
                orderToCreate.status = EOrderStatus.REJECTED;
            } else {
                if (orderRequest.type === EOrderType.MARKET) {
                    orderToCreate.status = EOrderStatus.FILLED;
                } else {
                    orderToCreate.status = EOrderStatus.NEW;
                }
            }

            const order = await createOrderRepository(orderToCreate, manager);
            return order;
        }
    });
}