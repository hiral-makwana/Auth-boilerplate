"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRegex = exports.requestType = exports.keyName = void 0;
const keyName = 'otp';
exports.keyName = keyName;
const requestType = {
    REGISTER: 'register',
    FORGOT: 'forgot'
};
exports.requestType = requestType;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
exports.passwordRegex = passwordRegex;
//# sourceMappingURL=constant.js.map