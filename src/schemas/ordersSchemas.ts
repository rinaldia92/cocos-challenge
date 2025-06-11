import Joi from 'joi';
import { EOrderSide, EOrderType } from '../enums/orders';

export const ordersRequestSchema = Joi.object({
  userId: Joi.number().required(),
  instrumentId: Joi.number().required(),
  side: Joi.string().valid(EOrderSide.BUY, EOrderSide.SELL).required(),
  type: Joi.string().valid(EOrderType.LIMIT, EOrderType.MARKET).required(),
  quantity: Joi.number().when('side', {
    is: EOrderSide.SELL,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  amount: Joi.number().when('type', {
    is: EOrderType.MARKET,
    then: Joi.when('side', {
      is: EOrderSide.SELL,
      then: Joi.optional(),
      otherwise: Joi.optional(),
    }),
    otherwise: Joi.optional(),
  }),
  priceLimit: Joi.number().when('type', {
    is: EOrderType.LIMIT,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
}).custom((value, helpers) => {
  if (value.side === EOrderSide.BUY && !value.quantity && !value.amount) {
    return helpers.error('any.custom', { 
      message: 'When side is BUY, either quantity or amount must be provided' 
    });
  }
  return value;
});
