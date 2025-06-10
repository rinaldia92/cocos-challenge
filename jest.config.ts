import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testPathIgnorePatterns: ['node_modules', '.d.ts', '.js'],
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**'],
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
  coverageDirectory: 'coverage/apps',
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/tests/'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './coverage/apps',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true
    }]
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};

export default config;
