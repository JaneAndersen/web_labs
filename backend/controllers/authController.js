import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

export const register = async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: "Заполните все поля"});
    }

    try {
        const existingUser = await User.findOne({ where: {email}});
        if (existingUser) return res.status(400).json({ message: "Email уже используется"});

        const user = await User.create({ email, username, password });
        res.status(201).json({ message: "Регистрация прошла успешно"});
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера"})
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Заполните все поля" });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: "Неверный email или пароль" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Неверный email или пароль" });

        const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ accessToken });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

export default router;