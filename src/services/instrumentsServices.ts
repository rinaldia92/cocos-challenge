import { instrumentsModel } from "../models/instruments";
import { getInstrumentsRepository } from "../repositories/instruments";

const getInstrumentsService = async ({
    ticker,
    name,
    limit = 10,
    offset = 0,
}: {
    ticker?: string;
    name?: string;
    limit?: number;
    offset?: number;
}): Promise<instrumentsModel[]> => {
    const instruments = await getInstrumentsRepository({
        ticker,
        name,
        limit,
        offset,
    });
    return instruments;
}

export { getInstrumentsService };
