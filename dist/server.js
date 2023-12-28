"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file server.ts
 * @description Main file for setting up the Express server and defining routes.
 */
const express_1 = __importDefault(require("express"));
const index_route_1 = __importDefault(require("./routers/index.route"));
const swaggerRoute_1 = __importDefault(require("./routers/swaggerRoute"));
const config_json_1 = __importDefault(require("./config/config.json"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const locale_helper_1 = __importDefault(require("./helper/locale.helper"));
const validate_1 = __importDefault(require("./middleware/validate"));
const index_1 = require("./models/index");
index_1.db.sequelize.sync({ alter: true })
    .then(() => {
    console.log('Database synchronized');
})
    .catch((error) => {
    console.error('Error syncing database:', error);
});
// Create an Express application
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(locale_helper_1.default.init);
// Create routes
app.use('/', index_route_1.default, swaggerRoute_1.default); // update value of API_BASE_PREFIX in configuration file to access swagger
// Handle error message
app.use(validate_1.default);
app.use('/src/pictures/', express_1.default.static(__dirname + '/pictures/'));
// Define a simple root route
app.get('/', (req, res) => {
    res.send({
        status: true,
        message: "Hello! there.."
    });
});
// Start the server
const port = config_json_1.default.PORT || 3000;
let server = app.listen(port, () => {
    console.log(`Server is started on port:`, port);
});
exports.default = server;
//# sourceMappingURL=server.js.map