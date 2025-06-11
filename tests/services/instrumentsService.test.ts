const instrumentsRepositoryMock = jest.fn();

import '@jest/globals';
import { getInstrumentsService } from '../../src/services/instrumentsServices';
import { getInstrumentsMock } from '../mocks/instruments.mocks';
import { instrumentsModel } from '../../src/models/instruments';
import { databaseError } from '../../src/utils/errors';

jest.mock('../../src/repositories/instruments', () => ({
  getInstrumentsRepository: instrumentsRepositoryMock,
}));

describe('Instruments Service', () => {
  describe('getInstrumentsService', () => {
    test('should first (default) instruments successfully', async () => {
      instrumentsRepositoryMock.mockResolvedValue(getInstrumentsMock({}));
      const response = await getInstrumentsService({});

      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBeGreaterThan(0);

      response.forEach((instrument: instrumentsModel) => {
        expect(instrument).toHaveProperty('id');
        expect(instrument).toHaveProperty('ticker');
        expect(instrument).toHaveProperty('name');
        expect(instrument).toHaveProperty('type');
      });
    });

    test('should get instruments by valid offset and limit', async () => {
      instrumentsRepositoryMock.mockResolvedValue(getInstrumentsMock({ page: 3, limit: 10 }));
      const response = await getInstrumentsService({ page: 1, limit: 10 });

      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBeGreaterThan(0);

      response.forEach((instrument: instrumentsModel) => {
        expect(instrument).toHaveProperty('id');
        expect(instrument).toHaveProperty('ticker');
        expect(instrument).toHaveProperty('name');
        expect(instrument).toHaveProperty('type');
      });
    });

    test('should get 0 instruments by valid limit and offset', async () => {
      instrumentsRepositoryMock.mockResolvedValue(
        getInstrumentsMock({ page: 10000, limit: 10000 }),
      );
      const response = await getInstrumentsService({ page: 10000, limit: 10000 });

      expect(response.length).toBe(0);
    });

    test('should get instruments by valid ticker', async () => {
      instrumentsRepositoryMock.mockResolvedValue(getInstrumentsMock({ ticker: 'DYCA' }));
      const response = await getInstrumentsService({ ticker: 'DYCA' });

      expect(response.length).toBe(1);
      expect(response[0].ticker).toBe('DYCA');
    });

    test('should get instruments by valid name', async () => {
      instrumentsRepositoryMock.mockResolvedValue(getInstrumentsMock({ name: 'Dycasa S.A.' }));
      const response = await getInstrumentsService({ name: 'Dycasa S.A.' });

      expect(response.length).toBeGreaterThan(0);
    });

    test('should get instruments by invalid ticker', async () => {
      instrumentsRepositoryMock.mockResolvedValue(getInstrumentsMock({ ticker: 'INVALID_TICKER' }));
      const response = await getInstrumentsService({ ticker: 'INVALID_TICKER' });

      expect(response.length).toBe(0);
    });

    test('should fail with database error', async () => {
      instrumentsRepositoryMock.mockRejectedValue(databaseError('database_error'));
      try {
        await getInstrumentsService({});
      } catch (error) {
        expect(error).toStrictEqual(databaseError('database_error'));
      }
    });
  });
});
