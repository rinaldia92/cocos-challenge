import { EOrderSide, EOrderType } from "../enums/orders";

export interface IOrderRequest {
    userId: number;
    instrumentId: number;
    quantity?: number;
    amount?: number;
    price?: number;
    side: EOrderSide;
    type: EOrderType;
}