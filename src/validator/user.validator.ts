import { Joi } from 'celebrate';
import { passwordRegex } from '../helper/constant';
import { validateSchema } from '../helper/utils';

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
