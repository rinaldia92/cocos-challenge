import Joi from "joi";
import { EOrderSide, EOrderType } from "../enums/orders";

export const ordersRequestSchema = Joi.object({
    userId: Joi.number().required(),
    instrumentId: Joi.number().required(),
    side: Joi.string().valid(EOrderSide.BUY, EOrderSide.SELL).required(),
    type: Joi.string().valid(EOrderType.LIMIT, EOrderType.MARKET).required(),
    quantity: Joi.number().required(),
    price: Joi.number().when('type', {
        is: EOrderType.LIMIT,
        then: Joi.required(),
        otherwise: Joi.optional()
    }),
});