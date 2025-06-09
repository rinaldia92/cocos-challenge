import { EntityManager } from 'typeorm';
import { ordersModel } from '../models/orders';
import { appDataSource } from '../config/database';
import { databaseError } from '../utils/errors';

export const createOrderRepository = async (
  order: Partial<ordersModel>,
  manager: EntityManager,
) => {
  try {
    const repository = manager
      ? manager.getRepository(ordersModel)
      : appDataSource.getRepository(ordersModel);
    return repository.save(order);
  } catch (error: any) {
    throw databaseError(error.message, error);
  }
};

export const getOrdersBy = async (searchParams: any, manager: EntityManager) => {
  try {
    const repository = manager
      ? manager.getRepository(ordersModel)
      : appDataSource.getRepository(ordersModel);
    return repository.find({
      where: {
        ...searchParams,
      },
    });
  } catch (error: any) {
    throw databaseError(error.message, error);
  }
};

export const getOrdersByUserId = async (userId: number, manager: EntityManager) => {
  return getOrdersBy({ userId }, manager);
};
