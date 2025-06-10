import { appDataSource } from '../src/config/database';
import '@jest/globals';

beforeAll(async () => {
  if (!appDataSource.isInitialized) {
    await appDataSource.initialize();
  }
});

afterAll(async () => {
  if (appDataSource.isInitialized) {
    await appDataSource.destroy();
  }
});

jest.setTimeout(10000); // 10 seconds
