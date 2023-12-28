import { Model } from 'sequelize';
import userAttributes from './interface/user.interface';
/** User enum  for status*/
export declare enum status {
    ACTIVE = "active",
    DEACTIVE = "deactive",
    DELETED = "deleted"
}
export declare class User extends Model<userAttributes> implements userAttributes {
    id: number;
    firstName: string;
    email: string;
    password: string;
    status: string;
    isVerified: boolean;
    roleId: number;
    profileImage: string;
    isDeleted: boolean;
}
