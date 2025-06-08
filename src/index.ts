import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { appDataSource } from './config/database';
import { config } from './config';
import { errorMiddleware } from './middleware/errorMiddleware';
import routes from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use(errorMiddleware);

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API is running' });
});

app.use('/v1/api', routes);

app.listen(config.port, async () => {
  if (config.db.host) {
    try {
      await appDataSource.initialize();
      console.info('Database connection established');
    } catch (error) {
      console.error('Error connecting to database:', error);
      process.exit(1);
    }
  }
});
