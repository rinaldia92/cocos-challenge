import { EntityManager, In } from 'typeorm';
import { marketDataModel } from '../models/marketData';
import { appDataSource } from '../config/database';

export const getMarketDataByInstrumentIds = async (
  instrumentIds: number[],
  manager: EntityManager,
) => {
  const repository = manager
    ? manager.getRepository(marketDataModel)
    : appDataSource.getRepository(marketDataModel);
  return repository.find({
    where: {
      instrumentId: In(instrumentIds),
    },
  });
};

export const getMarketDataByInstrumentId = async (instrumentId: number, manager: EntityManager) => {
  const repository = manager
    ? manager.getRepository(marketDataModel)
    : appDataSource.getRepository(marketDataModel);
  return repository.findOne({
    where: {
      instrumentId,
    },
    order: {
      date: 'DESC',
    },
  });
};
