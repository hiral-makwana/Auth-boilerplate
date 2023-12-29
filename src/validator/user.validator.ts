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
    changePassword: () => validateSchema(
        Joi.object().keys({
            oldPassword: Joi.string().required(),
            newPassword: Joi.string().pattern(passwordRegex)
                .message('Password should include at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long.').required()
        })
    ),

    checkValid: () => validateSchema(
        Joi.object().keys({
            value: Joi.any().required()
        })
    )
}
