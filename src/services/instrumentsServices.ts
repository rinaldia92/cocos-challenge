import { instrumentsModel } from '../models/instruments';
import { getInstrumentsRepository } from '../repositories/instruments';
import { IInstrumentRequest } from '../interfaces/instruments';
import { createNamedLogger } from '../utils/logger';

const logger = createNamedLogger('InstrumentsServices');

const getInstrumentsService = async (params: IInstrumentRequest): Promise<instrumentsModel[]> => {
  logger.info(`Getting instruments with params: ${JSON.stringify(params)}`);
  const instruments = await getInstrumentsRepository(params);
  return instruments;
};

export { getInstrumentsService };
