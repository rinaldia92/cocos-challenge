const instrumentsServiceMock = jest.fn();

import request from 'supertest';
import app from '../../src/app';
import '@jest/globals';
import { getInstrumentsMock } from '../mocks/instruments.mocks';
import { instrumentsModel } from '../../src/models/instruments';
import { databaseError } from '../../src/utils/errors';
import { httpStatus } from '../../src/constants/httpStatus';

jest.mock('../../src/services/instrumentsServices', () => ({
  getInstrumentsService: instrumentsServiceMock,
}));

describe('Instruments Controller', () => {
  describe('GET /instruments', () => {
    test('should first (default) instruments successfully', async () => {
      instrumentsServiceMock.mockResolvedValue(getInstrumentsMock({}));
      const response = await request(app).get('/v1/api/instruments');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      response.body.forEach((instrument: instrumentsModel) => {
        expect(instrument).toHaveProperty('id');
        expect(instrument).toHaveProperty('ticker');
        expect(instrument).toHaveProperty('name');
        expect(instrument).toHaveProperty('type');
      });
    });

    test('should get instruments by valid offset and limit', async () => {
      instrumentsServiceMock.mockResolvedValue(getInstrumentsMock({ page: 3, limit: 10 }));
      const response = await request(app).get('/v1/api/instruments?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      response.body.forEach((instrument: instrumentsModel) => {
        expect(instrument).toHaveProperty('id');
        expect(instrument).toHaveProperty('ticker');
        expect(instrument).toHaveProperty('name');
        expect(instrument).toHaveProperty('type');
      });
    });

    test('should get 0 instruments by valid limit and offset', async () => {
      instrumentsServiceMock.mockResolvedValue(getInstrumentsMock({ page: 10000, limit: 10000 }));
      const response = await request(app).get('/v1/api/instruments?page=10000&limit=10000');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });

    test('should get instruments by valid ticker', async () => {
      instrumentsServiceMock.mockResolvedValue(getInstrumentsMock({ ticker: 'DYCA' }));
      const response = await request(app).get('/v1/api/instruments?ticker=DYCA');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].ticker).toBe('DYCA');
    });

    test('should get instruments by valid name', async () => {
      instrumentsServiceMock.mockResolvedValue(getInstrumentsMock({ name: 'Dycasa S.A.' }));
      const response = await request(app).get('/v1/api/instruments?name=Dycasa S.A.');

      expect(response.status).toBe(200);
    });

    test('should get instruments by invalid ticker', async () => {
      instrumentsServiceMock.mockResolvedValue(getInstrumentsMock({ ticker: 'INVALID_TICKER' }));
      const response = await request(app).get('/v1/api/instruments?ticker=INVALID_TICKER');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });

    test('should fail with database error', async () => {
      instrumentsServiceMock.mockRejectedValue(databaseError('database_error'));
      const response = await request(app).get('/v1/api/instruments');

      expect(response.status).toBe(httpStatus.SERVICE_UNAVAILABLE.code);
      expect(response.body.message).toBe('database_error');
    });

    test('should fail with invalid schema', async () => {
      const response = await request(app).get('/v1/api/instruments?page=invalid-page');

      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY.code);
    });
  });
});
