import express from 'express';
import { getEvents } from '../controllers/eventController';
import apiKeyMiddleware from '../middlewares/apiKeyMiddleware';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Public
 *   description: Публичные маршруты
 */
/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получение списка мероприятий
 *     tags: [Public]
 *     security:
 *      - ApiKeyAuth: []
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

router.get('/events', apiKeyMiddleware, getEvents);

export default router;
