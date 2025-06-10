import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { errorMiddleware } from './middleware/errorMiddleware';
import { swaggerSpec } from './config/swagger';
import routes from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API is running' });
});

// API Routes with v1 prefix
app.use('/v1/api', routes);

app.use(errorMiddleware);

export default app;
