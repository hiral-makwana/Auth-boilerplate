import { Model } from 'sequelize';
import roleAttributes from './interface/role.interface';
export declare class Role extends Model<roleAttributes> implements roleAttributes {
    id: number;
    roleName: string;
    createdBy: number;
    updatedBy: number;
}
