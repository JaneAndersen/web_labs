import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import bcrypt from "bcryptjs"; 

const User = sequelize.define('User', {
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
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW, 
    },
}, {
    tableName: 'users', 
    timestamps: false, 
});

User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

export default User;
