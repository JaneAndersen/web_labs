import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import bcrypt from 'bcryptjs';

interface UserAttributes {
  id?: bigint;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
}

class User
  extends Model<UserAttributes>
  implements UserAttributes
{
  public id!: bigint;
  public name!: string;
  public email!: string;
  public password!: string;
  public createdAt!: Date;
  public static async hashPassword(user: User): Promise<void> {
    user.password = await bcrypt.hash(user.password, 10);
  }
}

User.init(
  {
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
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
    hooks: {
      beforeCreate: User.hashPassword,
      beforeUpdate: User.hashPassword,
    },
  },
);

User.beforeCreate(async (user: User) => {
  await User.hashPassword(user);
});

export default User;
