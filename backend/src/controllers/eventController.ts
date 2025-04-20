import express, { Request, Response, NextFunction } from 'express';
import Event from '@models/Event';
import User from '@models/User';
const router = express.Router();

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit } = req.query;
    const pageNumber = page ? parseInt(page as string) : 1;
    const limitNumber = limit ? parseInt(limit as string) : 10;
    const offset = (pageNumber - 1) * limitNumber;

    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber < 1 ||
      limitNumber < 1
    ) {
      res.status(400).json({ error: 'Некорректные параметры page или limit' });
      return;
    }

    const { count, rows } = await Event.findAndCountAll({
      limit: limitNumber,
      offset: offset,
    });

    res.status(200).json({
      total: count,
      totalPages: Math.ceil(count / limitNumber),
      currentPage: page,
      events: rows,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      res.status(404).json({ error: 'Мероприятие не найдено.' });
      return;
    }
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const user = req.user as User;

  if (!user) {
    res.status(401).json({ error: 'Пользователь не авторизован.' });
    return;
  }

  const { title, description, date } = req.body;

  if (!title || !date) {
    res
      .status(400)
      .json({ error: 'Поля title и date обязательны для заполнения.' });
    return;
  }

  try {
    const event = await Event.create({
      title,
      description,
      date,
      createdBy: user.id,
    });
    res.status(201).json(event);
    return;
  } catch (error) {
    return next(error);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { title, description, date } = req.body;

  if (!title || !date) {
    res
      .status(400)
      .json({ error: 'Поля title и date обязательны для заполнения.' });
    return;
  }

  try {
    const [updated] = await Event.update(
      { title, description, date },
      {
        where: { id: req.params.id },
      },
    );

    if (!updated) {
      res.status(404).json({ error: 'Мероприятие не найдено.' });
      return;
    }
    res.status(200).json({ message: 'Мероприятие обновлено.' });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deleted = await Event.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      res.status(404).json({ error: 'Мероприятие не найдено.' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export default router;
