import express from 'express';
import { createUser, getUser } from '../controllers/userController.js';
import passport from '../config/passport.js'
const router = express.Router();
router.use(passport.authenticate("jwt", { session: false}));

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управление пользователями
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: Создание нового пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *       400:
 *         description: Ошибка валидации данных
 *       500:
 *         description: Ошибка сервера
 */

router.post('/', createUser)

/**
 * @swagger
 * /:
 *   get:
 *     summary: Получение списка пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Успешно получен список пользователей
 *       500:
 *         description: Ошибка сервера
 */

router.get('/', getUser)

export default router;
