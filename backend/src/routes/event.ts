import express from 'express';
import {
  createEvent,
  deleteEvent,
  getEventById,
  updateEvent,
} from '../controllers/eventController';
import passport from '../config/passport';
import apiKeyMiddleware from '../middlewares/apiKeyMiddleware';
const router = express.Router();
router.use(passport.authenticate('jwt', { session: false }));
/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Управление мероприятиями
 */

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Получение мероприятия по ID
 *     tags: [Events]
 *     security:
 *      - ApiKeyAuth: []
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

router.get('/:id', apiKeyMiddleware, getEventById);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создание нового мероприятия
 *     tags: [Events]
 *     security:
 *      - ApiKeyAuth: []
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

router.post('/', apiKeyMiddleware, createEvent);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Обновление мероприятия
 *     tags: [Events]
 *     security:
 *      - ApiKeyAuth: []
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

router.put('/:id', apiKeyMiddleware, updateEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Удаление мероприятия
 *     tags: [Events]
 *     security:
 *      - ApiKeyAuth: []
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

router.delete('/:id', apiKeyMiddleware, deleteEvent);

export default router;
