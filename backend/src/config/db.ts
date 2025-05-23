import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    dialect: 'postgres',
    logging: false,
  },
);

const authenticate = async () => {
  try {
    await sequelize.authenticate();
    console.log('Соединение с базой данных успешно установлено!');
  } catch (error) {
    console.error('Не удалось установить соединение с базой данных:', error);
  }
};

export { sequelize, authenticate };
