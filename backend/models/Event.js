import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js'; 
import User from "./User.js"

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false, 
    },
    createdBy: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'users', 
            key: 'id',      
        },
    },
}, {
    tableName: 'events', 
    timestamps: false, 
});

User.hasMany(Event, { foreignKey: 'createdBy', onDelete: 'CASCADE' })
Event.belongsTo(User, { foreignKey: 'createdBy' })

export default Event;
