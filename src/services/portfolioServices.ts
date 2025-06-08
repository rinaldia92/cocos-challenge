import { EntityManager } from "typeorm";

import { getOrdersByUserId } from "../repositories/orders";
import { getMarketDataByInstrumentIds } from "../repositories/marketData";
import { appDataSource } from '../config/database';
import { ordersModel } from "../models/orders";
import { EOrderStatus, EOrderType, EOrderSide } from "../enums/orders";
import { marketDataModel } from "../models/marketData";
import { getInstrumentsByIds } from "../repositories/instruments";
import { instrumentsModel } from "../models/instruments";

const calculateAvailableCash = (orders: ordersModel[]) => {
    const ordersToUse = orders.filter(order => order.type === EOrderType.MARKET && order.status === EOrderStatus.FILLED);
    const totalCashIn = ordersToUse.filter(order => order.side === EOrderSide.CASH_IN).reduce((acc, order) => acc + order.size, 0);
    const totalCashOut = ordersToUse.filter(order => order.side === EOrderSide.CASH_OUT).reduce((acc, order) => acc + order.size, 0);

    return totalCashIn - totalCashOut;
}

const calculateAveragePrice = (orders: ordersModel[]) => {
    const totalQuantity = orders.reduce((acc, order) => acc + order.size, 0);
    const totalPrice = orders.reduce((acc, order) => acc + order.size * order.price, 0);
    return totalPrice / totalQuantity;
}

const calculatePosition = (orders: ordersModel[], instrument: instrumentsModel, marketData: marketDataModel[]) => {
    const ordersToUse = orders.filter(order => order.status === EOrderStatus.FILLED);
    const netQuantity = ordersToUse.reduce((acc, order) => {
        if (order.side === EOrderSide.BUY) {
            return acc + order.size;
        }
        return acc - order.size;
    }, 0);
    const averagePrice = calculateAveragePrice(ordersToUse);

    const currentPrice = marketData.sort((a, b) => a.date.getTime() - b.date.getTime())[0].close;

    const totalValue = netQuantity * currentPrice;

    const pnlPercent = ((currentPrice - averagePrice) / averagePrice) * 100;

    return {
        instrumentId: instrument.id,
        instrumentName: instrument.name,
        quantity: netQuantity,
        currentPrice,
        totalValue,
        pnlPercent,
    }
}

const calculatePositions = (orders: ordersModel[], instrumentIds: number[], instruments: instrumentsModel[], marketData: marketDataModel[]) => {
    const positions = instrumentIds.map(instrumentId => {
        const instrument = instruments.find(item => item.id === instrumentId);
        const ordersByInstrument = orders.filter(order => order.instrumentId === instrumentId);
        const marketDataByInstrument = marketData.filter(item => item.instrumentId === instrumentId);
        const position = calculatePosition(ordersByInstrument, instrument!, marketDataByInstrument);
        return position;
    })

    return positions;
}

export const getPortfolioService = async (userId: number) => {

    const response: any = {}

    await appDataSource.transaction(async (manager) => {
        const orders = await getOrdersByUserId(userId,manager);
        const instrumentIds = orders.map(order => order.instrumentId);
        const marketData = await getMarketDataByInstrumentIds(instrumentIds,manager);
        const instruments = await getInstrumentsByIds(instrumentIds,manager);

        const availableCash = calculateAvailableCash(orders);
        const positions = calculatePositions(orders, instrumentIds, instruments, marketData);
        const totalValue = positions.reduce((acc, position) => acc + position.totalValue, 0) + availableCash;

        response['availableCash'] = availableCash;
        response['positions'] = positions;
        response['totalValue'] = totalValue;
    });
    return response;
}
