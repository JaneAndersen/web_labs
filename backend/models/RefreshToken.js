import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const RefreshToken = sequelize.define('RefreshToken', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'refreshTokens',
    timestamps: false,
});

export default RefreshToken;
