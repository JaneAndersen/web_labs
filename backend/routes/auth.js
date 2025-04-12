import express from "express";
import dotenv from "dotenv";
import { register, login, refresh } from '../controllers/authController.js'
import apiKeyMiddleware from '../middlewares/apiKeyMiddleware.js';

dotenv.config();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Управление регистрацией и авторизацией
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     security:
 *      - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: Регистрация прошла успешно
 *       400:
 *         description: Заполните все поля или Email уже используется
 *       500:
 *         description: Ошибка сервера
 */

router.post("/register", apiKeyMiddleware, register)

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Вход пользователя
 *     tags: [Auth]
 *     security:
 *      - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Успешный вход, возвращает токен
 *       401:
 *         description: Неверный email или пароль
 *       500:
 *         description: Ошибка сервера
 */

router.post("/login", apiKeyMiddleware, login) 

/**
 * @swagger
 * /refresh:
 *   post:
 *     summary: Обновление Access Token
 *     tags: [Auth]
 *     security:
 *      - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *             required:
 *               - token
 *     responses:
 *       200:
 *         description: Успешное обновление Access Token, возвращает новый токен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "new-access-token-here"
 *       401:
 *         description: Не авторизован. Refresh Token не предоставлен.
 *       403:
 *         description: Запрещено. Refresh Token недействителен или истек.
 *       500:
 *         description: Ошибка сервера
 */
router.post("/refresh", apiKeyMiddleware, refresh) 

export default router;