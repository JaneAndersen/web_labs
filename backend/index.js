const express = require('express');
const dotenv = require('dotenv');   
const cors = require('cors');
const eventsRouter = require('./routes/event');
const usersRouter = require('./routes/user'); // Импортируем маршруты мероприятий
const app = express();
const PORT = process.env.PORT || 8080;
const { authenticate } = require('./config/db');
const { sequelize } = require('./config/db');
const Event = require('./models/event');
const User = require('./models/User');

dotenv.config();

app.use(express.json());
app.use(cors());
app.use('/events', eventsRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => {
    res.json({ message: 'Сервер работает!' });
});

app.listen(PORT, (err) => {
    if (err) {
        console.error('Ошибка при запуске сервера:', err);
        return;
    }
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});

authenticate();

const testDatabaseConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Соединение с базой данных успешно установлено!');
        await syncModels();
    } catch (error) {
        console.error('Не удалось установить соединение с базой данных:', error);
    }
};

testDatabaseConnection();

User.hasMany(Event, { foreignKey: 'createdBy', onDelete: 'CASCADE' })
Event.belongsTo(User, { foreignKey: 'createdBy' })

const syncModels = async () => {
    try {                                
        await sequelize.sync({ alter: true });
        console.log('Модели синхронизированы с базой данных!');
    } catch (error) {
        console.error('Ошибка при синхронизации моделей:', error);
    }
};

syncModels();