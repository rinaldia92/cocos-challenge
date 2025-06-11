import { instrumentsModel } from '../models/instruments';
import { getInstrumentsRepository } from '../repositories/instruments';
import { IInstrumentRequest } from '../interfaces/instruments';

const getInstrumentsService = async (params: IInstrumentRequest): Promise<instrumentsModel[]> => {
  const instruments = await getInstrumentsRepository(params);
  return instruments;
};

export { getInstrumentsService };
