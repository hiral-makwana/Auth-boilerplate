import { DataTypes, Model } from 'sequelize';
import roleAttributes from './interface/role.interface';
import { sequelize } from "./index";

export class Role extends Model<roleAttributes>
  implements roleAttributes {
  id!: number;
  roleName!: string;
  createdBy!: number;
  updatedBy!: number;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roleName: {
      type: DataTypes.STRING,
    },
    createdBy: {
      type: DataTypes.INTEGER,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: sequelize,
    tableName: "roles",
    modelName: 'Role'
  });
