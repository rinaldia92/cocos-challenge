import { In, EntityManager, Like } from 'typeorm';
import { instrumentsModel } from '../models/instruments';
import { appDataSource } from '../config/database';
import { IInstrumentRequest } from '../interfaces/instruments';

export const getInstrumentsRepository = async (
  { ticker, name, limit = 10, page = 1 }: IInstrumentRequest,
  manager?: EntityManager,
) => {
  const repository = manager
    ? manager.getRepository(instrumentsModel)
    : appDataSource.getRepository(instrumentsModel);
  const instruments = await repository.find({
    where: {
      ...(ticker && { ticker: Like(`%${ticker.toUpperCase()}%`) }),
      ...(name && { name: Like(`%${name}%`) }),
    },
    skip: (page - 1) * limit,
    take: limit,
    order: {
      id: 'ASC',
    },
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
