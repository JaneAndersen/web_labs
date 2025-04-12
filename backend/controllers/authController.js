import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Заполните все поля"});
    }

    try {
        const existingUser = await User.findOne({ where: {email}});
        if (existingUser) return res.status(400).json({ message: "Email уже используется"});

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "Регистрация прошла успешно"});
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Заполните все поля" });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: "Неверный email" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Неверный пароль" });

        const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        await RefreshToken.create({
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        res.json({ accessToken, refreshToken });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req, res) => {
    const { token } = req.body;

    try {
        if (!token) {
            return res.sendStatus(401).json({ message: "Введите токен" }); 
        }
    
        const refreshToken = await RefreshToken.findOne({ where: { token } });
        if (!refreshToken) {
            return res.sendStatus(403).json({ message: "Токен не обнаружен" }); 
        }
    
        if (new Date() > refreshToken.expiresAt) {
            await RefreshToken.destroy({ where: { id: refreshToken.id } }); 
            return res.sendStatus(403).json({ message: "Токен недействителен" }); 
        }
    
        const user = await User.findByPk(refreshToken.userId);
        const newAccessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
    
        res.json({ accessToken: newAccessToken });
    } catch(error) {
        next(error);
    }
    
};

export default router;