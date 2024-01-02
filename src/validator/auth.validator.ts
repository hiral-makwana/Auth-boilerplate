import { Joi } from 'celebrate';
import { validateSchema } from '../helper/utils';
import { passwordRegex } from '../helper/constant';

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
            type: Joi.string().required(),
            email: Joi.string().email().required(),
            otp: Joi.number().required()
        })
    ),

    resendOTP: () => validateSchema(
        Joi.object().keys({
            type: Joi.string().required(),
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
            type: Joi.string().required(),
            token: Joi.string().required()
        })
    )
}
