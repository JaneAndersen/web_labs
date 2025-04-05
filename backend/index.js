import express from 'express';
import dotenv from 'dotenv';   
import cors from 'cors';
import logger from './middlewares/logger.js';
import apiKeyMiddleware from './middlewares/apiKeyMiddleware.js';
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/event.js";
import usersRoutes from './routes/user.js'; 
import publicRoutes from './routes/public.js'; 
import { authenticate } from './config/db.js';
import { sequelize } from './config/db.js';
import Event from './models/Event.js';
import User from './models/User.js';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import passport from "passport";
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
                url: 'http://localhost:8080/api-docs',
            },
        ],
    },
    apis: ['./routes/*.js'], 
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

dotenv.config();

app.use(passport.initialize());
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use('/users', usersRoutes);
app.use('/public', publicRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json());
app.use(cors());
app.use(logger);
app.use(apiKeyMiddleware);

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