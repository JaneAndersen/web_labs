import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@config/db';

interface RefreshTokenAttributes {
  id: bigint;
  token: string;
  userId: bigint;
  expiresAt: Date;
}

interface RefreshTokenCreationAttributes {
  token: string;
  userId: bigint;
  expiresAt: Date;
}

class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  implements RefreshTokenAttributes
{
  public id!: bigint;
  public token!: string;
  public userId!: bigint;
  public expiresAt!: Date;
}

RefreshToken.init(
  {
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
  },
  {
    sequelize,
    tableName: 'refreshTokens',
    timestamps: false,
  },
);

export default RefreshToken;
