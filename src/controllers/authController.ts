import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@models/User';
import RefreshToken from '@models/RefreshToken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: 'Заполните все поля' });
    return;
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'Email уже используется' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({
      message: 'Регистрация прошла успешно! Ваш ID: ',
      userId: user.id,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Заполните все поля' });
    return;
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET не установлен в .env файле');
    res.status(500).json({ message: 'Ошибка конфигурации сервера' });
    return;
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Неверный email' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if (hashedPassword == user.password) {
      res.status(401).json({ message: 'Неверный пароль' });
      return;
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
    );
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );
    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.json({ accessToken, refreshToken });
    return;
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { token } = req.body;

  try {
    if (!token) {
      res.sendStatus(401).json({ message: 'Введите токен' });
      return;
    }

    const refreshToken = await RefreshToken.findOne({ where: { token } });
    if (!refreshToken) {
      res.sendStatus(403).json({ message: 'Токен не обнаружен' });
      return;
    }

    if (new Date() > refreshToken.expiresAt) {
      await RefreshToken.destroy({ where: { id: refreshToken.id } });
      res.sendStatus(403).json({ message: 'Токен недействителен' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET не установлен в .env файле');
      res.status(500).json({ message: 'Ошибка конфигурации сервера' });
      return;
    }

    const user = await User.findByPk(refreshToken.userId);
    if (!user) {
      res.status(401).json({ message: 'Пользователь не найден' });
      return;
    }
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
    );

    res.json({ accessToken: newAccessToken });
    return;
  } catch (error) {
    next(error);
  }
};

export default router;
