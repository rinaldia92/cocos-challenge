import { EntityManager, QueryRunner } from 'typeorm';
import { appDataSource } from '../../src/config/database';

const mockQueryRunner = {
  connect: jest.fn().mockResolvedValue(undefined),
  startTransaction: jest.fn().mockResolvedValue(undefined),
  commitTransaction: jest.fn().mockResolvedValue(undefined),
  rollbackTransaction: jest.fn().mockResolvedValue(undefined),
  release: jest.fn().mockResolvedValue(undefined),
} as unknown as jest.Mocked<QueryRunner>;

export const mockEntityManager = {
  queryRunner: mockQueryRunner,
  transaction: jest.fn().mockImplementation(async (cb) => {
    try {
      await mockQueryRunner.startTransaction();
      const result = await cb(mockEntityManager as EntityManager);
      await mockQueryRunner.commitTransaction();
      return result;
    } catch (error) {
      await mockQueryRunner.rollbackTransaction();
      throw error;
    } finally {
      await mockQueryRunner.release();
    }
  }),
} as unknown as jest.Mocked<EntityManager>;

export const setupDatabaseMock = () => {
  const transactionMock = jest.fn().mockImplementation(async (cb) => {
    return await cb(mockEntityManager);
  });

  jest.spyOn(appDataSource, 'transaction').mockImplementation(transactionMock);

  return {
    transactionMock,
    mockEntityManager,
    mockQueryRunner,
  };
};

export const clearDatabaseMocks = () => {
  jest.clearAllMocks();
};
