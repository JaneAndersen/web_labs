import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const apiKey = req.headers['api-key'];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    res.status(403).json({ error: 'Доступ запрещен. Неверный API-ключ.' });
  }
  next();
};

export default apiKeyMiddleware;
