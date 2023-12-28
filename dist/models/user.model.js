"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.status = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
const constant_1 = require("../helper/constant");
/** User enum  for status*/
var status;
(function (status) {
    status["ACTIVE"] = "active";
    status["DEACTIVE"] = "deactive";
    status["DELETED"] = "deleted";
})(status || (exports.status = status = {}));
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING
    },
    email: {
        type: sequelize_1.DataTypes.STRING
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        validate: {
            isStrongPassword(value) {
                if (!constant_1.passwordRegex.test(value)) {
                    throw new Error('Password must have at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long.');
                }
            },
        },
    },
    status: {
        type: sequelize_1.DataTypes.ENUM,
        values: Object.values(status),
        defaultValue: 'deactive'
    },
    isVerified: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    roleId: {
        type: sequelize_1.DataTypes.INTEGER
    },
    isDeleted: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    profileImage: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    sequelize: index_1.sequelize,
    tableName: "users",
    modelName: 'User'
});
//# sourceMappingURL=user.model.js.map