import { DataTypes, Model } from 'sequelize';
import userMetaAttributes from './interface/uerMeta.interface';
import { sequelize } from "./index";

export class UserMeta extends Model<userMetaAttributes>
    implements userMetaAttributes {
    id: number;
    userId: number;
    key: string;
    value: string;
    createdBy: number;
    updatedBy: number
}

UserMeta.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER
    },
    key: {
        type: DataTypes.STRING
    },
    value: {
        type: DataTypes.STRING
    },
    createdBy: {
        type: DataTypes.INTEGER
    },
    updatedBy: {
        type: DataTypes.INTEGER
    },
},
    {
        sequelize: sequelize,
        tableName: "user_meta",
        modelName: 'UserMeta'
    });
