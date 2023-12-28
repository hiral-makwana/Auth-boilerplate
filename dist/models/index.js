'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryTypes = exports.sequelize = exports.db = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("sequelize");
Object.defineProperty(exports, "QueryTypes", { enumerable: true, get: function () { return sequelize_1.QueryTypes; } });
const config_json_1 = __importDefault(require("../config/config.json"));
const basename = path_1.default.basename(__filename);
const db = {};
exports.db = db;
// Create a new Sequelize instance for database connection
const sequelize = new sequelize_1.Sequelize(config_json_1.default.database.dbName, config_json_1.default.database.dbUser, config_json_1.default.database.dbPassword, {
    dialect: 'mysql',
    host: config_json_1.default.database.host,
    logging: false,
});
exports.sequelize = sequelize;
// Authenticate the Sequelize instance
sequelize.authenticate()
    .then(() => {
    console.log("Db Connected");
})
    .catch((err) => {
    console.log("Db Error", err.message);
});
fs_1.default
    .readdirSync(__dirname)
    .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.ts');
})
    .forEach(file => {
    const model = require(path_1.default.join(__dirname, file));
    db[model.default] = model;
});
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = sequelize_1.Sequelize;
db.Op = sequelize_1.Op;
db.QueryTypes = sequelize_1.QueryTypes;
//# sourceMappingURL=index.js.map