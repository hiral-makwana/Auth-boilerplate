import { DataTypes, Model } from 'sequelize';
import userAttributes from './interface/user.interface';
import { sequelize } from "./index";
import { passwordRegex } from '../helper/constant';

/** User enum  for status*/
export enum status {
    ACTIVE = 'active',
    DEACTIVE = 'deactive',
    DELETED = 'deleted'
}

export class User extends Model<userAttributes>
    implements userAttributes {
    public id!: number
    firstName!: string
    email!: string
    password!: string
    status!: string
    isVerified!: boolean
    roleId!: number
    profileImage!: string
    isDeleted!: boolean
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                isStrongPassword(value: string) {
                    if (!passwordRegex.test(value)) {
                        throw new Error(
                            'Password must have at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long.'
                        );
                    }
                },
            },
        },
        status: {
            type: DataTypes.ENUM,
            values: Object.values(status),
            defaultValue: 'deactive'
        },
        isVerified: {
            type: DataTypes.BOOLEAN
        },
        roleId: {
            type: DataTypes.INTEGER
        },
        isDeleted: {
            type: DataTypes.BOOLEAN
        },
        profileImage: {
            type: DataTypes.STRING
        }
    },
    {
        sequelize: sequelize,
        tableName: "users",
        modelName: 'User'
    });
