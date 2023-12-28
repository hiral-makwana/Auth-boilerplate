import { Model } from 'sequelize';
import userMetaAttributes from './interface/uerMeta.interface';
export declare class UserMeta extends Model<userMetaAttributes> implements userMetaAttributes {
    id: number;
    userId: number;
    key: string;
    value: string;
    createdBy: number;
    updatedBy: number;
}
