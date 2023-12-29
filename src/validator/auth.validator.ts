import { celebrate, Joi, Segments } from 'celebrate';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import i18n from '../helper/locale.helper';
import { ObjectSchema } from 'joi';
import { passwordRegex } from '../helper/constant';

const validateSchema = (schema: ObjectSchema<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const language = req.headers['accept-language'] || 'en';

        // Set the language for i18n
        i18n.setLocale(language);
        try {
            let messages: any;
            // Dynamically load messages based on the selected language
            messages = await import(`./messages/${language}`);
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
export default {
    registerUser: () => {
        const defaultSchema = Joi.object().keys({
            firstName: Joi.string().required().allow("", null),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordRegex)
                .message('Password should include at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long.').required(),
            status: Joi.string(),
            isVerified: Joi.number(),
            roleId: Joi.number()
        }).unknown();

        return validateSchema(defaultSchema);
    },

    verifyOTP: () => validateSchema(
        Joi.object().keys({
            type: Joi.string(),
            email: Joi.string().email().required(),
            otp: Joi.number().required()
        })
    ),

    resendOTP: () => validateSchema(
        Joi.object().keys({
            type: Joi.string(),
            email: Joi.string().email().required()
        })
    ),

    forgotPassword: () => validateSchema(
        Joi.object().keys({
            email: Joi.string().email().required()
        })
    ),

    resetPassword: () => validateSchema(
        Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordRegex)
                .message('Password should include at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long.').required()
        })
    ),

    login: () => validateSchema(
        Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
    ),

    refreshTokens: () => validateSchema(
        Joi.object().keys({
            token: Joi.string().required()
        })
    )
}
