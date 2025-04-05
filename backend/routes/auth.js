import express from "express";
import dotenv from "dotenv";
import { register, login } from '../controllers/authController.js'

dotenv.config();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Управление регистрацией и авторизацией
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Users]
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

router.post("/register", register)

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Вход пользователя
 *     tags: [Users]
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

router.post("/login", login) 

export default router;