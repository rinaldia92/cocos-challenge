import { instrumentsModel } from '../models/instruments';
import { getInstrumentsRepository } from '../repositories/instruments';

const getInstrumentsService = async ({
  ticker,
  name,
  limit = 10,
  page = 1,
}: {
  ticker?: string;
  name?: string;
  limit?: number;
  page?: number;
}): Promise<instrumentsModel[]> => {
  const instruments = await getInstrumentsRepository({
    ticker,
    name,
    limit,
    page,
  });
  return instruments;
};

export { getInstrumentsService };
