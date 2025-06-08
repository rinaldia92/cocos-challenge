import { EntityManager } from 'typeorm';
import { ordersModel} from '../models/orders';
import { appDataSource } from '../config/database';

export const getOrdersByUserId = async (userId: number,manager: EntityManager) => {
    const repository = manager ? manager.getRepository(ordersModel) : appDataSource.getRepository(ordersModel);
    return repository.find({
        where: {
            userId,
        },
    });
}

export const createOrderRepository = async (order: Partial<ordersModel>, manager: EntityManager) => {
    const repository = manager ? manager.getRepository(ordersModel) : appDataSource.getRepository(ordersModel);
    return repository.save(order);
}