import { DataSource } from 'typeorm';
import { config } from './index';

const isDevelopment = config.environment === 'development';

export const appDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: process.env.DB_NAME || 'cocos_db',
  synchronize: false,
  logging: ['query'],
  entities: isDevelopment ? ['src/models/**/*.ts'] : ['dist/models/**/*.js'],
  migrations: isDevelopment ? ['src/migrations/**/*.ts'] : ['dist/migrations/**/*.js'],
  ssl: {
    rejectUnauthorized: false, // Permite conexiones sin certificado SSL válido (solo para desarrollo)
  },
});
