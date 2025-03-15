const express = require('express');
const User = require('../models/User'); 
const router = express.Router();

router.post('/', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Поля name и email обязательны для заполнения.' });
    }

    try {
        const existingUser  = await User.findOne({ where: { email } });
        if (existingUser ) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует.' });
        }

        const user = await User.create({ name, email });
        res.status(201).json(user);
    } catch (error) {
        console.error('Ошибка при создании пользователя:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: 'Неверные данные' })
        }
        res.status(500).json({ error: 'Ошибка при создании пользователя.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        res.status(500).json({ error: 'Ошибка сервера.' });
    }
});

module.exports = router;
