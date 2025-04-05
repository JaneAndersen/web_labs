import express from 'express';
import Event from '../models/Event.js';
const router = express.Router();

export const getEvents = async (req, res) => {
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
};

export const getEventById = async (req, res) => {
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
};

export const createEvent = async (req, res) => {
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
};

export const updateEvent = async (req, res) => {
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
};

export const deleteEvent = async (req, res) => {
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
};

export default router;

