import { DataSource } from 'typeorm';
import { config } from './index';
import { join } from 'path';

const isDevelopment = config.environment === 'development';

// Determinar el directorio base según el entorno
const baseDir = isDevelopment ? 'src' : 'dist';

export const appDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: process.env.DB_NAME || 'cocos_db',
  synchronize: false,
  logging: ['query'],
  entities: [join(baseDir, 'models', '**', isDevelopment ? '*.ts' : '*.js')],
  migrations: [join(baseDir, 'migrations', '**', isDevelopment ? '*.ts' : '*.js')],
  ssl: {
    rejectUnauthorized: false, // Permite conexiones sin certificado SSL válido (solo para desarrollo)
  },
});
