import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/db';
import User from './User';

interface EventAttributes {
  id?: bigint;
  title: string;
  description?: string;
  date: Date;
  createdBy: bigint;
}

export class Event
  extends Model<EventAttributes>
  implements EventAttributes
{
  public id!: bigint;
  public title!: string;
  public description!: string;
  public date!: Date;
  public createdBy!: bigint;
}

Event.init(
  {
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
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Event',
  },
);

User.hasMany(Event, { foreignKey: 'createdBy', onDelete: 'CASCADE' });
Event.belongsTo(User, { foreignKey: 'createdBy' });

export default Event;
