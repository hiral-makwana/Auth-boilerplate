"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_json_1 = __importDefault(require("../config/config.json"));
function verifyToken(req, res, next) {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
        try {
            if (authorization.split(" ")[1]) {
                const token = authorization.split(" ")[1];
                if (!token) {
                    return res.status(401).json({
                        status: false,
                        message: res.__("TOKEN_NOT_FOUND"),
                    });
                }
                jsonwebtoken_1.default.verify(token, config_json_1.default.JWT_SECRET, (err, decodedToken) => {
                    if (err) {
                        if (err.name === 'TokenExpiredError') {
                            return res.status(401).json({
                                status: false,
                                message: res.__("TOKEN_EXPIRED"),
                            });
                        }
                        return res.status(401).json({
                            status: false,
                            message: res.__("INVALID_TOKEN"),
                        });
                    }
                    req.user = decodedToken;
                    next();
                });
            }
        }
        catch (e) {
            console.error(e);
            return res.status(500).json({
                status: false,
                message: res.__("SERVER_ERR") + e.message,
            });
        }
    }
    else {
        return res.status(500).json({
            status: false,
            message: res.__("TOKEN_NOT_FOUND"),
        });
    }
}
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth.js.map