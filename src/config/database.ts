import { DataSource, Logger } from 'typeorm';
import { config } from './index';
import { join } from 'path';
import { createNamedLogger } from '../utils/logger';

const isDevelopment = config.environment === 'development';

// Determinar el directorio base según el entorno
const baseDir = isDevelopment ? 'src' : 'dist';

class TypeORMPinoLogger implements Logger {
  private logger = createNamedLogger('TypeORM');

  logQuery(query: string, parameters?: any[]) {
    this.logger.info({ query, parameters }, 'Database query');
  }

  logQueryError(error: string | Error, query: string, parameters?: any[]) {
    this.logger.error({ error, query, parameters }, 'Database query error');
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.logger.warn({ time, query, parameters }, 'Slow database query');
  }

  logSchemaBuild(message: string) {
    this.logger.info(message, 'Schema build');
  }

  logMigration(message: string) {
    this.logger.info(message, 'Migration');
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    switch (level) {
      case 'log':
      case 'info':
        this.logger.info(message);
        break;
      case 'warn':
        this.logger.warn(message);
        break;
    }
  }
}

export const appDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: process.env.DB_NAME || 'cocos_db',
  synchronize: false,
  logging: true,
  logger: new TypeORMPinoLogger(),
  entities: [join(baseDir, 'models', '**', isDevelopment ? '*.ts' : '*.js')],
  migrations: [join(baseDir, 'migrations', '**', isDevelopment ? '*.ts' : '*.js')],
  ssl: {
    rejectUnauthorized: false, // Permite conexiones sin certificado SSL válido (solo para desarrollo)
  },
});
