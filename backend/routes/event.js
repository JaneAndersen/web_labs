// routes/events.js
const express = require('express');
const Event = require('../models/event'); // Импортируем модель Event
const router = express.Router();

// Получение списка всех мероприятий
router.get('/', async (req, res) => {
    try {
        const events = await Event.findAll();
        res.status(200).json(events);
    } catch (error) {
        console.error('Ошибка при получении мероприятий:', error);
        res.status(500).json({ error: 'Ошибка при получении мероприятий.' });
    }
});

// Получение одного мероприятия по ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Мероприятие не найдено.' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error('Ошибка при получении мероприятия:', error);
        res.status(500).json({ error: 'Ошибка при получении мероприятия.' });
    }
});

// Создание мероприятия
router.post('/', async (req, res) => {
    const { title, description, date, createdBy } = req.body;

    // Проверка обязательных данных
    if (!title || !date || !createdBy) {
        return res.status(400).json({ error: 'Поля title, date и createdBy обязательны для заполнения.' });
    }

    try {
        const event = await Event.create({ title, description, date, createdBy });
        res.status(201).json(event);
    } catch (error) {
        console.error('Ошибка при создании мероприятия:', error);
        res.status(500).json({ error: 'Ошибка при создании мероприятия.' });
    }
});

// Обновление мероприятия
router.put('/:id', async (req, res) => {
    const { title, description, date } = req.body;

    // Проверка обязательных данных
    if (!title || !date) {
        return res.status(400).json({ error: 'Поля title и date обязательны для заполнения.' });
    }

    try {
        const [updated] = await Event.update({ title, description, date }, {
            where: { id: req.params.id }
        });

        if (!updated) {
            return res.status(404).json({ error: 'Мероприятие не найдено.' });
        }
        res.status(200).json({ message: 'Мероприятие обновлено.' });
    } catch (error) {
        console.error('Ошибка при обновлении мероприятия:', error);
        res.status(500).json({ error: 'Ошибка при обновлении мероприятия.' });
    }
});

// Удаление мероприятия
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Event.destroy({
            where: { id: req.params.id }
        });

        if (!deleted) {
            return res.status(404).json({ error: 'Мероприятие не найдено.' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Ошибка при удалении мероприятия:', error);
        res.status(500).json({ error: 'Ошибка при удалении мероприятия.' });
    }
});

module.exports = router;
