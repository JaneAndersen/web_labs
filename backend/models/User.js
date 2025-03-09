const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 

const User = sequelize.define('User ', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, 
        unique: true, 
        validate: {
            isEmail: true, 
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW, 
    },
}, {
    tableName: 'users', 
    timestamps: false, 
});

module.exports = User;
