import express, { Request, Response } from 'express';
import cors from 'cors';
import { errorMiddleware } from './middleware/errorMiddleware';
import routes from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API is running' });
});

app.use('/v1/api', routes);

// Error handling middleware (debe ir después de las rutas)
app.use(errorMiddleware);

export default app; 