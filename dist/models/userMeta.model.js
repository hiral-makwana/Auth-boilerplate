"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMeta = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
class UserMeta extends sequelize_1.Model {
}
exports.UserMeta = UserMeta;
UserMeta.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER
    },
    key: {
        type: sequelize_1.DataTypes.STRING
    },
    value: {
        type: sequelize_1.DataTypes.STRING
    },
    createdBy: {
        type: sequelize_1.DataTypes.INTEGER
    },
    updatedBy: {
        type: sequelize_1.DataTypes.INTEGER
    },
}, {
    sequelize: index_1.sequelize,
    tableName: "user_meta",
    modelName: 'UserMeta'
});
//# sourceMappingURL=userMeta.model.js.map