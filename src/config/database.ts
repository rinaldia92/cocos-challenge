import { DataSource } from 'typeorm';
import { config } from './index';

export const appDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: process.env.DB_NAME || 'cocos_db',
  synchronize: false,
  logging: ['query'],
  entities: ['dist/models/**/*.js'],
  migrations: ['dist/migrations/**/*.js'],
  ssl: {
    rejectUnauthorized: false, // Permite conexiones sin certificado SSL válido (solo para desarrollo)
  },
});
