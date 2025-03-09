const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 

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

module.exports = Event;
