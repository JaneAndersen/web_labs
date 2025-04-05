import express from 'express';
import User from '../models/User.js'; 
const router = express.Router();

export const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Поля name, email, password обязательны для заполнения.' });
    }

    try {
        const existingUser  = await User.findOne({ where: { email } });
        if (existingUser ) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует.' });
        }

        const user = await User.create({ name, email, password });
        res.status(201).json(user);
    } catch (error) {
        console.error('Ошибка при создании пользователя:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: 'Неверные данные' })
        }
        res.status(500).json({ error: 'Ошибка сервера.' });
    }
};

export const getUser = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        res.status(500).json({ error: 'Ошибка сервера.' });
    }
};

export default router;
