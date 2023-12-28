"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_json_1 = __importDefault(require("../config/config.json"));
// function to generate token
const generateToken = function (user) {
    try {
        let payload = user;
        const token = jsonwebtoken_1.default.sign(payload, config_json_1.default.JWT_SECRET, { expiresIn: config_json_1.default.JWT_EXPIRATION_TIME });
        return token;
    }
    catch (e) {
        console.log(e);
    }
};
exports.generateToken = generateToken;
//# sourceMappingURL=auth.helper.js.map