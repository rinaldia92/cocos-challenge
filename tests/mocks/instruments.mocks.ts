import { instrumentsModel } from '../../src/models/instruments';

const instruments = [
  { id: 1, ticker: 'DYCA', name: 'Dycasa S.A.', type: 'ACCIONES' },
  { id: 2, ticker: 'CAPX', name: 'Capex S.A.', type: 'ACCIONES' },
  { id: 3, ticker: 'PGR', name: 'Phoenix Global Resources', type: 'ACCIONES' },
  { id: 4, ticker: 'MOLA', name: 'Molinos Agro S.A.', type: 'ACCIONES' },
  { id: 5, ticker: 'MIRG', name: 'Mirgor', type: 'ACCIONES' },
  { id: 6, ticker: 'PATA', name: 'Importadora y Exportadora de la Patagonia', type: 'ACCIONES' },
  { id: 7, ticker: 'TECO2', name: 'Telecom', type: 'ACCIONES' },
  { id: 8, ticker: 'FERR', name: 'Ferrum S.A.', type: 'ACCIONES' },
  { id: 9, ticker: 'SAMI', name: 'S.A San Miguel', type: 'ACCIONES' },
  { id: 10, ticker: 'IRCP', name: 'IRSA Propiedades Comerciales S.A.', type: 'ACCIONES' },
  { id: 11, ticker: 'GAMI', name: 'Boldt Gaming S.A.', type: 'ACCIONES' },
  { id: 12, ticker: 'DOME', name: 'Domec', type: 'ACCIONES' },
  { id: 13, ticker: 'INTR', name: 'Compañía Introductora de Buenos Aires S.A.', type: 'ACCIONES' },
  { id: 14, ticker: 'MTR', name: 'Matba Rofex S.A.', type: 'ACCIONES' },
  { id: 15, ticker: 'FIPL', name: 'Fiplasto', type: 'ACCIONES' },
  { id: 16, ticker: 'GARO', name: 'Garovaglio Y Zorraquín', type: 'ACCIONES' },
  { id: 17, ticker: 'SEMI', name: 'Molinos Juan Semino', type: 'ACCIONES' },
  { id: 18, ticker: 'HARG', name: 'Holcim (Argentina) S.A.', type: 'ACCIONES' },
  { id: 19, ticker: 'BPAT', name: 'Banco Patagonia', type: 'ACCIONES' },
  { id: 20, ticker: 'RIGO', name: 'Rigolleau S.A.', type: 'ACCIONES' },
  { id: 21, ticker: 'CVH', name: 'Cablevision Holding', type: 'ACCIONES' },
  { id: 22, ticker: 'BBAR', name: 'Banco Frances', type: 'ACCIONES' },
  { id: 23, ticker: 'LEDE', name: 'Ledesma', type: 'ACCIONES' },
  { id: 24, ticker: 'CELU', name: 'Celulosa Argentina S.A.', type: 'ACCIONES' },
  { id: 25, ticker: 'CECO2', name: 'Central Costanera', type: 'ACCIONES' },
  { id: 26, ticker: 'AGRO', name: 'Agrometal', type: 'ACCIONES' },
  { id: 27, ticker: 'AUSO', name: 'Autopistas del Sol', type: 'ACCIONES' },
  { id: 28, ticker: 'BHIP', name: 'Banco Hipotecario S.A.', type: 'ACCIONES' },
  { id: 29, ticker: 'BOLT', name: 'Boldt S.A.', type: 'ACCIONES' },
  { id: 30, ticker: 'CARC', name: 'Carboclor S.A.', type: 'ACCIONES' },
  { id: 31, ticker: 'BMA', name: 'Banco Macro S.A.', type: 'ACCIONES' },
  { id: 32, ticker: 'CRES', name: 'Cresud S.A.', type: 'ACCIONES' },
  { id: 33, ticker: 'EDN', name: 'Edenor S.A.', type: 'ACCIONES' },
  { id: 34, ticker: 'GGAL', name: 'Grupo Financiero Galicia', type: 'ACCIONES' },
  { id: 35, ticker: 'DGCU2', name: 'Distribuidora De Gas Cuyano S.A.', type: 'ACCIONES' },
  { id: 36, ticker: 'GBAN', name: 'Gas Natural Ban S.A.', type: 'ACCIONES' },
  { id: 37, ticker: 'CGPA2', name: 'Camuzzi Gas del Sur', type: 'ACCIONES' },
  { id: 38, ticker: 'CADO', name: 'Carlos Casado', type: 'ACCIONES' },
  { id: 39, ticker: 'GCLA', name: 'Grupo Clarin S.A.', type: 'ACCIONES' },
  { id: 40, ticker: 'GRIM', name: 'Grimoldi', type: 'ACCIONES' },
  { id: 41, ticker: 'RICH', name: 'Laboratorios Richmond', type: 'ACCIONES' },
  { id: 42, ticker: 'MOLI', name: 'Molinos Río de la Plata', type: 'ACCIONES' },
  { id: 43, ticker: 'VALO', name: 'BCO DE VALORES ACCIONES ORD.', type: 'ACCIONES' },
  { id: 44, ticker: 'TGNO4', name: 'Transportadora de Gas del Norte', type: 'ACCIONES' },
  { id: 45, ticker: 'LOMA', name: 'Loma Negra S.A.', type: 'ACCIONES' },
  { id: 46, ticker: 'IRSA', name: 'IRSA Inversiones y Representaciones S.A.', type: 'ACCIONES' },
  { id: 47, ticker: 'PAMP', name: 'Pampa Holding S.A.', type: 'ACCIONES' },
  { id: 48, ticker: 'TGSU2', name: 'Transportadora de Gas del Sur', type: 'ACCIONES' },
  { id: 49, ticker: 'TXAR', name: 'Ternium Argentina S.A', type: 'ACCIONES' },
  { id: 50, ticker: 'YPFD', name: 'Y.P.F. S.A.', type: 'ACCIONES' },
  { id: 51, ticker: 'MORI', name: 'Morixe Hermanos S.A.C.I.', type: 'ACCIONES' },
  { id: 52, ticker: 'INVJ', name: 'Inversora Juramento S.A.', type: 'ACCIONES' },
  { id: 53, ticker: 'POLL', name: 'Polledo S.A.', type: 'ACCIONES' },
  { id: 54, ticker: 'METR', name: 'MetroGAS S.A.', type: 'ACCIONES' },
  { id: 55, ticker: 'LONG', name: 'Longvie', type: 'ACCIONES' },
  { id: 56, ticker: 'SUPV', name: 'Grupo Supervielle S.A.', type: 'ACCIONES' },
  { id: 57, ticker: 'ROSE', name: 'Instituto Rosenbusch', type: 'ACCIONES' },
  { id: 58, ticker: 'OEST', name: 'Oeste Grupo Concesionario', type: 'ACCIONES' },
  { id: 59, ticker: 'COME', name: 'Sociedad Comercial Del Plata', type: 'ACCIONES' },
  { id: 60, ticker: 'CEPU', name: 'Central Puerto', type: 'ACCIONES' },
  { id: 61, ticker: 'ALUA', name: 'Aluar Aluminio Argentino S.A.I.C.', type: 'ACCIONES' },
  { id: 62, ticker: 'CTIO', name: 'Consultatio S.A.', type: 'ACCIONES' },
  { id: 63, ticker: 'TRAN', name: 'Transener S.A.', type: 'ACCIONES' },
  { id: 64, ticker: 'HAVA', name: 'Havanna Holding', type: 'ACCIONES' },
  { id: 65, ticker: 'BYMA', name: 'Bolsas y Mercados Argentinos S.A.', type: 'ACCIONES' },
  { id: 66, ticker: 'ARS', name: 'PESOS', type: 'MONEDA' },
];

export const getInstrumentsByIdsMock = (instrumentIds: number[]): instrumentsModel[] => {
  return instruments.filter((instrument) =>
    instrumentIds.includes(instrument.id),
  ) as instrumentsModel[];
};

export const getInstrumentByIdMock = (instrumentId: number): instrumentsModel => {
  return instruments.find((instrument) => instrument.id === instrumentId) as instrumentsModel;
};

export const getInstrumentsMock = ({
  ticker,
  name,
  limit = 10,
  page = 1,
}: {
  ticker?: string;
  name?: string;
  limit?: number;
  page?: number;
}): instrumentsModel[] => {
  let instrumentsToReturn = instruments;

  if (ticker) {
    instrumentsToReturn = instrumentsToReturn.filter((instrument) =>
      instrument.ticker.toUpperCase().includes(ticker.toUpperCase()),
    );
  }

  if (name) {
    instrumentsToReturn = instrumentsToReturn.filter((instrument) =>
      instrument.name.toUpperCase().includes(name.toUpperCase()),
    );
  }

  return instrumentsToReturn.slice((page - 1) * limit, page * limit) as instrumentsModel[];
};
