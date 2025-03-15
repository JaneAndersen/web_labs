const express = require('express');
const Event = require('../models/event');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Управление мероприятиями
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получение списка мероприятий
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Номер страницы
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Количество мероприятий на странице
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Список мероприятий
 *       500:
 *         description: Ошибка при получении мероприятий
 */
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit; 

    try {
        const { count, rows } = await Event.findAndCountAll({
            limit: limit,
            offset: offset,
        });

        res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            events: rows,
        });
    } catch (error) {
        console.error('Ошибка при получении мероприятий:', error);
        res.status(500).json({ error: 'Ошибка при получении мероприятий.' });
    }
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Получение мероприятия по ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID мероприятия
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Мероприятие найдено
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка при получении мероприятия
 */
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

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создание нового мероприятия
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               createdBy:
 *                 type: string
 *     responses:
 *       201:
 *         description: Мероприятие создано
 *       400:
 *         description: Ошибка валидации
 *       500:
 *         description: Ошибка при создании мероприятия
 */
router.post('/', async (req, res) => {
    const { title, description, date, createdBy } = req.body;

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

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Обновление мероприятия
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID мероприятия
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Мероприятие обновлено
 *       400:
 *         description: Ошибка валидации
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка при обновлении мероприятия
 */
router.put('/:id', async (req, res) => {
    const { title, description, date } = req.body;

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

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Удаление мероприятия
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID мероприятия
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Мероприятие успешно удалено
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка при удалении мероприятия
 */
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

