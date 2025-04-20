import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from './middlewares/logger';
import apiKeyMiddleware from './middlewares/apiKeyMiddleware';
import authRoutes from './routes/auth';
import eventRoutes from './routes/event';
import usersRoutes from './routes/user';
import publicRoutes from './routes/public';
import { authenticate } from './config/db';
import { sequelize } from './config/db';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
const app = express();
const PORT = process.env.PORT || 8080;
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Event API',
      version: '1.0.0',
      description: 'API для работы с мероприятиями и пользователями',
    },
    servers: [
      {
        url: 'http://localhost:8080/',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'api-key',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

dotenv.config();

app.use(passport.initialize());
app.use(express.json());
app.use(cors());
app.use(logger);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(apiKeyMiddleware);
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/users', usersRoutes);
app.use('/public', publicRoutes);

app.use((err: SyntaxError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError) {
    res.status(400).json({ error: 'Неверный формат JSON' });
  }
  next(err);
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Сервер работает!' });
});

app.listen(PORT, (err) => {
  if (err) {
    console.error('Ошибка при запуске сервера:', err);
    return;
  }
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

authenticate();

const testDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Соединение с базой данных успешно установлено!');
    await syncModels();
  } catch (error) {
    console.error('Не удалось установить соединение с базой данных:', error);
  }
};

testDatabaseConnection();

const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Модели синхронизированы с базой данных!');
  } catch (error) {
    console.error('Ошибка при синхронизации моделей:', error);
  }
};

syncModels();
