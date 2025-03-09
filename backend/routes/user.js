// routes/users.js
const express = require('express');
const User = require('../models/User'); // Импортируем модель User
const router = express.Router();

// Создание нового пользователя
router.post('/', async (req, res) => {
    const { name, email } = req.body;

    // Проверка обязательных данных
    if (!name || !email) {
        return res.status(400).json({ error: 'Поля name и email обязательны для заполнения.' });
    }

    try {
        // Проверка уникальности email
        const existingUser  = await User.findOne({ where: { email } });
        if (existingUser ) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует.' });
        }

        const user = await User.create({ name, email });
        res.status(201).json(user);
    } catch (error) {
        console.error('Ошибка при создании пользователя:', error);
        res.status(500).json({ error: 'Ошибка при создании пользователя.' });
    }
});

// Получение списка пользователей
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        res.status(500).json({ error: 'Ошибка при получении пользователей.' });
    }
});

module.exports = router;
