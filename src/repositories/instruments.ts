import { In, EntityManager } from 'typeorm';
import { instrumentsModel } from '../models/instruments';
import { appDataSource } from '../config/database';

export const getInstrumentsRepository = async (
  {
    ticker,
    name,
    limit = 10,
    offset = 0,
  }: {
    ticker?: string;
    name?: string;
    limit?: number;
    offset?: number;
  },
  manager?: EntityManager,
) => {
  const repository = manager
    ? manager.getRepository(instrumentsModel)
    : appDataSource.getRepository(instrumentsModel);
  const instruments = await repository.find({
    where: {
      ticker: ticker,
      name: name,
    },
    skip: offset,
    take: limit,
  });
  return instruments;
};

export const getInstrumentsByIds = async (instrumentIds: number[], manager: EntityManager) => {
  const repository = manager
    ? manager.getRepository(instrumentsModel)
    : appDataSource.getRepository(instrumentsModel);
  const instruments = await repository.find({
    where: {
      id: In(instrumentIds),
    },
  });
  return instruments;
};

export const getInstrumentById = async (instrumentId: number, manager: EntityManager) => {
  const repository = manager
    ? manager.getRepository(instrumentsModel)
    : appDataSource.getRepository(instrumentsModel);
  const instrument = await repository.findOne({
    where: {
      id: instrumentId,
    },
  });
  return instrument;
};
