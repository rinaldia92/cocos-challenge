"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../src/config/database");
require("@jest/globals");
beforeAll(async () => {
    if (!database_1.appDataSource.isInitialized) {
        await database_1.appDataSource.initialize();
    }
});
afterAll(async () => {
    if (database_1.appDataSource.isInitialized) {
        await database_1.appDataSource.destroy();
    }
});
jest.setTimeout(10000); // 10 seconds
