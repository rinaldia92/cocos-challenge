import { appDataSource } from './config/database';
import { config } from './config';
import app from './app';

const startServer = async () => {
  if (config.environment !== 'testing' && config.db.host) {
    try {
      await appDataSource.initialize();
      console.info('Database connection established');
    } catch (error) {
      console.error('Error connecting to database:', error);
      process.exit(1);
    }
  }

  app.listen(config.port, () => {
    console.info(`Server is running on port ${config.port}`);
  });
};

if (config.environment !== 'testing') {
  startServer();
}

export default app;
