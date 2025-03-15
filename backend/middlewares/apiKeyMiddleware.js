require('dotenv').config();

const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['api-key']; 

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: 'Доступ запрещен. Неверный API-ключ.' });
    }

    next();
};

module.exports = apiKeyMiddleware;
