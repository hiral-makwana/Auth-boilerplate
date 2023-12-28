"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConfigFromJson = exports.convertHtmlToString = exports.generateOtpHtmlMessage = exports.generateHash = exports.generateRandomOtp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const email_helper_1 = require("./email.helper");
const generateRandomOtp = (n) => __awaiter(void 0, void 0, void 0, function* () {
    if (n <= 0)
        return 0;
    const min = Math.pow(10, n - 1);
    const max = Math.pow(10, n) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
});
exports.generateRandomOtp = generateRandomOtp;
const generateHash = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    return hashedPassword;
});
exports.generateHash = generateHash;
const readHTMLFile = function (path, cb) {
    fs_1.default.readFile(path, 'utf-8', function (err, data) {
        if (err) {
            console.log(err);
            throw err;
        }
        else {
            cb(null, data);
        }
    });
};
const generateOtpHtmlMessage = (to, custom, template, emailSubject, templateData) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        if (custom == true) {
            const compiledTemplate = handlebars_1.default.compile(template);
            const htmlToSend = compiledTemplate(templateData);
            const subject = emailSubject;
            (0, email_helper_1.sendEmail)(to, subject, htmlToSend);
            resolve(true);
        }
        else {
            readHTMLFile(template, (err, html) => {
                if (err) {
                    console.error(`Error reading HTML file: ${err.message}`);
                    reject(err);
                }
                else {
                    const compiledTemplate = handlebars_1.default.compile(html);
                    const htmlToSend = compiledTemplate(templateData);
                    const subject = emailSubject;
                    //const htmlMessage = html.replace('<%= otpCode %>', otpCode);
                    (0, email_helper_1.sendEmail)(to, subject, htmlToSend);
                    resolve(true);
                }
            });
        }
    });
});
exports.generateOtpHtmlMessage = generateOtpHtmlMessage;
function convertHtmlToString(html) {
    try {
        if (!html) {
            throw new Error('HTML content is required.');
        }
        const text = JSON.stringify(html);
        return { status: true, message: 'HTML converted to string successfully.', result: text };
    }
    catch (error) {
        return { status: false, message: error.message || 'Error converting HTML to string.' };
    }
}
exports.convertHtmlToString = convertHtmlToString;
function updateConfigFromJson(filePath) {
    try {
        const configFile = fs_1.default.readFileSync(filePath, 'utf-8');
        const config = JSON.parse(configFile);
        for (const key in config) {
            process.env[key] = config[key];
        }
        console.log('Configuration updated successfully.');
    }
    catch (error) {
        console.error('Error updating configuration:', error.message);
    }
}
exports.updateConfigFromJson = updateConfigFromJson;
//# sourceMappingURL=utils.js.map