import { EntityManager } from 'typeorm';
import { userModel } from '../models/user';
import { appDataSource } from '../config/database';

export const getUserById = async (userId: number, manager?: EntityManager) => {
  const repository = manager
    ? manager.getRepository(userModel)
    : appDataSource.getRepository(userModel);
  const user = await repository.findOne({ where: { id: userId } });
  return user;
};
