import dotenv from 'dotenv'

dotenv.config();

const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['api-key']; 

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: 'Доступ запрещен. Неверный API-ключ.' });
    }

    next();
};

export default apiKeyMiddleware;
