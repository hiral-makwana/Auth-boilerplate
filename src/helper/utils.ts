import bcrypt from 'bcrypt';
import fs from 'fs'
import handlebars from 'handlebars';
import { sendEmail } from './email.helper'
import { celebrate, Segments } from 'celebrate';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import i18n from '../helper/locale.helper';

const generateRandomOtp = async (n: any) => {
    try {
        if (n <= 0) return 0;

        // Ensure that n is a positive integer
        if (!Number.isInteger(n)) {
            throw new Error('Invalid input: OTP_LENGTH must be a positive integer.');
        }

        const min = Math.pow(10, n - 1);
        const max = Math.pow(10, n) - 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } catch (error) {
        console.error(`Error in generateRandomOtp: ${error.message}`);
        throw error;
    }
};

const generateHash = async (password: any) => {
    try {
        // Ensure that the password is a non-empty string
        if (typeof password !== 'string' || password.trim().length === 0) {
            throw new Error('Invalid input: Password must be a non-empty string.');
        }

        // Ensure that a valid number of salt rounds is obtained
        if (!Number.isInteger(global.global.config.SALT_ROUNDS) || global.global.config.SALT_ROUNDS <= 0) {
            throw new Error('Invalid salt rounds configuration.');
        }

        // Generate salt
        const salt = await bcrypt.genSalt(global.global.config.SALT_ROUNDS);

        // Ensure that a valid salt is generated
        if (!salt || typeof salt !== 'string' || salt.trim().length === 0) {
            throw new Error('Error generating salt: Invalid salt value.');
        }
        // Hash the password with the generated salt        
        const hashedPassword = await bcrypt.hash(password, salt);
        // Ensure that a valid hashed password is generated
        if (!hashedPassword || typeof hashedPassword !== 'string' || hashedPassword.trim().length === 0) {
            throw new Error('Error hashing password: Invalid hashed password value.');
        }
        return hashedPassword;
    } catch (error) {
        console.error(`Error in generateHash: ${error.message}`);
        throw error;
    }
};
const readHTMLFile = function (path: any, cb: any) {
    try {
        // Ensure that the path is a non-empty string
        if (typeof path !== 'string' || path.trim().length === 0) {
            throw new Error('Invalid input: Path must be a non-empty string.');
        }

        fs.readFile(path, 'utf-8', function (err, data) {
            if (err) {
                console.log(err)
                throw err;
            } else {
                cb(null, data);
            }
        });
    } catch (error) {
        console.error(`Error in readHTMLFile: ${error.message}`);
        throw error;
    }
};
const generateOtpHtmlMessage = async (to: any, custom: any, template: any, emailSubject: any, templateData: any) => {
    try {
        // Ensure that custom is a boolean
        if (typeof custom !== 'boolean') {
            throw new Error('Invalid input: Custom template value must be a boolean.');
        }
        if (custom == true) {
            const compiledTemplate = handlebars.compile(template);
            const htmlToSend = compiledTemplate(templateData);
            const subject = emailSubject;
            sendEmail(to, subject, htmlToSend)
            return true;
        }
        else {
            readHTMLFile(template, (err: any, html: any) => {
                if (err) {
                    console.error(`Error reading HTML file: ${err.message}`);
                    throw err;
                } else {
                    const compiledTemplate = handlebars.compile(html);
                    const htmlToSend = compiledTemplate(templateData);
                    const subject = emailSubject;
                    //const htmlMessage = html.replace('<%= otpCode %>', otpCode);
                    sendEmail(to, subject, htmlToSend)
                    return true;
                }
            });
        }
    } catch (error) {
        console.error(`Error in generateOtpHtmlMessage: ${error.message}`);
        throw error;
    }
};

function convertHtmlToString(html: any) {
    try {
        if (!html) {
            throw new Error('HTML content is required.');
        }

        const text = JSON.stringify(html);
        return { status: true, message: 'HTML converted to string successfully.', result: text };
    } catch (error) {
        return { status: false, message: error.message || 'Error converting HTML to string.' };
    }
}

const validateSchema = (schema: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const language = req.headers['accept-language'] || 'en';

        // Set the language for i18n
        i18n.setLocale(language);
        try {
            let messages: any;
            // Dynamically load messages based on the selected language
            messages = await import(`../validator/messages/${language}`);
            celebrate({ [Segments.BODY]: schema }, {
                abortEarly: false,
                messages: messages.default || {},
            })(req, res, next);
        } catch (error) {
            console.error(`Error loading messages for language ${language}:`, error);
            // Default to an empty object if messages cannot be loaded
            celebrate({ [Segments.BODY]: schema }, {
                abortEarly: false,
                messages: {},
            })(req, res, next);
        }
    };
};

export { generateRandomOtp, generateHash, generateOtpHtmlMessage, convertHtmlToString, validateSchema }